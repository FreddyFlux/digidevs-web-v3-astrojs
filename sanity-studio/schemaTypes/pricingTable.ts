import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingTable = defineType({
	name: "pricingTable",
	title: "Pricing comparison table",
	type: "object",
	fields: [
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			description: "Optional title shown above the table.",
		}),
		defineField({
			name: "columnLabels",
			title: "Column labels",
			type: "object",
			fields: [
				defineField({ name: "col1", title: "Column 1", type: "string" }),
				defineField({ name: "col2", title: "Column 2", type: "string" }),
				defineField({ name: "col3", title: "Column 3", type: "string" }),
			],
		}),
		defineField({
			name: "rows",
			title: "Rows",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "projectType",
							title: "Project type",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "col2Value",
							title: "Column 2 value",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "col3Value",
							title: "Column 3 value",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: { projectType: "projectType" },
						prepare({ projectType }) {
							return { title: projectType || "Row" };
						},
					},
				}),
			],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { heading: "heading", rows: "rows" },
		prepare({ heading, rows }) {
			const count = Array.isArray(rows) ? rows.length : 0;
			return {
				title: heading?.trim() || "Pricing comparison table",
				subtitle: count ? `${count} row${count === 1 ? "" : "s"}` : "No rows",
			};
		},
	},
});
