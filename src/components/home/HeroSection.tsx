import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import GlitchText from '@/components/effects/GlitchText';
import Button from '@/components/ui/Button';
import { SITE_NAME, SITE_DESCRIPTION } from '@/utils/constants';

export default function HeroSection() {
  return (
    <section className="relative min-h-[93vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto relative z-10">
        {/* Terminal-style prefix */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Terminal size={16} className="text-[var(--color-accent)]" />
          <span className="text-xs font-mono text-[var(--color-accent)] tracking-wider">
            root@nexus:~$ ./init_sequence.sh
          </span>
        </motion.div>

        {/* Neon divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto mb-8"
        />

        {/* Main title */}
        <GlitchText as="h1" className="block text-5xl sm:text-6xl md:text-8xl font-black mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-purple)] to-[var(--color-accent)] bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
        </GlitchText>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl font-mono font-light text-[var(--color-accent)] mb-3 tracking-wider"
        >
          NEXUS EDGE
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-10 font-mono"
        >
          <span className="text-[var(--color-purple)]">{'>'}</span> {SITE_DESCRIPTION}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/blog">
            <Button variant="primary" size="lg">
              <Terminal size={16} />
              进入博客
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" size="lg">
              ./about.sh
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-[var(--color-text-secondary)] tracking-widest">
            SCROLL
          </span>
          <ChevronDown size={16} className="text-[var(--color-accent)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
