import { defineField, defineType } from "sanity";

export const offerLineItem = defineType({
	name: "offerLineItem",
	title: "Line item",
	type: "object",
	fields: [
		defineField({
			name: "description",
			title: "Description",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "quantity",
			title: "Quantity",
			type: "number",
			initialValue: 1,
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: "unitPrice",
			title: "Unit price",
			type: "number",
			description: "Price per unit in the offer currency (before tax unless noted).",
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: "notes",
			title: "Notes",
			type: "text",
			rows: 2,
		}),
	],
	preview: {
		select: { description: "description", quantity: "quantity", unitPrice: "unitPrice" },
		prepare({ description, quantity, unitPrice }) {
			const q = quantity ?? 1;
			const p = unitPrice ?? 0;
			return {
				title: description || "Line item",
				subtitle: `${q} × ${p}`,
			};
		},
	},
});
