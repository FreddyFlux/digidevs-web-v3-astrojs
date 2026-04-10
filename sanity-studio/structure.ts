import type { StructureBuilder, StructureResolver } from "sanity/structure";

/** Matches @sanity/document-internationalization API_VERSION */
const API_VERSION = "2025-02-19";

const METADATA_TYPE = "translation.metadata";

const HIDDEN_FROM_DEFAULT_LIST = new Set<string>(["post", METADATA_TYPE]);

type MetadataRow = {
  _id: string;
  _createdAt: string | null;
  displayTitle: string | null;
  translationIds: string[] | null;
};

type PostRow = {
  _id: string;
  _createdAt: string | null;
  title: string | null;
  language: string | null;
};

/** Grouped posts: one row per translation.metadata from the document-i18n plugin */
const METADATA_GROUPS_QUERY = `*[_type == $metadataType]{
  _id,
  _createdAt,
  "displayTitle": coalesce(
    translations[_key == "en"][0].value->title,
    translations[_key == "no"][0].value->title,
    translations[0].value->title
  ),
  "translationIds": translations[].value._ref
} | order(displayTitle asc)`;

const ALL_POSTS_QUERY = `*[_type == "post"]{
  _id,
  _createdAt,
  title,
  language
}`;

function safePaneId(prefix: string, key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${prefix}${safe}`;
}

/** dd/mm/yy for folder labels */
function formatDdMmYy(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/**
 * Metadata refs usually store the published id; drafts live at `drafts.<id>`.
 */
function expandIdsForDraftLayer(refs: (string | undefined | null)[]): string[] {
  const out = new Set<string>();
  for (const r of refs) {
    if (!r) continue;
    out.add(r);
    if (!r.startsWith("drafts.")) {
      out.add(`drafts.${r}`);
    }
  }
  return [...out];
}

/**
 * `documentList` uses the desk search pipeline with workspace perspective; draft-only
 * documents can disappear when "Published" is selected. We instead link with
 * `documentListItem`, which opens by id and still lists one row per logical id here.
 */
function pickDraftPreferring(ids: string[]): string[] {
  const byBase = new Map<string, string>();
  for (const id of ids) {
    const base = id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
    const existing = byBase.get(base);
    if (!existing) {
      byBase.set(base, id);
      continue;
    }
    const pick =
      id.startsWith("drafts.") && !existing.startsWith("drafts.")
        ? id
        : !id.startsWith("drafts.") && existing.startsWith("drafts.")
          ? existing
          : id;
    byBase.set(base, pick);
  }
  return [...byBase.values()];
}

function buildPostDocumentItems(
  Sb: StructureBuilder,
  refs: (string | undefined | null)[],
): ReturnType<StructureBuilder["documentListItem"]>[] {
  const docIds = pickDraftPreferring(expandIdsForDraftLayer(refs));
  return docIds.map((docId) =>
    Sb.documentListItem({
      id: docId,
      schemaType: "post",
    }),
  );
}

function buildLinkedPostIdSet(metadataRows: MetadataRow[]): Set<string> {
  const linked = new Set<string>();
  for (const row of metadataRows) {
    for (const id of expandIdsForDraftLayer(row.translationIds ?? [])) {
      linked.add(id);
    }
  }
  return linked;
}

function postLabel(p: PostRow): string {
  const created = formatDdMmYy(p._createdAt);
  const t = p.title?.trim() || "Untitled";
  const lang = p.language ? String(p.language).toUpperCase() : "";
  const suffix = lang ? ` (${lang})` : "";
  return created !== undefined ? `${created}: ${t}${suffix}` : `${t}${suffix}`;
}

export const structure: StructureResolver = (S, _context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Blog posts")
        .id("blog-posts-grouped")
        .child(async (_itemId, { structureContext }) => {
          const client = structureContext.getClient({
            apiVersion: API_VERSION,
          });
          const Sb = structureContext.getStructureBuilder();

          const [metadataRows, allPosts] = await Promise.all([
            client.fetch<MetadataRow[]>(
              METADATA_GROUPS_QUERY,
              { metadataType: METADATA_TYPE },
              { perspective: "raw" },
            ),
            client.fetch<PostRow[]>(
              ALL_POSTS_QUERY,
              {},
              { perspective: "raw" },
            ),
          ]);

          const linked = buildLinkedPostIdSet(metadataRows);
          const orphans = allPosts.filter((p) => !linked.has(p._id));

          const groupedItems = metadataRows.map((row) => {
            const baseTitle = row.displayTitle?.trim() || "Untitled";
            const created = formatDdMmYy(row._createdAt);
            const title =
              created !== undefined ? `${created}: ${baseTitle}` : baseTitle;
            const gid = safePaneId("blog-tg-", row._id);
            return Sb.listItem()
              .title(title)
              .id(gid)
              .child(
                Sb.list()
                  .id(`${gid}-inner`)
                  .title("Translations")
                  .items(buildPostDocumentItems(Sb, row.translationIds ?? [])),
              );
          });

          const orphanItems = orphans.map((p) => {
            const oid = safePaneId("blog-orphan-", p._id);
            return Sb.listItem()
              .title(postLabel(p))
              .id(oid)
              .child(
                Sb.list()
                  .id(`${oid}-inner`)
                  .title("Post")
                  .items(buildPostDocumentItems(Sb, [p._id])),
              );
          });

          return Sb.list()
            .title("Blog posts")
            .items(
              orphanItems.length > 0
                ? [
                    ...groupedItems,
                    Sb.divider().title(
                      "Not linked via Translations yet (drafts & new posts)",
                    ),
                    ...orphanItems,
                  ]
                : groupedItems,
            );
        }),
      S.documentTypeListItem(METADATA_TYPE),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id === undefined || !HIDDEN_FROM_DEFAULT_LIST.has(id);
      }),
    ]);
