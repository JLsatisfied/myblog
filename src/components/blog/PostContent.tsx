import { type Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';

interface PostContentProps { content: string }

export const postContentComponents: Components = {
  h1: ({ children, id, ...props }) => (
    <h1 id={id} className="text-xl sm:text-2xl font-extrabold mt-14 mb-6 text-[var(--color-text-primary)] scroll-mt-28">
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="text-lg sm:text-xl font-extrabold mt-16 mb-6 text-[var(--color-accent)] border-l-4 border-[var(--color-accent)] pl-5 rounded-l-sm scroll-mt-28">
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="text-base sm:text-lg font-bold mt-12 mb-5 text-[var(--color-text-primary)] scroll-mt-28">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[var(--color-text-primary)] text-sm sm:text-base leading-[1.9]">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-[var(--color-accent)] font-medium underline decoration-[var(--color-accent)]/30 underline-offset-4 hover:text-[var(--color-purple)] transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-6 space-y-3 text-[var(--color-text-primary)] text-sm sm:text-base list-none pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 space-y-3 text-[var(--color-text-primary)] text-sm sm:text-base list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-3">
      <span className="text-[var(--color-accent)] shrink-0">●</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[var(--color-accent)] pl-6 py-5 my-8 bg-[var(--color-bg-secondary)]/50 rounded-r-2xl text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const inline = !className;
    return inline ? (
      <code className="px-2 py-0.5 text-sm rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-accent)] font-mono border border-[var(--color-border)]/30">
        {children}
      </code>
    ) : (
      <code className={`block p-6 overflow-x-auto text-sm font-mono bg-[var(--color-bg-secondary)]/50 rounded-2xl border border-[var(--color-border)]/20 ${className ?? ''}`}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-8 rounded-2xl border border-[var(--color-border)]/20 bg-[var(--color-bg-secondary)]/50 overflow-hidden">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-2xl border border-[var(--color-border)]/20">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[var(--color-bg-secondary)]/50">{children}</thead>,
  th: ({ children }) => (
    <th className="px-5 py-3 text-left font-bold text-[var(--color-accent)] text-sm border-b border-[var(--color-border)]/20">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3 border-t border-[var(--color-border)]/10 text-[var(--color-text-primary)] text-sm">{children}</td>
  ),
  hr: () => <hr className="my-12 border-[var(--color-border)]/20" />,
  img: ({ alt, src }) => (
    <img src={src} alt={alt} className="my-8 max-w-full rounded-2xl border border-[var(--color-border)]/20" loading="lazy" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[var(--color-accent)]">{children}</strong>
  ),
};

export default function PostContent({ content }: PostContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]} components={postContentComponents}>
      {content}
    </ReactMarkdown>
  );
}
