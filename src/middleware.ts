import { defineMiddleware } from "astro:middleware";
import { getOfferGateSecret } from "./lib/offer-gate-env";
import { hasOfferGateSessionCookie, isOfferGateKeyBypass } from "./lib/offer-gate-helpers";

/**
 * Edge-safe gate: key bypass + opaque session cookie shape. Pages/API run full HMAC verification (Node).
 */
export const onRequest = defineMiddleware(async (context, next) => {
	if (!getOfferGateSecret()) {
		return next();
	}

	const path = context.url.pathname;
	const req = context.request;

	if (path === "/offers/login") return next();
	if (path === "/api/offers/login") return next();
	if (path === "/api/offers/logout") return next();

	const isOfferArea =
		path.startsWith("/offers") ||
		path.startsWith("/api/offers") ||
		path.startsWith("/en/offers") ||
		path.startsWith("/hr/offers");

	if (isOfferArea) {
		if (isOfferGateKeyBypass(req) || hasOfferGateSessionCookie(req)) {
			return next();
		}

		if (path.startsWith("/api/")) {
			return new Response(JSON.stringify({ error: "Not Found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const dest = `${context.url.pathname}${context.url.search}`;
		return Response.redirect(
			new URL(`/offers/login?redirect=${encodeURIComponent(dest)}`, context.url),
			302,
		);
	}

	return next();
});
