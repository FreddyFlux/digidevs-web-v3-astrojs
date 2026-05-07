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

