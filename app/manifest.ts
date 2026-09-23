import type { MetadataRoute } from "next";

import { BRAND, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Chetan M.",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.ink,
    theme_color: BRAND.deep,
    icons: [
      // Both are generated at build time by app/icon.tsx and app/apple-icon.tsx.
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
