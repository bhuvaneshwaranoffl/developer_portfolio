import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-deep-space);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const SplashText = styled.div`
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 4rem);
  white-space: nowrap;
  letter-spacing: -0.02em;
  opacity: 0;
`;

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef();
  const textRef = useRef();

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Text fades in slightly scaled down
    tl.fromTo(textRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    );

    // 2. Hold for a moment
    tl.to(textRef.current, { duration: 0.5 });

    // 3. Text scales up significantly and fades out
    tl.to(textRef.current, {
      scale: 3,
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    });

    // 4. Background fades out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=0.4");

    return () => tl.kill();
  }, [onComplete]);

  return (
    <SplashContainer ref={containerRef}>
      <SplashText ref={textRef}>Bhuvaneshwaran N</SplashText>
    </SplashContainer>
  );
};

export default SplashScreen;
