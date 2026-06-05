import type { PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";

export interface Author {
  name: string;
  image?: Image;
  bio?: PortableTextBlock[];
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  readingTime?: number;
  mainImage?: Image;
  categories?: string[];
  author?: Pick<Author, "name" | "image">;
}

export interface Post extends PostListItem {
  body?: PortableTextBlock[];
  author?: Author;
}
