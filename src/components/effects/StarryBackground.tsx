import { useRef } from 'react';
import { useStarryBackground } from '@/hooks/useStarryBackground';

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarryBackground(canvasRef, 120);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
