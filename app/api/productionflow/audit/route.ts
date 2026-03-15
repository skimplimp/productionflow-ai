/**
 * POST /api/productionflow/audit
 *
 * The ProductionFlow AI Audit endpoint.
 *
 * Accepts a list of AI tools the user is currently paying for, resolves each
 * against the HookFlow tools database via tool_aliases, and returns an
 * Efficiency Score plus per-tool heat signals and swap suggestions.
 *
 * Flow:
 *  1. Rate limit by IP (20 req/min via existing apiRateLimiter)
 *  2. Validate request body
 *  3. Normalize each tool name → exact match in tool_aliases → ILIKE fallback on tools.name
 *  4. Fetch viral_score, trend_phase, score_delta_7d, pricing_info for each match
 *  5. For declining/fading tools: find best swap candidate in same category
 *  6. Calculate overall Efficiency Score + letter grade
 *  7. Return structured audit result
 *
 * No auth required — public endpoint, rate limited by IP.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiRateLimiter, getClientIdentifier } from '@/lib/rate-limit';
import {
  normalizeToolName,
  getTrendSignal,
  calculateEfficiencyScore,
  scoreToGrade,
  type TrendSignal,
} from '@/lib/productionflow/normalize-tool-name';

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

const auditToolSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  monthly_cost: z.number().min(0).max(10_000).optional(),
});

const auditRequestSchema = z.object({
  tools: z
    .array(auditToolSchema)
    .min(1, 'Please add at least one tool')
    .max(20, 'Maximum 20 tools per audit'),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MatchedTool {
  input_name: string;
  canonical_name: string;
  slug: string;
  category: string | null;
  viral_score: number;
  trend_phase: string | null;
  score_delta_7d: number | null;
  pricing_model: string | null;
  pricing_info: string | null;
  affiliate_url: string | null;
  monthly_cost?: number;
  trend_signal: TrendSignal;
  swap_suggestion: SwapSuggestion | null;
}

interface SwapSuggestion {
  name: string;
  slug: string;
  viral_score: number;
  trend_phase: string | null;
  pricing_model: string | null;
  affiliate_url: string | null;
  reason: string;
}

interface UnmatchedTool {
  input_name: string;
  monthly_cost?: number;
}

// ---------------------------------------------------------------------------
// Helper: resolve a single tool name → tool id + canonical name
// ---------------------------------------------------------------------------

async function resolveTool(
  supabase: Awaited<ReturnType<typeof createClient>>,
  inputName: string
): Promise<{ id: string; name: string; slug: string } | null> {
  const normalized = normalizeToolName(inputName);

  // Layer 1: exact alias match
  const { data: aliasMatch } = await supabase
    .from('tool_aliases')
    .select('canonical_tool_id, tools!inner(id, name, slug)')
    .eq('alias', normalized)
    .single();

  if (aliasMatch?.tools) {
    const t = aliasMatch.tools as { id: string; name: string; slug: string };
    return { id: t.id, name: t.name, slug: t.slug };
  }

  // Layer 2: ILIKE fallback on tools.name (handles new tools not yet aliased)
  const { data: nameMatch } = await supabase
    .from('tools')
    .select('id, name, slug')
    .ilike('name', `%${inputName.trim()}%`)
    .eq('is_archived', false)
    .is('deleted_at', null)
    .order('viral_score', { ascending: false })
    .limit(1)
    .single();

  if (!nameMatch) return null;
  return { id: nameMatch.id, name: nameMatch.name, slug: nameMatch.slug ?? '' };
}

// ---------------------------------------------------------------------------
// Helper: find best swap for a cooling/fading tool
// ---------------------------------------------------------------------------

async function findSwapSuggestion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  currentToolId: string,
  category: string | null,
  currentScore: number
): Promise<SwapSuggestion | null> {
  if (!category) return null;

  // First pass: same category, higher score, with confirmed upward trend_phase
  const { data } = await supabase
    .from('tools')
    .select('name, slug, viral_score, trend_phase, pricing_model, affiliate_url')
    .eq('category', category)
    .eq('is_archived', false)
    .is('deleted_at', null)
    .neq('id', currentToolId)
    .gt('viral_score', currentScore)
    .in('trend_phase', ['emerging', 'rising', 'peak'])
    .order('viral_score', { ascending: false })
    .limit(1)
    .single();

  if (data) {
    return {
      name: data.name,
      slug: data.slug ?? '',
      viral_score: data.viral_score ?? 0,
      trend_phase: data.trend_phase,
      pricing_model: data.pricing_model,
      affiliate_url: data.affiliate_url,
      reason: `Trending ${data.trend_phase ?? 'up'} with a heat score of ${data.viral_score} — ${(data.viral_score ?? 0) - currentScore} pts higher`,
    };
  }

  // Second pass: relax — just find anything higher in the same category
  const { data: fallback } = await supabase
    .from('tools')
    .select('name, slug, viral_score, trend_phase, pricing_model, affiliate_url')
    .eq('category', category)
    .eq('is_archived', false)
    .is('deleted_at', null)
    .neq('id', currentToolId)
    .gt('viral_score', currentScore)
    .order('viral_score', { ascending: false })
    .limit(1)
    .single();

  if (!fallback) return null;

  return {
    name: fallback.name,
    slug: fallback.slug ?? '',
    viral_score: fallback.viral_score ?? 0,
    trend_phase: fallback.trend_phase,
    pricing_model: fallback.pricing_model,
    affiliate_url: fallback.affiliate_url,
    reason: `Higher heat score (+${(fallback.viral_score ?? 0) - currentScore} pts) in the same category`,
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Rate limit
  const identifier = getClientIdentifier(request);
  const rateLimit = await apiRateLimiter.check(identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a moment.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter ?? 60) } }
    );
  }

  // 2. Parse and validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { tools: inputTools } = parsed.data;
  const supabase = await createClient();

  const matched: MatchedTool[] = [];
  const unmatched: UnmatchedTool[] = [];

  // 3 & 4. Resolve + fetch each tool in parallel
  await Promise.all(
    inputTools.map(async (inputTool) => {
      const resolved = await resolveTool(supabase, inputTool.name);

      if (!resolved) {
        unmatched.push({ input_name: inputTool.name, monthly_cost: inputTool.monthly_cost });
        return;
      }

      const { data: toolData } = await supabase
        .from('tools')
        .select(
          'id, name, slug, category, viral_score, trend_phase, score_delta_7d, pricing_model, pricing_info, affiliate_url'
        )
        .eq('id', resolved.id)
        .single();

      if (!toolData) {
        unmatched.push({ input_name: inputTool.name, monthly_cost: inputTool.monthly_cost });
        return;
      }

      const trendSignal = getTrendSignal(toolData.trend_phase, toolData.score_delta_7d);

      // 5. Swap suggestion only for warning/danger tools
      let swapSuggestion: SwapSuggestion | null = null;
      if (trendSignal.severity === 'warning' || trendSignal.severity === 'danger') {
        swapSuggestion = await findSwapSuggestion(
          supabase,
          toolData.id,
          toolData.category,
          toolData.viral_score ?? 0
        );
      }

      matched.push({
        input_name: inputTool.name,
        canonical_name: toolData.name,
        slug: toolData.slug ?? '',
        category: toolData.category,
        viral_score: toolData.viral_score ?? 0,
        trend_phase: toolData.trend_phase,
        score_delta_7d: toolData.score_delta_7d,
        pricing_model: toolData.pricing_model,
        pricing_info: toolData.pricing_info,
        affiliate_url: toolData.affiliate_url,
        monthly_cost: inputTool.monthly_cost,
        trend_signal: trendSignal,
        swap_suggestion: swapSuggestion,
      });
    })
  );

  // 6. Efficiency Score
  const signals: TrendSignal[] = matched.map((t) => t.trend_signal);
  const efficiencyScore = calculateEfficiencyScore(signals);
  const grade = efficiencyScore !== null ? scoreToGrade(efficiencyScore) : null;

  const summary = {
    total_input: inputTools.length,
    matched: matched.length,
    unmatched: unmatched.length,
    heating_up: matched.filter((t) => t.trend_signal.severity === 'positive').length,
    stable: matched.filter((t) => t.trend_signal.severity === 'neutral').length,
    cooling_down: matched.filter((t) => t.trend_signal.severity === 'warning').length,
    fading: matched.filter((t) => t.trend_signal.severity === 'danger').length,
    tools_with_swap: matched.filter((t) => t.swap_suggestion !== null).length,
    total_monthly_cost: inputTools.reduce((sum, t) => sum + (t.monthly_cost ?? 0), 0),
  };

  return NextResponse.json({ efficiency_score: efficiencyScore, grade, summary, matched, unmatched });
}
