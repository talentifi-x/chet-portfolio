import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";

import "../../stylesheets/homepage.css";
import "../../stylesheets/blog.css";

export const metadata: Metadata = {
  title: "Writing - Chetan Mangalwedhe",
  description: "Essays on hiring, AI, history, and the questions most people are too busy to ask.",
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function getPosts(): Promise<PostListItem[]> {
  try {
    return await sanityFetch<PostListItem[]>({ query: postsQuery });
  } catch {
    // Sanity not configured yet (placeholder env) - degrade gracefully.
    return [];
  }
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

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="chet-root">
      <SiteNav />

      <main className="blog-page">
        <header className="blog-hero">
          <div className="container">
            <div className="section-label">Journal</div>
            <h1 className="blog-hero__title">
              Latest from <em>#ChetTalks</em>
            </h1>
            <p className="blog-hero__sub">
              Published when I have something worth saying. About hiring, AI, history, and the
              questions most people are too busy to ask.
            </p>
          </div>
        </header>

        <section className="blog-list">
          <div className="container">
            {posts.length === 0 ? (
              <div className="blog-empty">
                <p>No posts yet.</p>
                <p className="blog-empty__hint">
                  Connect your Sanity project and publish a post in{" "}
                  <Link href="/studio">the Studio</Link> to see it here.
                </p>
              </div>
            ) : (
              <div className="post-grid blog-grid">
                {posts.map((post) => {
                  const img = post.mainImage ? urlForImage(post.mainImage).width(900).url() : null;
                  return (
                    <article key={post._id} className="post">
                      <Link
                        href={`/writing/${post.slug}`}
                        className="post__link"
                        aria-label={post.title}
                      >
                        <div className="post__media">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt={post.title} />
                          ) : (
                            <div className="post__media-fallback" aria-hidden="true" />
                          )}
                        </div>
                        <div className="post__body">
                          <div className="post__meta">
                            <span className="post__tag">{post.categories?.[0] || "Essay"}</span>
                            <span>
                              {post.readingTime
                                ? `${post.readingTime} min read`
                                : formatDate(post.publishedAt)}
                            </span>
                          </div>
                          <h3 className="post__title">{post.title}</h3>
                          {post.excerpt ? <p className="post__excerpt">{post.excerpt}</p> : null}
                          <span className="post__more">Read essay {arrow}</span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
