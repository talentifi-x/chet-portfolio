/**
 * Site-wide identity and URL constants - the single source of truth for
 * metadata, structured data, the sitemap, robots.txt, and the RSS feed.
 */

/**
 * Absolute origin for the site, with no trailing slash.
 *
 * Sitemaps, canonical URLs, Open Graph tags and JSON-LD all require absolute
 * URLs, so set NEXT_PUBLIC_SITE_URL to the production domain. On Vercel we fall
 * back to the project's production URL, and locally to the dev server.
 */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Build an absolute URL from a root-relative path. */
export function absoluteUrl(path = "/") {
  const base = siteUrl();
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE_NAME = "Chetan Mangalwedhe";

export const SITE_TITLE =
  "Chetan Mangalwedhe - Thinking out loud about the world we're actually building";

export const SITE_DESCRIPTION =
  "Founder, hiring practitioner, and writer on AI, history, and the questions most people are too busy to ask.";

export const AUTHOR = {
  name: "Chetan Mangalwedhe",
  jobTitle: "Founder & Hiring Practitioner",
  company: "TalentiFi-X",
  /** Portrait used by JSON-LD; lives in /public. */
  image: "/images/Chetan-Mangalwedhe.png",
  /** Profiles that let search and answer engines resolve the same entity. */
  sameAs: ["https://www.linkedin.com/in/chetan-mangalwedhe-chet-mann/"],
} as const;

/** Brand colours reused by the manifest and the generated OG image. */
export const BRAND = {
  accent: "#4ECCA3",
  deep: "#0B5844",
  ink: "#0A0F0D",
} as const;
