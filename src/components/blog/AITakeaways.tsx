import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { aiStream } from '@/services/ai';

interface Props {
  content: string;
  articleId: string;
}

const CACHE_PREFIX = 'ai_takeaways_';

function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim().slice(0, 5000);
}

export default function AITakeaways({ content, articleId }: Props) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cached = localStorage.getItem(CACHE_PREFIX + articleId);
    if (cached) {
      try { setItems(JSON.parse(cached)); } catch { /* ignore */ }
      return;
    }

    const text = plainText(content);
    if (text.length < 200) return;

    setLoading(true);
    (async () => {
      try {
        const prompt = [
          '请阅读以下文章，提取 **3 个最核心的要点**。',
          '',
          '硬性要求：',
          '1. 每条要点一句话，不超过 30 字',
          '2. 必须是读者看完能立刻记住的知识点',
          '3. 不要加编号前缀（不要 "1. 2. 3."）',
          '4. 每条要点用换行分隔',
          '',
          `文章内容：\n\n${text}`,
        ].join('\n');

        const gen = aiStream({ mode: 'chat', content: text, question: prompt });
        let result = '';
        for await (const chunk of gen) {
          result += chunk;
        }
        const lines = result
          .split('\n')
          .map(l => l.replace(/^[\d\s.\-•]+/, '').trim())
          .filter(l => l.length > 3)
          .slice(0, 3);

        if (lines.length > 0) {
          setItems(lines);
          localStorage.setItem(CACHE_PREFIX + articleId, JSON.stringify(lines));
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  if (items.length === 0 && !loading) return null;

  return (
    <div className="mb-10 rounded-2xl border border-[var(--color-accent)]/15 bg-gradient-to-br from-[var(--color-accent)]/3 via-transparent to-[var(--color-purple)]/3 p-5">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-4 rounded-sm bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-purple)] shadow-[0_0_8px_var(--color-accent-glow)]" />
        <Lightbulb size={14} className="text-amber-400" />
        <span className="text-xs font-mono font-bold tracking-[0.2em] text-[var(--color-accent)]">
          读完你该记住的
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent" />
      </div>

      {/* 加载中 */}
      {loading && items.length === 0 && (
        <div className="flex items-center gap-2 py-3 text-xs font-mono text-[var(--color-text-secondary)]/50">
          <Loader2 size={12} className="text-[var(--color-accent)] animate-spin" />
          ANALYZING...
        </div>
      )}

      {/* 3 张卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative group rounded-xl border border-[var(--color-accent)]/10 bg-[var(--color-bg-secondary)]/30 p-4 hover:border-[var(--color-accent)]/30 transition-all duration-300"
          >
            {/* 序号角标 */}
            <span className="absolute -top-2.5 -left-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-purple)] text-white text-[10px] font-bold shadow-[0_0_8px_var(--color-accent-glow)] font-mono">
              {i + 1}
            </span>

            <div className="text-xs leading-relaxed text-[var(--color-text-primary)]/80 markdown-chat mt-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {item}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
