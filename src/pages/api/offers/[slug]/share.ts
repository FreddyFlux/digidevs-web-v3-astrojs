import type { APIRoute } from "astro";
import { hash } from "bcryptjs";
import type { Locale } from "../../../../i18n/locales";
import { isOfferAccessAllowed } from "../../../../lib/offer-access";
import { localeFromOfferQuery, mergeOfferApiSearchParams } from "../../../../lib/offers";
import {
	fetchOfferShareAuth,
	normalizeOfferSharePassword,
	validateOfferSharePasswordPair,
} from "../../../../lib/offer-share";
import { getSanityWriteClient } from "../../../../lib/sanity";

export const prerender = false;

/** POST — set or rotate customer-offer password (requires internal offer gate). */
export const POST: APIRoute = async ({ params, request }) => {
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

	const write = getSanityWriteClient();
	if (!write) {
		return new Response(
			JSON.stringify({
				error: "Server is not configured to update offers (missing SANITY_API_WRITE_TOKEN).",
			}),
			{ status: 503, headers: { "Content-Type": "application/json" } },
		);
	}

	const incoming = new URL(request.url);
	const lang = localeFromOfferQuery(incoming.searchParams) as Locale;

	let body: { password?: string; passwordConfirm?: string };
	try {
		body = (await request.json()) as { password?: string; passwordConfirm?: string };
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const password = typeof body.password === "string" ? body.password : "";
	const passwordConfirm = typeof body.passwordConfirm === "string" ? body.passwordConfirm : "";
	const v = validateOfferSharePasswordPair(password, passwordConfirm);
	if (!v.ok) {
		return new Response(JSON.stringify({ error: v.error }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const row = await fetchOfferShareAuth(slug, lang);
	if (!row?._id) {
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const prevVersion = typeof row.shareSecretVersion === "number" ? row.shareSecretVersion : 0;
	const nextVersion = prevVersion + 1;
	const sharePasswordHash = await hash(normalizeOfferSharePassword(password), 12);

	try {
		await write
			.patch(row._id)
			.set({
				shareEnabled: true,
				sharePasswordHash,
				shareSecretVersion: nextVersion,
			})
			.commit();
	} catch (err) {
		console.error("[offer share PATCH]", err);
		return new Response(JSON.stringify({ error: "Failed to save offer. Try again." }), {
			status: 502,
			headers: { "Content-Type": "application/json" },
		});
	}

	const url = `/offer/p/${encodeURIComponent(slug)}${mergeOfferApiSearchParams("", lang)}`;
	return new Response(JSON.stringify({ url }), {
		status: 200,
		headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
	});
};
