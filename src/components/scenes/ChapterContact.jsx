import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sphere } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

const ChapterContact = () => {
  const groupRef = useRef();
  const particlesRef = useRef();

  // Create particles for Starfield warp
  const { positions, randoms } = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start them spread out across a massive space
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Start invisible and far away
    gsap.set(groupRef.current.position, { z: -50, y: -10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-contact",
        start: "top bottom",
        end: "center center",
        scrub: 1,
      }
    });

    // Bring the starfield forward
    tl.to(groupRef.current.position, {
      z: -5,
      y: 0,
      ease: "power2.out"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Animate stars flowing straight towards the camera (warp speed)
    const positionsAttr = particlesRef.current.geometry.attributes.position;
    for (let i = 0; i < positionsAttr.count; i++) {
      const i3 = i * 3;
      const z = positionsAttr.array[i3 + 2];
      
      if (z > 20) {
        // Reset particle far away in the background once it passes the camera
        positionsAttr.array[i3] = (Math.random() - 0.5) * 100; // X
        positionsAttr.array[i3 + 1] = (Math.random() - 0.5) * 100; // Y
        positionsAttr.array[i3 + 2] = -50 - (Math.random() * 50); // Far away Z
      } else {
        // Move straight towards camera (+Z)
        const speed = 0.2 + (randoms[i] * 0.8);
        positionsAttr.array[i3 + 2] += speed;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Supernova Flowing Stars */}
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
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

export default ChapterContact;
