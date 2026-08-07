import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortableTextRenderer } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { formatDate } from "@/lib/format";
import { fetchSanity } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY, POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import type { Post, PostCard as PostCardType } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await fetchSanity<PostCardType[]>(POSTS_QUERY, {}, ["post"]);
  return (posts ?? []).map((post) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchSanity<Post>(POST_BY_SLUG_QUERY, { slug }, ["post"]);

  if (!post) return {};

  const ogImage = post.coverImage
    ? { url: urlFor(post.coverImage).url() }
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: ogImage
      ? { title: post.title, description: post.excerpt, images: [ogImage] }
      : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchSanity<Post>(POST_BY_SLUG_QUERY, { slug }, ["post"]);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/blog">
          <ArrowLeft />
          All posts
        </Link>
      </Button>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        )}
        {post.author?.name && <span>· {post.author.name}</span>}
      </div>

      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      {post.categories && post.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Badge key={category.slug.current} variant="secondary">
              {category.title}
            </Badge>
          ))}
        </div>
      )}

      <SanityImage
        asset={post.coverImage}
        alt={post.title}
        width={1200}
        height={750}
        priority
        className="mt-8 aspect-video w-full rounded-xl object-cover"
        sizes="100vw"
      />

      <div className="mt-8">
        {post.body && post.body.length > 0 ? (
          <PortableTextRenderer content={post.body} />
        ) : (
          post.excerpt && (
            <p className="leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )
        )}
      </div>

      {post.author && (
        <div className="mt-12 flex items-center gap-4 rounded-xl border p-4">
          {post.author.image && (
            <SanityImage
              asset={post.author.image}
              alt={post.author.name}
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-heading text-sm font-semibold">
              {post.author.name}
            </p>
            {post.author.bio && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {post.author.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
