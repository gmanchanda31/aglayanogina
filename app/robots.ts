import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Block indexing on Vercel preview deployments — only the canonical
  // production host should be crawlable.
  const isProduction = process.env.VERCEL_ENV === "production" || !process.env.VERCEL_ENV;

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Don't index OG image or favicon routes; they're not user content.
        disallow: ["/opengraph-image", "*/opengraph-image", "/icon"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
