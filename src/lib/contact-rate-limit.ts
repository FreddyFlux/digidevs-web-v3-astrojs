/** Sliding-window limiter (per server instance). Sufficient for basic abuse protection; for multi-region shared limits use Redis/KV. */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

/**
 * Per-IP timestamp buckets. Stale entries are pruned on each read, but IPs
 * that never re-request are never evicted. This is intentional and safe on
 * Vercel (ephemeral function instances), but would leak on a persistent server.
 * If moving to a long-running runtime, replace with a TTL-aware store or Redis.
 */
const buckets = new Map<string, number[]>();

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export function checkContactRateLimit(
  ip: string,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  let timestamps = buckets.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0]!;
    const retryAfterMs = Math.max(0, oldest + WINDOW_MS - now);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) || 1 };
  }

  timestamps.push(now);
  buckets.set(ip, timestamps);
  return { ok: true };
}
