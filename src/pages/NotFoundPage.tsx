import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Terminal } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="mb-6"
      >
        <div className="relative">
          <Terminal size={80} className="text-[var(--color-accent)] opacity-30" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-black font-mono text-[var(--color-accent)]">
            404
          </span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl sm:text-2xl font-black font-mono text-[var(--color-text-primary)] mb-3 text-center"
      >
        SEGMENTATION FAULT
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xs sm:text-sm font-mono text-[var(--color-text-secondary)] mb-8 text-center max-w-md leading-relaxed"
      >
        <span className="text-[var(--color-accent)]">{'>'}</span> Accessing memory at 0x00000404...
        <br />
        <span className="text-[var(--color-purple)]">{'>'}</span> Page not found in this dimension.
        <br />
        <span className="text-[var(--color-green)]">{'>'}</span> Try returning to root directory.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-bold font-mono text-sm tracking-wider shadow-[var(--shadow-neon)] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-shadow"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          <Home size={16} />
          cd /
        </Link>
      </motion.div>
    </div>
  );
}
