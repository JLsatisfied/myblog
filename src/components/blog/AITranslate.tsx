import { useState, useEffect, useRef } from 'react';
import { Languages, Loader2, X } from 'lucide-react';
import { aiStream } from '@/services/ai';

export const AI_LANGUAGES = [
  { label: 'English', value: '英文' },
  { label: '日本語', value: '日文' },
  { label: '한국어', value: '韩文' },
  { label: '繁體中文', value: '繁体中文' },
  { label: 'Français', value: '法文' },
  { label: 'Deutsch', value: '德文' },
];

const CACHE_PREFIX = 'ai_trans_';

function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 8000);
}

interface Props {
  content: string;
  articleId: string;
  /** 是否正在显示翻译 */
  translating: boolean;
  /** 选中的语言 */
  lang: string | null;
  onStart: (lang: string) => void;
  /** 翻译流式输出中 */
  onStreaming: (text: string) => void;
  /** 翻译完成 */
  onDone: (text: string) => void;
  /** 退出翻译 */
  onClear: () => void;
}

export default function AITranslate({
  content, articleId, translating, lang,
  onStart, onStreaming, onDone, onClear,
}: Props) {
  const [loading, setLoading] = useState(false);
  const requesting = useRef(false);

  async function selectLang(l: string) {
    if (requesting.current) return;

    // 再点一次 = 退出翻译
    if (lang === l) { onClear(); return; }

    onStart(l);

    // 缓存命中
    const cacheKey = CACHE_PREFIX + articleId + '_' + l;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { onDone(cached); return; }

    requesting.current = true;
    setLoading(true);

    const text = plainText(content);
    try {
      const gen = aiStream({ mode: 'translate', content: text, targetLang: l });
      let full = '';
      for await (const chunk of gen) {
        full += chunk;
        onStreaming(full);
      }
      localStorage.setItem(cacheKey, full);
      onDone(full);
    } catch {
      onClear();
    } finally {
      setLoading(false);
      requesting.current = false;
    }
  }

  // 文章切换时重置
  useEffect(() => {
    requesting.current = false;
    setLoading(false);
  }, [articleId]);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1.5 mr-1 text-xs font-mono font-bold tracking-widest text-[var(--color-accent)]/60">
          <Languages size={12} />
          TRANSLATE
        </span>

        {AI_LANGUAGES.map((l) => {
          const isActive = lang === l.value;
          return (
            <button
              key={l.value}
              onClick={() => selectLang(l.value)}
              disabled={loading}
              className={`text-[11px] font-mono tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-40 ${
                isActive
                  ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent-glow)]'
                  : 'border-[var(--color-accent)]/15 text-[var(--color-text-secondary)]/60 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]'
              }`}
            >
              {l.label}
            </button>
          );
        })}

        {loading && (
          <span className="text-[11px] font-mono text-[var(--color-text-secondary)]/50 ml-2">
            <Loader2 size={10} className="inline animate-spin mr-1" />
            TRANSLATING...
          </span>
        )}

        {translating && !loading && (
          <button
            onClick={onClear}
            className="text-[11px] font-mono tracking-wider px-2 py-1 rounded-lg border border-[var(--color-red)]/20 text-[var(--color-red)]/60 hover:border-[var(--color-red)]/40 hover:text-[var(--color-red)] hover:bg-[var(--color-red)]/5 transition-all ml-1"
          >
            <X size={10} className="inline mr-0.5 -mt-px" />
            原文
          </button>
        )}
      </div>
    </div>
  );
}
