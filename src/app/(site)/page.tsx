import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { Magnetic } from "@/components/reactbits/magnetic";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { SplitText } from "@/components/reactbits/split-text";
import { fetchSanity } from "@/sanity/lib/data";
import { FEATURED_PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { Project } from "@/sanity/types";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default async function HomePage() {
  const projects = await fetchSanity<Project[]>(
    FEATURED_PROJECTS_QUERY,
    {},
    ["project"],
  );
  const featuredProjects = projects ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Hero */}
      <section>
        <ScrollReveal stagger={0.12}>
          <p className="text-sm font-medium text-muted-foreground">
            Hi, my name is
          </p>
          <SplitText
            as="h1"
            text={siteConfig.author.name}
            className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          />
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {siteConfig.author.role}. {siteConfig.author.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild size="lg">
                <Link href="/projects">
                  View projects
                  <ArrowRight />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </Magnetic>
          </div>
        </ScrollReveal>
      </section>

      {/* About */}
      <section className="mt-24">
        <ScrollReveal delay={0.05}>
          <h2 className="font-heading text-2xl font-semibold">About</h2>
          <div className="mt-4 max-w-2xl space-y-4 leading-relaxed text-muted-foreground">
            <p>{siteConfig.author.bio}</p>
            <p>
              I care about performance, accessibility and clean design. Everything
              here is built with modern tooling — React, Next.js, Sanity CMS and
              Tailwind CSS.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Featured projects */}
      <section className="mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold">
            Featured projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-primary hover:underline"
          >
            All projects →
          </Link>
        </div>
        <ScrollReveal
          stagger={0.1}
          className="mt-6 grid gap-6 sm:grid-cols-2"
        >
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <EmptyState
              title="No featured projects yet"
              description="Connect Sanity in .env.local and mark projects as featured in the Studio to show them here."
            />
          )}
        </ScrollReveal>
      </section>
    </div>
  );
}
