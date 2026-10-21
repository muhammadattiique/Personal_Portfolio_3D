import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const skin = new THREE.MeshPhysicalMaterial({
  color: '#e9ae8d',
  roughness: 0.58,
  clearcoat: 0.08,
});
const skinShadow = new THREE.MeshStandardMaterial({ color: '#cf8e70', roughness: 0.72 });
const hair = new THREE.MeshPhysicalMaterial({
  color: '#56301f',
  roughness: 0.34,
  clearcoat: 0.4,
  clearcoatRoughness: 0.3,
});
const hairHighlight = new THREE.MeshStandardMaterial({ color: '#72432b', roughness: 0.42 });
const shirt = new THREE.MeshStandardMaterial({ color: '#d5d0c5', roughness: 0.84 });
const shirtSeam = new THREE.MeshStandardMaterial({ color: '#bcb6a9', roughness: 0.9 });
const white = new THREE.MeshStandardMaterial({ color: '#fffaf4', roughness: 0.28 });
const iris = new THREE.MeshPhysicalMaterial({
  color: '#4c2718',
  roughness: 0.22,
  clearcoat: 0.65,
});
const pupil = new THREE.MeshStandardMaterial({ color: '#170d09', roughness: 0.15 });
const lip = new THREE.MeshStandardMaterial({ color: '#a85e54', roughness: 0.62 });
const mouth = new THREE.MeshStandardMaterial({ color: '#542925', roughness: 0.86 });
const freckles = new THREE.MeshStandardMaterial({ color: '#a9684e', roughness: 0.95 });

const frecklePositions = [
  [-0.37, -0.17, 0.41], [-0.31, -0.21, 0.45], [-0.25, -0.16, 0.47],
  [-0.4, -0.24, 0.39], [-0.29, -0.27, 0.44], [-0.2, -0.22, 0.48],
  [0.37, -0.17, 0.41], [0.31, -0.21, 0.45], [0.25, -0.16, 0.47],
  [0.4, -0.24, 0.39], [0.29, -0.27, 0.44], [0.2, -0.22, 0.48],
  [-0.08, -0.08, 0.51], [0.07, -0.08, 0.51],
];

function makeLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = '#153252';
  context.font = '700 88px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('PS', 128, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Eye({ x, eyesRef }) {
  return (
    <group ref={eyesRef} position={[x, 0.1, 0.445]}>
      <mesh scale={[0.17, 0.19, 0.075]} material={white}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh position={[0, -0.005, 0.064]} scale={[0.095, 0.115, 0.044]} material={iris}>
        <sphereGeometry args={[1, 28, 20]} />
      </mesh>
      <mesh position={[0, -0.006, 0.099]} scale={[0.055, 0.07, 0.025]} material={pupil}>
        <sphereGeometry args={[1, 24, 18]} />
      </mesh>
      <mesh position={[0.027, 0.045, 0.122]} material={white}>
        <sphereGeometry args={[0.022, 12, 10]} />
      </mesh>
      <mesh position={[-0.027, -0.026, 0.12]} material={white}>
        <sphereGeometry args={[0.009, 10, 8]} />
      </mesh>
    </group>
  );
}

