/**
 * POST /api/productionflow/subscribe
 *
 * Subscribes an email to the ProductionFlow waitlist via Beehiiv.
 *
 * Currently uses the shared HookFlow Beehiiv credentials (BEEHIIV_API_KEY /
 * BEEHIIV_PUBLICATION_ID). When ProductionFlow gets its own Beehiiv publication,
 * add PRODUCTIONFLOW_BEEHIIV_API_KEY and PRODUCTIONFLOW_BEEHIIV_PUBLICATION_ID
 * to Vercel env vars — those take priority automatically via the fallback logic below.
 *
 * The `source` field tags where in the UI the signup happened:
 *   - "audit_results"  — user completed AI Audit and opted in at results screen
 *   - "stack_builder"  — user clicked "Save this stack" in Stack Builder
 *   - "landing_page"   — user signed up from the landing page
 *
 * This maps to utm_campaign in Beehiiv for conversion tracking.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { strictRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const VALID_SOURCES = ['audit_results', 'stack_builder', 'landing_page'] as const;
type SubscribeSource = (typeof VALID_SOURCES)[number];

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  source: z.enum(VALID_SOURCES).default('landing_page'),
});

export async function POST(request: NextRequest) {
  // 1. Rate limit
  const identifier = getClientIdentifier(request);
  const rateLimit = await strictRateLimiter.check(identifier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter ?? 60) } }
    );
  }

  // 2. Validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, source } = parsed.data;

  // 3. Beehiiv credentials — ProductionFlow-specific vars take priority,
  //    falls back to the shared HookFlow vars during Phase 1.
  const apiKey = process.env.PRODUCTIONFLOW_BEEHIIV_API_KEY ?? process.env.BEEHIIV_API_KEY;
  const publicationId =
    process.env.PRODUCTIONFLOW_BEEHIIV_PUBLICATION_ID ?? process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('[ProductionFlow/Subscribe] Missing Beehiiv credentials');
    return NextResponse.json({ error: 'Newsletter service not configured' }, { status: 500 });
  }

  // 4. Call Beehiiv
  const beehiivResponse = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'productionflow',
        utm_medium: 'website',
        utm_campaign: source,
        custom_fields: [
          { name: 'signup_source', value: source },
          { name: 'product',       value: 'productionflow' },
        ],
      }),
    }
  );

  let beehiivData: Record<string, unknown>;
  try {
    beehiivData = await beehiivResponse.json();
  } catch {
    beehiivData = {};
  }

  if (!beehiivResponse.ok) {
    const errors = beehiivData.errors as Array<{ message: string }> | undefined;
    const errorMessage = errors?.[0]?.message ?? '';

    if (
      beehiivResponse.status === 400 &&
      (errorMessage.includes('already subscribed') || errorMessage.includes('already exists'))
    ) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list — we'll be in touch!",
        already_subscribed: true,
      });
    }

    console.error('[ProductionFlow/Subscribe] Beehiiv error:', beehiivData);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }

  const messages: Record<SubscribeSource, string> = {
    audit_results: "You're on the list! We'll alert you when ProductionFlow launches.",
    stack_builder: "Stack saved! We'll email you when ProductionFlow is ready.",
    landing_page:  "You're in! We'll let you know when ProductionFlow launches.",
  };

  console.log(`[ProductionFlow/Subscribe] ✓ ${email} via ${source}`);

  return NextResponse.json({ success: true, message: messages[source] });
}
