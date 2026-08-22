import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project"] | order(order asc, publishedAt desc)`,
);

export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc, publishedAt desc)`,
);

export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{
    ...,
    "coverImageAlt": coverImage.alt,
  }`,
);

export const POSTS_QUERY = defineQuery(
  `*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug},
  }`,
);

export const POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    body,
    coverImage,
    "author": author->{name, image, bio},
    "categories": categories[]->{title, slug},
  }`,
);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(title asc)`,
);

export const OFFERS_QUERY = defineQuery(
  `*[_type == "offer" && active == true] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    price,
    currency,
    billingNote,
    features,
    popular,
    ctaMessage,
    order
  }`,
);
