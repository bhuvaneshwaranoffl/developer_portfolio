import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ChapterArrival = () => {
  const galaxyRef = useRef();

  // Generate a procedural galaxy
  const { positions, colors, randoms } = useMemo(() => {
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const randoms = new Float32Array(count); // Used for animation offsets

    const radius = 8;
    const branches = 3;
    const spin = 1;
    const randomness = 0.5;
    const randomnessPower = 3;

    const colorInside = new THREE.Color('#D946EF'); // Magenta center
    const colorOutside = new THREE.Color('#00F0FF'); // Cyan edges

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color interpolation
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, r / radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      randoms[i] = Math.random();
    }

    return { positions, colors, randoms };
  }, []);

  useLayoutEffect(() => {
    if (!galaxyRef.current) return;

    // Start with galaxy scaled down and invisible
    gsap.set(galaxyRef.current.scale, { x: 0.1, y: 0.1, z: 0.1 });
    gsap.set(galaxyRef.current.material, { opacity: 0 });

    // GSAP Animation tied to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-arrival",
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing
      }
    });

    // As user scrolls through the arrival chapter, the galaxy forms and grows
    tl.to(galaxyRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      ease: "power2.out"
    }, 0);

    tl.to(galaxyRef.current.material, {
      opacity: 1,
      ease: "power2.out"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    if (galaxyRef.current) {
      // Slow rotation of the entire galaxy
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Update individual stars slightly (custom shader could be better here, but this works for now)
      const positionsAttribute = galaxyRef.current.geometry.attributes.position;
      // We avoid updating 10,000 points on CPU every frame for performance, 
      // instead we rely on the group rotation above.
    }
  });

  return (
    <group position={[3, 0, -5]} rotation={[0.4, 0, 0.2]}>
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0} // Controlled by GSAP
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default ChapterArrival;
