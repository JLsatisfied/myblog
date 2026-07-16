import type { BlogPost } from '@/types/blog';
import { parseFrontmatter, estimateReadingTime } from '@/utils/markdown';

// Use import.meta.glob to eagerly load all .md files
const postModules = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

interface RawFrontmatter {
  title?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  coverImage?: string;
}

function normalizeFrontmatter(fm: Record<string, string | string[]>): RawFrontmatter {
  const result: RawFrontmatter = {};

  for (const [key, value] of Object.entries(fm)) {
    if (key === 'tags') {
      result.tags = Array.isArray(value) ? (value as string[]) : [];
    } else if (key === 'featured') {
      result.featured = value === 'true';
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}

function buildPost(slug: string, raw: string): BlogPost {
  const { frontmatter: rawFm, content } = parseFrontmatter(raw);
  const fm = normalizeFrontmatter(rawFm);

  return {
    slug,
    title: fm.title ?? slug,
    excerpt: fm.excerpt ?? '',
    content,
    coverImage: fm.coverImage,
    category: fm.category ?? 'life',
    tags: fm.tags ?? [],
    author: fm.author ?? '星野',
    publishedAt: fm.publishedAt ?? '2026-06-25',
    updatedAt: fm.updatedAt,
    readingTime: estimateReadingTime(content),
    featured: fm.featured ?? false,
  };
}

let cachedPosts: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const posts = Object.entries(postModules)
    .map(([path, raw]) => {
      const slug = path.replace('./', '').replace('.md', '');
      return buildPost(slug, raw as string);
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  cachedPosts = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categoryId: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === categoryId);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
