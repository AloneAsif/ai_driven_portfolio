import Link from "next/link";
import { ArrowRight, FolderGit2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/sanity-image";
import { Tilt } from "@/components/reactbits/tilt";
import type { Project } from "@/sanity/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group relative block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Tilt className="h-full">
        <Card className="h-full transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:ring-foreground/30 group-hover:shadow-[0_18px_45px_-15px_rgb(0_0_0/0.25)]">
        <SanityImage
          asset={project.coverImage}
          alt={project.title}
          width={800}
          height={500}
          className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <CardContent className="flex flex-col gap-3 pt-(--card-spacing)">
          <div>
            <h3 className="font-heading text-lg font-semibold transition-colors group-hover:underline group-hover:text-primary">
              {project.title}
            </h3>
            {project.summary && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {project.summary}
              </p>
            )}
          </div>

          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-4 pt-2 text-sm text-muted-foreground">
            {project.liveUrl && (
              <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-foreground">
                <Globe className="size-3.5" /> Live
              </span>
            )}
            {project.githubUrl && (
              <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-foreground">
                <FolderGit2 className="size-3.5" /> Source
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-foreground">
              View
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </CardContent>
        </Card>
      </Tilt>
    </Link>
  );
}
