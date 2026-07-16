import { motion } from 'framer-motion';

const elements = [
  { text: '⚡', size: 22, x: '3%', y: '10%', delay: 0, dur: 4.5 },
  { text: '◈', size: 18, x: '92%', y: '20%', delay: 0.8, dur: 5 },
  { text: '◆', size: 16, x: '10%', y: '55%', delay: 1.6, dur: 4 },
  { text: '⬡', size: 20, x: '88%', y: '65%', delay: 0.3, dur: 5.5 },
  { text: '◇', size: 14, x: '50%', y: '78%', delay: 2, dur: 3.5 },
  { text: '▣', size: 18, x: '78%', y: '8%', delay: 1.2, dur: 6 },
];

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute select-none text-[var(--color-accent)]"
          style={{
            left: el.x,
            top: el.y,
            fontSize: el.size,
            filter: 'drop-shadow(0 0 6px var(--color-accent-glow))',
            opacity: 0.35,
          }}
          animate={{
            y: [0, -18, 0, 8, 0],
            x: [0, 8, -6, 5, 0],
            rotate: [0, 15, -10, 8, 0],
            opacity: [0.25, 0.5, 0.3, 0.45, 0.25],
          }}
          transition={{
            duration: el.dur,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  );
}
