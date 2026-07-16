import { useRef } from 'react';
import { useNeonParticles } from '@/hooks/useNeonParticles';

interface NeonParticlesProps {
  count?: number;
  active?: boolean;
}

export default function NeonParticles({ count = 60, active = true }: NeonParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!active) return null;
  useNeonParticles(canvasRef, count);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  );
}
