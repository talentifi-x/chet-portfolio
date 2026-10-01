import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Canonical host is the apex domain. Serving the same pages on both
        // www and apex splits ranking signals between two URLs, so www is sent
        // to apex permanently (308). Canonical tags, the sitemap and JSON-LD
        // all emit the apex form, so this keeps every signal pointing one way.
        source: "/:path*",
        has: [{ type: "host", value: "www.chetanmangalwedhe.com" }],
        destination: "https://chetanmangalwedhe.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
