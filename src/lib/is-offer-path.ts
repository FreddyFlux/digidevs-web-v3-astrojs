function startsWithSegment(pathname: string, prefix: string): boolean {
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isOfferPath(pathname: string): boolean {
	const path = pathname.toLowerCase();
	if (!path.startsWith("/")) return false;

	if (startsWithSegment(path, "/offers")) return true;
	if (startsWithSegment(path, "/offer")) return true;
	if (startsWithSegment(path, "/api/offers")) return true;

	return /^\/[a-z]{2}(?:-[a-z]{2})?\/offers(?:\/|$)/.test(path);
}

/**
 * True when the request must pass the internal offer gate (`offer_gate` cookie or key bypass).
 * Offer-related paths that are false here still go through middleware offer headers when the path
 * is an offer path — see {@link isOfferPath}.
 *
 * Excludes (in order): `/offer/p/*` before any other `/offer/*` rule; customer share session APIs.
 */
export function requiresInternalOfferGate(pathname: string): boolean {
	if (!isOfferPath(pathname)) return false;
	const path = pathname.toLowerCase();

	if (path === "/offers/login") return false;
	if (startsWithSegment(path, "/offer/p")) return false;
	if (path === "/api/offers/login" || path === "/api/offers/logout") return false;
	if (/^\/api\/offers\/[^/]+\/share\/(login|logout)$/.test(path)) return false;

	return true;
}

