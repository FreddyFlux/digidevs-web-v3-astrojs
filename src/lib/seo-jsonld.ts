import type { Locale } from "../i18n/locales";

/** Social / profile URLs used in Organization.sameAs (aligned with SiteFooter). */
export const ORG_SAME_AS = [
	"https://no.linkedin.com/in/fredrik-aarvold-871001100",
	"https://github.com/FreddyFlux",
] as const;

const IN_LANGUAGE: Record<Locale, string> = { no: "nb-NO", en: "en-GB", hr: "hr-HR" };

export function organizationId(siteBase: string): string {
	return `${siteBase.replace(/\/$/, "")}/#organization`;
}

export function websiteId(siteBase: string, lang: Locale): string {
	const base = siteBase.replace(/\/$/, "");
	const homeUrl = lang === "no" ? `${base}/` : `${base}/${lang}/`;
	return `${homeUrl}#website`;
}

/** Absolute URL for a site path in a given locale (e.g. `/`, `/blog`, `/about/competence`). */
export function absoluteUrl(siteBase: string, lang: Locale, path: string): string {
	const base = siteBase.replace(/\/$/, "");
	const normalized =
		path === "/" || path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
	if (lang === "no") {
		return normalized === "/" ? `${base}/` : `${base}${normalized}`;
	}
	const prefix = `/${lang}`;
	if (normalized === "/") return `${base}${prefix}/`;
	return `${base}${prefix}${normalized}`;
}

function breadcrumbList(items: { name: string; url: string }[]) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

function organizationNode(siteBase: string, description?: string) {
	const base = siteBase.replace(/\/$/, "");
	const node: Record<string, unknown> = {
		"@type": "Organization",
		"@id": organizationId(base),
		name: "digiDEVS",
		url: base,
		logo: {
			"@type": "ImageObject",
			url: `${base}/favicon.svg`,
		},
		sameAs: [...ORG_SAME_AS],
	};
	if (description) node.description = description;
	return node;
}

export function buildHomepageJsonLd(
	siteBase: string,
	lang: Locale,
	options?: { description?: string },
) {
	const base = siteBase.replace(/\/$/, "");
	const inLanguage = IN_LANGUAGE[lang];
	const orgId = organizationId(base);
	const homeUrl = lang === "no" ? `${base}/` : `${base}/${lang}/`;
	const webSiteId = `${homeUrl}#website`;
	const desc = options?.description;

	const org: Record<string, unknown> = {
		"@id": orgId,
		"@type": "Organization",
		name: "digiDEVS",
		url: base,
		logo: {
			"@type": "ImageObject",
			url: `${base}/favicon.svg`,
		},
		sameAs: [...ORG_SAME_AS],
	};
	if (desc) org.description = desc;

	const webSite: Record<string, unknown> = {
		"@type": "WebSite",
		"@id": webSiteId,
		name: "digiDEVS",
		url: homeUrl,
		inLanguage,
		publisher: { "@id": orgId },
	};
	if (desc) webSite.description = desc;

	return {
		"@context": "https://schema.org",
		"@graph": [org, webSite],
	};
}

export function buildBlogIndexJsonLd(
	siteBase: string,
	lang: Locale,
	args: { title: string; description: string; breadcrumbItems: { name: string; url: string }[] },
) {
	const base = siteBase.replace(/\/$/, "");
	const pageUrl = absoluteUrl(base, lang, "/blog");
	const inLanguage = IN_LANGUAGE[lang];

	return {
		"@context": "https://schema.org",
		"@graph": [
			organizationNode(base),
			breadcrumbList(args.breadcrumbItems),
			{
				"@type": "CollectionPage",
				"@id": `${pageUrl}#webpage`,
				name: args.title,
				description: args.description,
				url: pageUrl,
				inLanguage,
				isPartOf: { "@id": websiteId(base, lang) },
				publisher: { "@id": organizationId(base) },
			},
		],
	};
}

export function buildBlogPostingJsonLd(
	siteBase: string,
	lang: Locale,
	args: {
		canonical: string;
		headline: string;
		description: string;
		image: string;
		datePublished: string;
		dateModified: string;
		authorName: string;
		keywords?: string;
		articleSection?: string;
		breadcrumbItems: { name: string; url: string }[];
	},
) {
	const base = siteBase.replace(/\/$/, "");
	const inLanguage = IN_LANGUAGE[lang];

	const blogPosting: Record<string, unknown> = {
		"@type": "BlogPosting",
		headline: args.headline,
		description: args.description,
		inLanguage,
		image: [args.image],
		datePublished: args.datePublished,
		dateModified: args.dateModified,
		author: {
			"@type": "Person",
			name: args.authorName,
		},
		publisher: { "@id": organizationId(base) },
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": args.canonical,
		},
		isPartOf: { "@id": websiteId(base, lang) },
	};
	if (args.keywords) blogPosting.keywords = args.keywords;
	if (args.articleSection) blogPosting.articleSection = args.articleSection;

	return {
		"@context": "https://schema.org",
		"@graph": [organizationNode(base), breadcrumbList(args.breadcrumbItems), blogPosting],
	};
}

