#!/usr/bin/env node
/**
 * Static checks that view transitions, prefetch, content collections, and swap hooks are present.
 * Run after edits: `node ./scripts/verify-enhancements.mjs`
 *
 * Manual follow-up (negative side effects):
 * - Navigate Home → Blog → Post → Back: logo should stay stable; cover should morph; no white flash.
 * - Mobile: logo + LangSwitcher; open About drawer then navigate — state should reset (expected).
 * - prefers-reduced-motion: logo VT disabled via CSS; browser may still animate page (check comfort).
 * - Throttle network / CPU: prefetchAll can increase requests — monitor in DevTools Network.
 * - React islands (GlassNavBar): after swap, dropdown should close on new page (fresh mount).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

let failed = false;
function assert(cond, msg) {
	if (!cond) {
		console.error(`✗ ${msg}`);
		failed = true;
	} else {
		console.log(`✓ ${msg}`);
	}
}

const layout = read("src/layouts/Layout.astro");
assert(layout.includes("ClientRouter") && layout.includes("astro:transitions"), "Layout imports ClientRouter");
assert(layout.includes("astro:after-swap"), "Layout has astro:after-swap aurora-bar re-init");

const cfg = read("astro.config.mjs");
assert(/prefetch\s*:\s*\{/.test(cfg) && cfg.includes("prefetchAll"), "astro.config has prefetch.prefetchAll");

const blog = read("src/pages/blog/index.astro");
assert(blog.includes('transition:name={`blog-cover-${') && blog.includes("astro:assets"), "Blog index uses Image + transition:name");

const slug = read("src/pages/blog/[slug].astro");
assert(slug.includes("transition:name") && slug.includes("astro:assets"), "Blog slug page uses Image + transition:name");

const globalCss = read("src/styles/global.css");
assert(globalCss.includes("vt-site-logo") && globalCss.includes("view-transition-name"), "global.css defines vt-site-logo");

const contentCfg = read("src/content.config.ts");
assert(contentCfg.includes("defineCollection") && contentCfg.includes("astro/loaders"), "src/content.config.ts exists");

if (failed) {
	process.exit(1);
}
console.log("\nAll static checks passed. Run the dev server and manually verify transitions in the browser.\n");
