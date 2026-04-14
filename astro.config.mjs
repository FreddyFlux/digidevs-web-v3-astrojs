// @ts-check
import 'dotenv/config';
import { createClient } from '@sanity/client';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || 'https://digidevs.no';

/** Keep in sync with `src/lib/queries.ts` POST_SLUGS_BY_LANG_QUERY */
const POST_SLUGS_BY_LANG_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  (language == $lang || (!defined(language) && $lang == "no"))
].slug.current`;

async function blogUrlsForSitemap() {
	const projectId = process.env.SANITY_PROJECT_ID;
	if (!projectId) return [];
	const client = createClient({
		projectId,
		dataset: process.env.SANITY_DATASET ?? 'production',
		apiVersion: process.env.SANITY_API_VERSION ?? '2024-01-01',
		useCdn: false,
		token: process.env.SANITY_API_READ_TOKEN || undefined,
	});
	const base = site.replace(/\/$/, '');
	const out = [];
	for (const lang of ['no', 'en', 'hr']) {
		const slugs = await client.fetch(POST_SLUGS_BY_LANG_QUERY, { lang });
		if (!Array.isArray(slugs)) continue;
		for (const slug of slugs) {
			if (typeof slug !== 'string') continue;
			const path = lang === 'no' ? `/blog/${slug}/` : `/${lang}/blog/${slug}/`;
			out.push(`${base}${path}`);
		}
	}
	return out;
}

const sitemapBlogPages = await blogUrlsForSitemap();

/** Sanity dev server (sanity.cli.ts `server.port`). Studio is served at this path on both servers. */
const SANITY_DEV_PORT = 3333;
const SANITY_BASE_PATH = '/sanity';

/**
 * Sanity dev serves the app at `/sanity/`; a bare `/sanity` can 404 or redirect with
 * `Location: http://localhost:3333/sanity/` — which breaks behind the Astro proxy.
 */
function rewriteSanityProxyPath(path) {
  if (path === '/sanity') return '/sanity/';
  if (path.startsWith('/sanity?')) {
    return `/sanity/?${path.slice('/sanity?'.length)}`;
  }
  return path;
}

// https://astro.build/config
export default defineConfig({
  site,

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  /** Adapter required for `prerender = false` blog routes (on-demand Sanity by slug). With Astro 6, `output` defaults to static and supports mixed prerendering. */
  adapter: vercel(),

  i18n: {
    defaultLocale: 'no',
    locales: ['no', 'en', 'hr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    sitemap({
      /** Blog posts are server-rendered (`prerender = false`); list URLs explicitly. */
      customPages: sitemapBlogPages,
    }),
  ],

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**'
      }
    ]
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        [SANITY_BASE_PATH]: {
          target: `http://localhost:${SANITY_DEV_PORT}`,
          changeOrigin: true,
          ws: true,
          rewrite: rewriteSanityProxyPath,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req) => {
              const loc = proxyRes.headers.location;
              if (typeof loc !== 'string') return;
              // Redirects must stay on the Astro dev host (e.g. :4321), not Sanity's :3333.
              const wrong = new RegExp(`^https?://[^/]+:${SANITY_DEV_PORT}(?=/|$)`);
              if (wrong.test(loc)) {
                const host = req.headers.host ?? `127.0.0.1:${SANITY_DEV_PORT}`;
                proxyRes.headers.location = loc.replace(wrong, `http://${host}`);
              }
            });
          }
        }
      }
    }
  }
});