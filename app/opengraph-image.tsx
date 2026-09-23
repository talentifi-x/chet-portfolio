import { ImageResponse } from "next/og";

import { BRAND, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Site-wide social card. Because it lives at the root of `app/`, every route
// inherits it unless that route sets its own openGraph.images - which is how
// blog posts with a mainImage override it, and how posts without one still get
// a usable card instead of no image at all.
export const alt = `${SITE_NAME} - Founder, hiring practitioner, and writer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BRAND.ink,
        backgroundImage: `radial-gradient(900px 500px at 78% 12%, ${BRAND.deep} 0%, transparent 62%)`,
        padding: 72,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${BRAND.accent} 0%, ${BRAND.deep} 72%)`,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          CM
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: BRAND.accent,
          }}
        >
          Founder · Hiring Practitioner
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.4, color: "rgba(255,255,255,0.72)" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 72, height: 4, background: BRAND.accent, borderRadius: 2 }} />
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.55)" }}>
          Thinking out loud about the world we&apos;re actually building
        </div>
      </div>
    </div>,
    { ...size },
  );
}
