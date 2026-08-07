import type { StructureResolver } from "sanity/structure";

/**
 * Studio structure — grouped document lists per content type,
 * plus the default singleton/document type items.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Projects")
        .child(
          S.documentList()
            .id("projects")
            .title("Projects")
            .schemaType("project")
            .filter('_type == "project"'),
        ),
      S.listItem()
        .title("Posts")
        .child(
          S.documentList()
            .id("posts")
            .title("Posts")
            .schemaType("post")
            .filter('_type == "post"'),
        ),
      S.listItem()
        .title("Authors")
        .child(
          S.documentList()
            .id("authors")
            .title("Authors")
            .schemaType("author")
            .filter('_type == "author"'),
        ),
      S.listItem()
        .title("Categories")
        .child(
          S.documentList()
            .id("categories")
            .title("Categories")
            .schemaType("category")
            .filter('_type == "category"'),
        ),
      S.divider(),
      ...S.documentTypeListItems(),
    ]);
