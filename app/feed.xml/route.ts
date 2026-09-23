import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, absoluteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";

// Matches the ISR window used by the pages themselves.
export const revalidate = 60;

/** Escape the five XML predefined entities in Sanity-authored text. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getPosts(): Promise<PostListItem[]> {
  try {
    return await sanityFetch<PostListItem[]>({ query: postsQuery });
  } catch {
    return [];
  }
}

export async function GET() {
  const posts = await getPosts();
  const self = absoluteUrl("/feed.xml");
  const home = absoluteUrl("/");

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/talks/${post.slug}`);
      const published = post.publishedAt ? new Date(post.publishedAt).toUTCString() : undefined;

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        post.excerpt ? `      <description>${escapeXml(post.excerpt)}</description>` : "",
        published ? `      <pubDate>${published}</pubDate>` : "",
        ...(post.categories ?? []).map((c) => `      <category>${escapeXml(c)}</category>`),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${home}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <copyright>${escapeXml(`© ${new Date().getFullYear()} ${SITE_NAME}`)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
