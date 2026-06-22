/**
 * Build Sanity Studio and copy into `public/sanity/` for static hosting on the Astro site.
 * Avoids `sanity deploy` (multipart upload to api.sanity.io).
 */
import { access } from "node:fs/promises";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const studioDir = path.join(root, "sanity-studio");
const studioDist = path.join(studioDir, "dist");
const publicStudio = path.join(root, "public", "sanity");

/** Sanity build inlines these; Vercel can use SANITY_PROJECT_ID if studio-specific vars are unset. */
function studioBuildEnv() {
	const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
	const dataset =
		process.env.SANITY_STUDIO_DATASET ?? process.env.SANITY_DATASET ?? "production";
	if (!projectId) {
		throw new Error(
			"Set SANITY_STUDIO_PROJECT_ID or SANITY_PROJECT_ID for the Studio build (e.g. in Vercel env).",
		);
	}
	return {
		...process.env,
		SANITY_STUDIO_PROJECT_ID: projectId,
		SANITY_STUDIO_DATASET: dataset,
	};
}

function run(cmd, args, cwd, env = process.env) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false, env });
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}`));
		});
	});
}

async function ensureStudioDeps() {
	try {
		await access(path.join(studioDir, "node_modules", "sanity", "package.json"));
	} catch {
		await run("pnpm", ["install", "--frozen-lockfile"], studioDir);
	}
}

const buildEnv = studioBuildEnv();
await ensureStudioDeps();
await run("pnpm", ["exec", "sanity", "build"], studioDir, buildEnv);
await rm(publicStudio, { recursive: true, force: true });
await mkdir(publicStudio, { recursive: true });
await cp(studioDist, publicStudio, { recursive: true });
console.log(`Studio copied to ${path.relative(root, publicStudio)}/`);
