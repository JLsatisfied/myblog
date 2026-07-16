import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { ArticleItem, LabelItem } from '@/types/api';
import { formatDate } from '@/utils/date';
import Card from '@/components/ui/Card';

interface BlogCardProps {
  article: ArticleItem;
  /** 标签列表，用于将 label UUID 映射为名称和颜色 */
  labelMap?: Map<string, LabelItem>;
  /** 颜色预设，按索引循环分配 */
  colorIndex?: number;
}

const PRESET_COLORS = ['#4DC9FF', '#C44DFF', '#44E680', '#FF9F43', '#FF4D6A', '#FF6B9D'];

/** 根据文章阅读量估算阅读时间（中文约 400 字/分钟） */
function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = text.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length;
  const totalWords = chineseChars + englishWords;
  return Math.max(1, Math.ceil(totalWords / 400));
}

export default function BlogCard({ article, labelMap, colorIndex = 0 }: BlogCardProps) {
  // 解析 label UUID 数组 → LabelItem 对象（接口返回 label 已是数组）
  const labelIds: string[] = Array.isArray(article.label) ? article.label : [];
  const labels = labelIds.map((id) => labelMap?.get(id)).filter(Boolean) as LabelItem[];

  // 第一个标签决定分类色
  const accentColor = labels[0] && labelMap
    ? PRESET_COLORS[([...labelMap.keys()].indexOf(labels[0].name)) % PRESET_COLORS.length]
    : PRESET_COLORS[colorIndex % PRESET_COLORS.length];

  // 标签最多展示 3 个
  const showLabels = labels.slice(0, 3);
  const overflow = labels.length - 3;

  return (
    <Link to={`/blog/${article.id}`} className="block group h-full">
      <Card
        className="h-full flex flex-col overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300"
        glass={false}
        hover={false}
      >
        {/* Glow accent bar at top */}
        <div
          className="h-0.5 w-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 6px ${accentColor}66`,
          }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* ── 标签 + 日期 ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-1.5">
              {showLabels.length > 0 ? (
                <>
                  {showLabels.map((label) => (
                    <span
                      key={label.id}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded-full"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}12`,
                        border: `1px solid ${accentColor}30`,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full text-[var(--color-text-secondary)]/50 border border-transparent">
                      …
                    </span>
                  )}
                </>
              ) : (
                <span
                  className="px-2.5 py-1 text-[10px] font-semibold rounded-full border border-transparent"
                  style={{ color: accentColor }}
                >
                  文章
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-[var(--color-text-secondary)] flex items-center gap-1 shrink-0 ml-3">
              <Calendar size={11} />
              {formatDate(article.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
            {article.name}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[var(--color-text-secondary)] mb-5 line-clamp-2 flex-1 leading-relaxed">
            {article.introduction}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <span className="flex items-center gap-1 text-xs font-mono text-[var(--color-text-secondary)]">
              <Clock size={12} />
              {estimateReadingTime(article.text)} min
            </span>

            <span className="flex items-center gap-1 text-xs font-mono text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
              阅读 <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export { estimateReadingTime };
export { PRESET_COLORS };
