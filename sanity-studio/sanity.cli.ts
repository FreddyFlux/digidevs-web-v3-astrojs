import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

/** Must match Astro `vite.server.proxy` target path and production URL (e.g. digidevs.no/sanity). */
const studioBasePath = "/sanity";

export default defineCliConfig({
	api: {
		projectId: projectId ?? "",
		dataset,
	},
	project: {
		basePath: studioBasePath,
	},
	server: {
		port: 3333,
	},
});
