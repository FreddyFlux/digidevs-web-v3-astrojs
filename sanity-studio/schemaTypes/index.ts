import { type SchemaTypeDefinition } from "sanity";
import { seo } from "./seo";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [seo, post];
