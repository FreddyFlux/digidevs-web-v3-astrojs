import type { PortableTextBlock } from "@portabletext/types";
import { defaultComponents, mergeComponents, toHTML } from "@portabletext/to-html";
import { getSanityClient, urlForImage } from "./sanity";
import { ALL_POSTS_QUERY } from "./queries";

export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	date: string;
	category: string;
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
};

export type SanityPostDoc = {
	_id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	updatedAt?: string;
	author: string;
	category: string;
	readTime: string;
	featured?: boolean;
	coverImage?: {
		asset?: { _ref?: string };
		alt?: string;
	};
	body: PortableTextBlock[];
	seo?: {
		seoTitle?: string;
		seoDescription?: string;
		noIndex?: boolean;
		canonicalUrl?: string;
	};
};

function portableTextToHtml(blocks: PortableTextBlock[] | undefined): string {
	if (!blocks?.length) return "";
	return toHTML(blocks, {
		components: mergeComponents(defaultComponents, {
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
		category: doc.category,
		readTime: doc.readTime,
		author: doc.author,
		featured: doc.featured,
		bodyHtml: portableTextToHtml(doc.body),
		coverImageUrl: coverUrl,
		coverImageAlt: doc.coverImage?.alt?.trim() || doc.title,
		updatedAt: doc.updatedAt,
		seoTitle: seo?.seoTitle,
		seoDescription: seo?.seoDescription,
		noIndex: seo?.noIndex,
		canonicalUrl: seo?.canonicalUrl,
	};
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
	const client = getSanityClient();
	const docs = await client.fetch<SanityPostDoc[]>(ALL_POSTS_QUERY);
	return docs.map(mapDocToPost);
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
