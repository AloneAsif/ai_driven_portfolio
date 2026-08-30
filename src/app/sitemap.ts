import type { MetadataRoute } from "next";
import { fetchSanity } from "@/sanity/lib/data";
import { PROJECTS_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import type { Project, PostCard } from "@/sanity/types";

export const revalidate = 3600;

const BASE_URL = "https://www.asifai.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    fetchSanity<Project[]>(PROJECTS_QUERY, {}, ["project"]),
    fetchSanity<PostCard[]>(POSTS_QUERY, {}, ["post"]),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      priority: 0.6,
    },
  ];

  // Add project pages
  for (const project of projects ?? []) {
    if (project.slug?.current) {
      entries.push({
        url: `${BASE_URL}/projects/${project.slug.current}`,
        priority: 0.7,
        lastModified: project.publishedAt
          ? new Date(project.publishedAt)
          : undefined,
      });
    }
  }

  // Add blog posts
  for (const post of posts ?? []) {
    if (post.slug?.current) {
      entries.push({
        url: `${BASE_URL}/blog/${post.slug.current}`,
        priority: 0.6,
        lastModified: post.publishedAt
          ? new Date(post.publishedAt)
          : undefined,
      });
    }
  }

  return entries;
}