# digiweb v3 — Astro site

This folder is the **digiDEVS** marketing site implementation: Astro + React islands + Tailwind. Product goals, site map, and SEO strategy are documented in [`../docs/`](../docs/).

## Commands

Run from this directory:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro ...` | Astro CLI (`astro add`, `astro check`, etc.) |

**Node.js ≥ 22.12** is required (`engines` in `package.json`).

## Project structure

```text
astro-project/
├── public/                 # Static assets
├── src/
│   ├── components/         # Astro + React (layout, UI, icons)
│   ├── data/               # e.g. blog post data, remote images
│   ├── layouts/            # Page shells (e.g. Layout.astro)
│   ├── lib/                # Shared utilities
│   └── pages/
│       ├── index.astro     # /
│       ├── blog/           # /blog, /blog/[slug]
│       └── about/          # /about, /about/competence, /about/quality
├── package.json
└── tsconfig.json
```

Astro exposes routes from `src/pages/`; interactive pieces use React where needed.

## More documentation

- [Repository README](../README.md) — repo overview and stack
- [docs/README.md](../docs/README.md) — documentation index (IA, SEO, positioning)
