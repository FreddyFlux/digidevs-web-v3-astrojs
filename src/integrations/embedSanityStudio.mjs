import { cp, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Ensures `sanity-studio/dist` is copied into the Vercel static bundle.
 * `public/sanity` alone is not always present on the CDN; this runs after the client build.
 */
export function embedSanityStudio() {
	const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
	const studioDist = path.join(projectRoot, "sanity-studio", "dist");

	return {
		name: "embed-sanity-studio",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				try {
					await access(path.join(studioDist, "index.html"));
				} catch {
					logger.warn(
						"[embed-sanity-studio] sanity-studio/dist missing — run `pnpm studio:sync` before build.",
					);
					return;
				}

				const clientSanity = path.join(fileURLToPath(dir), "client", "sanity");
				await cp(studioDist, clientSanity, { recursive: true, force: true });

				const vercelStaticSanity = path.join(
					projectRoot,
					".vercel",
					"output",
					"static",
					"sanity",
				);
				try {
					await access(path.join(projectRoot, ".vercel", "output", "static"));
					await cp(studioDist, vercelStaticSanity, { recursive: true, force: true });
				} catch {
					// Local builds without Vercel output dir — client copy is enough.
				}

				logger.info("[embed-sanity-studio] Copied Studio into static output (/sanity).");
			},
		},
	};
}
