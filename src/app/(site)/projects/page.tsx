import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { fetchSanity } from "@/sanity/lib/data";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { Project } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of things I've designed and built.",
};

export default async function ProjectsPage() {
  const projects = await fetchSanity<Project[]>(PROJECTS_QUERY, {}, ["project"]);
  const allProjects = projects ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ScrollReveal>
        <header>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Projects
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A selection of things I&apos;ve designed and built.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal stagger={0.1} className="mt-8 grid gap-6 sm:grid-cols-2">
        {allProjects.length > 0 ? (
          allProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <EmptyState
            title="No projects yet"
            description="Connect Sanity in .env.local and add projects in the Studio to populate this page."
          />
        )}
      </ScrollReveal>
    </div>
  );
}
