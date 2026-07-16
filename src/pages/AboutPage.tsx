import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Loader2, Globe, BookOpen } from 'lucide-react';
import { getAbout, getResume, getProjects, getSettings } from '@/services/api';
import PostContent from '@/components/blog/PostContent';
import type { ArticleItem, ResumeItem, ProjectItem, SettingInfo } from '@/types/api';

// ─── 常量 ────────────────────────────────────────
const SKILL_COLORS = ['#4DC9FF', '#C44DFF', '#44E680', '#FF9F43', '#FF4D6A', '#FF6B9D'];
const PROJECT_ICONS = ['🚀', '🔧', '🎯', '💡', '⚡', '🧩'];

const defaultSkills = [
  { name: 'React / Next.js', pct: 92, color: '#4DC9FF' },
  { name: 'TypeScript', pct: 88, color: '#C44DFF' },
  { name: 'Node.js / Bun', pct: 82, color: '#44E680' },
  { name: 'Rust / WASM', pct: 65, color: '#FF9F43' },
  { name: 'Three.js / WebGL', pct: 70, color: '#FF4D6A' },
  { name: '系统架构设计', pct: 78, color: '#FF6B9D' },
];

const defaultTools = [
  { name: 'Arch Linux', icon: '🐧', color: '#4DC9FF' },
  { name: 'Neovim', icon: '💀', color: '#44E680' },
  { name: 'Docker', icon: '🐳', color: '#C44DFF' },
  { name: 'Three.js', icon: '🔺', color: '#FF4D6A' },
  { name: 'Blender', icon: '🔲', color: '#FF9F43' },
  { name: 'Figma', icon: '🎨', color: '#FF6B9D' },
];

// ─── 子组件 ──────────────────────────────────────

/** 区块标题 */
function SectionTitle({ label }: { label: string }) {
  return (
    <div className="mb-8 space-y-2">
      <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)]">{label}</h2>
      <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)]" />
    </div>
  );
}

/** 技能条 */
function SkillBar({
  name,
  value,
  color,
  delay,
  intro,
}: {
  name: string;
  value: number;
  color: string;
  delay: number;
  intro?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="flex items-end justify-between mb-2">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">{name}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, value)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.15, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}60)`,
            boxShadow: `0 0 10px ${color}50`,
          }}
        />
      </div>
      {intro && <p className="text-xs text-[var(--color-text-secondary)]/60 mt-1.5">{intro}</p>}
    </motion.div>
  );
}

/** 统计卡片 */
function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)]/40 border border-[var(--color-border)]/10"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <span className="text-2xl font-extrabold font-mono" style={{ color }}>
        {value}
      </span>
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">
        {label}
      </span>
    </motion.div>
  );
}

// ─── 主组件 ──────────────────────────────────────

