import { type SchemaTypeDefinition } from "sanity";
import { seo } from "./seo";
import { post } from "./post";
import { pricingTable } from "./pricingTable";
import { offerLineItem } from "./offerLineItem";
import { offerSection } from "./offerSection";
import { offerTerms } from "./offerTerms";
import { offer } from "./offer";

export const schemaTypes: SchemaTypeDefinition[] = [
	seo,
	pricingTable,
	offerLineItem,
	offerSection,
	offerTerms,
	offer,
	post,
];
