import { defineMiddleware } from "astro:middleware";
import { getOfferGateSecret } from "./lib/offer-gate-env";
import { hasOfferGateSessionCookie, isOfferGateKeyBypass } from "./lib/offer-gate-helpers";
import { isOfferPath } from "./lib/is-offer-path";

const OFFER_X_ROBOTS = "noindex, nofollow, noarchive, nosnippet, noimageindex";

function withOfferCrawlerHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("X-Robots-Tag", OFFER_X_ROBOTS);
	headers.set("Cache-Control", "private, no-store, max-age=0");
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

/**
 * Edge-safe gate: key bypass + opaque session cookie shape. Pages/API run full HMAC verification (Node).
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname;
	const isOfferArea = isOfferPath(path);

	if (!isOfferArea) {
		return next();
	}

	if (!getOfferGateSecret()) {
		return withOfferCrawlerHeaders(await next());
	}
	const req = context.request;

	if (path === "/offers/login") return withOfferCrawlerHeaders(await next());
	if (path === "/api/offers/login") return withOfferCrawlerHeaders(await next());
	if (path === "/api/offers/logout") return withOfferCrawlerHeaders(await next());

	if (isOfferGateKeyBypass(req) || hasOfferGateSessionCookie(req)) {
		return withOfferCrawlerHeaders(await next());
	}

	if (path.startsWith("/api/")) {
		return withOfferCrawlerHeaders(
			new Response(JSON.stringify({ error: "Not Found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			}),
		);
	}

	const dest = `${context.url.pathname}${context.url.search}`;
	return withOfferCrawlerHeaders(
		Response.redirect(
			new URL(`/offers/login?redirect=${encodeURIComponent(dest)}`, context.url),
			302,
		),
	);
});
