/** Prefer `OFFER_ACCESS_PASSWORD`; `OFFER_ACCESS_SECRET` is an alias (no `PUBLIC_` prefix). */
export function getOfferGateSecret(): string | undefined {
	const p = import.meta.env.OFFER_ACCESS_PASSWORD;
	const s = import.meta.env.OFFER_ACCESS_SECRET;
	if (typeof p === "string" && p.length > 0) return p;
	if (typeof s === "string" && s.length > 0) return s;
	return undefined;
}

/** @deprecated use {@link getOfferGateSecret} */
export function getOfferAccessSecret(): string | undefined {
	return getOfferGateSecret();
}
