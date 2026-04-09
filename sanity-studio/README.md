# digiDEVS Sanity Studio

Content models for the marketing site blog (`post` documents with Portable Text and SEO fields).

## Setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (or link an existing project).
2. Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID` and optionally `SANITY_STUDIO_DATASET` (default `production`).
3. `npm install` and `npm run dev` — Studio runs at [http://localhost:3333](http://localhost:3333).
4. Deploy the Studio for editors: `npm run deploy` (hosted on `*.sanity.studio`) or run it locally when publishing.

Align the Astro app’s `SANITY_PROJECT_ID` / `SANITY_DATASET` in the parent folder’s `.env` (`../.env` from this directory) with these values.

## Rebuild the static site on publish

The Astro blog is **static**: new or updated posts appear on the live site after the next **production deploy**.

1. In [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **Webhooks**, add a webhook:
   - **URL**: your host’s deploy hook (e.g. Vercel: Project → Settings → Git → Deploy Hooks).
   - **Trigger on**: Create, Update, Delete (or only document types you care about).
   - **Filter**: you can use `{"filter": "_type == \"post\""}` so only blog changes trigger builds.
2. Save the webhook secret on the hosting side if required.
3. Optional: add the same hook URL to **staging** with a branch-specific deploy hook for QA.

Until a webhook is configured, run a manual production deploy after editing posts.
