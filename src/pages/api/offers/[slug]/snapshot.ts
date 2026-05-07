import type { APIRoute } from "astro";
import { isOfferAccessAllowed } from "../../../../lib/offer-access";
import { localeFromOfferQuery, resolveOfferForSlug } from "../../../../lib/offers";

export const prerender = false;

/** GET `/api/offers/:slug/snapshot` — JSON for pasting into Sanity `renderSnapshot`. */
export const GET: APIRoute = async ({ params, request }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (!isOfferAccessAllowed(request)) {
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const routeLang = localeFromOfferQuery(new URL(request.url).searchParams);
	const offer = await resolveOfferForSlug(slug, routeLang);
	if (!offer) {
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(offer, null, 2), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
};
