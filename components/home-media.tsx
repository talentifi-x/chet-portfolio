import Link from "next/link";

import MediaCard from "@/components/media-card";
import { mediaItems } from "@/lib/media";

import "../stylesheets/media.css";

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

const MAX_CARDS = 4;

/**
 * Homepage "In the media" preview. Shows up to the first {MAX_CARDS} media
 * appearances; if there are more, a "View all media" button links to /media.
 * Data comes from the shared list in lib/media so this stays in sync with the
 * full /media page automatically.
 */
export default function HomeMedia() {
  if (!mediaItems.length) return null;

  const shown = mediaItems.slice(0, MAX_CARDS);
  const hasMore = mediaItems.length > MAX_CARDS;

  return (
    <section className="home-media" id="press">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head__left">
            <div className="section-label">Press</div>
            <h2 className="section-title">
              In the <em>media</em>
            </h2>
          </div>
          <p className="section-sub">
            Interviews, features, and columns across India&apos;s leading business and HR
            publications.
          </p>
        </div>

        <div className="home-media__grid reveal" data-delay="1">
          {shown.map((item) => (
            <MediaCard key={item.title} item={item} />
          ))}
        </div>

        {hasMore ? (
          <Link href="/media" className="all-writing reveal">
            View all media {arrow}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
