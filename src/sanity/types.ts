import type { SanityImageSource } from "@sanity/image-url";

// ---------------------------------------------------------------------------
// Lightweight types for the Sanity content used by the frontend.
// These intentionally mirror the schema (see src/sanity/schemaTypes).
// ---------------------------------------------------------------------------

export interface Slug {
  current: string;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{
    _key: string;
    _type: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

export interface PortableTextCode {
  _type: "code";
  _key: string;
  code?: string;
  language?: string;
  filename?: string;
}

export interface PortableTextImage {
  _type: "image";
  _key: string;
  asset: SanityImageSource;
  alt?: string;
}

export type PortableTextContent = (
  | PortableTextBlock
  | PortableTextCode
  | PortableTextImage
)[];

export interface Author {
  name: string;
  image?: SanityImageSource;
  bio?: string;
}

export interface Category {
  title: string;
  slug: Slug;
}

export interface Project {
  _id: string;
  title: string;
  slug: Slug;
  summary?: string;
  description?: PortableTextContent;
  coverImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
  publishedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: Slug;
  excerpt?: string;
  body?: PortableTextContent;
  coverImage?: SanityImageSource;
  author?: Author | null;
  categories?: Category[] | null;
  publishedAt?: string;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: Slug;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImageSource;
  author?: { name: string; image?: SanityImageSource } | null;
  categories?: Category[] | null;
}
