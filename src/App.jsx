import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { useReducedMotion } from './hooks';

// Code-split pages for high Lighthouse performance
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>LOADING...</span>
      </div>
    </div>
  );
}

// Scroll restoration helper
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If navigating to an anchor like #work, scroll to element
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    // Otherwise reset scroll to top on page navigation
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const reducedMotion = useReducedMotion();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);
    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.lenis;
    };
  }, [reducedMotion]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background font-sans antialiased relative">
      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Sticky Editorial Navbar */}
      <Navbar />

      {/* Main Routed Content */}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}