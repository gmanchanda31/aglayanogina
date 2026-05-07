import type { MetadataRoute } from "next";
import {
  exhibitions,
  illustrations,
  photographSets,
  projects,
  writings,
} from "@/lib/content";
import { hasMdx } from "@/lib/writings-mdx";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: today, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: today, changeFrequency: "yearly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/exhibitions`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/illustrations`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/photographs`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/writings`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
  ];

  const detailRoutes: MetadataRoute.Sitemap = [
    ...projects.map((p) => ({
      url: `${SITE_URL}${p.href}`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...exhibitions.map((e) => ({
      url: `${SITE_URL}${e.href}`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...illustrations.map((i) => ({
      url: `${SITE_URL}${i.href}`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...photographSets.map((s) => ({
      url: `${SITE_URL}${s.href}`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...writings
      .filter((w) => hasMdx(w.routeSlug))
      .map((w) => ({
        url: `${SITE_URL}${w.href}`,
        lastModified: today,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];

  return [...staticRoutes, ...detailRoutes];
}
