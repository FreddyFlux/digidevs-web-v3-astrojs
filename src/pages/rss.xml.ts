import rss from "@astrojs/rss";
import { fetchAllPosts } from "../lib/blog";

export async function GET(context) {
	const posts = await fetchAllPosts();
	const site = context.site ?? new URL("https://digidevs.no/");
	return rss({
		title: "digiDEVS — Blog",
		description: "Insights and engineering notes from the digiDEVS team — architecture, AI, delivery, and quality.",
		site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: new Date(post.date),
			link: `/blog/${post.slug}/`,
		})),
		trailingSlash: true,
	});
}
