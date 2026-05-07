import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { defaultComponents, escapeHTML, mergeComponents, toHTML } from "@portabletext/to-html";
import type {
	SanityOfferCustomer,
	SanityOfferLineItem,
	SanityOfferMediaItem,
	SanityOfferSection,
	SanityOfferTerms,
} from "../types/sanity";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locales";
import { getSanityClient, urlForImage } from "./sanity";
import { OFFER_BY_SLUG_QUERY, OFFERS_LIST_QUERY, OFFER_SLUGS_QUERY } from "./queries";

export type OfferLineItemView = {
	_key?: string;
	description: string;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
	notes?: string;
};

export type OfferSectionView = {
	title: string;
	bodyHtml: string;
};

/** Serializable view model for web, print, and locked JSON snapshot. */
export type OfferViewModel = {
	id: string;
	slug: string;
	title: string;
	offerNumber?: string;
	status: string;
	language: string;
	issueDate?: string;
	validUntil?: string;
	templateVersion: string;
	accentVariant: string;
	customer: SanityOfferCustomer;
	summary?: string;
	descriptionHtml: string;
	sections: OfferSectionView[];
	termsHeading?: string;
	termsHtml: string;
	currency: string;
	lineItems: OfferLineItemView[];
	subtotal?: number;
	discountAmount: number;
	taxAmount: number;
	total: number;
	media: { url: string; alt: string; caption?: string }[];
	/** True when Sanity `renderSnapshot` is non-empty (PDF may prefer locked payload). */
	hasLockedSnapshot: boolean;
};

export type SanityOfferDoc = {
	_id: string;
	title: string;
	slug: string;
	offerNumber?: string;
	status?: string;
	language?: string;
	issueDate?: string;
	validUntil?: string;
	templateVersion?: string;
	accentVariant?: string;
	customer?: SanityOfferCustomer;
	summary?: string;
	description?: PortableTextBlock[];
	sections?: SanityOfferSection[];
	terms?: SanityOfferTerms;
	currency?: string;
	lineItems?: SanityOfferLineItem[];
	subtotal?: number;
	discountAmount?: number;
	taxAmount?: number;
	total?: number;
	media?: SanityOfferMediaItem[];
	renderSnapshot?: string | null;
	snapshotCapturedAt?: string | null;
};

export type OfferListItem = {
	id: string;
	title: string;
	slug: string;
	offerNumber?: string;
	status?: string;
	issueDate?: string;
	company?: string;
};

function portableToHtml(blocks: PortableTextBlock[] | undefined): string {
	if (!blocks?.length) return "";
	return toHTML(blocks, {
		components: mergeComponents(defaultComponents, {
			types: {
				image: ({ value }) => {
					const src = urlForImage(value as SanityImageSource);
					if (!src) return "";
					const alt = escapeHTML(
						typeof (value as { alt?: string }).alt === "string"
							? (value as { alt: string }).alt
							: "",
					);
					const captionRaw = (value as { caption?: string }).caption?.trim();
					const img = `<img src="${escapeHTML(src)}" alt="${alt}" loading="eager" decoding="async" class="offer-desc-figure__img" />`;
					const caption = captionRaw
						? `<figcaption class="offer-desc-figure__caption">${escapeHTML(captionRaw)}</figcaption>`
						: "";
					return `<figure class="offer-desc-figure">${img}${caption}</figure>`;
				},
			},
			marks: {
				link: ({ value, children }) => {
					const href = (value as { href?: string } | undefined)?.href ?? "#";
					const isExternal = /^https?:\/\//.test(href);
					const rel = isExternal ? ' rel="noopener noreferrer"' : "";
					const target = isExternal ? ' target="_blank"' : "";
					return `<a href="${href}"${rel}${target}>${children}</a>`;
				},
			},
		}),
	});
}

function mapLineItems(raw: SanityOfferLineItem[] | undefined): OfferLineItemView[] {
	if (!raw?.length) return [];
	return raw.map((row) => {
		const quantity = typeof row.quantity === "number" ? row.quantity : 1;
		const unitPrice = typeof row.unitPrice === "number" ? row.unitPrice : 0;
		return {
			_key: row._key,
			description: row.description ?? "",
			quantity,
			unitPrice,
			lineTotal: quantity * unitPrice,
			notes: row.notes,
		};
	});
}

function mapMedia(raw: SanityOfferMediaItem[] | undefined): OfferViewModel["media"] {
	if (!raw?.length) return [];
	return raw
		.map((item) => {
			const u = urlForImage(item);
			if (!u) return null;
			return {
				url: u,
				alt: item.alt?.trim() || "Offer image",
				caption: item.caption?.trim() || undefined,
			};
		})
		.filter((x): x is NonNullable<typeof x> => x != null);
}

function mapSections(raw: SanityOfferSection[] | undefined): OfferSectionView[] {
	if (!raw?.length) return [];
	return raw.map((s) => ({
		title: s.title ?? "",
		bodyHtml: portableToHtml(s.body),
	}));
}

