import type { RSSFeedItem } from "@astrojs/rss";
import type { BlogPost } from "./blog";

function escapeXml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** Map a Sanity blog post to an @astrojs/rss item (categories, full HTML, dc:creator). */
export function postToRssItem(post: BlogPost, linkPath: string): RSSFeedItem {
	return {
		title: post.title,
		description: post.description,
		pubDate: new Date(post.date),
		link: linkPath,
		categories: post.categories?.length ? post.categories : undefined,
		content: post.bodyHtml,
		customData: post.author ? `<dc:creator>${escapeXml(post.author)}</dc:creator>` : undefined,
	};
}
