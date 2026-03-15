/**
 * GET /api/productionflow/stack?goal=[slug]
 *
 * Returns the curated tool stack for a given Stack Builder goal,
 * enriched with live heat scores from the HookFlow tools database.
 *
 * Cached at the edge for 5 minutes (revalidate = 300).
 * Heat scores update daily via HookFlow's cron jobs — 5-minute staleness is fine.
 *
 * Query params:
 *   goal  — stack_goals.slug  e.g. "faceless-youtube-channel"
 *
 * No auth required — public endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTrendSignal } from '@/lib/productionflow/normalize-tool-name';

export const revalidate = 300;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const goalSlug = searchParams.get('goal');

  if (!goalSlug) {
    return NextResponse.json(
      { error: 'Missing required query parameter: goal' },
      { status: 400 }
    );
  }

  if (!SLUG_PATTERN.test(goalSlug)) {
    return NextResponse.json({ error: 'Invalid goal slug format' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: goal, error: goalError } = await supabase
    .from('stack_goals')
    .select('id, slug, label, description, icon')
    .eq('slug', goalSlug)
    .eq('is_active', true)
    .single();

  if (goalError || !goal) {
    return NextResponse.json(
      { error: `No active stack found for goal: ${goalSlug}` },
      { status: 404 }
    );
  }

  const { data: stackItems, error: stackError } = await supabase
    .from('stacks')
    .select(`
      display_order,
      is_optional,
      role_in_stack,
      connection_note,
      monthly_cost_override,
      tools (
        id,
        name,
        slug,
        category,
        viral_score,
        trend_phase,
        score_delta_7d,
        score_delta_30d,
        pricing_model,
        pricing_info,
        affiliate_url,
        description
      )
    `)
    .eq('goal_id', goal.id)
    .order('display_order', { ascending: true });

  if (stackError) {
    console.error('[ProductionFlow/Stack]', stackError.message);
    return NextResponse.json({ error: 'Failed to load stack' }, { status: 500 });
  }

  if (!stackItems || stackItems.length === 0) {
    return NextResponse.json(
      { error: `Stack for "${goalSlug}" has no tools yet` },
      { status: 404 }
    );
  }

  const tools = stackItems.map((item) => {
    const tool = item.tools as {
      id: string;
      name: string;
      slug: string | null;
      category: string | null;
      viral_score: number | null;
      trend_phase: string | null;
      score_delta_7d: number | null;
      score_delta_30d: number | null;
      pricing_model: string | null;
      pricing_info: string | null;
      affiliate_url: string | null;
      description: string | null;
    };

    return {
      display_order: item.display_order,
      is_optional: item.is_optional,
      role_in_stack: item.role_in_stack,
      connection_note: item.connection_note,
      monthly_cost_override: item.monthly_cost_override,
      tool: {
        name: tool.name,
        slug: tool.slug,
        category: tool.category,
        description: tool.description,
        viral_score: tool.viral_score ?? 0,
        trend_phase: tool.trend_phase,
        score_delta_7d: tool.score_delta_7d,
        score_delta_30d: tool.score_delta_30d,
        pricing_model: tool.pricing_model,
        pricing_info: tool.pricing_info,
        affiliate_url: tool.affiliate_url,
        trend_signal: getTrendSignal(tool.trend_phase, tool.score_delta_7d),
      },
    };
  });

  const pricingTiers = tools.reduce(
    (acc, item) => {
      const model = item.tool.pricing_model ?? 'unknown';
      if (model === 'free') acc.free++;
      else if (model === 'freemium') acc.freemium++;
      else if (model === 'paid') acc.paid++;
      return acc;
    },
    { free: 0, freemium: 0, paid: 0 }
  );

  return NextResponse.json({
    goal: {
      slug: goal.slug,
      label: goal.label,
      description: goal.description,
      icon: goal.icon,
    },
    tools,
    total_tools: tools.length,
    required_tools: tools.filter((t) => !t.is_optional).length,
    estimated_pricing_tiers: pricingTiers,
  });
}
