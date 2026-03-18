/**
 * /blueprints/[slug] — Blueprint detail page
 *
 * Fetches blueprint + tools directly from Supabase (no internal HTTP hop).
 * Server-rendered with ISR (revalidate 10 min).
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTrendSignal } from '@/lib/productionflow/normalize-tool-name';

export const revalidate = 600;

// ── Static params (pre-generates all published blueprint pages at build time) ──

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('blueprints')
      .select('slug')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString());
    return (data ?? []).map((bp: { slug: string }) => ({ slug: bp.slug }));
  } catch (err) {
    console.error('[Blueprint generateStaticParams] Error:', err);
    return [];
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

interface BlueprintStep {
  order: number;
  title: string;
  description: string;
  tool_name: string;
  tool_slug: string | null;
  time_estimate: string | null;
  tips: string[];
  output: string | null;
}

interface Blueprint {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  goal: string;
  target_audience: string | null;
  tool_ids: string[];
  steps: BlueprintStep[];
  monthly_cost_min: number | null;
  monthly_cost_max: number | null;
  is_featured: boolean;
  published_at: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string | null;
  category: string | null;
  viral_score: number | null;
  trend_phase: string | null;
  score_delta_7d: number | null;
  pricing_model: string | null;
  pricing_info: string | null;
  affiliate_url: string | null;
  description: string | null;
}

// ── Data fetching ──────────────────────────────────────────────────────────

async function getBlueprintDetail(
  slug: string
): Promise<{ blueprint: Blueprint; tools: Tool[] } | null> {
  try {
    const supabase = await createClient();

    // 1. Fetch the blueprint
    const { data: blueprint, error: blueprintError } = await supabase
      .from('blueprints')
      .select(
        `id, slug, title, subtitle, goal, target_audience,
         tool_ids, steps, monthly_cost_min, monthly_cost_max,
         is_featured, published_at`
      )
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .single();

    if (blueprintError || !blueprint) return null;

    // 2. Enrich with live tool data
    let tools: Tool[] = [];
    if (blueprint.tool_ids && blueprint.tool_ids.length > 0) {
      const { data: toolData } = await supabase
        .from('tools')
        .select(
          `id, name, slug, category, viral_score, trend_phase,
           score_delta_7d, pricing_model, pricing_info, affiliate_url, description`
        )
        .in('id', blueprint.tool_ids);

      if (toolData) {
        // Preserve tool_ids order
        const toolMap = new Map((toolData as Tool[]).map((t: Tool) => [t.id, t]));
        tools = (blueprint.tool_ids as string[])
          .map((id: string) => toolMap.get(id))
          .filter((t: Tool | undefined): t is Tool => !!t);
      }
    }

    return { blueprint: blueprint as Blueprint, tools };
  } catch (err) {
    console.error('[Blueprint detail] Error:', err);
    return null;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function BlueprintDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBlueprintDetail(slug);

  if (!data) notFound();

  const { blueprint, tools } = data;
  const toolMap = new Map(tools.map((t) => [t.slug, t]));
  const steps: BlueprintStep[] = Array.isArray(blueprint.steps) ? blueprint.steps : [];

  const hasCostRange =
    blueprint.monthly_cost_min !== null && blueprint.monthly_cost_max !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <a
        href="/blueprints"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8"
      >
        ← Blueprints
      </a>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full border border-[var(--card-border)] text-gray-500">
            📋 Blueprint
          </span>
          {blueprint.is_featured && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ⭐ Featured
            </span>
          )}
          {hasCostRange && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-gray-400">
              {blueprint.monthly_cost_min === 0
                ? `Free to start · up to $${blueprint.monthly_cost_max}/mo`
                : `$${blueprint.monthly_cost_min}–$${blueprint.monthly_cost_max}/mo`}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          {blueprint.title}
        </h1>

        {blueprint.subtitle && (
          <p className="text-lg text-gray-400 max-w-2xl">{blueprint.subtitle}</p>
        )}

        {blueprint.target_audience && (
          <p className="mt-3 text-sm text-gray-500">
            <span className="text-gray-600">Built for: </span>
            {blueprint.target_audience}
          </p>
        )}
      </div>

      {/* ── Tool stack overview ────────────────────────────────────────── */}
      {tools.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Tools in this blueprint ({tools.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tools.map((tool) => {
              const signal = getTrendSignal(tool.trend_phase, tool.score_delta_7d);
              const badgeColor =
                signal.severity === 'positive'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : signal.severity === 'warning'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : signal.severity === 'danger'
                  ? 'text-red-400 bg-red-500/10 border-red-500/30'
                  : 'text-gray-400 bg-[var(--card)] border-[var(--card-border)]';

              return (
                <div
                  key={tool.id}
                  className="flex flex-col p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-white text-sm leading-snug">
                      {tool.affiliate_url ? (
                        <a
                          href={tool.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-400 transition-colors"
                        >
                          {tool.name}
                        </a>
                      ) : (
                        tool.name
                      )}
                    </span>
                    <span
                      className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full border font-medium ${badgeColor}`}
                    >
                      {tool.viral_score ?? '—'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{tool.category ?? ''}</span>
                  {tool.pricing_model && (
                    <span className="mt-1 text-xs text-gray-600 capitalize">
                      {tool.pricing_model}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Heat scores update daily via HookFlow. Higher = more community momentum.
          </p>
        </div>
      )}

      {/* ── Steps ─────────────────────────────────────────────────────── */}
      {steps.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">
            Step-by-step guide
          </h2>
          <div className="space-y-6">
            {steps.map((step) => {
              const stepTool = step.tool_slug ? toolMap.get(step.tool_slug) : null;
              const signal = stepTool
                ? getTrendSignal(stepTool.trend_phase, stepTool.score_delta_7d)
                : null;

              return (
                <div key={step.order} className="flex gap-5">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 mt-0.5">
                    {step.order}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Step title + tool badge */}
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-white text-base">{step.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {step.tool_name && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-gray-400">
                            {stepTool?.affiliate_url ? (
                              <a
                                href={stepTool.affiliate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-emerald-400 transition-colors"
                              >
                                {step.tool_name}
                              </a>
                            ) : (
                              step.tool_name
                            )}
                          </span>
                        )}
                        {step.time_estimate && (
                          <span className="text-xs text-gray-600">{step.time_estimate}</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Tool heat score inline */}
                    {stepTool && signal && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-600">Heat score:</span>
                        <span className="text-xs font-medium text-white">
                          {stepTool.viral_score ?? '—'}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            signal.severity === 'positive'
                              ? 'text-emerald-400'
                              : signal.severity === 'warning'
                              ? 'text-amber-400'
                              : signal.severity === 'danger'
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {signal.label}
                        </span>
                      </div>
                    )}

                    {/* Tips */}
                    {step.tips && step.tips.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {step.tips.map((tip, i) => (
                          <div
                            key={i}
                            className="flex gap-2 text-sm text-gray-500 bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-3 py-2"
                          >
                            <span className="text-emerald-500 flex-shrink-0">💡</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Output */}
                    {step.output && (
                      <div className="flex gap-2 text-sm text-gray-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                        <span className="flex-shrink-0">✓</span>
                        <span>
                          <span className="text-emerald-400 font-medium">Output: </span>
                          {step.output}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Cost breakdown ────────────────────────────────────────────── */}
      {tools.length > 0 && (
        <div className="mb-12 p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <h2 className="font-semibold text-white mb-4">Cost breakdown</h2>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{tool.name}</span>
                  {tool.pricing_model === 'free' && (
                    <span className="text-xs text-emerald-400">Free</span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">
                  {tool.pricing_info ?? (tool.pricing_model === 'free' ? '$0/mo' : tool.pricing_model ?? '—')}
                </span>
              </div>
            ))}
          </div>
          {hasCostRange && (
            <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated total</span>
              <span className="font-semibold text-white">
                {blueprint.monthly_cost_min === 0
                  ? `$0 – $${blueprint.monthly_cost_max}/mo`
                  : `$${blueprint.monthly_cost_min} – $${blueprint.monthly_cost_max}/mo`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 rounded-2xl bg-[var(--card)] border border-emerald-500/20">
        <div>
          <p className="font-semibold text-white">Want alerts when this stack goes stale?</p>
          <p className="text-sm text-gray-400 mt-1">
            We&apos;ll ping you when any tool in this blueprint drops in heat score.
          </p>
        </div>
        <a
          href="/?ref=blueprint"
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors whitespace-nowrap"
        >
          Get early access →
        </a>
      </div>

    </div>
  );
}
