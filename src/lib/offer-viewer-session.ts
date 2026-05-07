import { createHmac, timingSafeEqual } from "node:crypto";
import { OFFER_VIEWER_COOKIE } from "./offer-viewer-cookie";
import { getOfferViewerSigningSecret } from "./offer-viewer-env";

export { OFFER_VIEWER_COOKIE };

const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function signingKey(): Buffer {
	const secret = getOfferViewerSigningSecret();
	if (!secret) return Buffer.alloc(0);
	return Buffer.from(secret, "utf8");
}

type ViewerPayload = {
	exp: number;
	v: number;
	slug: string;
	sv: number;
};

/** Signed token: base64url JSON payload + `.` + base64url HMAC-SHA256. */
export function createOfferViewerToken(slug: string, shareSecretVersion: number): string | null {
	const key = signingKey();
	if (!key.length) return null;
	const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
	const body: ViewerPayload = { exp, v: 1, slug, sv: shareSecretVersion };
	const payloadB64 = Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
	const sig = createHmac("sha256", key).update(payloadB64).digest("base64url");
	return `${payloadB64}.${sig}`;
}

export function verifyOfferViewerToken(
	token: string | undefined,
	expectedSlug: string,
	expectedShareSecretVersion: number,
): boolean {
	if (!token) return false;
	const key = signingKey();
	if (!key.length) return false;
	const dot = token.indexOf(".");
	if (dot === -1) return false;
	const payloadB64 = token.slice(0, dot);
	const sig = token.slice(dot + 1);
	const expectedSig = createHmac("sha256", key).update(payloadB64).digest("base64url");
	const a = Buffer.from(sig, "utf8");
	const b = Buffer.from(expectedSig, "utf8");
	if (a.length !== b.length) return false;
	if (!timingSafeEqual(a, b)) return false;
	try {
		const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as ViewerPayload;
		if (payload.v !== 1 || typeof payload.exp !== "number") return false;
		if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
		if (payload.slug !== expectedSlug) return false;
		if (payload.sv !== expectedShareSecretVersion) return false;
		return true;
	} catch {
		return false;
	}
}

export function buildOfferViewerSetCookieHeader(token: string): string {
	const bits = [
		`${OFFER_VIEWER_COOKIE}=${encodeURIComponent(token)}`,
		"Path=/",
		`Max-Age=${MAX_AGE_SEC}`,
		"HttpOnly",
		"SameSite=Lax",
	];
	if (import.meta.env.PROD) bits.push("Secure");
	return bits.join("; ");
}

export function buildOfferViewerClearCookieHeader(): string {
	const bits = [`${OFFER_VIEWER_COOKIE}=`, "Path=/", "Max-Age=0", "HttpOnly", "SameSite=Lax"];
	if (import.meta.env.PROD) bits.push("Secure");
	return bits.join("; ");
}
