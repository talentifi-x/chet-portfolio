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
 */
export default function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a
      className={`media-card${item.image ? "media-card--has-media" : ""}`}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item.image ? (
        <div className="media-card__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} loading="lazy" />
        </div>
      ) : null}
      <div className="media-card__content">
        <div className="media-card__top">
          <span className="media-card__type">{item.type}</span>
          <span className="media-card__outlet">{item.outlet}</span>
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
