import React, { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Spaceship = () => {
  const shipGroup = useRef();
  const thrusterRef1 = useRef();
  const thrusterRef2 = useRef();

  useLayoutEffect(() => {
    if (!shipGroup.current) return;

    // Start position: Off-screen top, pointing away from camera
    gsap.set(shipGroup.current.position, { x: 0, y: 5, z: 2 });
    gsap.set(shipGroup.current.rotation, { x: 0.2, y: Math.PI, z: 0 });
    gsap.set(shipGroup.current.scale, { x: 0.5, y: 0.5, z: 0.5 }); // Increased scale!

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // 1. Drop into the scene when user starts scrolling
    tl.to(shipGroup.current.position, {
      y: -0.5, // Move into center screen
      z: 0,
      ease: "power2.out",
    }, 0);
    tl.to(shipGroup.current.rotation, {
      x: 0,
      ease: "power2.out"
    }, 0);

    // 2. Travel through middle sections
    tl.to(shipGroup.current.position, {
      y: 2,
      x: 4,
      z: -10,
      ease: "sine.inOut"
    }, 0.2);
    
    tl.to(shipGroup.current.rotation, {
      z: -0.3, // Bank right
      y: Math.PI + 0.3
    }, 0.2);

    tl.to(shipGroup.current.position, {
      y: -2,
      x: -4,
      z: -20,
      ease: "sine.inOut"
    }, 0.4);

    tl.to(shipGroup.current.rotation, {
      z: 0.3, // Bank left
      y: Math.PI - 0.3
    }, 0.4);

    // 3. Final approach to Black Hole
    tl.to(shipGroup.current.position, {
      y: 0,
      x: 0,
      z: -30,
      ease: "power2.in"
    }, 0.7);

    tl.to(shipGroup.current.rotation, {
      z: 0,
      y: Math.PI,
      x: -0.6 // Dive down
    }, 0.7);

    // 4. Dive into black hole and vanish
    tl.to(shipGroup.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      ease: "power3.in"
    }, 0.85);

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  useFrame((state) => {
    if (!shipGroup.current) return;
    const time = state.clock.elapsedTime;

    // Add idle hover animation
    shipGroup.current.position.y += Math.sin(time * 2) * 0.002;
    shipGroup.current.rotation.z += Math.sin(time * 1.5) * 0.001;

    // Flicker thrusters
    const flicker = 0.8 + Math.random() * 0.4;
    if (thrusterRef1.current) thrusterRef1.current.opacity = flicker;
    if (thrusterRef2.current) thrusterRef2.current.opacity = flicker;
  });

  return (
    <group ref={shipGroup}>
      {/* Main Fuselage */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 2, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cockpit Glass */}
      <mesh position={[0, 0.15, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 1, 16]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, -0.1, 0.4]}>
        <boxGeometry args={[2, 0.05, 0.5]} />
        <meshStandardMaterial color="#dddddd" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tail Fin */}
      <mesh position={[0, 0.2, 0.7]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Thruster Engine */}
      <mesh position={[-0.5, -0.1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.4} />
      </mesh>
      
      {/* Right Thruster Engine */}
      <mesh position={[0.5, -0.1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Left Thruster Glow */}
      <mesh position={[-0.5, -0.1, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.02, 0.4, 16]} />
        <meshBasicMaterial 
          ref={thrusterRef1}
          color="#D946EF" 
          transparent 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Right Thruster Glow */}
      <mesh position={[0.5, -0.1, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.02, 0.4, 16]} />
        <meshBasicMaterial 
          ref={thrusterRef2}
          color="#D946EF" 
          transparent 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
};

export default Spaceship;
