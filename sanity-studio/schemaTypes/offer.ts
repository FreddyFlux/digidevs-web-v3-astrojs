import { defineArrayMember, defineField, defineType } from "sanity";

const OFFER_STATUSES = [
	{ title: "Draft", value: "draft" },
	{ title: "Sent", value: "sent" },
	{ title: "Accepted", value: "accepted" },
	{ title: "Rejected", value: "rejected" },
	{ title: "Expired", value: "expired" },
] as const;

export const offer = defineType({
	name: "offer",
	title: "Offer",
	type: "document",
	groups: [
		{ name: "language", title: "Language", default: true },
		{ name: "meta", title: "Meta" },
		{ name: "customer", title: "Customer" },
		{ name: "content", title: "Scope & content" },
		{ name: "pricing", title: "Pricing" },
		{ name: "media", title: "Media" },
		{ name: "export", title: "Export snapshot" },
		{ name: "customerShare", title: "Customer share" },
	],
	fields: [
		defineField({
			name: "language",
			title: "Language",
			type: "string",
			readOnly: true,
			group: "language",
			description:
				"Set when you create this offer from a language template or via Translations → add translation. Slugs only need to be unique per language.",
			options: {
				list: [
					{ title: "Norsk", value: "no" },
					{ title: "English", value: "en" },
					{ title: "Hrvatski", value: "hr" },
				],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "title",
			title: "Offer title",
			type: "string",
			validation: (Rule) => Rule.required(),
			group: "meta",
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title", maxLength: 96 },
			validation: (Rule) => Rule.required(),
			group: "meta",
		}),
		defineField({
			name: "offerNumber",
			title: "Offer number",
			description: 'e.g. "OFF-2026-0042"',
			type: "string",
			group: "meta",
		}),
		defineField({
			name: "status",
			title: "Status",
			type: "string",
			options: { list: [...OFFER_STATUSES], layout: "radio" },
			initialValue: "draft",
			validation: (Rule) => Rule.required(),
			group: "meta",
		}),
		defineField({
			name: "issueDate",
			title: "Issue date",
			type: "date",
			group: "meta",
		}),
		defineField({
			name: "validUntil",
			title: "Valid until",
			type: "date",
			group: "meta",
		}),
		defineField({
			name: "templateVersion",
			title: "Template version",
			description: "Bump when the on-site offer layout changes; old PDFs can still use export snapshot.",
			type: "string",
			initialValue: "1",
			group: "meta",
		}),
		defineField({
			name: "accentVariant",
			title: "Accent variant",
			description: "Optional theme tweak for the offer layout.",
			type: "string",
			options: {
				list: [
					{ title: "Default (primary)", value: "default" },
					{ title: "Secondary (teal)", value: "secondary" },
				],
				layout: "radio",
			},
			initialValue: "default",
			group: "meta",
		}),
		defineField({
			name: "customer",
			title: "Customer",
			type: "object",
			group: "customer",
			fields: [
				defineField({
					name: "companyName",
					title: "Company name",
					type: "string",
					validation: (Rule) => Rule.required(),
				}),
				defineField({ name: "contactName", title: "Contact person", type: "string" }),
				defineField({ name: "email", title: "Email", type: "string" }),
				defineField({ name: "orgNumber", title: "Org. number", type: "string" }),
				defineField({
					name: "address",
					title: "Address",
					type: "text",
					rows: 3,
				}),
			],
		}),
		defineField({
			name: "summary",
			title: "Summary / elevator pitch",
			type: "text",
			rows: 4,
			group: "content",
		}),
		defineField({
			name: "description",
			title: "Detailed description",
			type: "array",
			group: "content",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
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
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							title: "Alternative text",
							description: "Short description for screen readers and if the image does not load.",
						}),
						defineField({
							name: "caption",
							type: "string",
							title: "Caption",
							description: "Optional caption shown below the image in the offer.",
						}),
					],
				}),
			],
		}),
		defineField({
			name: "sections",
			title: "Extra sections",
			type: "array",
			group: "content",
			of: [defineArrayMember({ type: "offerSection" })],
		}),
		defineField({
			name: "terms",
			title: "Terms",
			type: "offerTerms",
			group: "content",
		}),
		defineField({
			name: "currency",
			title: "Currency",
			type: "string",
			description: "ISO 4217 code, e.g. NOK, EUR, USD (stored uppercase in the app)",
			initialValue: "NOK",
			validation: (Rule) => Rule.required().min(3).max(3),
			group: "pricing",
		}),
		defineField({
			name: "lineItems",
			title: "Line items",
			type: "array",
			group: "pricing",
			of: [defineArrayMember({ type: "offerLineItem" })],
		}),
		defineField({
			name: "subtotal",
			title: "Subtotal",
			type: "number",
			description: "Sum before discount and tax (can match computed line totals).",
			group: "pricing",
		}),
		defineField({
			name: "discountAmount",
			title: "Discount",
			type: "number",
			initialValue: 0,
			group: "pricing",
		}),
		defineField({
			name: "taxAmount",
			title: "Tax (VAT)",
			type: "number",
			initialValue: 0,
			group: "pricing",
		}),
		defineField({
			name: "total",
			title: "Total",
			type: "number",
			validation: (Rule) => Rule.required().min(0),
			group: "pricing",
		}),
		defineField({
			name: "media",
			title: "Images / screenshots",
			type: "array",
			group: "media",
			of: [
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							type: "string",
							title: "Alternative text",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "caption",
							type: "string",
							title: "Caption",
						}),
					],
				}),
			],
		}),
		defineField({
			name: "renderSnapshot",
			title: "Locked export snapshot (JSON)",
			description:
				"Optional. When set, PDF reprints use this payload for deterministic output. Paste JSON from the export tool or maintain via API.",
			type: "text",
			rows: 12,
			group: "export",
		}),
		defineField({
			name: "snapshotCapturedAt",
			title: "Snapshot captured at",
			type: "datetime",
			readOnly: true,
			group: "export",
		}),
		defineField({
			name: "shareEnabled",
			title: "Customer page enabled",
			type: "boolean",
			initialValue: false,
			group: "customerShare",
			description:
				"When enabled, the offer can be viewed at a public URL (/offer/p/…) after a client-only password is set from the internal offer page.",
		}),
		defineField({
			name: "sharePasswordHash",
			title: "Customer page password hash",
			type: "string",
			readOnly: true,
			hidden: true,
			group: "customerShare",
			description: "Written by the website API only. Do not edit.",
		}),
		defineField({
			name: "shareSecretVersion",
			title: "Share session version",
			type: "number",
			initialValue: 0,
			readOnly: true,
			group: "customerShare",
			description: "Incremented when the customer password changes; invalidates old viewer sessions.",
		}),
	],
	preview: {
		select: {
			title: "title",
			language: "language",
			offerNumber: "offerNumber",
			status: "status",
			company: "customer.companyName",
		},
		prepare({ title, language, offerNumber, status, company }) {
			const num = offerNumber ? String(offerNumber) : "";
			const co = company ? String(company) : "";
			const st = status ? String(status) : "";
			const lang = language ? String(language) : "";
			return {
				title: title || "Offer",
				subtitle: [lang.toUpperCase(), num, co, st].filter(Boolean).join(" · "),
			};
		},
	},
	orderings: [
		{
			title: "Issue date (newest)",
			name: "issueDateDesc",
			by: [{ field: "issueDate", direction: "desc" }],
		},
	],
});
