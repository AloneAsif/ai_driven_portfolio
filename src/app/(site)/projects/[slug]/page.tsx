import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderGit2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { PortableTextRenderer } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { fetchSanity } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { PROJECT_BY_SLUG_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { Project } from "@/sanity/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await fetchSanity<Project[]>(PROJECTS_QUERY, {}, ["project"]);
  return (projects ?? []).map((project) => ({
    slug: project.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchSanity<Project>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    ["project"],
  );

  if (!project) return {};

  const ogImage = project.coverImage
    ? { url: urlFor(project.coverImage).url() }
    : undefined;

  return {
    title: project.title,
    description: project.summary,
    openGraph: ogImage
      ? { title: project.title, description: project.summary, images: [ogImage] }
      : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchSanity<Project>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    ["project"],
  );

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/projects">
          <ArrowLeft />
          All projects
        </Link>
      </Button>

      <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </h1>

      {project.techStack && project.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <Button asChild size="sm">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Globe />
                Live site
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <FolderGit2 />
                Source
              </a>
            </Button>
          )}
        </div>
      )}

      <SanityImage
        asset={project.coverImage}
        alt={project.title}
        width={1200}
        height={750}
        priority
        className="mt-8 aspect-video w-full rounded-xl object-cover"
        sizes="100vw"
      />

      <div className="mt-8">
        {project.description && project.description.length > 0 ? (
          <PortableTextRenderer content={project.description} />
        ) : (
          project.summary && (
            <p className="leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          )
        )}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold">Gallery</h2>
          <div className="mt-4">
            <GalleryLightbox images={project.gallery} title={project.title} />
          </div>
        </section>
      )}
    </article>
  );
}
