"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuditTool {
  name: string;
  monthly_cost: string;
}

interface TrendSignal {
  label: string;
  severity: "positive" | "neutral" | "warning" | "danger";
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

interface AuditResult {
  efficiency_score: number | null;
  grade: string | null;
  summary: {
    total_input: number;
    matched: number;
    unmatched: number;
    heating_up: number;
    stable: number;
    cooling_down: number;
    fading: number;
    tools_with_swap: number;
    total_monthly_cost: number;
  };
  matched: MatchedTool[];
  unmatched: Array<{ input_name: string; monthly_cost?: number }>;
}

// ── Grade config ─────────────────────────────────────────────────────────────

const GRADE_CONFIG: Record<string, { color: string; label: string }> = {
  A: { color: "text-emerald-400", label: "Excellent" },
  B: { color: "text-green-400",   label: "Good" },
  C: { color: "text-yellow-400",  label: "Fair" },
  D: { color: "text-orange-400",  label: "Needs Work" },
  F: { color: "text-red-400",     label: "At Risk" },
};

const SEVERITY_CLASSES: Record<string, string> = {
  positive: "badge-positive",
  neutral:  "badge-neutral",
  warning:  "badge-warning",
  danger:   "badge-danger",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [tools, setTools] = useState<AuditTool[]>([{ name: "", monthly_cost: "" }]);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success">("idle");
  const [subMessage, setSubMessage] = useState("");

  function addTool() {
    if (tools.length < 20) setTools([...tools, { name: "", monthly_cost: "" }]);
  }

  function removeTool(i: number) {
    if (tools.length === 1) return;
    setTools(tools.filter((_, idx) => idx !== i));
  }

  function updateTool(i: number, field: keyof AuditTool, value: string) {
    const updated = [...tools];
    updated[i] = { ...updated[i], [field]: value };
    setTools(updated);
  }

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    const validTools = tools.filter((t) => t.name.trim());
    if (!validTools.length) { setError("Add at least one tool to audit."); return; }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/productionflow/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: validTools.map((t) => ({
            name: t.name.trim(),
            ...(t.monthly_cost ? { monthly_cost: parseFloat(t.monthly_cost) } : {}),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Audit failed. Try again."); return; }
      setResult(data);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function subscribeForAlerts(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/productionflow/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "audit_results" }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setSubStatus("success"); setSubMessage(data.message); }
      else { setSubStatus("idle"); }
    } catch { setSubStatus("idle"); }
  }

  const grade = result?.grade ?? null;
  const gradeConfig = grade ? GRADE_CONFIG[grade] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[var(--card-border)] text-gray-500 mb-4">
          <span>📊</span> AI Audit · Free · No account required
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Audit Your AI Stack</h1>
        <p className="text-gray-400 text-lg">
          Enter the AI tools you&apos;re using. We&apos;ll score each one against live heat data and
          flag anything that&apos;s cooling down — with a specific swap recommendation.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={runAudit} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">Your AI tools</h2>
        <div className="space-y-3 mb-4">
          {tools.map((tool, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateTool(i, "name", e.target.value)}
                placeholder={`e.g. ${["ChatGPT", "Cursor", "ElevenLabs", "Midjourney", "Perplexity"][i % 5]}`}
                className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 text-sm transition-colors"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={tool.monthly_cost}
                onChange={(e) => updateTool(i, "monthly_cost", e.target.value)}
                placeholder="$/mo (optional)"
                className="w-32 px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 text-sm transition-colors"
              />
              <button type="button" onClick={() => removeTool(i)}
                className="text-gray-600 hover:text-red-400 text-xl leading-none transition-colors px-1"
                aria-label="Remove tool">×</button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={addTool}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
            <span>+</span> Add another tool
          </button>
          <span className="text-xs text-gray-600">{tools.filter(t => t.name).length} / 20</span>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading}
          className="mt-5 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors disabled:opacity-60 text-sm">
          {loading ? "Analyzing your stack…" : "Run Audit →"}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div id="results" className="space-y-6 score-pop">

          {/* Score card */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="text-center flex-shrink-0">
              <div className={`text-7xl font-bold tabular-nums ${gradeConfig?.color}`}>
                {result.efficiency_score ?? "—"}
              </div>
              <div className={`text-lg font-semibold mt-1 ${gradeConfig?.color}`}>
                Grade {grade} · {gradeConfig?.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">Efficiency Score</div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {[
                { label: "Tools matched",  value: result.summary.matched,      color: "text-white" },
                { label: "Heating up",     value: result.summary.heating_up,   color: "text-emerald-400" },
                { label: "Stable",         value: result.summary.stable,       color: "text-gray-400" },
                { label: "Cooling down",   value: result.summary.cooling_down, color: "text-amber-400" },
                { label: "Fading",         value: result.summary.fading,       color: "text-red-400" },
                { label: "Swaps found",    value: result.summary.tools_with_swap, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--background)] rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-tool cards */}
          <div className="space-y-3">
            <h2 className="font-semibold text-white">Tool breakdown</h2>
            {result.matched.map((tool) => (
              <ToolResultCard key={tool.canonical_name} tool={tool} />
            ))}
            {result.unmatched.map((tool) => (
              <div key={tool.input_name}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                <span className="text-sm text-gray-500">"{tool.input_name}" — not found in database</span>
                <span className="text-xs text-gray-600">unmatched</span>
              </div>
            ))}
          </div>

          {/* Email capture */}
          <div className="bg-[var(--card)] border border-emerald-500/20 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-white mb-1">Get monthly audit alerts</h3>
            <p className="text-sm text-gray-400 mb-4">
              We&apos;ll re-run your audit every month and email you when something in your stack starts cooling.
            </p>
            {subStatus === "success" ? (
              <div className="text-emerald-400 text-sm font-medium">✓ {subMessage}</div>
            ) : (
              <form onSubmit={subscribeForAlerts} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 text-sm" />
                <button type="submit" disabled={subStatus === "loading"}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors disabled:opacity-60 whitespace-nowrap">
                  {subStatus === "loading" ? "…" : "Alert me"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolResultCard({ tool }: { tool: MatchedTool }) {
  const badgeClass = SEVERITY_CLASSES[tool.trend_signal.severity];
  const delta = tool.score_delta_7d;
  const deltaLabel = delta !== null
    ? delta > 0 ? `+${delta}` : `${delta}`
    : null;

  return (
    <div className={`bg-[var(--card)] border rounded-xl p-4 transition-colors ${
      tool.trend_signal.severity === "danger"   ? "border-red-500/30" :
      tool.trend_signal.severity === "warning"  ? "border-amber-500/30" :
      tool.trend_signal.severity === "positive" ? "border-emerald-500/20" :
      "border-[var(--card-border)]"
    }`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-white">{tool.canonical_name}</span>
            {tool.input_name.toLowerCase() !== tool.canonical_name.toLowerCase() && (
              <span className="text-xs text-gray-600">← you entered "{tool.input_name}"</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            {tool.category && <span>{tool.category}</span>}
            {tool.category && <span>·</span>}
            <span>Heat score: <span className="text-white font-medium">{tool.viral_score}</span></span>
            {deltaLabel && (
              <span className={delta! > 0 ? "text-emerald-400" : "text-red-400"}>
                ({deltaLabel} this week)
              </span>
            )}
            {tool.pricing_model && <span>· {tool.pricing_model}</span>}
            {tool.monthly_cost && <span>· ${tool.monthly_cost}/mo</span>}
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${badgeClass}`}>
          {tool.trend_signal.label}
        </span>
      </div>

      {/* Swap suggestion */}
      {tool.swap_suggestion && (
        <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-amber-400 mt-0.5 flex-shrink-0">⚡</span>
            <div>
              <span className="text-gray-300">Consider switching to </span>
              {tool.swap_suggestion.affiliate_url ? (
                <a href={tool.swap_suggestion.affiliate_url} target="_blank" rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-medium">{tool.swap_suggestion.name}</a>
              ) : (
                <span className="text-emerald-400 font-medium">{tool.swap_suggestion.name}</span>
              )}
              <span className="text-gray-500"> — {tool.swap_suggestion.reason}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
