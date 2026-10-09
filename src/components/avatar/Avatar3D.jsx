import { Suspense, useState, useEffect, useRef, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import { ProceduralBoy } from './ProceduralBoy';
import { useReducedMotion } from '../../hooks';

/**
 * Tries to load /models/avatar.glb if present; otherwise lets fallback take over.
 */
function ModelOrProceduralAvatar({ mouseHover }) {
  const [modelError, setModelError] = useState(false);

  if (modelError) {
    return <ProceduralBoy mouseHover={mouseHover} />;
  }

  return (
    <Suspense fallback={<ProceduralBoy mouseHover={mouseHover} />}>
      <ExternalAvatarModel
        onError={() => setModelError(true)}
        mouseHover={mouseHover}
      />
    </Suspense>
  );
}

function ExternalAvatarModel({ onError, mouseHover }) {
  try {
    const gltf = useGLTF('/models/avatar.glb', true);
    if (!gltf || !gltf.scene) {
      return <ProceduralBoy mouseHover={mouseHover} />;
    }
    return (
      <primitive
        object={gltf.scene}
        position={[0, -1.2, 0]}
        scale={[1.2, 1.2, 1.2]}
      />
    );
  } catch {
    onError();
    return <ProceduralBoy mouseHover={mouseHover} />;
  }
}

/**
 * Simple Error Boundary for WebGL failures
 */
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * 2D Fallback badge when WebGL is disabled or unavailable
 */
function StaticAvatarFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 rounded-3xl bg-surface border border-border text-center">
      <div className="w-24 h-24 rounded-full bg-surface-elevated border border-accent/30 flex items-center justify-center font-display text-3xl font-bold text-accent mb-4 shadow-[0_0_30px_rgba(198,255,61,0.2)]">
        MA
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg">Muhammad Attique</h3>
      <p className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">Software Engineer</p>
    </div>
  );
}

export function Avatar3D({ className = '', height = '520px' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Pause rendering when off-screen to preserve battery/GPU
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!webGLSupported) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <StaticAvatarFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      <WebGLErrorBoundary fallback={<StaticAvatarFallback />}>
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          dpr={[1, 2]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 4.2], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Subtle Ambient Light */}
          <ambientLight intensity={0.65} />

          {/* Key Light (Front-Right Warm Light) */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.2}
            color="#FFF6EE"
          />

          {/* Cool Rim Light (Back-Left to separate silhouette from dark background) */}
          <directionalLight
            position={[-4, 3, -3]}
            intensity={1.6}
            color="#A8B8FF"
          />

          {/* Signature Accent Lime Bounce Light (Underneath) */}
          <pointLight
            position={[0, -2, 1.5]}
            intensity={0.8}
            color="#C6FF3D"
            distance={5}
          />

          {/* Character Suspense Wrapper */}
          <Suspense fallback={null}>
            {reducedMotion ? (
              <ModelOrProceduralAvatar mouseHover={isHovered} />
            ) : (
              <Float
                speed={1.6}
                rotationIntensity={0.2}
                floatIntensity={0.3}
                floatingRange={[-0.05, 0.05]}
              >
                <ModelOrProceduralAvatar mouseHover={isHovered} />
              </Float>
            )}
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating interactive indicator badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-muted tracking-widest uppercase pointer-events-none flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        <span>INTERACTIVE 3D AVATAR</span>
      </div>
    </div>
  );
}

// Preload avatar model if it exists
try {
  useGLTF.preload('/models/avatar.glb');
} catch {
  // Ignored if missing
}
