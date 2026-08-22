import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { OfferCard } from "@/components/offer-card";
import { ProjectCard } from "@/components/project-card";
import { Magnetic } from "@/components/reactbits/magnetic";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { SplitText } from "@/components/reactbits/split-text";
import { fetchSanity } from "@/sanity/lib/data";
import { FEATURED_PROJECTS_QUERY, OFFERS_QUERY } from "@/sanity/lib/queries";
import type { Offer, Project } from "@/sanity/types";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

const whatIDo = [
  { emoji: "🚀", label: "Full-Stack Web Development" },
  { emoji: "⚛️", label: "React & Next.js Applications" },
  { emoji: "🐍", label: "Python & FastAPI Backend" },
  { emoji: "🗄️", label: "PostgreSQL & Database Integration" },
  { emoji: "🔌", label: "REST API Development & Integration" },
  { emoji: "🎨", label: "UI/UX & Responsive Interface Design" },
  { emoji: "🧩", label: "Sanity CMS & Content Management" },
  { emoji: "🤖", label: "AI & Generative AI Applications" },
  { emoji: "⚙️", label: "Automation & API Integrations" },
  { emoji: "☁️", label: "Deployment & Modern Web Technologies" },
];

const toolkit = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Sanity CMS",
  "REST APIs",
];

export default async function HomePage() {
  const [projects, offers] = await Promise.all([
    fetchSanity<Project[]>(FEATURED_PROJECTS_QUERY, {}, ["project"]),
    fetchSanity<Offer[]>(OFFERS_QUERY, {}, ["offer"]),
  ]);
  const featuredProjects = projects ?? [];
  const featuredOffers = (offers ?? []).slice(0, 3); // Show max 3 on homepage

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Hero */}
      <section>
        <ScrollReveal stagger={0.12}>
          <p className="text-sm font-medium text-muted-foreground">
            Hi, I&apos;m
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
        <ScrollReveal stagger={0.1}>
          <p className="text-sm font-medium text-muted-foreground">
            About me
          </p>
          <h2 className="mt-2 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Full-Stack Developer &amp; UI/UX Designer building modern, scalable
            digital experiences.
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Hi, I&apos;m{" "}
              <span className="font-medium text-foreground">Muhammad Asif</span>{" "}
              — I work across the full development stack, from designing
              intuitive interfaces to building robust backend systems and
              connecting databases, APIs, and third-party services. I enjoy
              turning ideas into complete, functional products that are both
              visually polished and technically reliable.
            </p>
            <p>
              My development toolkit includes HTML, CSS, JavaScript,
              TypeScript, React, Next.js, Tailwind CSS, Python, FastAPI,
              PostgreSQL, Sanity CMS, and REST APIs. I&apos;m also exploring AI,
              generative AI, automation, and AI-powered applications to build
              smarter, more useful software.
            </p>
            <p>
              My background in UI/UX and graphic design gives me a different
              perspective as a developer. I care about the details that make an
              application feel professional — from typography and spacing to
              responsive layouts, accessibility, performance, and overall user
              experience.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* What I do */}
      <section className="mt-16">
        <ScrollReveal stagger={0.05}>
          <h3 className="font-heading text-xl font-semibold">What I do</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {whatIDo.map((item) => (
              <Card key={item.label} size="sm" className="h-full">
                <CardContent className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg"
                  >
                    {item.emoji}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Offers teaser */}
      {featuredOffers.length > 0 && (
        <section className="mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold">Offers & Pricing</h2>
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all offers →
            </Link>
          </div>
          <ScrollReveal stagger={0.1} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOffers.map((offer, index) => (
              <OfferCard key={offer._id} offer={offer} index={index} />
            ))}
          </ScrollReveal>
        </section>
      )}

      {/* Toolkit */}
      <section className="mt-16">
        <ScrollReveal stagger={0.03}>
          <h3 className="font-heading text-xl font-semibold">My toolkit</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {toolkit.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="h-auto rounded-full px-3 py-1 text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Goal */}
      <section className="mt-16">
        <ScrollReveal>
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                My goal
              </p>
              <p className="max-w-2xl text-lg font-medium leading-relaxed">
                Build complete digital products that combine great design,
                clean code, reliable functionality, and an excellent user
                experience.
              </p>
            </CardContent>
          </Card>
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
