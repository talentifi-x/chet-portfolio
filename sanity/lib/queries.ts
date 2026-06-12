import { groq } from "next-sanity";

// All posts, newest first - used by the /talks index.
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 180) + 1,
    mainImage,
    "categories": categories[]->title,
    "author": author->{name, image}
  }
`;

// A single post by slug - used by /talks/[slug].
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 180) + 1,
    mainImage,
    body,
    "categories": categories[]->title,
    "author": author->{name, image, bio}
  }
`;

// Recent posts excluding the one being viewed - used by the post sidebar widget.
export const recentPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && slug.current != $slug]
    | order(publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "readingTime": round(length(pt::text(body)) / 5 / 180) + 1,
    mainImage,
    "categories": categories[]->title
  }
`;

// Just the slugs - used by generateStaticParams.
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`;
