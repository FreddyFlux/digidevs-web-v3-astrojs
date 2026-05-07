import type { APIRoute } from "astro";
import { compare } from "bcryptjs";
import type { Locale } from "../../../../../i18n/locales";
import { localeFromOfferQuery } from "../../../../../lib/offers";
import {
	fetchOfferShareAuth,
	isCustomerOfferViewable,
	normalizeOfferSharePassword,
	type OfferShareAuthRow,
} from "../../../../../lib/offer-share";
import { clientIpFromRequest, isOfferShareLoginRateLimited } from "../../../../../lib/offer-share-rate-limit";
import {
	buildOfferViewerSetCookieHeader,
	createOfferViewerToken,
} from "../../../../../lib/offer-viewer-session";
import { getOfferViewerSigningSecret } from "../../../../../lib/offer-viewer-env";

export const prerender = false;

async function authorizeLogin(
	slug: string,
	lang: Locale,
	password: string,
): Promise<{ ok: true; auth: OfferShareAuthRow } | { ok: false; status: number }> {
	const auth = await fetchOfferShareAuth(slug, lang);
	if (!isCustomerOfferViewable(auth)) {
		return { ok: false, status: 404 };
	}
	const hash = auth.sharePasswordHash!.trim();
	// Match setup behavior (trim + NFC normalization) before hashing.
	const match = await compare(normalizeOfferSharePassword(password), hash);
	if (!match) {
		return { ok: false, status: 401 };
	}
	return { ok: true, auth };
}

/** POST — verify customer password and set viewer cookie. */
export const POST: APIRoute = async ({ params, request }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	const signing = getOfferViewerSigningSecret();
	if (!signing) {
		return new Response(
			JSON.stringify({ error: "Server is not configured (missing OFFER_VIEWER_SIGNING_SECRET)." }),
			{ status: 503, headers: { "Content-Type": "application/json" } },
		);
	}

	const incoming = new URL(request.url);
	const lang = localeFromOfferQuery(incoming.searchParams) as Locale;

	const ip = clientIpFromRequest(request);
	if (isOfferShareLoginRateLimited(`${ip}:${slug}`)) {
		return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
			status: 429,
			headers: { "Content-Type": "application/json" },
		});
	}

	const ct = request.headers.get("content-type") ?? "";
	let password = "";
	let redirectTo: string | null = null;

	if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
		const fd = await request.formData();
		password = String(fd.get("password") ?? "");
		redirectTo = String(fd.get("redirect") ?? "") || null;
	} else {
		let json: { password?: string; redirect?: string };
		try {
			json = (await request.json()) as { password?: string; redirect?: string };
		} catch {
			return new Response(JSON.stringify({ error: "Invalid body." }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
		password = typeof json.password === "string" ? json.password : "";
		redirectTo = typeof json.redirect === "string" ? json.redirect : null;
	}

	const result = await authorizeLogin(slug, lang, password);
	if (!result.ok) {
		if (result.status === 401 && redirectTo) {
			const back = new URL(redirectTo, incoming.origin);
			if (back.origin === incoming.origin) {
				back.searchParams.set("e", "1");
				return Response.redirect(back.toString(), 303);
			}
		}
		return new Response(
			JSON.stringify({
				error: result.status === 404 ? "Not Found" : "Invalid password.",
			}),
			{
				status: result.status,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const sv =
		typeof result.auth.shareSecretVersion === "number" ? result.auth.shareSecretVersion : 0;
	const token = createOfferViewerToken(slug, sv);
	if (!token) {
		return new Response(JSON.stringify({ error: "Could not create session." }), {
			status: 503,
			headers: { "Content-Type": "application/json" },
		});
	}

	const setCookie = buildOfferViewerSetCookieHeader(token);

	if (redirectTo) {
		const dest = new URL(redirectTo, incoming.origin);
		if (dest.origin !== incoming.origin) {
			return new Response(JSON.stringify({ error: "Invalid redirect." }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
		return new Response(null, {
			status: 303,
			headers: {
				Location: dest.pathname + dest.search,
				"Set-Cookie": setCookie,
			},
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Set-Cookie": setCookie,
			"Cache-Control": "no-store",
		},
	});
};
