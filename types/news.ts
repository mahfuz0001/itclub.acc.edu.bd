import type { Timestamp } from "firebase/firestore";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  slug?: string;
  category: string;
  tags: string[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
}
