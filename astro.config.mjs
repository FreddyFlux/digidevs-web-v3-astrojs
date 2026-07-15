// @ts-check
import 'dotenv/config';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { embedSanityStudio } from './src/integrations/embedSanityStudio.mjs';

const site = process.env.PUBLIC_SITE_URL || 'https://digidevs.no';

/** Sanity dev server (sanity.cli.ts `server.port`). Studio is served at this path on both servers. */
const SANITY_DEV_PORT = 3333;
const SANITY_BASE_PATH = '/sanity';
const OFFER_ROUTE_PATTERNS = [
  /^\/offers(?:\/|$)/,
  /^\/offer(?:\/|$)/,
  /^\/api\/offers(?:\/|$)/,
  /^\/[a-z]{2}(?:-[a-z]{2})?\/offers(?:\/|$)/,
];

/**
 * Sanity dev serves the app at `/sanity/`; a bare `/sanity` can 404 or redirect with
 * `Location: http://localhost:3333/sanity/` — which breaks behind the Astro proxy.
 * @param {string} path
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

  /** @astrojs/sitemap emits sitemap-index.xml (not sitemap.xml) when split; many tools expect /sitemap.xml */
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
    '/sanity': '/sanity/',
    /**
     * Self-hosted Studio quirk: `sanity build` prefixes the JS entry with the `/sanity` basePath,
     * but emits the `<link rel="icon|manifest">` tags in index.html as root-relative `/static/...`.
     * Those 404 under `/sanity`; redirect them to the real assets to silence console errors.
     */
    '/static/manifest.webmanifest': '/sanity/static/manifest.webmanifest',
    '/static/favicon.ico': '/sanity/static/favicon.ico',
    '/static/favicon.svg': '/sanity/static/favicon.svg',
    '/static/apple-touch-icon.png': '/sanity/static/apple-touch-icon.png',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  /** Vercel adapter: SSR routes (e.g. blog listings, API) and static prerendered pages. */
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
    embedSanityStudio(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.toLowerCase();
        return !OFFER_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
      },
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
    plugins: [
      tailwindcss(),
    ],
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