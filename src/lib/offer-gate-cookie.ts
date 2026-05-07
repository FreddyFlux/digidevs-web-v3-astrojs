export const OFFER_GATE_COOKIE = "offer_gate";

export function parseOfferGateCookie(cookieHeader: string | null): string | undefined {
	if (!cookieHeader) return undefined;
	const parts = cookieHeader.split(";").map((p) => p.trim());
	for (const part of parts) {
		if (part.startsWith(`${OFFER_GATE_COOKIE}=`)) {
			return decodeURIComponent(part.slice(OFFER_GATE_COOKIE.length + 1));
		}
	}
	return undefined;
}
