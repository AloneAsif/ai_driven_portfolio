import type { SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { post } from "./post";
import { author } from "./author";
import { category } from "./category";
import { offer } from "./offer";

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  post,
  author,
  category,
  offer,
];

export const schema = {
  types: schemaTypes,
};
