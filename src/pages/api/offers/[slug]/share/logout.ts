import type { APIRoute } from "astro";
import { buildOfferViewerClearCookieHeader } from "../../../../../lib/offer-viewer-session";

export const prerender = false;

/** POST — clear customer-offer viewer cookie. */
export const POST: APIRoute = async () => {
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Set-Cookie": buildOfferViewerClearCookieHeader(),
			"Cache-Control": "no-store",
		},
	});
};
