export default function AnimatedGradient() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -2 }}
      >
        {/* Neon cyan blob */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)',
            top: '-15%',
            left: '-10%',
            animation: 'gradMove1 28s ease-in-out infinite',
            filter: 'blur(100px)',
          }}
        />
        {/* Neon purple blob */}
        <div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(180,0,255,0.10) 0%, transparent 70%)',
            top: '35%',
            right: '-12%',
            animation: 'gradMove2 32s ease-in-out infinite',
            filter: 'blur(100px)',
          }}
        />
        {/* Neon green blob */}
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
            bottom: '5%',
            left: '25%',
            animation: 'gradMove3 24s ease-in-out infinite',
            filter: 'blur(90px)',
          }}
        />
      </div>
      <style>{`
        @keyframes gradMove1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(12%, 15%) scale(1.1); }
          50% { transform: translate(8%, -5%) scale(0.9); }
          75% { transform: translate(-10%, 8%) scale(1.05); }
        }
        @keyframes gradMove2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-15%, -10%) scale(1.15); }
          66% { transform: translate(-8%, 15%) scale(0.9); }
        }
        @keyframes gradMove3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18%, -12%) scale(1.12); }
        }
      `}</style>
    </>
  );
}
