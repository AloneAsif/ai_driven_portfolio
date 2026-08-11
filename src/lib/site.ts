export const siteConfig = {
  name: "Asif",
  title: "Muhammad Asif — Portfolio",
  description:
    "Muhammad Asif — Full-Stack Developer & UI/UX Designer building modern, scalable, and user-friendly digital experiences.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/AloneAsif",
    twitter: "https://x.com/AsifKhadim36513",
    linkedin: "https://www.linkedin.com/in/asif-khadim-12ba332a4/",
  },
  // Author info — manage via the `author` document in the Sanity Studio if
  // you'd rather keep copy there instead of here.
  author: {
    name: "Muhammad Asif",
    role: "Full-Stack Developer & UI/UX Designer",
    bio: "I build modern, scalable digital products — from intuitive interfaces to robust backend systems, databases, and APIs.",
    email: "hello@example.com",
  },
};

export type SiteConfig = typeof siteConfig;
