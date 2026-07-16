import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import FloatingElements from '@/components/effects/FloatingElements';
import BlogCard from '@/components/blog/BlogCard';
import { getLatestArticles, getHotArticles } from '@/services/api';
import type { ArticleItem } from '@/types/api';

export default function HomePage() {
  const [latestArticles, setLatestArticles] = useState<ArticleItem[]>([]);
  const [hotArticles, setHotArticles] = useState<ArticleItem[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingHot, setLoadingHot] = useState(true);

  useEffect(() => {
    getLatestArticles()
      .then((res) => {
        if (res.code === 200) setLatestArticles(res.data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoadingLatest(false));

    getHotArticles()
      .then((res) => {
        if (res.code === 200) setHotArticles(res.data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoadingHot(false));
  }, []);

  return (
    <div className="relative">
      <FloatingElements />
      <HeroSection />

      {/* ── 内容区域 ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-24">
        {/* ── 最新文章 ── */}
        <section>
          <motion.div
            className="text-center mb-12 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
              <Sparkles size={14} className="text-[var(--color-accent)]" />
              <span className="text-xs font-semibold tracking-[0.12em] text-[var(--color-accent)]">
                最新发布
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
              新鲜出炉
            </h2>
            <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)]" />
          </motion.div>

          {loadingLatest ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={28} className="text-[var(--color-accent)] animate-spin" />
            </div>
          ) : latestArticles.length === 0 ? (
            <p className="text-center text-[var(--color-text-secondary)] text-sm">暂无文章</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {latestArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <BlogCard article={article} colorIndex={i} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/50 transition-all group"
            >
              浏览全部文章
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </section>

        {/* ── 热门文章 ── */}
        <section>
          <motion.div
            className="text-center mb-12 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-purple)]/10 border border-[var(--color-purple)]/20">
              <TrendingUp size={14} className="text-[var(--color-purple)]" />
              <span className="text-xs font-semibold tracking-[0.12em] text-[var(--color-purple)]">
                热门榜单
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
              阅读排行
            </h2>
            <div className="h-1 w-12 mx-auto rounded-full bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-accent)]" />
          </motion.div>

          {loadingHot ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={28} className="text-[var(--color-purple)] animate-spin" />
            </div>
          ) : hotArticles.length === 0 ? (
            <p className="text-center text-[var(--color-text-secondary)] text-sm">暂无数据</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {hotArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <BlogCard article={article} colorIndex={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
