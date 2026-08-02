import React, { useRef, useLayoutEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { id: 'flutter', name: 'Flutter', color: '#042B59', accent: '#45D1FD', pos: [0, 0, 0], size: 1.2 },
  { id: 'firebase', name: 'Firebase', color: '#FFCA28', accent: '#F57C00', pos: [-3, 2, -2], size: 0.8 },
  { id: 'backend', name: 'Backend', color: '#3C873A', accent: '#68A063', pos: [4, -1, -3], size: 0.9 },
  { id: 'arch', name: 'Architecture', color: '#8B5CF6', accent: '#D946EF', pos: [-2, -3, -1], size: 0.7 },
  { id: 'ui', name: 'UI Design', color: '#F24E1E', accent: '#FF7262', pos: [3, 3, -4], size: 0.8 },
  { id: 'animation', name: 'Animation', color: '#000000', accent: '#FFFFFF', pos: [1, -4, -2], size: 0.6 },
  { id: 'ai', name: 'AI Tools', color: '#00F0FF', accent: '#0055FF', pos: [-4, -1, -4], size: 0.8 },
  { id: 'devops', name: 'Git & DevOps', color: '#F05032', accent: '#E94E32', pos: [2, 1, -5], size: 0.7 },
  { id: 'cloud', name: 'Cloud', color: '#4285F4', accent: '#DB4437', pos: [0, 4, -3], size: 0.9 },
];

const Planet = ({ skill }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      // Floating effect
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + skill.pos[0]) * 0.002;
    }
  });

  return (
    <group position={skill.pos}>
      <Sphere 
        args={[skill.size, 32, 32]} 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={skill.color} 
          emissive={skill.accent}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          roughness={0.4}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[skill.size * 1.2, 32, 32]}>
        <meshBasicMaterial 
          color={skill.accent} 
          transparent 
          opacity={hovered ? 0.3 : 0.1} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Holographic Info */}
      <Html center distanceFactor={15}>
        <div 
          className="glass-panel"
          style={{
            opacity: hovered ? 1 : 0,
            transform: `scale(${hovered ? 1 : 0.8})`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            padding: '1rem',
            width: 'max-content',
            pointerEvents: 'none',
            marginTop: `${skill.size * 50 + 20}px`
          }}
        >
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{skill.name}</div>
          <div style={{ color: skill.accent, fontSize: '0.8rem', marginTop: '4px' }}>Explore Domain</div>
        </div>
      </Html>
    </group>
  );
};

const ChapterSkills = () => {
  const groupRef = useRef();

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Start from below
    gsap.set(groupRef.current.position, { y: -30, z: -10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-skills",
        start: "top bottom",
        end: "top 20%",
        scrub: 1,
      }
    });

    tl.to(groupRef.current.position, {
      y: 0,
      z: 0,
      ease: "power2.out"
    });

    // Exit animation
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-skills",
        start: "bottom 80%",
        end: "bottom top",
        scrub: 1,
      }
    });

    exitTl.to(groupRef.current.position, {
      y: 20,
      z: -20,
      opacity: 0,
      ease: "power2.in"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Energy lines connecting planets */}
      {skills.map((s1, i) => 
        skills.map((s2, j) => {
          // Connect flutter to everything, and random connections otherwise
          if (i !== j && (i === 0 || Math.random() > 0.8)) {
             return (
               <Line 
                 key={`line-${i}-${j}`}
                 points={[new THREE.Vector3(...s1.pos), new THREE.Vector3(...s2.pos)]}
                 color="#00F0FF"
                 lineWidth={0.5}
                 transparent
                 opacity={0.15}
                 blending={THREE.AdditiveBlending}
               />
             )
          }
          return null;
        })
      )}
      
      {skills.map(skill => (
        <Planet key={skill.id} skill={skill} />
      ))}
    </group>
  );
};

export default ChapterSkills;
