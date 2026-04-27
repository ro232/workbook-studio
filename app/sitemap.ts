import type { MetadataRoute } from "next";

const BASE = "https://workbook-studio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/create`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
