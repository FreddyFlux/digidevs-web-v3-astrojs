const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 25;
const store = new Map<string, { count: number; windowStart: number }>();

function prune(now: number): void {
	if (store.size < 500) return;
	for (const [k, v] of store) {
		if (now - v.windowStart > WINDOW_MS) store.delete(k);
	}
}

/** Returns true if this key should be blocked (too many attempts in the window). */
export function isOfferShareLoginRateLimited(key: string): boolean {
	const now = Date.now();
	prune(now);
	const prev = store.get(key);
	if (!prev || now - prev.windowStart > WINDOW_MS) {
		store.set(key, { count: 1, windowStart: now });
		return false;
	}
	prev.count += 1;
	return prev.count > MAX_ATTEMPTS;
}

export function clientIpFromRequest(request: Request): string {
	const xff = request.headers.get("x-forwarded-for");
	if (xff) {
		const first = xff.split(",")[0]?.trim();
		if (first) return first;
	}
	return request.headers.get("cf-connecting-ip")?.trim() || "unknown";
}
