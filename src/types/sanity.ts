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
