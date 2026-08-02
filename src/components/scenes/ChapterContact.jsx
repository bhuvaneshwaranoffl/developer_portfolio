import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sphere } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

const ChapterContact = () => {
  const groupRef = useRef();
  const blackHoleRef = useRef();
  const accretionDiskRef = useRef();
  const particlesRef = useRef();

  // Create particles being pulled in
  const { positions, randoms } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start them far away
      const r = 20 + Math.random() * 30;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Start invisible and far below
    gsap.set(groupRef.current.position, { y: -50 });
    gsap.set(blackHoleRef.current.scale, { x: 0.1, y: 0.1, z: 0.1 });
    gsap.set(accretionDiskRef.current.scale, { x: 0.1, y: 0.1, z: 0.1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-contact",
        start: "top bottom",
        end: "center center",
        scrub: 1,
      }
    });

    // Rise up and expand
    tl.to(groupRef.current.position, {
      y: 0,
      ease: "power2.out"
    }, 0);

    tl.to(blackHoleRef.current.scale, {
      x: 3,
      y: 3,
      z: 3,
      ease: "power2.out"
    }, 0.5);

    tl.to(accretionDiskRef.current.scale, {
      x: 5,
      y: 5,
      z: 5,
      ease: "power2.out"
    }, 0.5);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotate accretion disk
    accretionDiskRef.current.rotation.y = time * 0.5;
    accretionDiskRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.1;

    // Animate particles flowing into the center
    const positionsAttr = particlesRef.current.geometry.attributes.position;
    for (let i = 0; i < positionsAttr.count; i++) {
      const i3 = i * 3;
      // Get current position
      const x = positionsAttr.array[i3];
      const y = positionsAttr.array[i3 + 1];
      const z = positionsAttr.array[i3 + 2];
      
      // Calculate distance to center
      const dist = Math.sqrt(x*x + y*y + z*z);
      
      if (dist < 1) {
        // Reset particle if it reaches center
        const r = 20 + Math.random() * 30;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);

        positionsAttr.array[i3] = r * Math.sin(phi) * Math.cos(theta);
        positionsAttr.array[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positionsAttr.array[i3 + 2] = r * Math.cos(phi);
      } else {
        // Pull towards center
        const pull = 0.5 / dist; // Stronger pull when closer
        positionsAttr.array[i3] -= x * pull;
        positionsAttr.array[i3 + 1] -= y * pull;
        positionsAttr.array[i3 + 2] -= z * pull;
        
        // Add some swirl
        const swirlX = Math.sin(time + randoms[i] * 10) * pull;
        const swirlZ = Math.cos(time + randoms[i] * 10) * pull;
        positionsAttr.array[i3] += swirlX;
        positionsAttr.array[i3 + 2] += swirlZ;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* The Black Hole (Void) */}
      <Sphere ref={blackHoleRef} args={[1, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Accretion Disk (Glowing Ring) */}
      <mesh ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 3, 64]} />
        <meshBasicMaterial 
          color="#00F0FF" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer Glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 4, 64]} />
        <meshBasicMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Flowing Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#FFFFFF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default ChapterContact;
