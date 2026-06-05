import type { Metadata } from "next";

import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

import "../../stylesheets/homepage.css";
import "../../stylesheets/media.css";

export const metadata: Metadata = {
  title: "Media - Chetan Mangalwedhe",
  description:
    "Interviews, features, and columns across India's leading business and HR publications.",
};

// Media appearances. Replace the remaining sample `href`s with real article URLs.
type MediaItem = {
  outlet: string;
  type: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
};

const items: MediaItem[] = [
  {
    outlet: "HR Today",
    type: "Insight",
    title: "Amoral Drift: The AI Hiring Risk Nobody in Talent Acquisition Is Talking About",
    excerpt:
      "How AI hiring systems quietly learn yesterday's patterns and narrow tomorrow's pipelines - and why it demands governance and human oversight.",
    href: "https://hrtoday.in/insights/amoral-drift-the-ai-hiring-risk-nobody-in-talent-acquisition-is-talking-about/",
    image: "https://hrtoday.in/wp-content/uploads/2026/05/HR-TODAY-SUNIL-54-2.png",
  },
];

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

export default function MediaPage() {
  return (
    <div className="chet-root">
      <SiteNav />

      <main className="media-page">
        <header className="media-hero">
          <div className="container">
            <div className="section-label">Press</div>
            <h1 className="media-hero__title">
              In the <em>media</em>
            </h1>
            <p className="media-hero__sub">
              Interviews, features, and columns across India&apos;s leading business and HR
              publications. A selection of where the ideas have shown up.
            </p>
          </div>
        </header>

        <section className="media-list">
          <div className="container">
            <div className="media-grid">
              {items.map((item) => (
                <a
                  key={item.title}
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
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
