import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Eye, Loader2 } from 'lucide-react';
import { getArticleDetail, getArticles } from '@/services/api';
import { formatDate } from '@/utils/date';
import PostContent from '@/components/blog/PostContent';
import PostNavigation from '@/components/blog/PostNavigation';
import TableOfContents from '@/components/blog/TableOfContents';
import AISummary from '@/components/blog/AISummary';
import AITakeaways from '@/components/blog/AITakeaways';
import AITranslate from '@/components/blog/AITranslate';
import AIArticleChat from '@/components/blog/AIArticleChat';
import { estimateReadingTime } from '@/components/blog/BlogCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { postContentComponents } from '@/components/blog/PostContent';
import NotFoundPage from './NotFoundPage';
import type { ArticleItem } from '@/types/api';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [allArticles, setAllArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // ─── AI 翻译状态 ───
  const [transLang, setTransLang] = useState<string | null>(null);
  const [transText, setTransText] = useState<string>('');
  const [transStream, setTransStream] = useState<string>('');
  const [transDone, setTransDone] = useState(false);
  const [transLoading, setTransLoading] = useState(false);

  // 加载文章列表（用于 prev/next 导航）
  useEffect(() => {
    getArticles({ page: 1, pageSize: 100 }).then((res) => {
      if (res.code === 200) setAllArticles(res.data);
    }).catch(() => {});
  }, []);

  // 加载文章详情
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setNotFound(false);

    getArticleDetail(id)
      .then((res) => {
        if (res.code === 200 && res.data) {
          setArticle(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // 计算 prev / next
  const { prev, next } = useMemo(() => {
    if (!article || allArticles.length === 0) return { prev: undefined, next: undefined };
    const idx = allArticles.findIndex((a) => a.id === article.id);
    return {
      prev: idx > 0 ? allArticles[idx - 1] : undefined,
      next: idx < allArticles.length - 1 ? allArticles[idx + 1] : undefined,
    };
  }, [article, allArticles]);

  // 文章切换时清空翻译状态
  useEffect(() => {
    setTransLang(null);
    setTransText('');
    setTransStream('');
    setTransDone(false);
    setTransLoading(false);
  }, [id]);

  // ─── 加载中 ───
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[var(--color-accent)] animate-spin" />
        <p className="text-[var(--color-text-secondary)] text-sm">加载文章中...</p>
      </div>
    );
  }

  // ─── 文章不存在 ───
  if (notFound || (!loading && !article && !error)) return <NotFoundPage />;

  // ─── 错误 ───
  if (error) {
    return (
      <motion.div
        className="py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
        <Link to="/blog" className="text-[var(--color-accent)] hover:underline text-sm">
          ← 返回博客列表
        </Link>
      </motion.div>
    );
  }

  if (!article) return null;

  const readingTime = estimateReadingTime(article.text);

  return (
    <div className="flex gap-6 justify-center items-start">
      <motion.article
        className="text-left w-full max-w-4xl min-w-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back */}
        <div className="mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]/70 hover:text-[var(--color-accent)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            返回博客列表
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-14">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]/60 mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--color-accent)]" />
              {formatDate(article.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--color-accent)]" />
              {readingTime} 分钟阅读
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-[var(--color-accent)]" />
              {article.read} 次阅读
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight mb-5">
            {article.name}
          </h1>

          {/* Divider */}
          <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-purple)] to-transparent opacity-30 rounded-full" />
        </header>

        {/* AI 翻译语言选择器 */}
        <AITranslate
          content={article.text}
          articleId={article.id}
          translating={transDone}
          lang={transLang}
          onStart={(l) => {
            setTransLang(l);
            setTransText('');
            setTransStream('');
            setTransDone(false);
            setTransLoading(true);
          }}
          onStreaming={(text) => setTransStream(text)}
          onDone={(text) => {
            setTransText(text);
            setTransStream('');
            setTransDone(true);
            setTransLoading(false);
          }}
          onClear={() => {
            setTransLang(null);
            setTransText('');
            setTransStream('');
            setTransDone(false);
            setTransLoading(false);
          }}
        />

        {/* AI 摘要 */}
        <AISummary content={article.text} articleId={article.id} />

        {/* AI 要点卡片 */}
        <AITakeaways content={article.text} articleId={article.id} />

        {/* 正文 — 翻译时用翻译后的内容替换 */}
        {transDone && transText ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={postContentComponents}
          >
            {transText}
          </ReactMarkdown>
        ) : transLoading ? (
          <div>
            {transStream && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSlug]}
                components={postContentComponents}
              >
                {transStream}
              </ReactMarkdown>
            )}
            <div className="flex items-center gap-2 mt-6 text-[var(--color-accent)]">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-mono tracking-widest">TRANSLATING...</span>
            </div>
          </div>
        ) : (
          <PostContent content={article.text} />
        )}

        <PostNavigation prev={prev} next={next} />
      </motion.article>

      <TableOfContents rawMarkdown={article.text} />

      {/* AI 文章问答 */}
      <AIArticleChat content={article.text} />
    </div>
  );
}
