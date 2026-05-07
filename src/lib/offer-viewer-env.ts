/** Server-only secret for signing customer-offer viewer cookies (separate from internal offer_gate). */
export function getOfferViewerSigningSecret(): string | undefined {
	const s = import.meta.env.OFFER_VIEWER_SIGNING_SECRET;
	return typeof s === "string" && s.trim().length > 0 ? s.trim() : undefined;
}
