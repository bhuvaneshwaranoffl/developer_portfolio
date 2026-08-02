import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ChapterContact = () => {
  const groupRef = useRef();
  const diskRef = useRef();
  const innerDiskRef = useRef();
  const particlesRef = useRef();

  // Create particles for the accretion disk debris
  const { positions, randoms } = useMemo(() => {
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 200 : 5000;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Ring distribution between inner (2.1) and outer (6.5)
      const r = 2.1 + Math.random() * 4.4;
      const theta = 2 * Math.PI * Math.random();

      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // Slight thickness
      
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Start invisible and far away/below
    gsap.set(groupRef.current.position, { z: -30, y: -20, x: -10 });
    gsap.set(groupRef.current.scale, { x: 0.1, y: 0.1, z: 0.1 });
    // Initial rotation for the "falling" effect
    gsap.set(groupRef.current.rotation, { z: Math.PI / 4 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-contact",
        start: "top bottom",
        end: "center center",
        scrub: 1,
      }
    });

    // Rise up, expand massively, and frame the card
    // Move it slightly to the right so the disk sweeps across
    tl.to(groupRef.current.position, {
      z: -4,
      y: 0,
      x: 2,
      ease: "power2.out"
    }, 0);

    tl.to(groupRef.current.scale, {
      x: 1.8,
      y: 1.8,
      z: 1.8,
      ease: "power2.out"
    }, 0);

    // Rotate into final "flow from top to right" orientation
    tl.to(groupRef.current.rotation, {
      z: -Math.PI / 12,
      ease: "power2.out"
    }, 0);

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotate accretion disks (flowing effect)
    if (diskRef.current) diskRef.current.rotation.z = -time * 0.15;
    if (innerDiskRef.current) innerDiskRef.current.rotation.z = -time * 0.4;
    if (particlesRef.current) particlesRef.current.rotation.z = -time * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* 1. Lensing Halo (The bent light around the top/bottom of the black hole) */}
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[2.0, 3.5, window.innerWidth <= 768 ? 16 : 64]} />
        <meshBasicMaterial 
          color="#ff7722" 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.1]}>
        <ringGeometry args={[2.0, 2.5, window.innerWidth <= 768 ? 16 : 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. The Black Hole (Event Horizon) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, window.innerWidth <= 768 ? 16 : 64, window.innerWidth <= 768 ? 16 : 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 3. Accretion Disk (Tilted heavily to view edge-on, angled to flow top-left to bottom-right) */}
      <group rotation={[Math.PI / 2.2, Math.PI / 10, -Math.PI / 6]}>
        {/* Main outer disk (orange/dusty) */}
        <mesh ref={diskRef}>
          <ringGeometry args={[2.2, 8, window.innerWidth <= 768 ? 32 : 128]} />
          <meshBasicMaterial 
            color="#ff8833" 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Inner bright hot disk (white/blueish) */}
        <mesh ref={innerDiskRef} position={[0, 0, 0.01]}>
          <ringGeometry args={[2.05, 3.5, window.innerWidth <= 768 ? 32 : 128]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Mid intense orange glow */}
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[2.1, 4.5, window.innerWidth <= 768 ? 32 : 128]} />
          <meshBasicMaterial 
            color="#ffcc88" 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbiting Debris / Plasma Particles */}
        <points ref={particlesRef} position={[0, 0, 0.03]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color="#ffffff"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
};

export default ChapterContact;
