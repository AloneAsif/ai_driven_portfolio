import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <header>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-muted-foreground">
          Have a project in mind, or just want to say hi? Send a message and
          I&apos;ll get back to you.
        </p>
      </header>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
