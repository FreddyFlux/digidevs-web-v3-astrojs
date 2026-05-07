import type { APIRoute } from "astro";
import { OFFER_GATE_COOKIE, parseOfferGateCookie } from "../../../../lib/offer-gate-cookie";
import { isOfferAccessAllowed } from "../../../../lib/offer-access";
import { offerPostPath } from "../../../../i18n/utils";
import { renderUrlToPdf } from "../../../../lib/offer-pdf";
import { localeFromOfferQuery, resolveOfferForSlug } from "../../../../lib/offers";

export const prerender = false;

function originFromRequest(request: Request): string {
	const requestUrl = new URL(request.url);
	const requestHost = requestUrl.hostname.toLowerCase();
	const isLocalHost =
		requestHost === "localhost" ||
		requestHost === "127.0.0.1" ||
		requestHost === "::1";

	// In local dev, forwarded proto/host can report https even when Astro serves plain http.
	if (isLocalHost) {
		return requestUrl.origin;
	}

	const xfProto = request.headers.get("x-forwarded-proto");
	const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
	if (host && xfProto) {
		const proto = xfProto.split(",")[0]?.trim();
		if (proto === "http" || proto === "https") {
			return `${proto}://${host}`;
		}
	}

	return requestUrl.origin;
}

export const GET: APIRoute = async ({ params, request }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response("Not Found", { status: 404 });
	}

	if (!isOfferAccessAllowed(request)) {
		return new Response("Not Found", { status: 404 });
	}

	const incoming = new URL(request.url);
	const routeLang = localeFromOfferQuery(incoming.searchParams);
	const offer = await resolveOfferForSlug(slug, routeLang);
	if (!offer) {
		return new Response("Not Found", { status: 404 });
	}

	const origin = originFromRequest(request);
	const printUrl = `${origin}${offerPostPath(routeLang, slug)}/print${incoming.search}`;

	const session = parseOfferGateCookie(request.headers.get("cookie"));
	const pdfCookies =
		session != null && session.length > 0
			? [{ name: OFFER_GATE_COOKIE, value: session, url: origin }]
			: undefined;

	try {
		const pdfBytes = await renderUrlToPdf(printUrl, pdfCookies);
		const safeSlug = slug.replace(/[^a-zA-Z0-9_-]+/g, "-");
		return new Response(pdfBytes, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="digiDEVS-offer-${safeSlug}.pdf"`,
				"Cache-Control": "no-store",
			},
		});
	} catch (err) {
		console.error("[offer pdf]", err);
		return new Response("PDF generation failed", { status: 502 });
	}
};
