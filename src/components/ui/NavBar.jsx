import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const NavContainer = styled.nav`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  gap: 2.5rem;
  padding: 1rem 3rem;
  border-radius: 100px;
  
  /* Liquid Glass Effect */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.05), 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    width: 90%;
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem;
    top: 1rem;
  }
`;

const NavLink = styled.a`
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--accent-primary);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover {
    color: var(--accent-primary);
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const NavBar = () => {
  const navRef = useRef();

  useLayoutEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  const handleScroll = (e, target) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.5, offset: 0 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavContainer ref={navRef}>
      <NavLink href="#chapter-arrival" onClick={(e) => handleScroll(e, '#chapter-arrival')}>Home</NavLink>
      <NavLink href="#chapter-skills" onClick={(e) => handleScroll(e, '#chapter-skills')}>Arsenal</NavLink>
      <NavLink href="#chapter-projects" onClick={(e) => handleScroll(e, '#chapter-projects')}>Work</NavLink>
      <NavLink href="#chapter-contact" onClick={(e) => handleScroll(e, '#chapter-contact')}>Contact</NavLink>
    </NavContainer>
  );
};

export default NavBar;
