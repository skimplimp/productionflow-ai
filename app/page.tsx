"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/productionflow/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing_page" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">

        {/* From the makers badge */}
        <a href="https://hookflow.ai" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 transition-colors mb-8">
          <span>🔥</span>
          <span>From the makers of HookFlow.ai</span>
          <span>→</span>
        </a>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
          Know when your AI stack<br className="hidden sm:block" /> is{" "}
          <span className="text-emerald-400">falling behind</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ProductionFlow audits your current AI tools against live heat scores,
          builds workflow stacks for your goals, and tells you exactly what to
          swap — before you fall behind.
        </p>

        {/* Email capture */}
        {status === "success" ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
            <span>✓</span> {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === "loading" ? "Joining…" : "Get Early Access"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">{message}</p>
        )}
        <p className="mt-4 text-xs text-gray-600">No spam. Unsubscribe anytime.</p>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <FeatureCard
            href="/audit"
            icon="📊"
            label="AI Audit"
            badge="Free"
            title="Score your current stack"
            description="Enter the AI tools you're paying for. We cross-reference every one against live HookFlow heat scores and tell you what's heating up, cooling down, or already fading — plus a specific swap recommendation for anything falling behind."
            cta="Audit my stack →"
          />

          <FeatureCard
            href="/stack-builder"
            icon="🔧"
            label="Stack Builder"
            badge="Free"
            title="Build your workflow stack"
            description="Pick a goal — Faceless YouTube, Blog Pipeline, Newsletter, Indie Dev — and get a curated, ordered stack of AI tools with their roles, how they connect, and live heat scores so you know the recommendation isn't stale."
            cta="Build a stack →"
          />

          <FeatureCard
            href="/blueprints"
            icon="📋"
            label="Blueprints"
            badge="Coming soon"
            title="Step-by-step workflow guides"
            description="Opinionated, detailed blueprints for the most common AI-powered production workflows. Each one is built around tools with strong heat scores and shows exactly how the pieces connect — with cost estimates included."
            cta="Browse blueprints →"
          />

        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--card-border)] bg-[var(--card)] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            Powered by HookFlow heat scores
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-14">
            Every recommendation in ProductionFlow is backed by live signal data — not editorial opinions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "📡", label: "Reddit", desc: "35+ subreddits monitored daily" },
              { icon: "🔍", label: "Search", desc: "Google Trends signals" },
              { icon: "💬", label: "Community", desc: "Hacker News & dev forums" },
              { icon: "📈", label: "Momentum", desc: "30-day trend delta tracking" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold text-white mb-1">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Start with the AI Audit — it&apos;s free
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Takes 60 seconds. No account required. Find out what in your stack is already cooling down.
        </p>
        <a
          href="/audit"
          className="inline-block px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-lg transition-colors"
        >
          Audit My Stack →
        </a>
      </section>

    </div>
  );
}

function FeatureCard({
  href, icon, label, badge, title, description, cta
}: {
  href: string;
  icon: string;
  label: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-white">{label}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
          badge === "Free"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-gray-500/10 text-gray-400 border-gray-500/30"
        }`}>
          {badge}
        </span>
      </div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>
      <div className="mt-5 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
        {cta}
      </div>
    </a>
  );
}
