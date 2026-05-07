import { createHmac, timingSafeEqual } from "node:crypto";
import { OFFER_GATE_COOKIE } from "./offer-gate-cookie";
import { getOfferGateSecret } from "./offer-gate-env";

export { OFFER_GATE_COOKIE };

const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function signingKey(): Buffer {
	const secret = getOfferGateSecret();
	if (!secret) return Buffer.alloc(0);
	return Buffer.from(secret, "utf8");
}

/** Payload: base64url JSON `{ exp, v }` + `.` + base64url HMAC-SHA256 of payload. */
export function createOfferGateToken(): string | null {
	const key = signingKey();
	if (!key.length) return null;
	const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
	const payloadB64 = Buffer.from(JSON.stringify({ exp, v: 1 }), "utf8").toString("base64url");
	const sig = createHmac("sha256", key).update(payloadB64).digest("base64url");
	return `${payloadB64}.${sig}`;
}

export function verifyOfferGateToken(token: string | undefined): boolean {
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
		const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
			exp?: number;
		};
		if (typeof payload.exp !== "number") return false;
		return payload.exp > Math.floor(Date.now() / 1000);
	} catch {
		return false;
	}
}

export function buildOfferGateSetCookieHeader(token: string): string {
	const bits = [
		`${OFFER_GATE_COOKIE}=${encodeURIComponent(token)}`,
		"Path=/",
		`Max-Age=${MAX_AGE_SEC}`,
		"HttpOnly",
		"SameSite=Lax",
	];
	if (import.meta.env.PROD) bits.push("Secure");
	return bits.join("; ");
}

export function buildOfferGateClearCookieHeader(): string {
	const bits = [`${OFFER_GATE_COOKIE}=`, "Path=/", "Max-Age=0", "HttpOnly", "SameSite=Lax"];
	if (import.meta.env.PROD) bits.push("Secure");
	return bits.join("; ");
}

export function verifyOfferGatePassword(provided: string, expected: string): boolean {
	const a = Buffer.from(provided, "utf8");
	const b = Buffer.from(expected, "utf8");
	if (a.length !== b.length) return false;
	try {
		return timingSafeEqual(a, b);
	} catch {
		return false;
	}
}
