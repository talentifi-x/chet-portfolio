import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sitemapPostsQuery } from "@/sanity/lib/queries";

/**
 * Every hand-written page in `app/`. Add a route here whenever you add a
 * `page.tsx`, otherwise it will not be submitted to search engines.
 *
 * Deliberately excluded:
 * - `/studio/[[...tool]]` - the Sanity CMS admin, which must not be indexed.
 * - `/robots.txt`, `/manifest.webmanifest`, `/feed.xml`, `/llms.txt`,
 *   `/opengraph-image`, `/icon`, `/apple-icon` - generated assets, not pages.
 * - `/#about`, `/#contact`, `/#newsletter` - fragments of the homepage, not
 *   separate pages. Crawlers collapse them into `/`, so listing them would
 *   just be duplicate entries.
 *
 * `/talks/[slug]` is not listed because it is generated from Sanity below.
 */
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/talks", changeFrequency: "weekly", priority: 0.8 },
  { path: "/media", changeFrequency: "monthly", priority: 0.6 },
];

type PostEntry = { slug: string; publishedAt?: string };

async function getPosts(): Promise<PostEntry[]> {
  try {
    return await sanityFetch<PostEntry[]>({
      query: sitemapPostsQuery,
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl();
  const posts = await getPosts();
  const now = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: path === "/" ? site : `${site}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${site}/talks/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
