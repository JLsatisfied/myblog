import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-bold shadow-[var(--shadow-neon)] hover:shadow-[0_0_30px_var(--color-accent-glow)] border border-[var(--color-accent)]',
  secondary:
    'glass text-[var(--color-accent)] hover:shadow-[var(--shadow-neon)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]',
  ghost:
    'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] border border-transparent',
};

const sizes = {
  sm: 'px-4 py-1.5 text-xs tracking-wider',
  md: 'px-6 py-2.5 text-sm tracking-wider',
  lg: 'px-8 py-3 text-sm tracking-widest',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 font-mono transition-all ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ clipPath: variant === 'primary' ? 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' : undefined }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
