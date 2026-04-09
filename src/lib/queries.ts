/** Published posts, newest first. Excludes drafts. */
export const ALL_POSTS_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt)
] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  author,
  category,
  readTime,
  featured,
  coverImage,
  body,
  seo
}`;

export const POST_SLUGS_QUERY = `*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt)
].slug.current`;
