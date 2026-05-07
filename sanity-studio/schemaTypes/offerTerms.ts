import { defineArrayMember, defineField, defineType } from "sanity";

export const offerTerms = defineType({
	name: "offerTerms",
	title: "Terms & conditions",
	type: "object",
	fields: [
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			initialValue: "Terms & conditions",
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [{ title: "Normal", value: "normal" }],
					lists: [
						{ title: "Bullet", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
						],
					},
				}),
			],
		}),
	],
	preview: {
		select: { heading: "heading" },
		prepare({ heading }) {
			return { title: heading || "Terms" };
		},
	},
});
