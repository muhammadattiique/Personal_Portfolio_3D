import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks';

// Your real photo-derived 3D model. Export it from a photo-to-3D tool
// (MetaPerson / Ready Player Me / Avaturn) and place it here. Until this file
// exists the component gracefully shows the photo fallback instead.
const MODEL_URL = '/models/my-avatar.glb';
// Static photo fallback (WebGL unavailable, or model missing/failed to load).
const FALLBACK_IMAGE = '/profile-avatar.png';

/**
 * Loads the GLB, plays an idle animation clip if the rig ships one, otherwise
 * applies a procedural idle (breathing + sway). Adds gentle mouse-responsive
 * rotation and lip-syncs mouth morph targets while `speaking` is true.
 */
function AvatarModel({ speaking, reducedMotion }) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);

  // Play the first available animation clip as a looping idle, if any exists.
  useEffect(() => {
    if (reducedMotion) return undefined;
    if (!names || names.length === 0) return undefined;
    // Prefer a clip that looks like an idle; else just use the first one.
    const idleName =
      names.find((n) => /idle|breath|stand|loop/i.test(n)) || names[0];
    const action = actions[idleName];
    if (!action) return undefined;
    action.reset().fadeIn(0.4).play();
    action.setLoop(THREE.LoopRepeat, Infinity);
    return () => action.fadeOut(0.3);
  }, [actions, names, reducedMotion]);

  // Collect mouth-related morph targets across all skinned meshes for lip-sync.
  const lipTargets = useMemo(() => {
    const targets = [];
    if (!scene) return targets;
    scene.traverse((child) => {
      const dict = child?.morphTargetDictionary;
      const influences = child?.morphTargetInfluences;
      if (!dict || !influences) return;
      // RPM / MetaPerson / ARKit style target names, in priority order.
      const idx =
        dict['mouthOpen'] ??
        dict['jawOpen'] ??
        dict['viseme_aa'] ??
        dict['viseme_O'] ??
        dict['mouthSmile'];
      if (Number.isInteger(idx) && idx >= 0 && idx < influences.length) {
        targets.push({ mesh: child, idx });
      }
    });
    return targets;
  }, [scene]);

  const hasIdleClip = (names?.length ?? 0) > 0;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (g && !reducedMotion) {
      // Gentle mouse-responsive rotation (eased toward the pointer).
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.35, 4, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.15, 4, delta);
      // Procedural idle breathing/sway ONLY when the rig has no idle clip.
      if (!hasIdleClip) {
        g.position.y = -1.5 + Math.sin(t * 1.6) * 0.015;
        g.rotation.z = Math.sin(t * 0.6) * 0.01;
      }
    }

    // Lip-sync: drive mouth morphs while speaking; ease shut otherwise.
    if (lipTargets.length) {
      const open = speaking
        ? Math.min(1, Math.max(0, Math.abs(Math.sin(t * 11)) * (0.55 + Math.random() * 0.4)))
        : 0;
      for (const { mesh, idx } of lipTargets) {
        const inf = mesh.morphTargetInfluences;
        if (!inf) continue;
        inf[idx] = THREE.MathUtils.damp(inf[idx] || 0, open, speaking ? 25 : 10, delta);
      }
    }
  });

  // Head-and-shoulders framing for a ~1.8m-tall full-body rig under the camera.
  return (
    <group ref={group} position={[0, -1.5, 0]} scale={1.45}>
      <primitive object={scene} />
    </group>
  );
}

/** Error boundary: on any model load/decode error, calls onError so the parent
 *  reveals the photo fallback. */
class ModelBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function PhotoFallback({ label }) {
  // Show the portrait EXACTLY as it is in the project directory — full image,
  // no cropping, no zoom, no circular clip — so every pixel is preserved as-is.
  // object-contain fits the whole image within the panel at its native aspect.
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0B1020]">
      <img
        src={FALLBACK_IMAGE}
        alt="Professional portrait of Muhammad Attique"
        aria-label={label}
        draggable={false}
        decoding="async"
        className="max-h-full max-w-full h-auto w-auto object-contain select-none"
      />
    </div>
  );
}

export function RealAvatar({ className = '', height = '520px', speaking = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [modelFailed, setModelFailed] = useState(false);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(Boolean(gl));
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showCanvas = webGLSupported && !modelFailed;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`3D avatar of Muhammad Attique${speaking ? ', speaking' : ''}`}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {/* Photo fallback sits behind; it shows while the model streams in and
          stays if the model/WebGL fails. */}
      <div className="absolute inset-0">
        <PhotoFallback label="Avatar preview" />
      </div>

      {showCanvas && (
        <div className="absolute inset-0">
          <ModelBoundary onError={() => setModelFailed(true)}>
            <Canvas
              frameloop={isVisible ? 'always' : 'demand'}
              dpr={[1, 1.75]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              camera={{ position: [0, 0, 4.2], fov: 38 }}
              className="h-full w-full"
            >
              {/* Premium neutral studio lighting + subtle blue rim light. */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 4, 5]} intensity={1.4} color="#FFF6EE" />
              <directionalLight position={[-4, 2, -3]} intensity={1.3} color="#4F8CFF" />
              <pointLight position={[0, -1.5, 2]} intensity={0.4} color="#A855F7" distance={6} />
              <Suspense fallback={null}>
                <Environment preset="studio" />
                <AvatarModel speaking={speaking} reducedMotion={reducedMotion} />
              </Suspense>
            </Canvas>
          </ModelBoundary>
        </div>
      )}
    </div>
  );
}

// Preload the model so it is ready by the time the hero scrolls into view.
// Guarded: a missing file must not break module evaluation.
try {
  useGLTF.preload(MODEL_URL);
} catch {
  // Ignored when the model is absent.
}
