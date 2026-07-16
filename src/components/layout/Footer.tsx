import { Zap } from 'lucide-react';
import { SITE_NAME, SITE_NAME_EN } from '@/utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-accent)]">©</span>
            <span>{year}</span>
            <span className="text-[var(--color-text-primary)] font-medium">[{SITE_NAME}]</span>
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">| {SITE_NAME_EN}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-accent)]">$</span>
            <Zap size={12} className="text-[var(--color-purple)]" />
            <span>powered by KAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
