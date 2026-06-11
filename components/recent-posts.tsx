import Link from "next/link";

import { urlForImage } from "@/sanity/lib/image";
import type { PostListItem } from "@/sanity/lib/types";

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * "Recent posts" sidebar widget shown on single post pages. Renders a compact,
 * theme-aware list of the latest articles (the current post is excluded by the
 * caller's query). Returns null when there's nothing to show.
 */
export default function RecentPosts({ posts }: { posts: PostListItem[] }) {
  if (!posts?.length) return null;

  return (
    <aside className="recent-widget" aria-label="Recent posts">
      <div className="recent-widget__inner">
        <h2 className="recent-widget__title">Recent posts</h2>
        <ul className="recent-widget__list">
          {posts.map((post) => {
            const thumb = post.mainImage
              ? urlForImage(post.mainImage).width(160).height(160).url()
              : null;
            return (
              <li key={post._id} className="recent-item">
                <Link href={`/writing/${post.slug}`} className="recent-item__link">
                  <div className="recent-item__thumb">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="recent-item__thumb-fallback" aria-hidden="true" />
                    )}
                  </div>
                  <div className="recent-item__body">
                    {post.categories?.length ? (
                      <span className="recent-item__tag">{post.categories[0]}</span>
                    ) : null}
                    <h3 className="recent-item__title">{post.title}</h3>
                    <span className="recent-item__meta">
                      {post.readingTime
                        ? `${post.readingTime} min read`
                        : formatDate(post.publishedAt)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/writing" className="recent-widget__all">
          View all writing
        </Link>
      </div>
    </aside>
  );
}
