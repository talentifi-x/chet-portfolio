import { urlForImage } from "@/sanity/lib/image";
import type { Post } from "@/sanity/lib/types";

import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "./site";

/** Stable @id values so the graph nodes can reference each other. */
const PERSON_ID = absoluteUrl("/#person");
const SITE_ID = absoluteUrl("/#website");

/**
 * The author as an entity. `sameAs` is the important part for answer engines:
 * it links this site to the same person on other platforms so citations
 * resolve to one identity instead of several.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(AUTHOR.image),
    jobTitle: AUTHOR.jobTitle,
    description: SITE_DESCRIPTION,
    worksFor: {
      "@type": "Organization",
      name: AUTHOR.company,
    },
    knowsAbout: [
      "Hiring and staffing",
      "Future of work",
      "Artificial intelligence and employment",
      "India's talent market",
      "Economic history",
    ],
    sameAs: [...AUTHOR.sameAs],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/** The /talks index, described as a blog so its posts are discoverable. */
export function blogSchema(posts: { slug: string; title: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/talks#blog"),
    name: `Talks - ${SITE_NAME}`,
    url: absoluteUrl("/talks"),
    description:
      "Essays on hiring, AI, history, and the questions most people are too busy to ask.",
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`/talks/${post.slug}#post`),
      headline: post.title,
      url: absoluteUrl(`/talks/${post.slug}`),
    })),
  };
}

export function blogPostingSchema(post: Post) {
  const url = absoluteUrl(`/talks/${post.slug}`);
  const image = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : absoluteUrl("/opengraph-image");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": absoluteUrl("/talks#blog") },
    inLanguage: "en",
    ...(post.categories?.length ? { keywords: post.categories.join(", ") } : {}),
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
  };
}

/** Media appearances, presented as a list of works citing the author. */
export function mediaPageSchema(items: { title: string; href: string; outlet: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/media#collection"),
    name: `Media - ${SITE_NAME}`,
    url: absoluteUrl("/media"),
    description:
      "Interviews, features, and columns across India's leading business and HR publications.",
    about: { "@id": PERSON_ID },
    inLanguage: "en",
    hasPart: items.map((item) => ({
      "@type": "NewsArticle",
      headline: item.title,
      url: item.href,
      publisher: { "@type": "Organization", name: item.outlet },
      mentions: { "@id": PERSON_ID },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
