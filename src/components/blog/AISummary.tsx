import { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { aiStream } from '@/services/ai';

interface Props {
  content: string;   // 文章正文（HTML）
  articleId: string; // 文章 ID（用于 localStorage 缓存）
}

const CACHE_PREFIX = 'ai_summary_';

function plainText(html: string, maxLen = 5000): string {
  return html.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

export default function AISummary({ content, articleId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;

    // 先从缓存读取
    const cached = localStorage.getItem(CACHE_PREFIX + articleId);
    if (cached) {
      setSummary(cached);
      fetched.current = true;
      return;
    }

    // 异步生成摘要
    fetched.current = true;
    const text = plainText(content);
    if (text.length < 100) return; // 太短的文章不用摘要

    setLoading(true);
    (async () => {
      try {
        const gen = aiStream({ mode: 'summarize', content: text });
        let result = '';
        for await (const chunk of gen) {
          result += chunk;
          setSummary(result);
        }
        if (result) {
          localStorage.setItem(CACHE_PREFIX + articleId, result);
        }
      } catch (e: any) {
        setError(e.message || '摘要生成失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  if (!summary && !loading) return null;

  return (
    <div className="mb-10 rounded-2xl border border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-purple)]/5 p-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-[var(--color-accent)] w-full text-left"
      >
        <Sparkles size={16} className="text-[var(--color-purple)]" />
        AI 摘要{loading ? ' 生成中…' : ''}
        <span className="flex-1" />
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="mt-3 text-sm leading-relaxed text-[var(--color-text-primary)]/85 markdown-chat">
          {loading && !summary && (
            <span className="text-[var(--color-text-secondary)] animate-pulse">
              <Loader2 size={12} className="inline animate-spin mr-1.5" />
              正在分析文章内容…
            </span>
          )}
          {error && <span className="text-[var(--color-red)] text-xs">{error}</span>}
          {summary && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {summary}
            </ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
}
