/** Published posts for a locale, newest first. Includes legacy docs without language when lang is no. */
export const POSTS_BY_LANG_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  (language == $lang || (!defined(language) && $lang == "no"))
] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  author,
  categories,
  category,
  readTime,
  featured,
  coverImage,
  body,
  seo,
  language
}`;

export const POST_SLUGS_BY_LANG_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  (language == $lang || (!defined(language) && $lang == "no"))
].slug.current`;

export const SINGLE_POST_BY_SLUG_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  slug.current == $slug &&
  (language == $lang || (!defined(language) && $lang == "no"))
][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  author,
  categories,
  category,
  readTime,
  featured,
  coverImage,
  body,
  seo,
  language
}`;

/** Slugs for each locale from @sanity/document-internationalization translation.metadata */
export const TRANSLATION_SLUGS_BY_POST_ID_QUERY = `*[
  _type == "translation.metadata" &&
  (references($postId) || references($draftPostId))
][0]{
  "no": translations[_key == "no"][0].value->slug.current,
  "en": translations[_key == "en"][0].value->slug.current,
  "hr": translations[_key == "hr"][0].value->slug.current
}`;

/** @deprecated use POSTS_BY_LANG_QUERY with $lang */
export const ALL_POSTS_QUERY = POSTS_BY_LANG_QUERY;

/** Single offer by slug and language (published only). Legacy docs without language match only when $lang is "no". */
export const OFFER_BY_SLUG_QUERY = `*[
  _type == "offer" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug &&
  (language == $lang || (!defined(language) && $lang == "no"))
][0] {
  _id,
  title,
  "slug": slug.current,
  offerNumber,
  status,
  language,
  issueDate,
  validUntil,
  templateVersion,
  accentVariant,
  customer,
  summary,
  description,
  sections,
  terms,
  currency,
  lineItems,
  subtotal,
  discountAmount,
  taxAmount,
  total,
  media,
  renderSnapshot,
  snapshotCapturedAt
}`;

/** Minimal fields for customer share gate + password updates (never merged into public view models). */
export const OFFER_SHARE_AUTH_QUERY = `*[
  _type == "offer" &&
  !(_id in path("drafts.**")) &&
  slug.current == $slug &&
  (language == $lang || (!defined(language) && $lang == "no"))
][0] {
  _id,
  shareEnabled,
  sharePasswordHash,
  shareSecretVersion,
  language
}`;

/** All offer slugs for sitemap or admin (published only). */
export const OFFER_SLUGS_QUERY = `*[
  _type == "offer" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current)
].slug.current`;

/** List offers for a locale (newest issue date first). Legacy docs without language appear only for $lang "no". */
export const OFFERS_LIST_QUERY = `*[
  _type == "offer" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  (language == $lang || (!defined(language) && $lang == "no"))
] | order(coalesce(issueDate, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  offerNumber,
  status,
  issueDate,
  "company": customer.companyName
}`;