export function buildAboutSectionJsonLd(
	siteBase: string,
	lang: Locale,
	args: {
		pageUrl: string;
		title: string;
		description: string;
		schemaType: "AboutPage" | "WebPage";
		breadcrumbItems: { name: string; url: string }[];
	},
) {
	const base = siteBase.replace(/\/$/, "");
	const inLanguage = IN_LANGUAGE[lang];

	return {
		"@context": "https://schema.org",
		"@graph": [
			organizationNode(base),
			breadcrumbList(args.breadcrumbItems),
			{
				"@type": args.schemaType,
				"@id": `${args.pageUrl}#webpage`,
				name: args.title,
				description: args.description,
				url: args.pageUrl,
				inLanguage,
				isPartOf: { "@id": websiteId(base, lang) },
				publisher: { "@id": organizationId(base) },
			},
		],
	};
}

export function buildContactPageJsonLd(
	siteBase: string,
	lang: Locale,
	args: {
		title: string;
		description: string;
		email: string;
		breadcrumbItems: { name: string; url: string }[];
	},
) {
	const base = siteBase.replace(/\/$/, "");
	const pageUrl = absoluteUrl(base, lang, "/contact");
	const inLanguage = IN_LANGUAGE[lang];
	const org = organizationNode(base, args.description);
	org.email = args.email;
	org.contactPoint = [
		{
			"@type": "ContactPoint",
			contactType: "sales",
			email: args.email,
			availableLanguage: ["Norwegian", "English", "Croatian"],
			areaServed: ["NO", "HR", "EU"],
		},
	];
	org.address = [
		{
			"@type": "PostalAddress",
			addressLocality: "Split",
			addressCountry: "HR",
		},
		{
			"@type": "PostalAddress",
			addressLocality: "Trondheim",
			addressCountry: "NO",
		},
	];

	return {
		"@context": "https://schema.org",
		"@graph": [
			org,
			breadcrumbList(args.breadcrumbItems),
			{
				"@type": "ContactPage",
				"@id": `${pageUrl}#webpage`,
				name: args.title,
				description: args.description,
				url: pageUrl,
				inLanguage,
				isPartOf: { "@id": websiteId(base, lang) },
				publisher: { "@id": organizationId(base) },
				mainEntity: { "@id": organizationId(base) },
			},
		],
	};
}

export function buildBlogBreadcrumbItems(
	siteBase: string,
	lang: Locale,
	t: (key: string) => string,
	postTitle: string,
	postCanonical: string,
): { name: string; url: string }[] {
	const base = siteBase.replace(/\/$/, "");
	return [
		{ name: t("nav.home"), url: absoluteUrl(base, lang, "/") },
		{ name: t("nav.blog"), url: absoluteUrl(base, lang, "/blog") },
		{ name: postTitle, url: postCanonical },
	];
}

export function buildBlogIndexBreadcrumbItems(
	siteBase: string,
	lang: Locale,
	t: (key: string) => string,
): { name: string; url: string }[] {
	const base = siteBase.replace(/\/$/, "");
	return [
		{ name: t("nav.home"), url: absoluteUrl(base, lang, "/") },
		{ name: t("nav.blog"), url: absoluteUrl(base, lang, "/blog") },
	];
}

export function buildContactBreadcrumbItems(
	siteBase: string,
	lang: Locale,
	t: (key: string) => string,
): { name: string; url: string }[] {
	const base = siteBase.replace(/\/$/, "");
	return [
		{ name: t("nav.home"), url: absoluteUrl(base, lang, "/") },
		{ name: t("nav.contact"), url: absoluteUrl(base, lang, "/contact") },
	];
}

export type AboutBreadcrumbDepth = "index" | "competence" | "quality";

export function buildAboutBreadcrumbItems(
	siteBase: string,
	lang: Locale,
	t: (key: string) => string,
	depth: AboutBreadcrumbDepth,
): { name: string; url: string }[] {
	const base = siteBase.replace(/\/$/, "");
	const items: { name: string; url: string }[] = [
		{ name: t("nav.home"), url: absoluteUrl(base, lang, "/") },
		{ name: t("nav.about"), url: absoluteUrl(base, lang, "/about") },
	];
	if (depth === "competence") {
		items.push({
			name: t("nav_about_links.competence"),
			url: absoluteUrl(base, lang, "/about/competence"),
		});
	}
	if (depth === "quality") {
		items.push({
			name: t("nav_about_links.quality"),
			url: absoluteUrl(base, lang, "/about/quality"),
		});
	}
	return items;
}
