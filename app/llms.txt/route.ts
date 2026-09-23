import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";
import { mediaItems } from "@/lib/media";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";

export const revalidate = 60;

async function getPosts(): Promise<PostListItem[]> {
  try {
    return await sanityFetch<PostListItem[]>({ query: postsQuery });
  } catch {
    return [];
  }
}

/**
 * llms.txt - a plain-text brief for AI crawlers and answer engines, stating in
 * one place who this site is about and where the substantive content lives.
 * An emerging convention rather than a ratified standard; it costs one route
 * and gives models a clean, unambiguous summary to cite.
 */
export async function GET() {
  const posts = await getPosts();

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${AUTHOR.name} is ${AUTHOR.jobTitle} at ${AUTHOR.company}, with 23 years in hiring and staffing.
He writes about AI and employment, the future of work, India's talent market, and the economic
history behind both.

## Talks (essays)

${
  posts.length
    ? posts
        .map(
          (post) =>
            `- [${post.title}](${absoluteUrl(`/talks/${post.slug}`)})${
              post.excerpt ? `: ${post.excerpt}` : ""
            }`,
        )
        .join("\n")
    : "- (no posts published yet)"
}

## Media appearances

${mediaItems.map((item) => `- [${item.title}](${item.href}) - ${item.outlet}`).join("\n")}

## Site

- [Homepage](${absoluteUrl("/")}): background, themes, and contact
- [All talks](${absoluteUrl("/talks")})
- [Media coverage](${absoluteUrl("/media")})
- [RSS feed](${absoluteUrl("/feed.xml")})
- [Sitemap](${absoluteUrl("/sitemap.xml")})

## Elsewhere

${AUTHOR.sameAs.map((url) => `- ${url}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
