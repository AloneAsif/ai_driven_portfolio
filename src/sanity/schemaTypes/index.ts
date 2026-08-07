import type { SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { post } from "./post";
import { author } from "./author";
import { category } from "./category";

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  post,
  author,
  category,
];

export const schema = {
  types: schemaTypes,
};
