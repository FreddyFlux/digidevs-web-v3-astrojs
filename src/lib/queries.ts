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
