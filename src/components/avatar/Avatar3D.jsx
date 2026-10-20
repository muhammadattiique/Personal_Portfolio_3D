import { Suspense, useState, useEffect, useRef, useMemo, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralBoy } from './ProceduralBoy';
import { useReducedMotion } from '../../hooks';

// The avatar is a Ready Player Me (RPM) model loaded AT RUNTIME from the RPM CDN
// in the end-user's browser, so it requires internet in that browser (it is NOT
// bundled or downloaded at build time). Replace AVATAR_GLB_URL with your own RPM
// .glb URL to swap the character. The lip-sync morph-target names below
// ("mouthOpen", "viseme_aa", etc.) only exist because they are requested via the
// ?morphTargets= query param — changing that param changes the available targets.
const AVATAR_GLB_URL =
  'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=mouthOpen,mouthSmile,viseme_aa,viseme_O,viseme_E&textureAtlas=1024&pose=A';

/**
 * Renders the external RPM GLB model, degrading to the procedural boy if the
 * model cannot load/decode. The GLB is tried first; a load/decode/network
 * failure is caught by the surrounding ModelErrorBoundary which falls back to
 * <ProceduralBoy /> (NOT the 2D StaticAvatarFallback — that is reserved for
 * WebGL being unavailable).
 */
function ModelOrProceduralAvatar({ mouseHover, speaking }) {
  return (
    <Suspense fallback={<ProceduralBoy mouseHover={mouseHover} speaking={speaking} />}>
      <ModelErrorBoundary fallback={<ProceduralBoy mouseHover={mouseHover} speaking={speaking} />}>
        <ExternalAvatarModel mouseHover={mouseHover} speaking={speaking} />
      </ModelErrorBoundary>
    </Suspense>
  );
}

function ExternalAvatarModel({ mouseHover, speaking }) {
  // Hook is called unconditionally at the top; load failure (network/CDN/decode)
  // surfaces as a thrown promise/error during render and is handled by the
  // surrounding ModelErrorBoundary, not a try/catch here.
  const gltf = useGLTF(AVATAR_GLB_URL);

  // Collect every mesh that exposes mouth-related morph targets so the lip-sync
  // can drive all of them. Resolve the mouth morph index in priority order and
  // guard fully so a model missing these targets never throws.
  const lipSyncTargets = useMemo(() => {
    const targets = [];
    const scene = gltf?.scene;
    if (!scene) return targets;
    scene.traverse((child) => {
      const dict = child?.morphTargetDictionary;
      const influences = child?.morphTargetInfluences;
      if (!dict || !influences) return;
      const index =
        dict['mouthOpen'] ??
        dict['viseme_aa'] ??
        dict['jawOpen'] ??
        dict['mouthSmile'];
      if (Number.isInteger(index) && index >= 0 && index < influences.length) {
        targets.push({ mesh: child, index });
      }
    });
    return targets;
  }, [gltf?.scene]);

  useFrame((state) => {
    if (!lipSyncTargets.length) return;
    const t = state.clock.elapsedTime;
    for (const { mesh, index } of lipSyncTargets) {
      const influences = mesh?.morphTargetInfluences;
      if (!influences || !Number.isInteger(index) || index >= influences.length) continue;
      if (speaking) {
        const target = Math.min(
          1,
          Math.abs(Math.sin(t * 10)) * (0.4 + Math.random() * 0.4)
        );
        influences[index] = target;
      } else {
        // Ease the mouth shut when not speaking.
        influences[index] = THREE.MathUtils.lerp(influences[index] || 0, 0, 0.3);
      }
    }
  });

  if (!gltf || !gltf.scene) {
    return <ProceduralBoy mouseHover={mouseHover} speaking={speaking} />;
  }

  // Framed for head-and-shoulders in the square panel under the existing
  // camera (position [0,0,4.2], fov 42).
  return <primitive object={gltf.scene} position={[0, -1.5, 0]} scale={1.45} />;
}

/**
 * Dedicated error boundary for the external GLB model. On any model
 * load/decode error it renders its fallback (the 3D ProceduralBoy). This is
 * intentionally separate from WebGLErrorBoundary so a model failure degrades to
 * the procedural 3D boy rather than the 2D badge.
 */
class ModelErrorBoundary extends Component {
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
      <div className="w-24 h-24 rounded-full bg-surface-elevated border border-accent/30 flex items-center justify-center font-display text-3xl font-bold text-accent mb-4 shadow-[0_0_30px_rgba(79,140,255,0.2)]">
        MA
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg">Muhammad Attique</h3>
      <p className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">Software Engineer</p>
    </div>
  );
}

export function Avatar3D({ className = '', height = '520px', speaking = false }) {
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

          {/* Signature Accent Blue Bounce Light (Underneath) */}
          <pointLight
            position={[0, -2, 1.5]}
            intensity={0.8}
            color="#4F8CFF"
            distance={5}
          />

          {/* Character Suspense Wrapper */}
          <Suspense fallback={null}>
            {reducedMotion ? (
              <ModelOrProceduralAvatar mouseHover={isHovered} speaking={speaking} />
            ) : (
              <Float
                speed={1.6}
                rotationIntensity={0.2}
                floatIntensity={0.3}
                floatingRange={[-0.05, 0.05]}
              >
                <ModelOrProceduralAvatar mouseHover={isHovered} speaking={speaking} />
              </Float>
            )}
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

// Preload the RPM avatar model. Loaded at runtime from the Ready Player Me CDN
// (requires internet in the end-user browser); guarded so a missing/unreachable
// model never breaks module evaluation.
try {
  useGLTF.preload(AVATAR_GLB_URL);
} catch {
  // Ignored if the preload cannot start (e.g. offline).
}
