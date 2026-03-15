"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface StackGoal {
  slug: string;
  label: string;
  description: string;
  icon: string;
}

interface TrendSignal {
  label: string;
  severity: "positive" | "neutral" | "warning" | "danger";
}

interface StackTool {
  display_order: number;
  is_optional: boolean;
  role_in_stack: string;
  connection_note: string | null;
  monthly_cost_override: number | null;
  tool: {
    name: string;
    slug: string | null;
    category: string | null;
    description: string | null;
    viral_score: number;
    trend_phase: string | null;
    pricing_model: string | null;
    pricing_info: string | null;
    affiliate_url: string | null;
    trend_signal: TrendSignal;
  };
}

interface StackResult {
  goal: StackGoal;
  tools: StackTool[];
  total_tools: number;
  required_tools: number;
  estimated_pricing_tiers: { free: number; freemium: number; paid: number };
}

// ── Static goal cards (shown before API loads) ────────────────────────────────
// These match the seeds in stack_goals. The API call enriches with live scores.

const GOALS: StackGoal[] = [
  { slug: "faceless-youtube-channel",   label: "Faceless YouTube Channel",   icon: "🎬", description: "Automate research, scripting, voiceover, and publishing" },
  { slug: "blog-seo-content-pipeline",  label: "Blog & SEO Content Pipeline", icon: "✍️", description: "Research, draft, edit, and publish SEO-optimized content" },
  { slug: "social-media-automation",    label: "Social Media Automation",     icon: "📱", description: "Generate, schedule, and repurpose content across platforms" },
  { slug: "podcast-production",         label: "Podcast Production",          icon: "🎙️", description: "Record, transcribe, edit, and distribute podcast episodes" },
  { slug: "newsletter-production",      label: "Newsletter Production",       icon: "📧", description: "Curate, write, and send AI-assisted newsletters" },
  { slug: "video-to-shorts-repurposing",label: "Video-to-Shorts Repurposing", icon: "✂️", description: "Clip long-form videos into TikTok, Reels, and Shorts" },
  { slug: "indie-dev-workflow",         label: "Indie Dev Workflow",          icon: "💻", description: "AI-assisted coding, deployment, and monitoring for solo devs" },
  { slug: "ecommerce-product-pipeline", label: "E-commerce Product Pipeline", icon: "🛒", description: "Generate product descriptions, imagery, and promotional assets" },
];

const SEVERITY_CLASSES: Record<string, string> = {
  positive: "badge-positive",
  neutral:  "badge-neutral",
  warning:  "badge-warning",
  danger:   "badge-danger",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function StackBuilderPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [stack, setStack] = useState<StackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success">("idle");

  async function selectGoal(slug: string) {
    setSelected(slug);
    setStack(null);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/productionflow/stack?goal=${slug}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to load stack."); return; }
      setStack(data);
      setTimeout(() => document.getElementById("stack-result")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function saveStack(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/productionflow/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "stack_builder" }),
      });
      const data = await res.json();
      if (res.ok && data.success) setSubStatus("success");
      else setSubStatus("idle");
    } catch { setSubStatus("idle"); }
  }

  const { free, freemium, paid } = stack?.estimated_pricing_tiers ?? { free: 0, freemium: 0, paid: 0 };
  const paidCount = paid;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[var(--card-border)] text-gray-500 mb-4">
          <span>🔧</span> Stack Builder · Free
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Build Your AI Workflow Stack</h1>
        <p className="text-gray-400 text-lg">
          Pick your goal. We&apos;ll recommend a curated, ordered stack of AI tools — with live heat scores,
          roles, and how each tool hands off to the next.
        </p>
      </div>

      {/* Goal grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {GOALS.map((goal) => (
          <button key={goal.slug} onClick={() => selectGoal(goal.slug)}
            className={`text-left p-4 rounded-2xl border transition-all group ${
              selected === goal.slug
                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                : "border-[var(--card-border)] bg-[var(--card)] hover:border-emerald-500/40 hover:bg-[var(--card)]"
            }`}>
            <div className="text-2xl mb-2">{goal.icon}</div>
            <div className="font-semibold text-white text-sm mb-1">{goal.label}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{goal.description}</div>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-gray-400">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Building your stack with live heat scores…
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center mb-8">{error}</p>}

      {/* Stack result */}
      {stack && !loading && (
        <div id="stack-result" className="score-pop">

          {/* Stack header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{stack.goal.icon}</span> {stack.goal.label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {stack.required_tools} required tools · {stack.total_tools - stack.required_tools} optional
                {paidCount > 0 && ` · ${free + freemium} free/freemium, ${paidCount} paid`}
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              {free + freemium > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {free + freemium} free/freemium
                </span>
              )}
              {paidCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {paidCount} paid
                </span>
              )}
            </div>
          </div>

          {/* Tool steps */}
          <div className="space-y-3 mb-8">
            {stack.tools.map((item, i) => (
              <StackToolCard key={item.tool.name} item={item} step={i + 1} isLast={i === stack.tools.length - 1} />
            ))}
          </div>

          {/* Save CTA */}
          <div className="bg-[var(--card)] border border-emerald-500/20 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-white mb-1">Save this stack</h3>
            <p className="text-sm text-gray-400 mb-4">
              We&apos;ll email you when any tool in this stack changes heat score — so you know when to swap.
            </p>
            {subStatus === "success" ? (
              <div className="text-emerald-400 font-medium text-sm">✓ Stack saved — we&apos;ll keep you updated!</div>
            ) : (
              <form onSubmit={saveStack} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 text-sm" />
                <button type="submit" disabled={subStatus === "loading"}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors disabled:opacity-60 whitespace-nowrap">
                  {subStatus === "loading" ? "…" : "Save Stack"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StackToolCard({ item, step, isLast }: { item: StackTool; step: number; isLast: boolean }) {
  const { tool } = item;
  const badgeClass = SEVERITY_CLASSES[tool.trend_signal.severity];

  return (
    <div className="relative">
      <div className={`flex gap-4 p-4 rounded-xl border bg-[var(--card)] transition-colors ${
        item.is_optional ? "border-dashed border-[var(--card-border)] opacity-80" : "border-[var(--card-border)]"
      }`}>

        {/* Step number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--card-border)] flex items-center justify-center text-sm font-bold text-gray-400">
          {step}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {tool.affiliate_url ? (
                <a href={tool.affiliate_url} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-emerald-400 transition-colors">
                  {tool.name}
                </a>
              ) : (
                <span className="font-semibold text-white">{tool.name}</span>
              )}
              {item.is_optional && (
                <span className="text-xs text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded">optional</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-600 font-mono">{tool.viral_score}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass}`}>{tool.trend_signal.label}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-1">{item.role_in_stack}</p>

          <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
            {tool.category && <span>{tool.category}</span>}
            {tool.pricing_model && (
              <span className={tool.pricing_model === "free" || tool.pricing_model === "freemium" ? "text-emerald-500" : "text-amber-500"}>
                {tool.pricing_model}
              </span>
            )}
          </div>

          {item.connection_note && !isLast && (
            <div className="mt-2 text-xs text-gray-600 flex items-center gap-1.5">
              <span>→</span> <span className="italic">{item.connection_note}</span>
            </div>
          )}
        </div>
      </div>

      {/* Connector line */}
      {!isLast && !item.is_optional && (
        <div className="absolute left-8 -bottom-3 w-px h-3 bg-[var(--card-border)]" style={{ marginLeft: "15px" }} />
      )}
    </div>
  );
}
