import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Local markdown for pages that should stay in-repo (legal snippets, static copy).
 * Blog remains in Sanity; use this when you add `.md` files under `src/content/docs/`.
 */
const docs = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { docs };
