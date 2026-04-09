import { defineArrayMember, defineField, defineType } from "sanity";

export const seo = defineType({
	name: "seo",
	title: "SEO",
	type: "object",
	fields: [
		defineField({
			name: "seoTitle",
			title: "Meta title override",
			description: "Defaults to the post title if empty.",
			type: "string",
			validation: (Rule) => Rule.max(70).warning("Keep under ~60 characters for best results"),
		}),
		defineField({
			name: "seoDescription",
			title: "Meta description override",
			description: "Defaults to the excerpt if empty.",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.max(200).warning("Keep under ~160 characters"),
		}),
		defineField({
			name: "keywords",
			title: "Keywords / tags",
			description:
				"Search and topic tags for this post (meta keywords and structured data). Separate concepts with new tags.",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
			options: { layout: "tags" },
			validation: (Rule) =>
				Rule.max(20).warning("Fewer, specific keywords usually work better than long lists"),
		}),
		defineField({
			name: "noIndex",
			title: "Hide from search engines",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "canonicalUrl",
			title: "Canonical URL override",
			description: "Full URL only if you need a non-default canonical.",
			type: "url",
		}),
	],
});
