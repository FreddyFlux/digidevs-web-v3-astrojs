import { defineArrayMember, defineField, defineType } from "sanity";

export const offerSection = defineType({
	name: "offerSection",
	title: "Offer section",
	type: "object",
	fields: [
		defineField({
			name: "title",
			title: "Section title",
			type: "string",
			validation: (Rule) => Rule.required(),
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
						{ title: "H3", value: "h3" },
					],
					lists: [
						{ title: "Bullet", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
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
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: "title" },
		prepare({ title }) {
			return { title: title || "Section" };
		},
	},
});
