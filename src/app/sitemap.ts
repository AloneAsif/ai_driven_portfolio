import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { fetchSanity } from "@/sanity/lib/data";
import { PROJECTS_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import type { Project, PostCard } from "@/sanity/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [projects, posts] = await Promise.all([
    fetchSanity<Project[]>(PROJECTS_QUERY, {}, ["project"]),
    fetchSanity<PostCard[]>(POSTS_QUERY, {}, ["post"]),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/projects`, priority: 0.8 },
    { url: `${base}/blog`, priority: 0.8 },
    { url: `${base}/contact`, priority: 0.6 },
  ];

  for (const project of projects ?? []) {
    entries.push({
      url: `${base}/projects/${project.slug.current}`,
      priority: 0.7,
      lastModified: project.publishedAt,
    });
  }

  for (const post of posts ?? []) {
    entries.push({
      url: `${base}/blog/${post.slug.current}`,
      priority: 0.6,
      lastModified: post.publishedAt,
    });
  }

  return entries;
}