function isRecord(v: unknown): v is Record<string, unknown> {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isCustomerLike(v: unknown): v is SanityOfferCustomer {
	if (!isRecord(v)) return false;
	return typeof v.companyName === "string" && v.companyName.length > 0;
}

/**
 * If `renderSnapshot` is valid JSON matching the slug, merge over the Sanity-derived model
 * so sent offers stay reproducible.
 */
export function applyRenderSnapshot(
	base: OfferViewModel,
	renderSnapshot: string | null | undefined,
	requestSlug: string,
): OfferViewModel {
	const raw = renderSnapshot?.trim();
	if (!raw) return base;
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!isRecord(parsed)) return base;
		if (typeof parsed.slug === "string" && parsed.slug !== requestSlug) return base;
		if (typeof parsed.title !== "string") return base;
		if (!isCustomerLike(parsed.customer)) return base;
		const merged = { ...base, ...parsed } as OfferViewModel;
		merged.slug = requestSlug;
		merged.hasLockedSnapshot = true;
		if (!Array.isArray(merged.lineItems)) merged.lineItems = base.lineItems;
		if (!Array.isArray(merged.media)) merged.media = base.media;
		if (!Array.isArray(merged.sections)) merged.sections = base.sections;
		return merged;
	} catch {
		return base;
	}
}

export function sanityDocToViewModel(doc: SanityOfferDoc): OfferViewModel {
	const customer = doc.customer ?? { companyName: "—" };
	const lineItems = mapLineItems(doc.lineItems);
	const computedSubtotal = lineItems.reduce((acc, r) => acc + r.lineTotal, 0);

	return {
		id: doc._id,
		slug: doc.slug,
		title: doc.title ?? "Offer",
		offerNumber: doc.offerNumber,
		status: doc.status ?? "draft",
		language: doc.language ?? "no",
		issueDate: doc.issueDate,
		validUntil: doc.validUntil,
		templateVersion: doc.templateVersion ?? "1",
		accentVariant: doc.accentVariant ?? "default",
		customer,
		summary: doc.summary?.trim() || undefined,
		descriptionHtml: portableToHtml(doc.description),
		sections: mapSections(doc.sections),
		termsHeading: doc.terms?.heading,
		termsHtml: portableToHtml(doc.terms?.body),
		currency: (doc.currency ?? "NOK").toUpperCase(),
		lineItems,
		subtotal: doc.subtotal ?? (computedSubtotal > 0 ? computedSubtotal : undefined),
		discountAmount: doc.discountAmount ?? 0,
		taxAmount: doc.taxAmount ?? 0,
		total: doc.total ?? 0,
		media: mapMedia(doc.media),
		hasLockedSnapshot: Boolean(doc.renderSnapshot?.trim()),
	};
}

/** Parse `lang` query for `/api/offers/*` (defaults to Norwegian). */
export function localeFromOfferQuery(searchParams: URLSearchParams): Locale {
	const raw = searchParams.get("lang")?.trim().toLowerCase();
	if (raw === "en" || raw === "hr") return raw;
	return DEFAULT_LOCALE;
}

/** Preserve gate/query params and set `lang` for PDF/snapshot when locale is not default. */
export function mergeOfferApiSearchParams(initialQuery: string, pageLocale: Locale): string {
	const qs = initialQuery.startsWith("?") ? initialQuery.slice(1) : initialQuery;
	const sp = new URLSearchParams(qs);
	if (pageLocale === "en" || pageLocale === "hr") {
		sp.set("lang", pageLocale);
	} else {
		sp.delete("lang");
	}
	const s = sp.toString();
	return s ? `?${s}` : "";
}

export async function fetchOfferBySlug(slug: string, lang: Locale): Promise<SanityOfferDoc | null> {
	const client = getSanityClient();
	return client.fetch<SanityOfferDoc | null>(OFFER_BY_SLUG_QUERY, { slug, lang });
}

export async function resolveOfferForSlug(slug: string, lang: Locale): Promise<OfferViewModel | null> {
	const doc = await fetchOfferBySlug(slug, lang);
	if (!doc) return null;
	const base = sanityDocToViewModel(doc);
	return applyRenderSnapshot(base, doc.renderSnapshot, slug);
}

export async function fetchOfferSlugs(): Promise<string[]> {
	const client = getSanityClient();
	return client.fetch<string[]>(OFFER_SLUGS_QUERY);
}

export async function fetchOffersList(lang: Locale): Promise<OfferListItem[]> {
	const client = getSanityClient();
	const rows = await client.fetch<
		{
			_id: string;
			title: string;
			slug: string;
			offerNumber?: string;
			status?: string;
			issueDate?: string;
			company?: string;
		}[]
	>(OFFERS_LIST_QUERY, { lang });
	return rows.map((r) => ({
		id: r._id,
		title: r.title,
		slug: r.slug,
		offerNumber: r.offerNumber,
		status: r.status,
		issueDate: r.issueDate,
		company: r.company,
	}));
}

/** Sum of line totals (before discount/tax). */
export function sumLineTotals(offer: OfferViewModel): number {
	return offer.lineItems.reduce((a, b) => a + b.lineTotal, 0);
}
