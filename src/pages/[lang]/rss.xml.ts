import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE, LOCALES } from "../../i18n/locales";
import { fetchAllPosts } from "../../lib/blog";

export const getStaticPaths = () =>
	LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((lang) => ({ params: { lang } }));

export const GET: APIRoute = async ({ params, site }) => {
	const lang = params.lang as Locale;
	const posts = await fetchAllPosts(lang);
	const base = site ?? new URL("https://digidevs.no/");
	const title =
		lang === "en"
			? "digiDEVS — Blog (English)"
			: "digiDEVS — Blog (Hrvatski)";
	return rss({
		title,
		description: "Insights and engineering notes from the digiDEVS team.",
		site: base,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: new Date(post.date),
			link: `/${lang}/blog/${post.slug}/`,
		})),
		trailingSlash: true,
	});
};
