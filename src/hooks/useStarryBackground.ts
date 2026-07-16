import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  opacity: number;
  phase: number;
  speed: number;
  color: string;
}

const COLORS = [
  'rgba(0, 240, 255, OPACITY)',
  'rgba(180, 0, 255, OPACITY)',
  'rgba(255, 255, 255, OPACITY)',
  'rgba(100, 140, 255, OPACITY)',
  'rgba(0, 255, 136, OPACITY)',
];

export function useStarryBackground(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  starCount = 100,
) {
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);
  const connectDist = 100;

  const create = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        baseX: Math.random() * w, baseY: Math.random() * h,
        radius: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.003,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      create(canvas.width, canvas.height);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });

    let frame = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouseRef.current;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const dx = (mx - canvas.width / 2) / canvas.width;
        const dy = (my - canvas.height / 2) / canvas.height;
        const parallax = s.radius * 25;
        s.x = s.baseX + dx * parallax;
        s.y = s.baseY + dy * parallax;

        const twinkle = Math.sin(frame * s.speed + s.phase) * 0.25 + 0.75;
        const alpha = s.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace('OPACITY', String(alpha));
        ctx.fill();

        if (s.radius > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.color.replace('OPACITY', String(alpha * 0.08));
          ctx.fill();
        }

        for (let j = i + 1; j < stars.length; j++) {
          const q = stars[j];
          const dist = Math.hypot(s.x - q.x, s.y - q.y);
          if (dist < connectDist) {
            const la = ((connectDist - dist) / connectDist) * Math.min(twinkle, 0.5) * 0.1;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${la})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      frame++;
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
  }, [canvasRef, create]);
}
