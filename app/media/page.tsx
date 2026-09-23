import type { Metadata } from "next";

import JsonLd from "@/components/json-ld";
import MediaCard from "@/components/media-card";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { mediaItems } from "@/lib/media";
import { breadcrumbSchema, mediaPageSchema } from "@/lib/schema";

import "../../stylesheets/homepage.css";
import "../../stylesheets/media.css";

const TITLE = "Media - Chetan Mangalwedhe";
const DESCRIPTION =
  "Interviews, features, and columns across India's leading business and HR publications.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/media" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/media",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function MediaPage() {
  return (
    <div className="chet-root">
      <JsonLd data={mediaPageSchema(mediaItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" },
        ])}
      />
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
              {mediaItems.map((item) => (
                <MediaCard key={item.href} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
