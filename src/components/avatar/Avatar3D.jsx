import { Component, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { StylizedBoy } from './StylizedBoy';
import { useReducedMotion } from '../../hooks';

class AvatarErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Unable to render the 3D avatar.', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#ece9e4] px-6 text-center font-mono text-xs text-[#625d56]">
          The 3D avatar could not be rendered in this browser.
        </div>
      );
    }
    return this.props.children;
  }
}

export function Avatar3D({ className = '', height = '520px', speaking = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (error) {
      console.error('Unable to initialize WebGL for the 3D avatar.', error);
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Animated 3D cartoon avatar${speaking ? ', speaking' : ''}`}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {webGLSupported ? (
        <AvatarErrorBoundary>
          <Canvas
            frameloop={isVisible && !reducedMotion ? 'always' : 'demand'}
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 5.8], fov: 38 }}
            className="h-full w-full"
          >
            <color attach="background" args={['#ece9e4']} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[-3.5, 5, 5]} intensity={2.1} color="#fff4e8" />
            <directionalLight position={[4, 2, -2]} intensity={1.2} color="#d8e4ff" />
            <pointLight position={[0, 2.5, 3]} intensity={0.35} color="#ffffff" />
            <StylizedBoy speaking={speaking} reducedMotion={reducedMotion} />
          </Canvas>
        </AvatarErrorBoundary>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#ece9e4] px-6 text-center font-mono text-xs text-[#625d56]">
          This browser does not support WebGL, which is required for the 3D avatar.
        </div>
      )}
    </div>
  );
}
