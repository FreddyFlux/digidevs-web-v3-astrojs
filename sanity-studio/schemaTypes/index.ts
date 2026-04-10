import { type SchemaTypeDefinition } from "sanity";
import { seo } from "./seo";
import { post } from "./post";
import { pricingTable } from "./pricingTable";

export const schemaTypes: SchemaTypeDefinition[] = [seo, pricingTable, post];
