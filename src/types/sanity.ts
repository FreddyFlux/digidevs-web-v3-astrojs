import type { PortableTextBlock } from "@portabletext/types";

/** Column labels for {@link PricingTableBlock} (all optional in CMS). */
export type PricingTableColumnLabels = {
	col1?: string;
	col2?: string;
	col3?: string;
};

/** One row in a pricing comparison table (Sanity adds `_key` on array items). */
export type PricingTableRow = {
	_key: string;
	projectType: string;
	col2Value: string;
	col3Value: string;
};

/** Custom Portable Text block: pricing comparison table. */
export type PricingTableBlock = {
	_type: "pricingTable";
	_key: string;
	heading?: string;
	columnLabels?: PricingTableColumnLabels;
	rows: PricingTableRow[];
};

/** Offer line item as stored in Sanity (array member). */
export type SanityOfferLineItem = {
	_key?: string;
	description: string;
	quantity: number;
	unitPrice: number;
	notes?: string;
};

/** Extra section on an offer document. */
export type SanityOfferSection = {
	_key?: string;
	title: string;
	body: PortableTextBlock[];
};

/** Terms block on an offer document. */
export type SanityOfferTerms = {
	heading?: string;
	body?: PortableTextBlock[];
};

/** Customer object on an offer. */
export type SanityOfferCustomer = {
	companyName: string;
	contactName?: string;
	email?: string;
	orgNumber?: string;
	address?: string;
};

/** Media item with optional caption (Sanity image). */
export type SanityOfferMediaItem = {
	_type?: "image";
	_key?: string;
	asset?: { _ref?: string };
	alt?: string;
	caption?: string;
};
