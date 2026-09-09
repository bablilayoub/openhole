import type { MetadataRoute } from "next";
import { docPages } from "@/lib/docs";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/docs`, priority: 0.8 },
    ...docPages.map((page) => ({ url: `${base}/docs/${page.slug}`, priority: 0.7 })),
    { url: `${base}/terms`, priority: 0.3 },
  ];
}
