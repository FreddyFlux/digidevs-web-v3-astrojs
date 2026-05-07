import { parseOfferGateCookie } from "./offer-gate-cookie";
import { getOfferGateSecret } from "./offer-gate-env";

/** Query/header bypass (bookmarks, tools). */
export function isOfferGateKeyBypass(request: Request): boolean {
	const secret = getOfferGateSecret();
	if (!secret) return false;
	const url = new URL(request.url);
	const keyFromQuery = url.searchParams.get("key")?.trim();
	const keyFromHeader = request.headers.get("x-offer-key")?.trim();
	const provided = keyFromQuery ?? keyFromHeader;
	return provided === secret;
}

/** Opaque session cookie shape; full HMAC check runs in Node (pages/API). */
export function hasOfferGateSessionCookie(request: Request): boolean {
	const v = parseOfferGateCookie(request.headers.get("cookie"));
	if (!v) return false;
	const dot = v.indexOf(".");
	if (dot === -1) return false;
	const payload = v.slice(0, dot);
	const sig = v.slice(dot + 1);
	return Boolean(payload && sig && payload.length > 8 && sig.length > 8);
}
