/**
 * /blueprints — Blueprint index page
 *
 * Fetches published blueprints from the API.
 * Shows a graceful "coming soon" state when no blueprints are published yet
 * (which will be the case at Phase 1 launch — blueprints are seeded later).
 *
 * Uses server-side rendering so blueprints appear immediately with no client JS.
 * Revalidates every 10 minutes via Next.js ISR.
 */

export const revalidate = 600;

interface Blueprint {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  goal: string;
  tool_ids: string[];
  monthly_cost_min: number | null;
  monthly_cost_max: number | null;
  is_featured: boolean;
  published_at: string;
}

async function getBlueprints(): Promise<Blueprint[]> {
  try {
    // In production this calls the internal Next.js API route.
    // Adjust the base URL if deploying to a custom domain.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/productionflow/blueprints`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blueprints ?? [];
  } catch {
    return [];
  }
}

export default async function BlueprintsPage() {
  const blueprints = await getBlueprints();
  const hasBluprints = blueprints.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[var(--card-border)] text-gray-500 mb-4">
          <span>📋</span> Workflow Blueprints
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">AI Workflow Blueprints</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Opinionated, step-by-step guides for building real AI-powered production workflows.
          Every blueprint is built around tools with strong heat scores — so the stack
          doesn&apos;t go stale.
        </p>
      </div>

      {hasBluprints ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprints.map((bp) => (
            <BlueprintCard key={bp.id} blueprint={bp} />
          ))}
        </div>
      ) : (
        <ComingSoon />
      )}
    </div>
  );
}

function BlueprintCard({ blueprint }: { blueprint: Blueprint }) {
  const toolCount = blueprint.tool_ids?.length ?? 0;
  const hasCostRange = blueprint.monthly_cost_min !== null;

  return (
    <a href={`/blueprints/${blueprint.slug}`}
      className="group flex flex-col p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5">

      {blueprint.is_featured && (
        <div className="mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ⭐ Featured
          </span>
        </div>
      )}

      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition-colors">
        {blueprint.title}
      </h3>

      {blueprint.subtitle && (
        <p className="text-sm text-gray-400 mb-3">{blueprint.subtitle}</p>
      )}

      <div className="mt-auto pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-gray-500 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {toolCount > 0 && <span>{toolCount} tools</span>}
          {hasCostRange && (
            <span>
              {blueprint.monthly_cost_min === 0
                ? "Free to start"
                : `From $${blueprint.monthly_cost_min}/mo`}
            </span>
          )}
        </div>
        <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
      </div>
    </a>
  );
}

function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">

      {/* Preview cards (teaser) */}
      <div className="relative w-full max-w-2xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-40 pointer-events-none select-none">
          {[
            { title: "AI Blog Content Pipeline", tools: 5, cost: "Free to start" },
            { title: "Faceless YouTube Channel", tools: 6, cost: "From $36/mo" },
            { title: "Newsletter Production", tools: 5, cost: "Free to start" },
          ].map((bp) => (
            <div key={bp.title} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] text-left">
              <div className="h-2 w-16 bg-emerald-500/30 rounded mb-3" />
              <div className="font-bold text-white text-sm mb-2">{bp.title}</div>
              <div className="text-xs text-gray-500">{bp.tools} tools · {bp.cost}</div>
            </div>
          ))}
        </div>
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/60 to-[var(--background)]" />
      </div>

      <div className="max-w-sm">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-white mb-3">Blueprints dropping soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          We&apos;re building detailed, step-by-step workflow guides starting with the most
          requested production pipelines. First five launch within days of ProductionFlow going live.
        </p>

        <EmailCapture />

        <div className="mt-8 text-left space-y-2">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">First blueprints dropping</p>
          {[
            "AI Blog & SEO Content Pipeline",
            "Faceless YouTube Channel",
            "Newsletter Production",
            "Podcast-to-Social Repurposing",
            "Indie Dev Workflow",
          ].map((title) => (
            <div key={title} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-emerald-500">⚡</span> {title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailCapture() {
  // Server component wrapper — the actual form needs client JS
  // Rendered as a static link to the landing page email capture for simplicity
  return (
    <a href="/?ref=blueprints"
      className="inline-block w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm text-center transition-colors">
      Notify me when blueprints launch →
    </a>
  );
}
