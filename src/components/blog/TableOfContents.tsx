import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

interface TocGroup {
  id: string;
  text: string;
  children: TocEntry[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(raw: string): TocEntry[] {
  const items: TocEntry[] = [];
  const htmlRe = /<h([23])[^>]*>(.+?)<\/h[23]>/gi;
  let m: RegExpExecArray | null;
  while ((m = htmlRe.exec(raw)) !== null) {
    const level = parseInt(m[1], 10);
    const text = m[2].replace(/<[^>]*>/g, '').trim();
    items.push({ id: slugify(text), text, level });
  }
  if (items.length === 0) {
    const mdRe = /^(#{2,3})\s+(.+)$/gm;
    while ((m = mdRe.exec(raw)) !== null) {
      const text = m![2].trim();
      items.push({ id: slugify(text), text, level: m![1].length });
    }
  }
  return items;
}

function groupHeadings(items: TocEntry[]): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const item of items) {
    if (item.level === 2) {
      groups.push({ id: item.id, text: item.text, children: [] });
    } else if (item.level === 3 && groups.length > 0) {
      groups[groups.length - 1].children.push(item);
    }
  }
  return groups;
}

interface Props {
  rawMarkdown: string;
}

export default function TableOfContents({ rawMarkdown }: Props) {
  const allHeadings = useRef<TocEntry[]>(extractHeadings(rawMarkdown));
  const groups = useRef<TocGroup[]>(groupHeadings(allHeadings.current));
  const [activeId, setActiveId] = useState<string>('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    let closest: string | null = null;
    let minTop = Infinity;
    for (const e of entries) {
      if (e.isIntersecting && e.boundingClientRect.top < minTop) {
        minTop = e.boundingClientRect.top;
        closest = e.target.id;
      }
    }
    if (closest) setActiveId(closest);
  }, []);

  useEffect(() => {
    if (allHeadings.current.length === 0) return;
    const timer = setTimeout(() => {
      observerRef.current = new IntersectionObserver(handleIntersect, {
        rootMargin: '-80px 0px -70% 0px',
      });
      for (const h of allHeadings.current) {
        const el = document.getElementById(h.id);
        if (el) observerRef.current.observe(el);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [handleIntersect]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (groups.current.length === 0) return null;

  const navBody = (
    <>
      {/* 标题 — 霓虹渐变 */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-4 rounded-sm bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-purple)] shadow-[0_0_8px_var(--color-accent-glow)]" />
        <p className="text-xs font-bold tracking-[0.25em] text-[var(--color-accent)]">
          目录
        </p>
        <span className="flex-1 h-px bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent" />
      </div>

      <ul className="space-y-0.5">
        {groups.current.map((g) => {
          const hasChildren = g.children.length > 0;
          const isCollapsed = collapsed.has(g.id);
          const isGroupActive = activeId === g.id;

          return (
            <li key={g.id}>
              {/* ── h2 父级 ── */}
              <div
                className={`
                  group flex items-center gap-1 py-2 pr-2 text-sm leading-snug transition-all duration-200 rounded-r-lg border-l-2
                  ${isGroupActive
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)] font-bold bg-[var(--color-accent)]/5 shadow-[inset_0_0_12px_var(--color-accent-glow)]'
                    : 'border-transparent text-[var(--color-text-primary)]/85 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]/50'
                  }
                `}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(g.id)}
                    className={`shrink-0 p-0.5 rounded transition-all duration-200 ${isGroupActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]/50 group-hover:text-[var(--color-accent)]'}`}
                    aria-label={isCollapsed ? '展开' : '收起'}
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    />
                  </button>
                ) : (
                  <span className="w-[22px] shrink-0" />
                )}
                <button
                  onClick={() => scrollTo(g.id)}
                  className="flex-1 text-left cursor-pointer"
                >
                  {g.text}
                </button>
              </div>

              {/* ── h3 子级 ── */}
              {hasChildren && !isCollapsed && (
                <ul className="space-y-0 ml-2.5 border-l border-[var(--color-accent)]/15">
                  {g.children.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => scrollTo(c.id)}
                        className={`
                          block py-1.5 pl-4 pr-2 text-sm leading-snug transition-all duration-200 text-left w-full cursor-pointer rounded-r-md border-l-2 -ml-px
                          ${
                            activeId === c.id
                              ? 'border-[var(--color-accent)] text-[var(--color-accent)] font-semibold bg-[var(--color-accent)]/5 shadow-[inset_0_0_12px_var(--color-accent-glow)]'
                              : 'border-transparent text-[var(--color-text-primary)]/65 hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-bg-secondary)]/30'
                          }
                        `}
                      >
                        {c.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════
          桌面端 — sticky 在 article 右侧
          ═══════════════════════════════════════════════ */}
      <aside
        className="
          hidden xl:block
          z-30
          w-52
          max-h-[calc(100vh-160px)]
          overflow-y-auto
          rounded-lg
          border border-[var(--color-accent)]/20
          bg-[var(--color-bg-primary)]/90 backdrop-blur-xl
          p-5
        "
        style={{ position: 'sticky', top: '7rem', alignSelf: 'flex-start' }}
      >
        {navBody}
      </aside>

      {/* ═══════════════════════════════════════════════
          移动端 — 底部栏 + 全屏弹窗
          ═══════════════════════════════════════════════ */}

      {/* 移动端 — 右侧固定垂直居中浮动按钮（Portal 到 body 绕过祖先 transform） */}
      {createPortal(
        <button
          onClick={() => setMobileOpen(true)}
          className="xl:hidden fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-bold tracking-wider shadow-[0_0_12px_var(--color-accent-glow)] hover:bg-[var(--color-accent)]/20 hover:shadow-[0_0_20px_var(--color-accent)] transition-all active:scale-95"
          aria-label="打开目录"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span className="[writing-mode:vertical-rl]">目录</span>
        </button>,
        document.body
      )}

      {/* 移动端 — 遮罩 + 右侧滑入抽屉（Portal 到 body 绕过祖先 transform） */}
      {createPortal(
        <>
          {/* 遮罩层 */}
          <div
            className={`
              xl:hidden fixed inset-0 z-50 bg-black/60
              transition-opacity duration-300
              ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* 侧滑面板：始终在 DOM 中，通过 translate 控制滑入滑出 */}
          <div
            className={`
              xl:hidden fixed top-0 bottom-0 right-0 z-50
              w-72 max-w-[80vw]
              bg-[var(--color-bg-primary)]/98 backdrop-blur-xl
              border-l border-[var(--color-accent)]/20
              shadow-[-8px_0_24px_rgba(0,0,0,0.4)]
              flex flex-col
              transition-transform duration-300 ease-out
              ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
            inert={!mobileOpen ? true : undefined}
          >
            {/* 顶栏 — 仅关闭按钮 */}
            <div className="flex items-center justify-end px-5 py-3 border-b border-[var(--color-accent)]/15 shrink-0">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-[var(--color-accent)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/10 transition-colors"
                aria-label="关闭目录"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* 目录内容 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {navBody}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export { extractHeadings };
