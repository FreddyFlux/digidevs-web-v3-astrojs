import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
	name: "post",
	title: "Blog post",
	type: "document",
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "meta", title: "Meta & SEO" },
	],
	fields: [
		defineField({
			name: "language",
			type: "string",
			readOnly: true,
			hidden: true,
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title", maxLength: 96 },
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			description: "Shown in listings and default meta description.",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "publishedAt",
			title: "Published at",
			type: "datetime",
			validation: (Rule) => Rule.required(),
			group: "meta",
		}),
		defineField({
			name: "updatedAt",
			title: "Updated at",
			type: "datetime",
			group: "meta",
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "string",
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
					options: {
						list: [
							{ title: "News", value: "News" },
							{ title: "Work", value: "Work" },
							{ title: "Tech", value: "Tech" },
							{ title: "Business", value: "Business" },
							{ title: "Frontend", value: "Frontend" },
							{ title: "Backend", value: "Backend" },
							{ title: "AI", value: "AI" },
						],
						layout: "dropdown",
					},
				}),
			],
			options: { sortable: true },
			validation: (Rule) => Rule.required().unique().min(1),
			group: "content",
		}),
		defineField({
			name: "readTime",
			title: "Read time label",
			description: 'e.g. "8 min read"',
			type: "string",
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "featured",
			title: "Featured on blog home",
			type: "boolean",
			initialValue: false,
			group: "meta",
		}),
		defineField({
			name: "coverImage",
			title: "Cover image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative text",
					description: "Important for accessibility and SEO.",
					validation: (Rule) => Rule.required(),
				}),
			],
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "Quote", value: "blockquote" },
					],
					lists: [
						{ title: "Bullet", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
							{ title: "Code", value: "code" },
						],
						annotations: [
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									{
										name: "href",
										type: "url",
										title: "URL",
										validation: (Rule) =>
											Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
									},
								],
							},
						],
					},
				}),
			],
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
			group: "meta",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "publishedAt",
			media: "coverImage",
			language: "language",
		},
		prepare({ title, subtitle, media, language }) {
			const dateStr = subtitle ? new Date(subtitle).toLocaleDateString() : "";
			const langStr = language ? String(language).toUpperCase() : "";
			return {
				title,
				subtitle: [dateStr, langStr].filter(Boolean).join(" · "),
				media,
			};
		},
	},
	orderings: [
		{
			title: "Published (newest)",
			name: "publishedAtDesc",
			by: [{ field: "publishedAt", direction: "desc" }],
		},
	],
});
