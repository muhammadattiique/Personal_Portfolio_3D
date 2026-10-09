import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useIsMobile } from '../../hooks';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default', 'pointer', 'view'
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile(1024);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const viewElement = target.closest('[data-cursor="view"]');
      if (viewElement) {
        setCursorType('view');
        return;
      }

      const interactiveElement = target.closest('a, button, input, textarea, [role="button"]');
      if (interactiveElement) {
        setCursorType('pointer');
        return;
      }

      setCursorType('default');
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isMobile, reducedMotion, isVisible]);

  if (isMobile || reducedMotion || !isVisible) {
    return null;
  }

  const isView = cursorType === 'view';
  const isPointer = cursorType === 'pointer';

  return (
    <>
      {/* Central dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999] rounded-full bg-accent"
        animate={{
          x: mousePosition.x - (isView ? 40 : isPointer ? 12 : 4),
          y: mousePosition.y - (isView ? 40 : isPointer ? 12 : 4),
          width: isView ? 80 : isPointer ? 24 : 8,
          height: isView ? 80 : isPointer ? 24 : 8,
          opacity: isView ? 1 : isPointer ? 0.35 : 1,
          backgroundColor: isView ? '#C6FF3D' : '#C6FF3D',
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 28,
          mass: 0.1,
        }}
      >
        {isView && (
          <div className="w-full h-full flex items-center justify-center font-mono text-[11px] font-bold tracking-widest text-background uppercase">
            VIEW
          </div>
        )}
      </motion.div>

      {/* Outer subtle follower ring */}
      {!isView && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[998] rounded-full border border-white/20"
          animate={{
            x: mousePosition.x - (isPointer ? 20 : 16),
            y: mousePosition.y - (isPointer ? 20 : 16),
            width: isPointer ? 40 : 32,
            height: isPointer ? 40 : 32,
            borderColor: isPointer ? 'rgba(198, 255, 61, 0.4)' : 'rgba(255, 255, 255, 0.2)',
          }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 22,
            mass: 0.2,
          }}
        />
      )}
    </>
  );
}

