export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured: boolean;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  nameJa?: string;
  color: string;
  icon: string;
  description?: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  color?: string;
}
