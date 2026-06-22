import { defineConfig } from "sanity";
import { documentInternationalization } from "@sanity/document-internationalization";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
	throw new Error("Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env and set your Sanity project ID.");
}

// Studio URL path is only set in sanity.cli.ts (`project.basePath`). Do not set `basePath` here — it
// stacks with the CLI path and becomes /sanity/sanity.

const includeVision = process.env.SANITY_STUDIO_VISION === "true";

export default defineConfig({
	name: "digidevs",
	title: "digiDEVS",
	projectId,
	dataset,
	// Fewer live `/data/listen/…` subscriptions — helps on networks that reset HTTP/2 (ERR_HTTP2_PING_FAILED).
	releases: { enabled: false },
	scheduledDrafts: { enabled: false },
	announcements: { enabled: false },
	plugins: [
		structureTool({ structure }),
		...(includeVision ? [visionTool()] : []),
		documentInternationalization({
			supportedLanguages: [
				{ id: "no", title: "Norsk" },
				{ id: "en", title: "English" },
				{ id: "hr", title: "Hrvatski" },
			],
			schemaTypes: ["post", "offer"],
		}),
	],
	schema: {
		types: schemaTypes,
	},
});
