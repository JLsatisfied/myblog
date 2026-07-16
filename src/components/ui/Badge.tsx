import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({ children, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        color: color ?? undefined,
        border: color ? `1px solid ${color}40` : undefined,
      }}
    >
      {children}
    </span>
  );
}
