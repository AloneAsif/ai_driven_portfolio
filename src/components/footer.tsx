import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/social-icons";

const socials = [
  { href: siteConfig.links.github, label: "GitHub", Icon: GitHubIcon },
  { href: siteConfig.links.twitter, label: "X (Twitter)", Icon: XIcon },
  { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.name}. Built with Next.js, Sanity &amp; Tailwind.
        </p>
        <div className="flex items-center gap-1">
          {socials.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
