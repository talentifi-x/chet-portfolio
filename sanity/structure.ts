import type { StructureResolver } from "sanity/structure";

// Custom desk structure: groups posts, authors and categories.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["post", "category", "author"].includes(item.getId()!),
      ),
    ]);
