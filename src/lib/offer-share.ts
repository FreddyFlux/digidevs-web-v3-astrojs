import type { Locale } from "../i18n/locales";
import { OFFER_SHARE_AUTH_QUERY } from "./queries";
import { getSanityClient } from "./sanity";

export type OfferShareAuthRow = {
	_id: string;
	shareEnabled?: boolean;
	sharePasswordHash?: string;
	shareSecretVersion?: number;
	language?: string;
};

export async function fetchOfferShareAuth(
	slug: string,
	lang: Locale,
): Promise<OfferShareAuthRow | null> {
	const client = getSanityClient();
	return client.fetch<OfferShareAuthRow | null>(OFFER_SHARE_AUTH_QUERY, { slug, lang });
}

const MIN_PASSWORD_LEN = 10;
const MAX_PASSWORD_LEN = 200;

export function validateOfferSharePasswordPair(
	password: string,
	passwordConfirm: string,
): { ok: true } | { ok: false; error: string } {
	const p = password.trim();
	const c = passwordConfirm.trim();
	if (p.length < MIN_PASSWORD_LEN) {
		return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LEN} characters.` };
	}
	if (p.length > MAX_PASSWORD_LEN) {
		return { ok: false, error: "Password is too long." };
	}
	if (p !== c) {
		return { ok: false, error: "Passwords do not match." };
	}
	return { ok: true };
}

export function isCustomerOfferViewable(auth: OfferShareAuthRow | null): auth is OfferShareAuthRow {
	if (!auth?.shareEnabled) return false;
	const hash = auth.sharePasswordHash?.trim();
	return Boolean(hash && hash.length > 0);
}
