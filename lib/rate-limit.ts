/**
 * Distributed rate limiter backed by Upstash Redis.
 * Falls back to in-memory when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * are not set — safe for local development without a Redis instance.
 *
 * Upstash free tier: 10,000 requests/day, suitable for this scale.
 *
 * Usage:
 *   const result = await checkoutRateLimiter.check(clientId);
 *   if (!result.allowed) return NextResponse.json(..., { status: 429 });
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ---------------------------------------------------------------------------
// Shared result type (same shape as before — callers only need `await` added)
// ---------------------------------------------------------------------------

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// ---------------------------------------------------------------------------
// In-memory fallback — used when Upstash env vars are absent (local dev)
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class LocalRateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    // Periodic cleanup — acceptable in Node.js serverless (runs on cold-start process)
    setInterval(() => this.cleanup(), 60_000);
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    if (entry.count < this.maxRequests) {
      entry.count++;
      this.requests.set(identifier, entry);
      return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
    }

    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetTime: entry.resetTime, retryAfter };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) this.requests.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// Upstash Redis client — one instance shared across all rate limiters
// ---------------------------------------------------------------------------

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedisClient();

// ---------------------------------------------------------------------------
// Unified RateLimiter: Upstash when available, in-memory otherwise
// ---------------------------------------------------------------------------

class RateLimiter {
  private upstash: Ratelimit | null;
  private local: LocalRateLimiter;

  constructor(maxRequests: number, windowMs: number, prefix: string) {
    this.local = new LocalRateLimiter(maxRequests, windowMs);
    this.upstash = redis
      ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs / 1000} s`),
          prefix: `hookflow:rl:${prefix}`,
        })
      : null;

    if (!redis) {
      console.warn(`[RateLimit] Upstash not configured — "${prefix}" using in-memory fallback`);
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    if (this.upstash) {
      const { success, remaining, reset } = await this.upstash.limit(identifier);
      const now = Date.now();
      return {
        allowed: success,
        remaining,
        resetTime: reset,
        retryAfter: success ? undefined : Math.ceil((reset - now) / 1000),
      };
    }
    return this.local.check(identifier);
  }
}

// ---------------------------------------------------------------------------
// Exported rate limiter instances (same names as before)
// ---------------------------------------------------------------------------

export const checkoutRateLimiter = new RateLimiter(5,  60_000, 'checkout');
export const apiRateLimiter      = new RateLimiter(20, 60_000, 'api');
export const strictRateLimiter   = new RateLimiter(3,  60_000, 'strict');
// Stripe webhook endpoint: 30 req/min per IP is generous for Stripe's retry
// schedule while blocking flood attacks that trigger expensive signature crypto.
export const webhookRateLimiter  = new RateLimiter(30, 60_000, 'webhook');

// ---------------------------------------------------------------------------
// Utility functions (unchanged API)
// ---------------------------------------------------------------------------

/**
 * Extract client IP from request headers (handles proxy/CDN).
 *
 * Priority order:
 *  1. x-vercel-forwarded-for — set by Vercel's edge infrastructure; cannot be
 *     spoofed by clients because Vercel overwrites it before the request reaches
 *     the function. Prefer this over x-forwarded-for in production.
 *  2. x-forwarded-for — set by reverse proxies; first IP is the client.
 *     Can be spoofed when running outside Vercel (localhost / self-hosted).
 *  3. x-real-ip — set by Nginx and some other proxies.
 *  4. 'unknown-client' — fallback (triggers single shared counter).
 */
export function getClientIdentifier(request: Request): string {
  // Vercel-managed header — not user-controllable in production
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwarded) return vercelForwarded.split(',')[0].trim();

  const forwarded = request.headers.get('x-forwarded-for');
  const realIp    = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp)    return realIp;
  return 'unknown-client';
}

/**
 * Build standard X-RateLimit-* response headers.
 */
export function createRateLimitHeaders(info: {
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': info.remaining.toString(),
    'X-RateLimit-Reset': info.resetTime.toString(),
  };
  if (info.retryAfter !== undefined) {
    headers['Retry-After'] = info.retryAfter.toString();
  }
  return headers;
}
