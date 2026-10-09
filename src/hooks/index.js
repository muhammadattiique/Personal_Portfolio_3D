import { useState, useEffect } from 'react';

/**
 * Tracks normalized or screen mouse coordinates
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      setPosition({ x: e.clientX, y: e.clientY, normalizedX, normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

/**
 * Mobile breakpoint detector
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Reduced motion preference
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}