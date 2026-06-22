/**
 * Build Sanity Studio and copy into `public/sanity/` for static hosting on the Astro site.
 * Avoids `sanity deploy` (multipart upload to api.sanity.io).
 */
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const studioDir = path.join(root, "sanity-studio");
const studioDist = path.join(studioDir, "dist");
const publicStudio = path.join(root, "public", "sanity");

function run(cmd, args, cwd) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false });
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}`));
		});
	});
}

await run("pnpm", ["run", "build"], studioDir);
await rm(publicStudio, { recursive: true, force: true });
await mkdir(publicStudio, { recursive: true });
await cp(studioDist, publicStudio, { recursive: true });
console.log(`Studio copied to ${path.relative(root, publicStudio)}/`);
