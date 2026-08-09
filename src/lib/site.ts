export const siteConfig = {
  name: "Asif",
  title: "Asif — Portfolio",
  description:
    "Hi, I'm Asif — a developer building fast, thoughtful things for the web. Projects, writing and more.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/AloneAsif",
    twitter: "https://x.com/AsifKhadim36513",
    linkedin: "https://www.linkedin.com/in/asif-khadim-12ba332a4/",
  },
  // Placeholder author info — replace with your real details, or manage via
  // the `author` document in the Sanity Studio.
  author: {
    name: "Asif",
    role: "Developer",
    bio: "I build fast, thoughtful products for the web — from polished marketing sites to complex applications.",
    email: "hello@example.com",
  },
};

export type SiteConfig = typeof siteConfig;
