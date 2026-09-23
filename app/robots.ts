import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The Sanity CMS admin. Nothing here belongs in a search index, and it
        // is the only route deliberately kept out of the sitemap too.
        disallow: ["/studio", "/studio/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
