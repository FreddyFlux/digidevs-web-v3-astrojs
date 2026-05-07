import type { APIRoute } from "astro";
import { buildOfferGateClearCookieHeader } from "../../../lib/offer-session";

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
	const headers = new Headers();
	headers.set("Set-Cookie", buildOfferGateClearCookieHeader());
	headers.set("Location", new URL("/offers/login", request.url).toString());
	return new Response(null, { status: 303, headers });
};