export function StylizedBoy({ speaking = false, reducedMotion = false }) {
  const headRef = useRef();
  const bodyRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const mouthRef = useRef();
  const blink = useRef({ elapsed: 0, closed: false });
  const logoTexture = useMemo(makeLogoTexture, []);

  const smileCurve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, -0.36, 0.474),
      new THREE.Vector3(-0.09, -0.4, 0.495),
      new THREE.Vector3(0, -0.41, 0.5),
      new THREE.Vector3(0.09, -0.4, 0.495),
      new THREE.Vector3(0.18, -0.36, 0.474),
    ]),
    []
  );

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y, state.pointer.x * 0.16, 4, delta
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x, -state.pointer.y * 0.08, 4, delta
      );
      headRef.current.rotation.z = Math.sin(time * 0.65) * 0.012;
    }
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 1.8) * 0.008;
    }

    blink.current.elapsed += delta;
    if (blink.current.closed) {
      if (blink.current.elapsed > 0.13) {
        blink.current.closed = false;
        blink.current.elapsed = 0;
      }
    } else if (blink.current.elapsed > 3.2 + Math.sin(time * 0.17) * 0.7) {
      blink.current.closed = true;
      blink.current.elapsed = 0;
    }
    const eyeScale = blink.current.closed ? 0.08 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScale;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScale;

    // Lip-sync: while speaking, open/close the mouth on a layered rhythm with a
    // touch of randomness so it reads as natural speech; settle nearly closed
    // otherwise. A larger range makes the talking clearly visible.
    if (mouthRef.current) {
      const open = speaking
        ? 1 + Math.max(
            0,
            Math.sin(time * 11) + Math.sin(time * 18.7) * 0.35 + Math.sin(time * 6.3) * 0.2
          ) * 5.5
        : 0.5;
      mouthRef.current.scale.y = THREE.MathUtils.damp(mouthRef.current.scale.y, open, 16, delta);
    }
  });

  return (
    <group position={[0, -0.02, 0]}>
      {/* Tee and relaxed shoulders */}
      <group ref={bodyRef}>
        <mesh position={[0, -1.16, -0.02]} scale={[0.82, 0.86, 0.4]} material={shirt}>
          <sphereGeometry args={[1, 40, 32]} />
        </mesh>
        <mesh position={[0, -0.78, 0]} scale={[0.83, 0.29, 0.39]} material={shirt}>
          <sphereGeometry args={[1, 32, 24]} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 0.78, -0.85, 0]}
              rotation={[0, 0, -side * 0.12]}
              scale={[0.24, 0.34, 0.34]}
              material={shirt}
            >
              <sphereGeometry args={[1, 28, 24]} />
            </mesh>
            <mesh
              position={[side * 0.79, -1.51, 0.015]}
              rotation={[0, 0, -side * 0.035]}
              scale={[0.16, 0.56, 0.17]}
              material={skin}
            >
              <capsuleGeometry args={[0.5, 1, 8, 16]} />
            </mesh>
            <mesh
              position={[side * 0.78, -1.04, 0.255]}
              rotation={[Math.PI / 2, 0, 0]}
              material={shirtSeam}
            >
              <torusGeometry args={[0.18, 0.012, 8, 28]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.68, 0.04]} rotation={[Math.PI / 2, 0, 0]} material={shirtSeam}>
          <torusGeometry args={[0.28, 0.027, 12, 40]} />
        </mesh>
        {logoTexture && (
          <mesh position={[0.39, -1.05, 0.344]}>
            <planeGeometry args={[0.42, 0.21]} />
            <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
          </mesh>
        )}
      </group>

      {/* Neck */}
      <mesh position={[0, -0.49, 0]} scale={[0.25, 0.42, 0.24]} material={skin}>
        <capsuleGeometry args={[0.5, 1, 8, 20]} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.92, 0]}>
        <mesh scale={[0.62, 0.78, 0.5]} material={skin}>
          <sphereGeometry args={[1, 48, 40]} />
        </mesh>

        {/* Ears */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.61, -0.02, -0.015]}>
            <mesh scale={[0.18, 0.25, 0.12]} material={skin}>
              <sphereGeometry args={[1, 28, 24]} />
            </mesh>
            <mesh position={[0, 0, 0.075]} scale={[0.08, 0.14, 0.04]} material={skinShadow}>
              <sphereGeometry args={[1, 20, 16]} />
            </mesh>
          </group>
        ))}

        {/* Voluminous chestnut hair with sculpted swept-up locks */}
        <mesh position={[0, 0.48, -0.035]} scale={[0.65, 0.46, 0.53]} material={hair}>
          <sphereGeometry args={[1, 40, 32]} />
        </mesh>
        <mesh position={[0, 0.27, -0.08]} scale={[0.64, 0.32, 0.53]} material={hair}>
          <sphereGeometry args={[1, 36, 28]} />
        </mesh>
        {[
          [-0.42, 0.48, 0.21, -0.42, 0.16, 0.27],
          [-0.29, 0.62, 0.28, -0.26, 0.2, 0.31],
          [-0.1, 0.71, 0.28, -0.08, 0.15, 0.34],
          [0.1, 0.74, 0.25, 0.16, 0.2, 0.3],
          [0.31, 0.61, 0.2, 0.39, 0.15, 0.26],
          [0.45, 0.42, 0.1, 0.5, 0.12, 0.19],
          [-0.51, 0.2, 0.04, -0.53, -0.04, 0.1],
          [0.51, 0.21, 0.04, 0.54, -0.04, 0.1],
        ].map(([x, y, z, rx, rz, length], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[rx * 0.12, 0, rz]}
            scale={[0.17, length, 0.19]}
            material={index % 2 ? hairHighlight : hair}
          >
            <sphereGeometry args={[1, 28, 24]} />
          </mesh>
        ))}

        {/* Soft brows and large expressive brown eyes */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.235, 0.315, 0.445]}
            rotation={[0, 0, side * 0.08]}
            scale={[0.19, 0.045, 0.052]}
            material={hair}
          >
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
        ))}
        <Eye x={-0.235} eyesRef={leftEyeRef} />
        <Eye x={0.235} eyesRef={rightEyeRef} />

        {/* Nose, gentle closed smile, and subtle freckles */}
        <mesh position={[0, -0.105, 0.49]} scale={[0.105, 0.13, 0.105]} material={skin}>
          <sphereGeometry args={[1, 28, 24]} />
        </mesh>
        <mesh ref={mouthRef} position={[0, -0.365, 0.47]} scale={[0.17, 0.025, 0.025]} material={mouth}>
          <sphereGeometry args={[1, 24, 18]} />
        </mesh>
        <mesh position={[0, -0.385, 0.493]} material={lip}>
          <tubeGeometry args={[smileCurve, 24, 0.012, 8, false]} />
        </mesh>
        {frecklePositions.map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]} material={freckles}>
            <sphereGeometry args={[index % 3 === 0 ? 0.011 : 0.008, 8, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
