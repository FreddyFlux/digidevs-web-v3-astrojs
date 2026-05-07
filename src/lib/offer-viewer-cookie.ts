export const OFFER_VIEWER_COOKIE = "offer_viewer";

/** Extract raw signed token from Cookie header. */
export function parseOfferViewerCookie(cookieHeader: string | null): string | undefined {
	if (!cookieHeader) return undefined;
	for (const part of cookieHeader.split(";")) {
		const idx = part.indexOf("=");
		if (idx === -1) continue;
		const name = part.slice(0, idx).trim();
		if (name !== OFFER_VIEWER_COOKIE) continue;
		return decodeURIComponent(part.slice(idx + 1).trim());
	}
	return undefined;
}
