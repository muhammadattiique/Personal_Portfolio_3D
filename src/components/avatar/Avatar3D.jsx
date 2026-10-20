import { Suspense, useState, useEffect, useRef, useMemo, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarImage } from './AvatarImage';
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
function ModelOrProceduralAvatar({ speaking }) {
  // While the GLB streams in, render nothing inside the Canvas (null) — the
  // image portrait behind the transparent Canvas shows through until the 3D
  // model is ready, then the model draws on top of it.
  return (
    <Suspense fallback={null}>
      <ExternalAvatarModel speaking={speaking} />
    </Suspense>
  );
}

function ExternalAvatarModel({ speaking }) {
  // Hook is called unconditionally at the top; load failure (network/CDN/decode)
  // surfaces as a thrown promise/error during render and is handled by the
  // surrounding ModelErrorBoundary, not a try/catch here.
  const gltf = useGLTF(AVATAR_GLB_URL);
  const groupRef = useRef();

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

  useFrame((state, delta) => {
    // CURSOR TRACKING: smoothly rotate the whole model toward the pointer so the
    // avatar "looks at" the cursor, easing back to center.
    if (groupRef.current) {
      const px = state.pointer.x; // -1..1
      const py = state.pointer.y; // -1..1
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, px * 0.5, delta * 4
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, -py * 0.25, delta * 4
      );
    }

    // LIP-SYNC: drive the mouth morph target(s) while speaking.
    if (lipSyncTargets.length) {
      const t = state.clock.elapsedTime;
      for (const { mesh, index } of lipSyncTargets) {
        const influences = mesh?.morphTargetInfluences;
        if (!influences || !Number.isInteger(index) || index >= influences.length) continue;
        if (speaking) {
          const target = Math.min(
            1,
            Math.abs(Math.sin(t * 11)) * (0.45 + Math.random() * 0.4)
          );
          influences[index] = target;
        } else {
          influences[index] = THREE.MathUtils.lerp(influences[index] || 0, 0, 0.3);
        }
      }
    }
  });

  if (!gltf || !gltf.scene) {
    // Model object missing — show the image portrait instead.
    return null;
  }

  // Framed for head-and-shoulders in the square panel under the existing
  // camera (position [0,0,4.2], fov 42).
  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} position={[0, -1.5, 0]} scale={1.45} />
    </group>
  );
}

/**
 * Error boundary that, on any error from its children (a GLB model load/decode
 * failure, or a WebGL/Canvas failure), renders nothing AND calls onError so the
 * parent can reveal the image-portrait fallback layered behind the Canvas.
 */
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * The avatar is a Ready Player Me 3D model loaded at runtime from the RPM CDN
 * and rendered on a transparent WebGL Canvas. The AvatarImage portrait
 * (public/avatar.webp) is layered BEHIND the Canvas and acts as the fallback:
 *   - it shows while the model streams in, and
 *   - it remains visible if the model fails to load, WebGL is unavailable, or
 *     the Canvas errors (in which case the Canvas is hidden).
 * The 3D model tracks the cursor and lip-syncs while `speaking` is true; the
 * image fallback has its own cursor-tracking + talking animation, so the avatar
 * always feels alive either way.
 */
export function Avatar3D({ className = '', height = '520px', speaking = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [canvasFailed, setCanvasFailed] = useState(false);
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

  const showCanvas = webGLSupported && !canvasFailed;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {/* Base layer: the image portrait. Always rendered; the 3D Canvas sits on
          top of it (transparent) when the model is available. */}
      <div className="absolute inset-0">
        <AvatarImage speaking={speaking} height="100%" className="h-full w-full" />
      </div>

      {/* 3D model layer (transparent Canvas) on top of the portrait. */}
      {showCanvas && (
        <div className="absolute inset-0">
          <CanvasErrorBoundary onError={() => setCanvasFailed(true)}>
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
              <ambientLight intensity={0.65} />
              <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FFF6EE" />
              <directionalLight position={[-4, 3, -3]} intensity={1.6} color="#A8B8FF" />
              <pointLight position={[0, -2, 1.5]} intensity={0.8} color="#4F8CFF" distance={5} />

              <Suspense fallback={null}>
                {reducedMotion ? (
                  <ModelOrProceduralAvatar speaking={speaking} />
                ) : (
                  <Float
                    speed={1.6}
                    rotationIntensity={0.2}
                    floatIntensity={0.3}
                    floatingRange={[-0.05, 0.05]}
                  >
                    <ModelOrProceduralAvatar speaking={speaking} />
                  </Float>
                )}
              </Suspense>
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      )}
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
