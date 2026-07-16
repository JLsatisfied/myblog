import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  alphaDir: number;
}

const COLORS = [
  'rgba(0, 240, 255, OPACITY)',
  'rgba(180, 0, 255, OPACITY)',
  'rgba(0, 255, 136, OPACITY)',
  'rgba(100, 140, 255, OPACITY)',
];

export function useNeonParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count = 60,
) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef(0);
  const connectionDist = 160;

  const init = useCallback((w: number, h: number) => {
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.6 + 0.2,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
    particlesRef.current = p;
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(canvas.width, canvas.height);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Alpha pulse
        p.alpha += p.alphaDir * 0.005;
        if (p.alpha >= 0.8) p.alphaDir = -1;
        if (p.alpha <= 0.15) p.alphaDir = 1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('OPACITY', String(p.alpha));
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('OPACITY', String(p.alpha * 0.1));
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDist) {
            const lineAlpha = ((connectionDist - dist) / connectionDist) * Math.min(p.alpha, q.alpha) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction - attract nearby particles
        const mdx = mx - p.x;
        const mdy = my - p.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 200 && mDist > 0 && mx > 0) {
          const force = (200 - mDist) / 200 * 0.15;
          p.vx += mdx / mDist * force;
          p.vy += mdy / mDist * force;
          // Dampen velocity
          p.vx *= 0.995;
          p.vy *= 0.995;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(animRef.current);
      else animate();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [canvasRef, init]);
}
