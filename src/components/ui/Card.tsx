import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({
  children,
  hover = true,
  glass = true,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${
        glass
          ? 'glass'
          : 'bg-[var(--color-bg-card)] border border-[var(--color-border)]'
      } shadow-[var(--shadow-card)] ${className}`}
      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
