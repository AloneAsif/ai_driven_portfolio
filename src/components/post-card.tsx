import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/sanity-image";
import { Tilt } from "@/components/reactbits/tilt";
import { formatDate } from "@/lib/format";
import type { PostCard as PostCardType } from "@/sanity/types";

export function PostCard({ post }: { post: PostCardType }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group relative block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Tilt className="h-full">
        <Card className="h-full transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:ring-foreground/30 group-hover:shadow-[0_18px_45px_-15px_rgb(0_0_0/0.25)]">
        <SanityImage
          asset={post.coverImage}
          alt={post.title}
          width={800}
          height={500}
          className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <CardContent className="flex flex-col gap-2 pt-(--card-spacing)">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
            {post.author?.name && (
              <span className="inline-flex items-center gap-1">
                <BadgeCheck className="size-3.5" /> {post.author.name}
              </span>
            )}
          </div>
          <h3 className="font-heading text-base font-semibold transition-colors group-hover:underline group-hover:text-primary">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          {post.categories && post.categories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {post.categories.map((category) => (
                <Badge key={category.slug.current} variant="secondary">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-foreground">
            Read
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </CardContent>
        </Card>
      </Tilt>
    </Link>
  );
}
