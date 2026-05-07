import type { APIRoute } from "astro";
import {
	buildOfferGateSetCookieHeader,
	createOfferGateToken,
	verifyOfferGatePassword,
} from "../../../lib/offer-session";
import { getOfferGateSecret } from "../../../lib/offer-gate-env";

export const prerender = false;

function safeRedirectPath(raw: string): string {
	if (!raw.startsWith("/") || raw.startsWith("//")) return "/offers";
	return raw;
}

export const POST: APIRoute = async ({ request }) => {
	const expected = getOfferGateSecret();
	if (!expected) {
		return new Response("Offer gate not configured", { status: 503 });
	}

	let password = "";
	let redirect = "/offers";
	try {
		const ct = request.headers.get("content-type") ?? "";
		if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
			const fd = await request.formData();
			password = String(fd.get("password") ?? "");
			redirect = safeRedirectPath(String(fd.get("redirect") ?? "/offers"));
		} else if (ct.includes("application/json")) {
			const body = (await request.json()) as { password?: string; redirect?: string };
			password = typeof body.password === "string" ? body.password : "";
			redirect = safeRedirectPath(typeof body.redirect === "string" ? body.redirect : "/offers");
		}
	} catch {
		return new Response(null, { status: 400 });
	}

	if (!verifyOfferGatePassword(password, expected)) {
		return Response.redirect(new URL("/offers/login?error=1", request.url), 302);
	}

	const token = createOfferGateToken();
	if (!token) {
		return new Response("Session error", { status: 500 });
	}

	const headers = new Headers();
	headers.set("Set-Cookie", buildOfferGateSetCookieHeader(token));
	headers.set("Location", new URL(redirect, request.url).toString());
	return new Response(null, { status: 303, headers });
};
