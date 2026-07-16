import { type ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
}

export default function GlitchText({
  children,
  as: Tag = 'h1',
  className = '',
}: GlitchTextProps) {
  return (
    <>
      <Tag
        className={`relative inline-block glitch-text ${className}`}
        data-text={typeof children === 'string' ? children : undefined}
      >
        {children}
      </Tag>
      <style>{`
        .glitch-text { position: relative; letter-spacing: -0.02em; }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          opacity: 0;
        }
        .glitch-text::before {
          color: #00f0ff;
          z-index: -1;
          animation: g1 3.5s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%);
        }
        .glitch-text::after {
          color: #ff00ff;
          z-index: -2;
          animation: g2 2.5s infinite reverse;
          clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%);
        }
        @keyframes g1 {
          0% { transform: translate(0); opacity: 0; }
          3% { transform: translate(-3px, 2px); opacity: 0.7; }
          6% { transform: translate(2px, -1px); opacity: 0.6; }
          9% { transform: translate(0); opacity: 0; }
          100% { transform: translate(0); opacity: 0; }
        }
        @keyframes g2 {
          0% { transform: translate(0); opacity: 0; }
          4% { transform: translate(3px, -1px); opacity: 0.6; }
          8% { transform: translate(-2px, 2px); opacity: 0.7; }
          12% { transform: translate(0); opacity: 0; }
          100% { transform: translate(0); opacity: 0; }
        }
        .glitch-text:hover::before {
          animation: gskew1 0.35s ease-in-out infinite alternate;
          opacity: 0.75;
        }
        .glitch-text:hover::after {
          animation: gskew2 0.25s ease-in-out infinite alternate;
          opacity: 0.75;
        }
        @keyframes gskew1 {
          0% { transform: translate(0); }
          25% { transform: translate(-4px, 2px); }
          50% { transform: translate(4px, -2px); }
          75% { transform: translate(-2px, -3px); }
          100% { transform: translate(2px, 3px); }
        }
        @keyframes gskew2 {
          0% { transform: translate(0); }
          25% { transform: translate(4px, -2px); }
          50% { transform: translate(-3px, 3px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(-2px, -2px); }
        }
      `}</style>
    </>
  );
}
