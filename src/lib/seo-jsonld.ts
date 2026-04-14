import type { Locale } from "../i18n/locales";

/** Social / profile URLs used in Organization.sameAs (aligned with SiteFooter). */
export const ORG_SAME_AS = [
	"https://no.linkedin.com/in/fredrik-aarvold-871001100",
	"https://github.com/FreddyFlux",
] as const;

export function organizationPublisherBlock(siteBase: string) {
	return {
		"@type": "Organization",
		name: "digiDEVS",
		url: siteBase,
		logo: {
			"@type": "ImageObject",
			url: `${siteBase}/favicon.svg`,
		},
	};
}

/** Organization + WebSite @graph for localized homepages. */
export function buildHomepageJsonLd(siteBase: string, lang: Locale) {
	const inLanguage = ({ no: "nb-NO", en: "en-GB", hr: "hr-HR" } as const)[lang];
	const orgId = `${siteBase}/#organization`;
	const homeUrl = lang === "no" ? `${siteBase}/` : `${siteBase}/${lang}/`;
	const webSiteId = `${homeUrl}#website`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": orgId,
				name: "digiDEVS",
				url: siteBase,
				logo: {
					"@type": "ImageObject",
					url: `${siteBase}/favicon.svg`,
				},
				sameAs: [...ORG_SAME_AS],
			},
			{
				"@type": "WebSite",
				"@id": webSiteId,
				name: "digiDEVS",
				url: homeUrl,
				inLanguage,
				publisher: { "@id": orgId },
			},
		],
	};
}
