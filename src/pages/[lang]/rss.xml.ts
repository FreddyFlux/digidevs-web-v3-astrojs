import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE, LOCALES } from "../../i18n/locales";
import { fetchAllPosts } from "../../lib/blog";
import { postToRssItem } from "../../lib/rss-feed";

export const getStaticPaths = () =>
	LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((lang) => ({ params: { lang } }));

const FEED_META: Record<
	Exclude<Locale, "no">,
	{ title: string; description: string; language: string }
> = {
	en: {
		title: "digiDEVS — Blog (English)",
		description:
			"Insights and engineering notes from the digiDEVS team — architecture, AI, delivery, and quality.",
		language: "en-GB",
	},
	hr: {
		title: "digiDEVS — Blog (Hrvatski)",
		description: "Insights and engineering notes from the digiDEVS team.",
		language: "hr-HR",
	},
};

export const GET: APIRoute = async ({ params, site }) => {
	const lang = params.lang as Locale;
	const posts = await fetchAllPosts(lang);
	const base = site ?? new URL("https://digidevs.no/");
	const meta = FEED_META[lang as Exclude<Locale, "no">];
	return rss({
		title: meta.title,
		description: meta.description,
		site: base,
		items: posts.map((post) => postToRssItem(post, `/${lang}/blog/${post.slug}/`)),
		trailingSlash: true,
		xmlns: {
			dc: "http://purl.org/dc/elements/1.1/",
		},
		customData: `<language>${meta.language}</language>`,
	});
};
