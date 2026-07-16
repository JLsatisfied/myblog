import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getArticles, getAllLabels } from '@/services/api';
import BlogCard, { PRESET_COLORS } from '@/components/blog/BlogCard';
import type { ArticleItem, LabelItem } from '@/types/api';

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 300;

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLabelId = searchParams.get('label') ?? '';
  const searchQuery = searchParams.get('q') ?? '';

  // 本地输入值（立即响应打字），搜索词延迟同步到 URL
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 数据状态
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // 构建 label 映射：名称 → LabelItem（article.label 存的是名称，不是 UUID）
  const labelMap = useMemo(() => {
    const map = new Map<string, LabelItem>();
    labels.forEach((l) => map.set(l.name, l));
    return map;
  }, [labels]);

  // 同步外部 URL 的 q 参数到本地输入框（例如点击清除时）
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // 防抖：本地输入值延迟后写入 URL
  const handleSearchChange = (value: string) => {
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set('q', value);
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }, DEBOUNCE_MS);
  };

  // 初始加载标签列表
  useEffect(() => {
    getAllLabels()
      .then((res) => {
        if (res.code === 200) setLabels(res.data);
      })
      .catch(() => {}); // 标签加载失败不影响文章列表
  }, []);

  // 加载文章列表
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPage(1);

    const params: { page: number; pageSize: number } = { page: 1, pageSize: PAGE_SIZE };

    getArticles(params)
      .then((res) => {
        if (res.code === 200) {
          setArticles(res.data);
          setTotal(res.total ?? res.data.length);
        } else {
          setError(res.msg ?? '获取文章列表失败');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // 加载更多
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await getArticles({ page: nextPage, pageSize: PAGE_SIZE });
      if (res.code === 200) {
        setArticles((prev) => [...prev, ...res.data]);
        setPage(nextPage);
      }
    } catch {
      // 忽略加载更多错误
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = articles.length < total;

  // 客户端筛选（搜索 + 标签）
  const filteredArticles = useMemo(() => {
    let list = articles;
    if (activeLabelId) {
      list = list.filter((a) => a.label?.includes(activeLabelId));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.introduction.toLowerCase().includes(q) ||
          a.label?.some((lid) => labelMap.get(lid)?.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [articles, activeLabelId, searchQuery, labelMap]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <div className="text-center space-y-16">
        {/* ── Hero ── */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-purple)]/10 border border-[var(--color-accent)]/20">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] text-[var(--color-accent)]">
              文章归档
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-purple)] to-[var(--color-green)] bg-clip-text text-transparent">
              探索博客
            </span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
            共 <span className="font-bold text-[var(--color-accent)]">{filteredArticles.length}</span> 篇文章
            {activeLabelId && (
              <span> · 标签：<span className="font-bold" style={{ color: PRESET_COLORS[labels.findIndex((l) => l.name === activeLabelId) % PRESET_COLORS.length] }}>{activeLabelId}</span></span>
            )}
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="🔍 搜索文章..."
            className="px-5 py-3 text-sm rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/50 outline-none focus:border-[var(--color-accent)]/50 focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all w-56"
          />

          <button
            onClick={() => updateFilter('label', '')}
            className={`px-5 py-3 text-sm font-semibold rounded-full transition-all ${
              !activeLabelId
                ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                : 'bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
            }`}
          >
            ✨ 全部
          </button>

          {labels.map((label, i) => (
            <button
              key={label.id}
              onClick={() => updateFilter('label', activeLabelId === label.name ? '' : label.name)}
              className={`px-5 py-3 text-sm font-semibold rounded-full transition-all border ${
                activeLabelId === label.name
                  ? 'text-white shadow-lg'
                  : 'bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-current'
              }`}
              style={
                activeLabelId === label.name
                  ? { backgroundColor: PRESET_COLORS[i % PRESET_COLORS.length], borderColor: PRESET_COLORS[i % PRESET_COLORS.length], boxShadow: `0 4px 20px ${PRESET_COLORS[i % PRESET_COLORS.length]}40` }
                  : {}
              }
            >
              {label.name}
            </button>
          ))}
        </motion.div>

        {/* 清除筛选 */}
        {(activeLabelId || searchQuery) && (
          <motion.div
            className="flex flex-wrap items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setSearchParams({}, { replace: true })}
              className="px-3.5 py-1.5 text-xs font-medium text-[var(--color-accent)] hover:underline rounded-full"
            >
              清除筛选
            </button>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <motion.div
            className="py-20 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 size={32} className="text-[var(--color-accent)] animate-spin" />
            <p className="text-[var(--color-text-secondary)] text-sm">加载文章中...</p>
          </motion.div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <motion.div
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-[var(--color-text-secondary)]">{error}</p>
          </motion.div>
        )}

        {/* ── Posts Grid ── */}
        {!loading && !error && filteredArticles.length === 0 ? (
          <motion.div
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[var(--color-text-secondary)]">没有找到匹配的文章</p>
          </motion.div>
        ) : !loading && !error ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <BlogCard article={article} labelMap={labelMap} colorIndex={i} />
                </motion.div>
              ))}
            </motion.div>

            {/* 加载更多 */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 text-sm font-semibold rounded-full border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-[var(--color-bg-secondary)]/30 hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/50 transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      加载中...
                    </span>
                  ) : (
                    '加载更多文章 ↓'
                  )}
                </button>
              </motion.div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
