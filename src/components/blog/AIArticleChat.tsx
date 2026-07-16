import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { aiStream } from '@/services/ai';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface Props {
  content: string; // 文章正文
}

export default function AIArticleChat({ content }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // 打开时自动聚焦输入框
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    const userMsg: Message = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreaming('');

    try {
      const gen = aiStream({ mode: 'chat', content, question: q });
      let full = '';
      for await (const chunk of gen) {
        full += chunk;
        setStreaming(full);
      }
      setMessages((prev) => [...prev, { role: 'ai', content: full }]);
    } catch {
      setStreaming('生成失败，请重试');
    } finally {
      setLoading(false);
      setStreaming('');
    }
  }

  return (
    <>
      {/* 右侧浮动按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] text-white text-sm font-bold shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-xl hover:shadow-[var(--color-accent)]/30 hover:scale-105 transition-all active:scale-95"
        aria-label="AI 问答"
      >
        <Sparkles size={16} />
        问 AI
      </button>

      {/* 聊天面板 */}
      {open && (
        <div className="fixed top-16 bottom-0 right-0 z-[9999] w-96 max-w-[90vw] flex flex-col border-l border-[var(--color-accent)]/20 bg-[var(--color-bg-primary)]/98 backdrop-blur-xl shadow-[-8px_0_24px_rgba(0,0,0,0.3)]">
          {/* 顶栏 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-accent)]/15 shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]">
              <MessageCircle size={16} />
              AI 文章问答
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 消息列表 */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles size={28} className="mx-auto mb-3 text-[var(--color-accent)]/40" />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  基于本篇文章内容，向我提问吧
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]/60 mt-1">
                  例如："这篇文章的核心观点是什么？"
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'ml-8 px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-text-primary)]'
                    : 'mr-4 px-4 py-2.5 text-[var(--color-text-primary)]/85 markdown-chat'
                }`}
              >
                {m.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}

            {/* 流式输出 */}
            {streaming && (
              <div className="mr-4 px-4 py-2.5 text-sm leading-relaxed text-[var(--color-text-primary)]/85 markdown-chat">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {streaming}
                </ReactMarkdown>
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-[var(--color-accent)] animate-pulse rounded-sm align-middle" />
              </div>
            )}

            {loading && !streaming && (
              <div className="mr-4 px-4 py-2.5 text-sm text-[var(--color-text-secondary)]">
                <Loader2 size={14} className="inline animate-spin mr-2" />
                思考中…
              </div>
            )}
          </div>

          {/* 输入框 */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 p-4 border-t border-[var(--color-accent)]/15 shrink-0"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题…"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/40 outline-none focus:border-[var(--color-accent)]/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 disabled:opacity-30 transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
