import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ArticleItem } from '@/types/api';

interface PostNavigationProps {
  prev?: ArticleItem;
  next?: ArticleItem;
}

export default function PostNavigation({ prev, next }: PostNavigationProps) {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-20 pt-10 border-t border-[var(--color-border)]/20">
      {prev ? (
        <Link
          to={`/blog/${prev.id}`}
          className="group block p-6 rounded-2xl border border-[var(--color-border)]/20 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-bg-secondary)]/30 transition-all"
        >
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]/50 mb-3">
            <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            上一篇
          </span>
          <span className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
            {prev.name}
          </span>
          <p className="text-sm text-[var(--color-text-secondary)]/60 mt-2 line-clamp-1">
            {prev.introduction}
          </p>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          to={`/blog/${next.id}`}
          className="group block p-6 rounded-2xl border border-[var(--color-border)]/20 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-bg-secondary)]/30 transition-all text-right"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-[var(--color-text-secondary)]/50 mb-3">
            下一篇
            <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
            {next.name}
          </span>
          <p className="text-sm text-[var(--color-text-secondary)]/60 mt-2 line-clamp-1">
            {next.introduction}
          </p>
        </Link>
      ) : <div />}
    </nav>
  );
}
