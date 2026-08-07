import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextContent } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 text-xl font-semibold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-muted pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href;
      if (!href) return <span>{children}</span>;
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-primary underline underline-offset-3 hover:opacity-80"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  types: {
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm leading-relaxed">
        <code>{value.code}</code>
      </pre>
    ),
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value.asset).url()}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="w-full rounded-lg"
          />
        </figure>
      );
    },
  },
};

export function PortableTextRenderer({
  content,
}: {
  content: PortableTextContent;
}) {
  if (!content?.length) return null;
  return (
    <PortableText
      value={content as unknown as PortableTextBlock[]}
      components={components}
    />
  );
}
