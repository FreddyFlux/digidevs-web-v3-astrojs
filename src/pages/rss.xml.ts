import rss from "@astrojs/rss";
import { fetchAllPosts } from "../lib/blog";
import { postToRssItem } from "../lib/rss-feed";

export async function GET(context) {
	const posts = await fetchAllPosts("no");
	const site = context.site ?? new URL("https://digidevs.no/");
	return rss({
		title: "digiDEVS — Blog",
		description: "Insights and engineering notes from the digiDEVS team — architecture, AI, delivery, and quality.",
		site,
		items: posts.map((post) => postToRssItem(post, `/blog/${post.slug}/`)),
		trailingSlash: true,
		xmlns: {
			dc: "http://purl.org/dc/elements/1.1/",
		},
		customData: "<language>nb-NO</language>",
	});
}
