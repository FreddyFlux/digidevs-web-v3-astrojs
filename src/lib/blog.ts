import type { PortableTextBlock } from "@portabletext/types";
import { defaultComponents, escapeHTML, mergeComponents, toHTML } from "@portabletext/to-html";
import type { Locale } from "../i18n/locales";
import type { PricingTableBlock } from "../types/sanity";
import { getSanityClient, urlForImage } from "./sanity";
import { POSTS_BY_LANG_QUERY, SINGLE_POST_BY_SLUG_QUERY } from "./queries";

const PRICING_TABLE_DEFAULT_LABELS = {
	col1: "Project Type",
	col2: "Norwegian Agency",
	col3: "DigiDevs",
} as const;

function pricingTableBlockToHtml(value: PricingTableBlock): string {
	const labels = value.columnLabels ?? {};
	const l1 = labels.col1?.trim() || PRICING_TABLE_DEFAULT_LABELS.col1;
	const l2 = labels.col2?.trim() || PRICING_TABLE_DEFAULT_LABELS.col2;
	const l3 = labels.col3?.trim() || PRICING_TABLE_DEFAULT_LABELS.col3;
	const rows = value.rows ?? [];

	const headingHtml = value.heading?.trim()
		? `<h3>${escapeHTML(value.heading.trim())}</h3>`
		: "";

	const thead = `<thead><tr class="border-b border-outline/30 bg-surface-container-low/80"><th scope="col" class="px-4 py-3 text-left font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">${escapeHTML(l1)}</th><th scope="col" class="px-4 py-3 text-left font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">${escapeHTML(l2)}</th><th scope="col" class="px-4 py-3 text-left font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">${escapeHTML(l3)}</th></tr></thead>`;

	const tbodyRows = rows
		.map(
			(r) =>
				`<tr class="border-b border-outline/15 last:border-0"><td class="px-4 py-3 font-medium text-on-surface">${escapeHTML(r.projectType)}</td><td class="px-4 py-3 text-on-surface-variant">${escapeHTML(r.col2Value)}</td><td class="px-4 py-3 text-on-surface-variant">${escapeHTML(r.col3Value)}</td></tr>`,
		)
		.join("");

	const tableHtml = `<div class="not-prose my-8 overflow-x-auto rounded-xl border border-outline/20"><table class="w-full min-w-[28rem] border-collapse text-left text-base">${thead}<tbody>${tbodyRows}</tbody></table></div>`;

	return `${headingHtml}${tableHtml}`;
}

export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	date: string;
	categories: string[];
	readTime: string;
	author: string;
	featured?: boolean;
	bodyHtml: string;
	coverImageUrl: string;
	coverImageAlt: string;
	updatedAt?: string;
	seoTitle?: string;
	seoDescription?: string;
	noIndex?: boolean;
	canonicalUrl?: string;
	/** SEO keywords from Sanity (meta + JSON-LD) */
	seoKeywords?: string[];
};

export type SanityPostDoc = {
	_id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	updatedAt?: string;
	author: string;
	categories?: string[];
	/** @deprecated Legacy single field from older documents */
	category?: string;
	readTime: string;
	featured?: boolean;
	language?: string;
	coverImage?: {
		asset?: { _ref?: string };
		alt?: string;
	};
	body: PortableTextBlock[];
	seo?: {
		seoTitle?: string;
		seoDescription?: string;
		keywords?: string[];
		noIndex?: boolean;
		canonicalUrl?: string;
	};
};

function portableTextToHtml(blocks: PortableTextBlock[] | undefined): string {
	if (!blocks?.length) return "";
	return toHTML(blocks, {
		components: mergeComponents(defaultComponents, {
			types: {
				pricingTable: ({ value }) => pricingTableBlockToHtml(value as PricingTableBlock),
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

function normalizeCategories(doc: SanityPostDoc): string[] {
	const raw = doc.categories;
	if (Array.isArray(raw)) {
		const list = raw.filter((c): c is string => typeof c === "string" && Boolean(c));
		if (list.length) return list;
	}
	if (typeof doc.category === "string" && doc.category.trim()) {
		return [doc.category.trim()];
	}
	return [];
}

/** Join categories for inline labels (e.g. hero line, article header). */
export function formatCategories(categories: string[] | undefined | null): string {
	return (categories ?? []).filter(Boolean).join(" · ");
}

function mapDocToPost(doc: SanityPostDoc): BlogPost {
	const coverUrl = urlForImage(doc.coverImage);
	if (!coverUrl) {
		throw new Error(
			`Post "${doc.slug}" is missing a usable cover image. Add coverImage in Sanity.`,
		);
	}
	const seo = doc.seo;
	return {
		slug: doc.slug,
		title: doc.title,
		description: doc.excerpt,
		date: doc.publishedAt,
		categories: normalizeCategories(doc),
		readTime: doc.readTime,
		author: doc.author,
		featured: doc.featured,
		bodyHtml: portableTextToHtml(doc.body),
		coverImageUrl: coverUrl,
		coverImageAlt: doc.coverImage?.alt?.trim() || doc.title,
		updatedAt: doc.updatedAt,
		seoTitle: seo?.seoTitle,
		seoDescription: seo?.seoDescription,
		seoKeywords: normalizeSeoKeywords(seo?.keywords),
		noIndex: seo?.noIndex,
		canonicalUrl: seo?.canonicalUrl,
	};
}

function normalizeSeoKeywords(raw: string[] | undefined): string[] | undefined {
	if (!raw?.length) return undefined;
	const list = raw.map((k) => k.trim()).filter(Boolean);
	return list.length ? list : undefined;
}

export async function fetchAllPosts(lang: Locale): Promise<BlogPost[]> {
	const client = getSanityClient();
	const docs = await client.fetch<SanityPostDoc[]>(POSTS_BY_LANG_QUERY, { lang });
	return docs.map(mapDocToPost);
}

export async function fetchPostBySlug(lang: Locale, slug: string): Promise<BlogPost | undefined> {
	const client = getSanityClient();
	const doc = await client.fetch<SanityPostDoc | null>(SINGLE_POST_BY_SLUG_QUERY, { lang, slug });
	if (!doc) return undefined;
	return mapDocToPost(doc);
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
	if (!posts.length) return undefined;
	const featured = posts.filter((p) => p.featured);
	if (featured.length) {
		return [...featured].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
	}
	return posts[0];
}

/** Listing cards: all posts except the hero (featured or newest), newest first. */
export function getGridPosts(posts: BlogPost[], featured: BlogPost | undefined): BlogPost[] {
	if (!featured) return [];
	return [...posts]
		.filter((p) => p.slug !== featured.slug)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
	return posts.find((p) => p.slug === slug);
}
