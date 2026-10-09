import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Stylized procedural clay 3D boy representation of Muhammad Attique:
 * - Warm skin tone, styled dark hair, glasses, neat trim beard
 * - Dark charcoal hoodie with subtle accent drawstrings
 * - Smooth head & eye mouse tracking, breathing float, blinking, and greeting wave
 */
export function ProceduralBoy({ mouseHover = false }) {
  const groupRef = useRef();
  const headRef = useRef();
  const eyesGroupRef = useRef();
  const leftEyelidRef = useRef();
  const rightEyelidRef = useRef();
  const rightArmRef = useRef();
  const hoodieRef = useRef();

  const [hasWaved, setHasWaved] = useState(false);

  // Target rotations for smooth lerping
  const targetRotation = useRef({ x: 0, y: 0 });

  // Blinking cycle state
  const blinkState = useRef({ isBlinking: false, timer: 0 });

  useEffect(() => {
    // Initial friendly greeting wave triggers for 2.5 seconds
    const timer = setTimeout(() => {
      setHasWaved(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Mouse Tracking with smooth damping
    const pointerX = state.pointer.x; // -1 to 1
    const pointerY = state.pointer.y; // -1 to 1

    targetRotation.current.y = THREE.MathUtils.lerp(
      targetRotation.current.y,
      pointerX * 0.55,
      delta * 4
    );
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      -pointerY * 0.35,
      delta * 4
    );

    if (headRef.current) {
      headRef.current.rotation.y = targetRotation.current.y;
      headRef.current.rotation.x = targetRotation.current.x;
      // Slight head tilt when moving sideways
      headRef.current.rotation.z = -targetRotation.current.y * 0.15;
    }

    // 2. Idle Breathing / Subtle Floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.8) * 0.05 - 0.2;
    }

    if (hoodieRef.current) {
      // Gentle chest expansion with breathing
      const breathScale = 1 + Math.sin(time * 1.8) * 0.015;
      hoodieRef.current.scale.set(1, breathScale, 1);
    }

    // 3. Eye Movement & Blinking
    if (eyesGroupRef.current) {
      eyesGroupRef.current.position.x = pointerX * 0.04;
      eyesGroupRef.current.position.y = pointerY * 0.03;
    }

    blinkState.current.timer += delta;
    if (blinkState.current.timer > 3.6) {
      blinkState.current.isBlinking = true;
      if (blinkState.current.timer > 3.75) {
        blinkState.current.isBlinking = false;
        blinkState.current.timer = 0;
      }
    }

    const eyelidScaleY = blinkState.current.isBlinking ? 0.08 : 1;
    if (leftEyelidRef.current && rightEyelidRef.current) {
      leftEyelidRef.current.scale.y = eyelidScaleY;
      rightEyelidRef.current.scale.y = eyelidScaleY;
    }

    // 4. Greeting Wave (on load or when mouse is hovered on avatar)
    if (rightArmRef.current) {
      if (!hasWaved || mouseHover) {
        // Arm raised waving
        const waveAngle = Math.sin(time * 8) * 0.28;
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          1.8 + waveAngle,
          delta * 6
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0.3,
          delta * 4
        );
      } else {
        // Rest position
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.2,
          delta * 4
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0,
          delta * 4
        );
      }
    }
  });

  // Materials & Colors
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#D89E7C',
    roughness: 0.55,
    metalness: 0.05,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: '#1C1A20',
    roughness: 0.85,
    metalness: 0.05,
  });

  const beardMaterial = new THREE.MeshStandardMaterial({
    color: '#26222A',
    roughness: 0.9,
    metalness: 0.02,
  });

  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: '#222228',
    roughness: 0.2,
    metalness: 0.8,
  });

  const hoodieMaterial = new THREE.MeshStandardMaterial({
    color: '#15151A',
    roughness: 0.75,
    metalness: 0.1,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: '#C6FF3D',
    roughness: 0.3,
    metalness: 0.1,
    emissive: '#C6FF3D',
    emissiveIntensity: 0.25,
  });

  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: '#F0F0F0',
    roughness: 0.2,
  });

  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: '#121214',
    roughness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.45, 1.45, 1.45]}>
      {/* ================= TORSO & HOODIE ================= */}
      <group ref={hoodieRef} position={[0, -0.9, 0]}>
        {/* Main Chest */}
        <mesh position={[0, 0, 0]} material={hoodieMaterial}>
          <cylinderGeometry args={[0.55, 0.68, 0.95, 32]} />
        </mesh>

        {/* Shoulders */}
        <mesh position={[0, 0.35, 0]} material={hoodieMaterial}>
          <capsuleGeometry args={[0.3, 0.65, 8, 16]} />
        </mesh>

        {/* Hoodie Neck Cowl */}
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]} material={hoodieMaterial}>
          <torusGeometry args={[0.32, 0.12, 16, 32]} />
        </mesh>

        {/* Hoodie Strings */}
        <mesh position={[-0.1, 0.28, 0.3]} material={hoodieMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
        </mesh>
        <mesh position={[-0.1, 0.12, 0.3]} material={accentMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
        </mesh>

        <mesh position={[0.1, 0.28, 0.3]} material={hoodieMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
        </mesh>
        <mesh position={[0.1, 0.12, 0.3]} material={accentMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
        </mesh>

        {/* Left Arm (Relaxed) */}
        <group position={[-0.6, 0.32, 0]} rotation={[0, 0, -0.2]}>
          <mesh position={[0, -0.3, 0]} material={hoodieMaterial}>
            <capsuleGeometry args={[0.14, 0.45, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
        </group>

        {/* Right Arm (Waving Arm) */}
        <group ref={rightArmRef} position={[0.6, 0.32, 0]}>
          <mesh position={[0, -0.3, 0]} material={hoodieMaterial}>
            <capsuleGeometry args={[0.14, 0.45, 8, 16]} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.62, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Subtle waving thumb */}
          <mesh position={[-0.08, -0.6, 0.02]} rotation={[0, 0, 0.5]} material={skinMaterial}>
            <capsuleGeometry args={[0.04, 0.08, 6, 8]} />
          </mesh>
        </group>
      </group>

      {/* ================= HEAD & FEATURES ================= */}
      <group ref={headRef} position={[0, 0, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.35, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.18, 0.22, 0.35, 24]} />
        </mesh>

        {/* Head Base */}
        <mesh position={[0, 0, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.52, 32, 32]} />
        </mesh>

        {/* Jaw & Chin Shape */}
        <mesh position={[0, -0.15, 0.1]} material={skinMaterial}>
          <sphereGeometry args={[0.38, 24, 24]} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.52, 0, 0]} rotation={[0, -0.2, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh position={[0.52, 0, 0]} rotation={[0, 0.2, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>

        {/* Trim Beard / Goatee / Stubble */}
        <mesh position={[0, -0.22, 0.22]} material={beardMaterial}>
          <boxGeometry args={[0.38, 0.18, 0.32]} />
        </mesh>
        <mesh position={[0, -0.36, 0.2]} material={beardMaterial}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.52]} rotation={[0.2, 0, 0]} material={skinMaterial}>
          <capsuleGeometry args={[0.055, 0.12, 8, 12]} />
        </mesh>

        {/* ================= STYLISH GLASSES ================= */}
        <group position={[0, 0.08, 0.48]}>
          {/* Left Frame */}
          <mesh position={[-0.2, 0, 0]} material={glassesMaterial}>
            <torusGeometry args={[0.11, 0.02, 12, 28]} />
          </mesh>
          {/* Right Frame */}
          <mesh position={[0.2, 0, 0]} material={glassesMaterial}>
            <torusGeometry args={[0.11, 0.02, 12, 28]} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0.02, 0]} material={glassesMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          </mesh>
          {/* Temples */}
          <mesh position={[-0.32, 0, -0.2]} rotation={[0, 1.4, 0]} material={glassesMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
          </mesh>
          <mesh position={[0.32, 0, -0.2]} rotation={[0, -1.4, 0]} material={glassesMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
          </mesh>
        </group>

        {/* ================= EYES & PUPILS ================= */}
        <group ref={eyesGroupRef} position={[0, 0.08, 0.44]}>
          {/* Left Eye */}
          <group ref={leftEyelidRef} position={[-0.2, 0, 0]}>
            <mesh material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.075, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.06]} material={pupilMaterial}>
              <sphereGeometry args={[0.035, 12, 12]} />
            </mesh>
            {/* Catchlight */}
            <mesh position={[0.015, 0.02, 0.085]} material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.01, 8, 8]} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group ref={rightEyelidRef} position={[0.2, 0, 0]}>
            <mesh material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.075, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.06]} material={pupilMaterial}>
              <sphereGeometry args={[0.035, 12, 12]} />
            </mesh>
            {/* Catchlight */}
            <mesh position={[0.015, 0.02, 0.085]} material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.01, 8, 8]} />
            </mesh>
          </group>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.2, 0.22, 0.46]} rotation={[0, 0, 0.08]} material={beardMaterial}>
          <boxGeometry args={[0.18, 0.035, 0.04]} />
        </mesh>
        <mesh position={[0.2, 0.22, 0.46]} rotation={[0, 0, -0.08]} material={beardMaterial}>
          <boxGeometry args={[0.18, 0.035, 0.04]} />
        </mesh>

        {/* ================= HAIR (STYLISH TEXTURED CROPPED) ================= */}
        <group position={[0, 0.24, 0]}>
          {/* Top Hair Volume */}
          <mesh position={[0, 0.26, -0.05]} material={hairMaterial}>
            <sphereGeometry args={[0.48, 24, 24]} />
          </mesh>
          {/* Front Quiff / Fringe */}
          <mesh position={[0, 0.28, 0.22]} rotation={[-0.2, 0, 0]} material={hairMaterial}>
            <boxGeometry args={[0.56, 0.22, 0.32]} />
          </mesh>
          <mesh position={[-0.15, 0.32, 0.24]} rotation={[-0.15, 0.2, 0.1]} material={hairMaterial}>
            <sphereGeometry args={[0.24, 16, 16]} />
          </mesh>
          <mesh position={[0.15, 0.32, 0.24]} rotation={[-0.15, -0.2, -0.1]} material={hairMaterial}>
            <sphereGeometry args={[0.24, 16, 16]} />
          </mesh>
          {/* Side Fades */}
          <mesh position={[-0.38, 0.06, 0.02]} material={hairMaterial}>
            <boxGeometry args={[0.18, 0.42, 0.54]} />
          </mesh>
          <mesh position={[0.38, 0.06, 0.02]} material={hairMaterial}>
            <boxGeometry args={[0.18, 0.42, 0.54]} />
          </mesh>
          {/* Back Hair */}
          <mesh position={[0, -0.02, -0.32]} material={hairMaterial}>
            <boxGeometry args={[0.62, 0.48, 0.28]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

