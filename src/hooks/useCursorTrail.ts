import { useEffect, useRef } from 'react';

interface TrailDot {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function useCursorTrail() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const maxDots = 10;

  useEffect(() => {
    // Create neon crosshair cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="3" fill="#00f0ff" opacity="0.9"/>
      <circle cx="14" cy="14" r="8" fill="none" stroke="#00f0ff" stroke-width="0.8" opacity="0.5"/>
      <line x1="14" y1="0" x2="14" y2="5" stroke="#00f0ff" stroke-width="0.6" opacity="0.4"/>
      <line x1="14" y1="23" x2="14" y2="28" stroke="#00f0ff" stroke-width="0.6" opacity="0.4"/>
      <line x1="0" y1="14" x2="5" y2="14" stroke="#00f0ff" stroke-width="0.6" opacity="0.4"/>
      <line x1="23" y1="14" x2="28" y2="14" stroke="#00f0ff" stroke-width="0.6" opacity="0.4"/>
    </svg>`;
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%); line-height: 1;
      transition: transform 0.1s ease;
      filter: drop-shadow(0 0 6px rgba(0,240,255,0.6));
    `;
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    // Trail container
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;';
    document.body.appendChild(trail);
    trailRef.current = trail;

    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.4)';
        cursorRef.current.style.filter = 'drop-shadow(0 0 12px rgba(180,0,255,0.8))';
      }
    };
    const onLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRef.current.style.filter = 'drop-shadow(0 0 6px rgba(0,240,255,0.6))';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const sel = 'a, button, [role="button"], input, textarea, select, [tabindex]';
    const attach = () => {
      document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      const { x: tx, y: ty } = mouseRef.current;
      const cur = currentRef.current;
      cur.x += (tx - cur.x) * 0.18;
      cur.y += (ty - cur.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cur.x}px`;
        cursorRef.current.style.top = `${cur.y}px`;
      }

      const dots = dotsRef.current;
      dots.push({ x: cur.x, y: cur.y, size: 5, opacity: 0.55 });
      while (dots.length > maxDots) dots.shift();

      if (trailRef.current) {
        trailRef.current.innerHTML = '';
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          d.opacity -= 0.04;
          d.size -= 0.25;
          if (d.opacity <= 0 || d.size <= 0) continue;
          const el = document.createElement('div');
          el.style.cssText = `
            position:fixed;top:${d.y}px;left:${d.x}px;
            width:${Math.max(d.size,1)}px;height:${Math.max(d.size,1)}px;
            border-radius:50%;background:#00f0ff;
            opacity:${Math.max(d.opacity,0)};
            transform:translate(-50%,-50%);pointer-events:none;
            box-shadow:0 0 ${d.size*2}px rgba(0,240,255,0.5);
          `;
          trailRef.current.appendChild(el);
        }
        dotsRef.current = dots.filter((d) => d.opacity > 0 && d.size > 0);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      document.body.classList.remove('custom-cursor-active');
      cursorRef.current?.remove();
      trailRef.current?.remove();
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);
}
