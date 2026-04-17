// @ts-check
import 'dotenv/config';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || 'https://digidevs.no';

/** Sanity dev server (sanity.cli.ts `server.port`). Studio is served at this path on both servers. */
const SANITY_DEV_PORT = 3333;
const SANITY_BASE_PATH = '/sanity';

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
    sitemap(),
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