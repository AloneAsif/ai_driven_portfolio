import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { fetchSanity } from "@/sanity/lib/data";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { PostCard as PostCardType } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes, learnings and tutorials.",
};

export default async function BlogPage() {
  const posts = await fetchSanity<PostCardType[]>(POSTS_QUERY, {}, ["post"]);
  const allPosts = posts ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ScrollReveal>
        <header>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Notes, learnings and tutorials.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal stagger={0.08} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allPosts.length > 0 ? (
          allPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <EmptyState
            title="No posts yet"
            description="Connect Sanity in .env.local and write your first post in the Studio to populate this page."
          />
        )}
      </ScrollReveal>
    </div>
  );
}
