import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
	throw new Error("Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env and set your Sanity project ID.");
}

// Studio URL path is only set in sanity.cli.ts (`project.basePath`). Do not set `basePath` here — it
// stacks with the CLI path and becomes /sanity/sanity.

export default defineConfig({
	name: "digidevs",
	title: "digiDEVS",
	projectId,
	dataset,
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes,
	},
});
