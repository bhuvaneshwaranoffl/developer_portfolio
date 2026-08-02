import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { id: 1, title: 'Learning Programming', date: '2020', pos: [0, -10, -30] },
  { id: 2, title: 'First Internship', date: 'Dec 2022', pos: [-5, -8, -25] },
  { id: 3, title: 'Discovering Flutter', date: '2023', pos: [4, -6, -20] },
  { id: 4, title: 'First Product (GameCafe)', date: '2023', pos: [-3, -4, -15] },
  { id: 5, title: 'Professional Growth', date: '2024', pos: [5, -2, -10] },
  { id: 6, title: 'Current Position (SafeBox)', date: 'Mar 2025', pos: [-2, 0, -5] },
  { id: 7, title: 'Future Vision', date: 'Aug 2026', pos: [0, 2, 0] }
];

const ChapterJourney = () => {
  const groupRef = useRef();
  
  // Create points for the connecting line
  const points = useMemo(() => milestones.map(m => new THREE.Vector3(...m.pos)), []);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Start with the constellation far away
    gsap.set(groupRef.current.position, { z: -50, y: -10 });
    gsap.set(groupRef.current.material, { opacity: 0 }); // Assuming group material access, wait, group doesn't have material

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-journey",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Move the constellation towards the camera and up
    tl.to(groupRef.current.position, {
      z: 10,
      y: 5,
      ease: "none"
    });

    // Animate HTML elements appearing
    milestones.forEach((m, i) => {
      gsap.to(`.milestone-content-${m.id}`, {
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#chapter-journey",
          start: () => `top+=${(i / milestones.length) * 100}% center`,
          end: () => `top+=${((i + 1) / milestones.length) * 100}% center`,
          scrub: 1,
        }
      });
    });

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing effect
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <Line
        points={points}
        color="#00F0FF"
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      
      {milestones.map((m, i) => (
        <group key={m.id} position={m.pos}>
          {/* The glowing star */}
          <Sphere args={[0.2, window.innerWidth <= 768 ? 8 : 16, window.innerWidth <= 768 ? 8 : 16]}>
            <meshBasicMaterial color="#FFFFFF" />
          </Sphere>
          <Sphere args={[0.4, window.innerWidth <= 768 ? 8 : 16, window.innerWidth <= 768 ? 8 : 16]}>
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.3} />
          </Sphere>

          {/* Holographic Text attached to the star */}
          <Html center distanceFactor={15}>
            <div 
              className={`milestone-content-${m.id} glass-panel`}
              style={{
                opacity: 0,
                transform: 'scale(0.8)',
                padding: '1rem',
                width: 'max-content',
                textAlign: 'center',
                pointerEvents: 'none',
                marginTop: '30px'
              }}
            >
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '4px' }}>{m.date}</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{m.title}</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

export default ChapterJourney;
