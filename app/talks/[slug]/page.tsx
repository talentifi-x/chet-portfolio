import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JsonLd from "@/components/json-ld";
import PortableTextRenderer from "@/components/portable-text";
import RecentPosts from "@/components/recent-posts";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { postBySlugQuery, postSlugsQuery, recentPostsQuery } from "@/sanity/lib/queries";
import type { Post, PostListItem } from "@/sanity/lib/types";

import "../../../stylesheets/homepage.css";
import "../../../stylesheets/blog.css";

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    return await sanityFetch<Post | null>({
      query: postBySlugQuery,
      params: { slug },
    });
  } catch {
    return null;
  }
}

async function getRecentPosts(slug: string): Promise<PostListItem[]> {
  try {
    return await sanityFetch<PostListItem[]>({
      query: recentPostsQuery,
      params: { slug },
    });
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>({
      query: postSlugsQuery,
    });
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    // Keep unresolved slugs out of the index rather than letting a 404 shell
    // get crawled.
    return { title: "Post not found - Chetan Mangalwedhe", robots: { index: false } };
  }

  const title = `${post.title} - Chetan Mangalwedhe`;
  const url = `/talks/${slug}`;

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: post.excerpt,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author?.name ?? "Chetan Mangalwedhe"],
      tags: post.categories,
      // Falls back to the site-wide app/opengraph-image.tsx when a post has no
      // cover image, so every post still gets a card.
      ...(post.mainImage
        ? { images: [urlForImage(post.mainImage).width(1200).height(630).url()] }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description: post.excerpt },
  };
}

const arrow = (
  <svg className="arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M1 7h12m0 0L8 2m5 5l-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, recentPosts] = await Promise.all([getPost(slug), getRecentPosts(slug)]);

  if (!post) notFound();

  const heroImg = post.mainImage ? urlForImage(post.mainImage).width(1600).url() : null;
  const authorImg = post.author?.image
    ? urlForImage(post.author.image).width(96).height(96).url()
    : null;

  return (
    <div className="chet-root">
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Talks", path: "/talks" },
          { name: post.title, path: `/talks/${post.slug}` },
        ])}
      />
      <SiteNav />

      <main className="post-page">
        <div className="post-layout container">
          <article className="post-article">
            <Link href="/talks" className="post-back">
              <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M13 7H1m0 0l5-5M1 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All talks
            </Link>

            <header className="post-head">
              <div className="post-head__meta">
                {post.categories?.length ? (
                  <span className="post__tag">{post.categories[0]}</span>
                ) : null}
                {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
                {post.readingTime ? <span>{post.readingTime} min read</span> : null}
              </div>
              <h1 className="post-head__title">{post.title}</h1>
              {post.excerpt ? <p className="post-head__excerpt">{post.excerpt}</p> : null}
              {post.author?.name ? (
                <div className="post-author">
                  {authorImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="post-author__avatar" src={authorImg} alt={post.author.name} />
                  ) : null}
                  <span className="post-author__name">{post.author.name}</span>
                </div>
              ) : null}
            </header>

            {heroImg ? (
              <figure className="post-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImg} alt={post.title} />
              </figure>
            ) : null}

            <div className="prose">
              {post.body?.length ? (
                <PortableTextRenderer value={post.body} />
              ) : (
                <p>This essay has no content yet.</p>
              )}
            </div>

            <div className="post-foot">
              <Link href="/talks" className="post__more">
                More talks {arrow}
              </Link>
            </div>
          </article>

          <RecentPosts posts={recentPosts} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
