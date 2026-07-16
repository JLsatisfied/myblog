import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NeonParticles from '@/components/effects/NeonParticles';
import StarryBackground from '@/components/effects/StarryBackground';
import CursorTrail from '@/components/effects/CursorTrail';
import AnimatedGradient from '@/components/effects/AnimatedGradient';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedGradient />
      <StarryBackground />
      <NeonParticles count={isHome ? 60 : 30} active={true} />
      <CursorTrail />
      <Navbar />

      {isHome ? (
        <main className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          <Outlet />
        </main>
      ) : (
        <>
          <main className="relative z-10 flex-1 flex items-start justify-center px-6 py-12">
            <div className="w-full max-w-4xl xl:max-w-6xl">
              <Outlet />
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
