import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks';

/**
 * Image-based speaking avatar that feels alive:
 *   - CURSOR TRACKING: the portrait tilts / shifts toward the pointer (3D
 *     parallax), easing back to center when the mouse leaves.
 *   - SPEAKING: while `speaking` is true it looks like it is talking — a clipped
 *     lower-face "jaw" strip squashes/stretches on a randomized rhythm, the head
 *     gently bobs, and a soft glow pulses near the mouth. One flat image can't
 *     open a real mouth, so this layered motion is what sells the talking.
 * Honors prefers-reduced-motion (static, no motion).
 *
 * Props:
 *   - speaking: boolean — drives the talking animation
 *   - src: image path (defaults to /avatar.webp)
 *   - className / height: layout passthrough (matches the old Avatar3D API)
 */
export function AvatarImage({
  speaking = false,
  src = '/avatar.webp',
  className = '',
  height = '100%',
}) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const sceneRef = useRef(null); // the tilting 3D scene wrapper
  const jawRef = useRef(null); // clipped lower-face strip for the "mouth"
  const rafRef = useRef(0);

  // Pointer target (normalized -1..1) and current eased values.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [hovering, setHovering] = useState(false);

  // --- Cursor tracking: track pointer position relative to the panel ---------
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1..1
      target.current.x = Math.max(-1, Math.min(1, nx));
      target.current.y = Math.max(-1, Math.min(1, ny));
    };
    // Track across the whole window so the avatar "looks" at the cursor even
    // when the pointer is outside the panel (common for a hero avatar).
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  // --- Animation loop: ease tilt toward target + drive talking jaw -----------
  useEffect(() => {
    if (reducedMotion) {
      // Reset to neutral, no loop.
      if (sceneRef.current) sceneRef.current.style.transform = '';
      if (jawRef.current) jawRef.current.style.transform = '';
      return;
    }

    const loop = (now) => {
      const t = now / 1000;
      // Ease current tilt toward the pointer target.
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;

      const rotY = current.current.x * 8; // deg, left/right
      const rotX = -current.current.y * 6; // deg, up/down
      const transX = current.current.x * 6; // px parallax
      const bob = speaking ? Math.sin(t * 7) * 2.2 : 0; // talking head bob (px)

      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) ` +
          `translateX(${transX}px) translateY(${bob}px)`;
      }

      // Talking "jaw": squash/stretch the clipped lower-face strip with a
      // randomized rhythm so it reads as speech, not a loop.
      if (jawRef.current) {
        let openY = 1;
        if (speaking) {
          const base = Math.abs(Math.sin(t * 11));
          const jitter = Math.sin(t * 23.3) * 0.25 + Math.sin(t * 7.1) * 0.15;
          openY = 1 + Math.max(0, base + jitter) * 0.12; // up to ~12% stretch
        }
        jawRef.current.style.transform = `scaleY(${openY})`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion, speaking]);

  const animateGlow = speaking && !reducedMotion;

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        target.current.x = 0;
        target.current.y = 0;
      }}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {/* Tilting 3D scene wrapper (cursor parallax + talking bob applied here) */}
      <div
        ref={sceneRef}
        className="relative w-full h-full will-change-transform"
        style={{ transformStyle: 'preserve-3d', transition: hovering ? 'none' : 'transform 0.3s ease-out' }}
      >
        {/* Base portrait */}
        <img
          src={src}
          alt="3D illustrated portrait of Muhammad Attique"
          draggable={false}
          className="block w-full h-full object-cover object-top"
        />

        {/* Talking "jaw": a copy of the SAME image, clipped to the lower-face
            band and anchored at the top of that band, so scaling it on Y makes
            the chin/mouth area move like a jaw while keeping the rest aligned. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: 'inset(52% 22% 14% 22%)' }}
        >
          <img
            ref={jawRef}
            src={src}
            alt=""
            draggable={false}
            className="block w-full h-full object-cover object-top will-change-transform"
            style={{ transformOrigin: 'center 52%' }}
          />
        </div>

        {/* Soft speaking glow near the mouth area */}
        {animateGlow && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 w-32 h-32 rounded-full bg-accent/25 blur-2xl avatar-mouth-glow"
          />
        )}
      </div>
    </div>
  );
}
