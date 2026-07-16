import type { ArticleItem, LabelItem } from '@/types/api';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: ArticleItem[];
  labelMap?: Map<string, LabelItem>;
}

export default function BlogGrid({ posts, labelMap }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-4xl mb-4 font-mono text-[var(--color-text-secondary)]">
          [EMPTY]
        </div>
        <p className="text-sm font-mono text-[var(--color-text-secondary)]">
          No entries match your query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {posts.map((post, i) => (
        <BlogCard key={post.id} article={post} labelMap={labelMap} colorIndex={i} />
      ))}
    </div>
  );
}
