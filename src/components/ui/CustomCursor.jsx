import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const CursorDot = styled.div`
  position: fixed;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  background-color: var(--accent-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  mix-blend-mode: difference;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorRing = styled.div`
  position: fixed;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--accent-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 999998;
  opacity: 0.5;
  transition: transform 0.2s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // If it's a touch device, do not run the cursor logic.
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
    };
    
    const onMouseDown = () => {
      gsap.to(followerRef.current, { scale: 0.5, duration: 0.2 });
    };
    
    const onMouseUp = () => {
      gsap.to(followerRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    
    // Add hover effects for links and buttons
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || 
          e.target.tagName.toLowerCase() === 'button' || 
          e.target.closest('.chip')) {
        gsap.to(followerRef.current, { scale: 1.5, backgroundColor: 'rgba(176, 38, 255, 0.1)', duration: 0.3 });
      }
    };
    
    const handleMouseOut = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || 
          e.target.tagName.toLowerCase() === 'button' || 
          e.target.closest('.chip')) {
        gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <CursorDot ref={cursorRef} />
      <CursorRing ref={followerRef} />
    </>
  );
};

export default CustomCursor;
