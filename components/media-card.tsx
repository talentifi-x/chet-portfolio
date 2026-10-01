"use client";

import { useState } from "react";

import type { MediaItem } from "@/lib/media";

const arrow = (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M1 7h12m0 0L8 2m5 5l-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A single media-appearance card. Shared by the /media page grid and the
 * homepage preview so both render identically.
 *
 * Every card renders a 16:9 cover so the grid keeps one rhythm - the type pill
 * is absolutely positioned over that cover, so a card without one knocks the
 * pill out of place too.
 *
 * Covers are hotlinked from the publisher where that works, and served from
 * /public/images/media where it does not. `referrerPolicy="no-referrer"` is
 * set because some publishers only reject requests that carry an off-site
 * Referer. If an image still fails, the cover degrades to a branded tile
 * showing the outlet name - the wordmark is deliberately not repeated there,
 * since it already sits in the row directly below.
 */
export default function MediaCard({ item }: { item: MediaItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const showImage = Boolean(item.image) && !imageFailed;
  const showLogo = Boolean(item.logo) && !logoFailed;

  return (
    <a
      className="media-card media-card--has-media"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={`media-card__media${showImage ? "" : "media-card__media--fallback"}`}>
        {showImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="media-card__fallback" aria-hidden="true">
            <span className="media-card__fallback-name">{item.outlet}</span>
          </div>
        )}
      </div>
      <div className="media-card__content">
        <div className="media-card__top">
          <span className="media-card__type">{item.type}</span>
          {showLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="media-card__logo"
              src={item.logo}
              alt={item.outlet}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="media-card__outlet">{item.outlet}</span>
          )}
        </div>
        <h3 className="media-card__title">{item.title}</h3>
        <p className="media-card__excerpt">{item.excerpt}</p>
        <span className="media-card__cta">
          Read on {item.outlet} {arrow}
        </span>
      </div>
    </a>
  );
}
