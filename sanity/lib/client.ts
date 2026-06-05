import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Server-only token. Enables fresh, authenticated reads (and lets a private
// dataset be read by the frontend). It is NOT prefixed NEXT_PUBLIC_, so it is
// never bundled into client-side JS - the blog pages read it from Server
// Components only. Falls back to the seed token for convenience in local dev.
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // We cache reads with Next's ISR layer (see `sanityFetch`), so we hit the
  // live API rather than Sanity's CDN - each revalidation stays fresh.
  useCdn: false,
  token,
  // Only ever return published content to the site (never drafts), even when
  // a token that *can* see drafts is used.
  perspective: "published",
});
