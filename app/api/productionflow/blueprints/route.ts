/**
 * GET /api/productionflow/blueprints
 *
 * Returns published blueprints, ordered by:
 *   1. is_featured DESC  — featured blueprints always rise to the top
 *   2. published_at DESC — newest first within each group
 *
 * Only rows with `published_at IS NOT NULL AND published_at <= now()` are
 * returned — the RLS policy on the table enforces this at the DB level, but
 * the query also filters explicitly so the intent is clear.
 *
 * Response shape:
 *   { blueprints: Blueprint[] }
 *
 * ISR: revalidate = 600 (10 min) — same as the blueprints page that calls this.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 600;

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blueprints')
      .select(
        `id,
         slug,
         title,
         subtitle,
         goal,
         tool_ids,
         monthly_cost_min,
         monthly_cost_max,
         is_featured,
         published_at`
      )
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[ProductionFlow/Blueprints] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to load blueprints' }, { status: 500 });
    }

    return NextResponse.json({ blueprints: data ?? [] });
  } catch (err) {
    console.error('[ProductionFlow/Blueprints] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
