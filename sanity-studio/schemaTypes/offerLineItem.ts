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
			name: "discountAmount",
			title: "Discount per unit",
			type: "number",
			description: "Optional amount subtracted from unit price.",
			initialValue: 0,
			validation: (Rule) => Rule.min(0),
		}),
		defineField({
			name: "monthlyPrice",
			title: "Monthly price",
			type: "number",
			description: "Optional recurring monthly price per unit.",
			validation: (Rule) => Rule.min(0),
		}),
		defineField({
			name: "monthlyDiscountAmount",
			title: "Monthly discount per unit",
			type: "number",
			description: "Optional amount subtracted from monthly unit price.",
			initialValue: 0,
			validation: (Rule) => Rule.min(0),
		}),
		defineField({
			name: "notes",
			title: "Notes",
			type: "text",
			rows: 2,
		}),
	],
	preview: {
		select: {
			description: "description",
			quantity: "quantity",
			unitPrice: "unitPrice",
			discountAmount: "discountAmount",
			monthlyPrice: "monthlyPrice",
			monthlyDiscountAmount: "monthlyDiscountAmount",
		},
		prepare({ description, quantity, unitPrice, discountAmount, monthlyPrice, monthlyDiscountAmount }) {
			const q = quantity ?? 1;
			const p = unitPrice ?? 0;
			const d = discountAmount ?? 0;
			const m = monthlyPrice ?? 0;
			const md = monthlyDiscountAmount ?? 0;
			const unitDisplay = d > 0 ? `${p} - ${d}` : `${p}`;
			const monthlyDisplay = m > 0 ? ` + ${md > 0 ? `${m} - ${md}` : m}/mo` : "";
			return {
				title: description || "Line item",
				subtitle: `${q} × ${unitDisplay}${monthlyDisplay}`,
			};
		},
	},
});