export default function AboutPage() {
  const [aboutArticle, setAboutArticle] = useState<ArticleItem | null>(null);
  const [resumeList, setResumeList] = useState<ResumeItem[]>([]);
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<SettingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAbout().then((r) => { if (r.code === 200) setAboutArticle(r.data); }).catch(() => {}),
      getResume().then((r) => { if (r.code === 200) setResumeList(r.data); }).catch(() => {}),
      getProjects().then((r) => { if (r.code === 200) setProjectList(r.data); }).catch(() => {}),
      getSettings().then((r) => { if (r.code === 200) setSettings(r.data); }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const uptime = new Date().getFullYear() - 2018;
  const hasResume = resumeList.length > 0;
  const hasProjects = projectList.length > 0;

  // 构建社交链接（移除内联事件处理器）
  const socialLinks = [];
  if (settings?.github) socialLinks.push({ href: settings.github, label: 'GitHub', icon: Globe, color: '#4DC9FF' });
  if (settings?.juejin) socialLinks.push({ href: settings.juejin, label: '掘金', icon: BookOpen, color: '#C44DFF' });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-16">
      {/* ════════════════ Header ════════════════ */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-[var(--color-bg-secondary)]/20 border border-[var(--color-border)]/10 p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 背景装饰 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--color-accent)]/3 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-[var(--color-purple)]/3 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-[var(--color-accent)]/40 to-[var(--color-purple)]/40 scale-125" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-purple)] p-[2px] shadow-xl shadow-[var(--color-accent)]/15">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center overflow-hidden">
                {settings?.imgs ? (
                  <img src={settings.imgs} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-3xl">⚡</span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
                {settings?.name ?? 'KAI'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--color-green)]/10 border border-[var(--color-green)]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
                <span className="text-[10px] font-bold text-[var(--color-green)] tracking-wider">ONLINE</span>
              </span>
            </div>
            <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[var(--color-text-secondary)] mb-3">
              <MapPin size={13} className="text-[var(--color-accent)]" />
              连续运行 {uptime} 年 · 状态良好
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]/80 leading-relaxed max-w-md">
              硬核 ACG 爱好者 · 底层技术狂热者 · 开源贡献者。用代码解构世界，在二次元中寻找秩序与美感。
            </p>
          </div>
        </div>
      </motion.div>

      {/* ════════════════ Stats + Social ════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 统计 */}
        <StatCard value={`${uptime}+`} label="Years Running" color="#4DC9FF" />
        <StatCard value={hasProjects ? `${projectList.length}` : '6+'} label="Projects" color="#C44DFF" />
        <StatCard value="50+" label="Blog Posts" color="#44E680" />
        <StatCard value="99.9%" label="Uptime" color="#FF9F43" />

        {/* 社交 */}
        {socialLinks.length > 0 && (
          <div className="col-span-2 sm:col-span-4 flex flex-wrap justify-center gap-3 mt-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: link.color,
                  borderColor: `${link.color}30`,
                }}
              >
                <link.icon size={16} />
                {link.label}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════ 关于我 + 技术能力（双栏） ════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 左栏：关于我 */}
        <div className="lg:col-span-3">
          <SectionTitle label="关于我" />
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="text-[var(--color-accent)] animate-spin" />
            </div>
          ) : aboutArticle ? (
            <motion.div
              className="rounded-2xl bg-[var(--color-bg-secondary)]/10 border border-[var(--color-border)]/5 p-6 sm:p-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <PostContent content={aboutArticle.text} />
            </motion.div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]/60 text-center py-12">暂无内容</p>
          )}
        </div>

        {/* 右栏：技术能力 */}
        <div className="lg:col-span-2">
          <SectionTitle label="技术能力" />
          <motion.div
            className="rounded-2xl bg-[var(--color-bg-secondary)]/10 border border-[var(--color-border)]/5 p-6 sm:p-8 space-y-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {(hasResume ? resumeList : []).length > 0
              ? resumeList.map((item, i) => (
                  <SkillBar
                    key={item.id}
                    name={item.name}
                    value={item.weight}
                    color={SKILL_COLORS[i % SKILL_COLORS.length]}
                    delay={0.1 + i * 0.05}
                    intro={item.introduction}
                  />
                ))
              : defaultSkills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    value={skill.pct}
                    color={skill.color}
                    delay={0.1 + i * 0.05}
                  />
                ))}

            {/* 技能标签云 */}
            <div className="flex flex-wrap gap-2 pt-3">
              {(hasResume ? resumeList : defaultSkills).map((item, i) => {
                const color = SKILL_COLORS[i % SKILL_COLORS.length];
                const name = 'name' in item ? item.name : item.name;
                return (
                  <span
                    key={name}
                    className="px-3 py-1 text-[10px] font-semibold rounded-full transition-colors hover:scale-105"
                    style={{
                      color,
                      backgroundColor: `${color}14`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════ 项目 / 工具 ════════════════ */}
      <section>
        <div className="mb-10 space-y-2 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)]">
            {hasProjects ? '开源项目' : '常用工具'}
          </h2>
          <div className="h-0.5 w-10 mx-auto rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)]" />
        </div>

        {hasProjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectList.map((project, i) => {
              const color = SKILL_COLORS[i % SKILL_COLORS.length];
              return (
                <motion.a
                  key={project.id}
                  href={project.urlname || project.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 p-5 rounded-2xl bg-[var(--color-bg-secondary)]/10 border border-[var(--color-border)]/5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-bg-secondary)]/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{PROJECT_ICONS[i % PROJECT_ICONS.length]}</span>
                    <span className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                      {project.name}
                    </span>
                    <ExternalLink size={13} className="text-[var(--color-text-secondary)]/20 group-hover:text-[var(--color-accent)]/60 transition-colors ml-auto shrink-0" />
                  </div>
                  {project.introduction && (
                    <p className="text-xs text-[var(--color-text-secondary)]/70 leading-relaxed">{project.introduction}</p>
                  )}
                  {/* glow bar */}
                  <div
                    className="h-0.5 w-full rounded-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${color}, transparent)`, boxShadow: `0 0 8px ${color}40` }}
                  />
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {defaultTools.map((item, i) => (
              <motion.div
                key={item.name}
                className="flex flex-col items-center gap-3 group cursor-default"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center text-2xl rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                  style={{
                    backgroundColor: `${item.color}14`,
                    border: `2px solid ${item.color}30`,
                    boxShadow: `0 0 20px ${item.color}10`,
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
