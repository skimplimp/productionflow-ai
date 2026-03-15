/**
 * normalize-tool-name.ts
 *
 * Two-layer tool name normalization for the ProductionFlow AI Audit.
 *
 * Layer 1 — normalizeToolName():
 *   Strips everything except alphanumeric characters and lowercases the result.
 *   "Chat GPT", "ChatGPT", "chat-gpt", "chatgpt" → "chatgpt"
 *   This is the key used to look up rows in the tool_aliases table.
 *
 * Layer 2 — resolved server-side in the audit route via Supabase:
 *   Exact match against tool_aliases.alias after normalization.
 *   Falls back to a case-insensitive ILIKE search against tools.name
 *   for inputs that aren't in the alias table yet.
 */

// ---------------------------------------------------------------------------
// Layer 1 — pure normalization (safe to use client-side too)
// ---------------------------------------------------------------------------

export function normalizeToolName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // strip spaces, dashes, dots, punctuation
}

// ---------------------------------------------------------------------------
// Label helpers — converts tool trend data into human-readable signal labels
// ---------------------------------------------------------------------------

export type TrendLabel =
  | 'Heating Up'
  | 'Rising'
  | 'At Peak'
  | 'Cooling Down'
  | 'Fading'
  | 'Trending Up'
  | 'Stable'
  | 'Trending Down';

export type TrendSeverity = 'positive' | 'neutral' | 'warning' | 'danger';

export interface TrendSignal {
  label: TrendLabel;
  severity: TrendSeverity;
}

/**
 * Derives a display label and severity from a tool's trend_phase and score_delta_7d.
 * trend_phase takes priority; score_delta_7d is the fallback when trend_phase is null.
 */
export function getTrendSignal(
  trend_phase: string | null,
  score_delta_7d: number | null
): TrendSignal {
  if (trend_phase) {
    switch (trend_phase) {
      case 'emerging':  return { label: 'Heating Up',   severity: 'positive' };
      case 'rising':    return { label: 'Rising',        severity: 'positive' };
      case 'peak':      return { label: 'At Peak',       severity: 'neutral'  };
      case 'declining': return { label: 'Cooling Down',  severity: 'warning'  };
      case 'fading':    return { label: 'Fading',        severity: 'danger'   };
    }
  }

  // Fallback: use 7-day score delta when trend_phase is null
  const delta = score_delta_7d ?? 0;
  if (delta >= 5)   return { label: 'Trending Up',   severity: 'positive' };
  if (delta <= -10) return { label: 'Fading',         severity: 'danger'   };
  if (delta <= -5)  return { label: 'Cooling Down',   severity: 'warning'  };
  return { label: 'Stable', severity: 'neutral' };
}

/**
 * Calculates an overall Efficiency Score (0–100) for a user's stack.
 *
 * Scoring:
 *  - Baseline: 100 pts per tool
 *  - 'Cooling Down' (warning): −15 pts
 *  - 'Fading'       (danger):  −25 pts
 *  - 'Heating Up' / 'Rising' (positive): +5 pts bonus
 *  - Final = average across all matched tools, clamped 0–100
 *
 * Returns null when no tools were matched.
 */
export function calculateEfficiencyScore(signals: TrendSignal[]): number | null {
  if (signals.length === 0) return null;

  const total = signals.reduce((sum, signal) => {
    switch (signal.severity) {
      case 'danger':   return sum + 75;   // −25 from 100
      case 'warning':  return sum + 85;   // −15 from 100
      case 'positive': return sum + 105;  // +5 bonus
      default:         return sum + 100;  // neutral baseline
    }
  }, 0);

  return Math.min(100, Math.max(0, Math.round(total / signals.length)));
}

/**
 * Maps an efficiency score (0–100) to a letter grade for display.
 */
export function scoreToGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}
