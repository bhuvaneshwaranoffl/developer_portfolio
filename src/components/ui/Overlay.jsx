import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OverlayContainer = styled.div`
  width: 100%;
  pointer-events: auto; /* Allow interactions with UI elements */
`;

const ChapterSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 10vw, 5rem);
  position: relative;
`;

const HeroHeading = styled.h1`
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 500;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 2rem;
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.03), 
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
      inset 0 0 20px rgba(255, 255, 255, 0.05), 
      0 12px 40px 0 rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const ArsenalCard = styled(GlassCard)`
  background: 
    linear-gradient(135deg, rgba(20, 20, 25, 0.6) 0%, rgba(10, 10, 15, 0.8) 100%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.04"/></svg>');
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(176, 38, 255, 0.15), transparent 70%);
    pointer-events: none;
  }
`;

const SkillCategory = styled.div`
  margin-bottom: 3rem;
  
  h4 {
    color: var(--accent-primary);
    font-size: clamp(1rem, 2vw, 1.2rem);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
  }
`;

const SkillChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  /* Dim other chips when container is hovered */
  &:hover .chip {
    opacity: 0.5;
    transform: scale(0.95);
    filter: grayscale(0.5);
  }
  
  .chip {
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    font-weight: 500;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    
    /* Shine effect line */
    &::after {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(176, 38, 255, 0.4), transparent);
      transform: skewX(-20deg);
      transition: 0.5s;
    }
    
    &:hover {
      opacity: 1 !important;
      filter: grayscale(0) !important;
      background: rgba(176, 38, 255, 0.15);
      border-color: var(--accent-primary);
      transform: scale(1.1) translateY(-2px) !important;
      box-shadow: 0 10px 20px rgba(176, 38, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      z-index: 10;
      
      &::after {
        left: 200%;
      }
    }
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: clamp(1.5rem, 4vw, 2rem);
  margin-top: clamp(2rem, 5vw, 4rem);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .value {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .label {
    color: var(--accent-primary);
    font-weight: 600;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const ProjectCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.5rem);
  max-width: 600px;
  
  h3 {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  
  .role {
    color: var(--accent-primary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: clamp(1rem, 2vw, 1.15rem);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(4, 4, 4, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const ModalContent = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  position: relative;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  transition: transform 0.3s ease;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  
  h3 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.15rem;
    line-height: 1.7;
  }
  
  .close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    
    &:hover {
      color: white;
    }
  }
`;

const ProcessArrow = styled.div`
  color: var(--accent-primary);
  font-size: 1.5rem;
  opacity: 0.5;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const skillDescriptions = {
  'Flutter': 'My primary weapon. 2.9 years of experience building complex, production-ready mobile applications with beautiful UI and smooth animations.',
  'Dart': 'The backbone of my Flutter apps. Strong grasp of OOP, asynchronous programming, and performance optimization.',
  'Clean Architecture': 'I build scalable apps using domain-driven design, ensuring the codebase remains maintainable as the product grows.',
  'MVVM': 'Experienced in Model-View-ViewModel pattern for clean separation of UI and business logic.',
  'BLoC/Cubit': 'My go-to state management solution for complex, enterprise-level Flutter applications.',
  'Riverpod': 'Used for modern, compile-safe state management and dependency injection in newer projects.',
  'Firebase': 'Extensive experience with Firestore, Auth, Storage, and Cloud Functions for rapid backend development.',
  'SQLite': 'Expert in offline-first architectures. I ensure zero data loss by syncing local SQLite databases with remote servers.',
  'REST APIs': 'Strong experience integrating complex third-party and custom REST APIs securely.',
  'MongoDB': 'NoSQL database experience for flexible, scalable backend data storage.',
  'Node.js': 'Backend development experience for writing custom cloud functions and API endpoints.',
  'Smallcase MF SDK': 'Integrated real-money mutual fund transaction flows for family data organizer apps.',
  'Finvu AA SDK': 'Implemented Account Aggregator flows for secure bank data fetching.',
  'Razorpay': 'Integrated secure payment gateways for premium features and subscriptions.',
  'Git': 'Version control, branching strategies, and collaborative development best practices.',
  'Figma': 'Strong eye for design. I translate Figma mockups into pixel-perfect Flutter UI.',
  'Widget Tests': 'I write comprehensive UI tests to ensure components render and behave correctly.',
  'Unit Tests': 'Logic validation to ensure every function behaves exactly as expected.',
  'Integration Tests': 'End-to-end testing to guarantee smooth user journeys across the app.',
  'Cubit Tests': 'Specific state management testing to catch edge cases in business logic.'
};

const Overlay = ({ splashFinished }) => {
  const heroRef = useRef();
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      if (splashFinished && heroRef.current) {
        gsap.fromTo(heroRef.current.children, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 }
        );
      }

      // 2. Cinematic reveal for Process steps (with back ease)
      const processSteps = gsap.utils.toArray('.process-step');
      processSteps.forEach((step) => {
        gsap.fromTo(step,
          { opacity: 0, scale: 0.5, y: 50, filter: 'blur(10px)' },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    // 4. 3D Magnetic Tilt Effect for interactive cards
    const cards = gsap.utils.toArray('.interactive-card');
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5
      });
    };
    
    const handleMouseLeave = (e) => {
      const card = e.currentTarget;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
        duration: 1
      });
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      ctx.revert();
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [splashFinished]);

  return (
    <OverlayContainer>

      {/* Chapter 1: Arrival */}
      <ChapterSection id="chapter-arrival">
        <div ref={heroRef} style={{ opacity: splashFinished ? 1 : 0 }} className="arrival-content">
          <HeroHeading>
            Hi, I'm <span className="text-gradient-primary">Bhuvaneshwaran.</span>
          </HeroHeading>
          <SubHeading>
            Flutter Developer. Product Builder. Problem Solver.
          </SubHeading>
          <p style={{ marginTop: '2rem', fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '550px', lineHeight: '1.7' }}>
            2.9 years shipping production apps — from Smallcase MF SDK to offline-first architecture. Clean code. Real impact.
            <br /><br />
            "I don't just write code. <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>I own features — from requirement to deployment.</span>"
          </p>
        </div>
      </ChapterSection>

      {/* Chapter 2: The Journey */}
      <ChapterSection id="chapter-journey" style={{ minHeight: '150vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>The Developer Behind The <span className="text-gradient-primary">Code</span></h2>
        <div style={{ maxWidth: '700px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Started coding in 2020 during a pandemic with nothing but curiosity and a laptop. Found Flutter in 2023 — and never looked back.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.8' }}>
            Today I build family data organizer products at <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Beyondco Technologies</span>, integrating real-money flows like Smallcase MF SDK and Finvu Account Aggregator into apps that people actually trust with their savings.
          </p>
        </div>
      </ChapterSection>

      {/* Chapter 3: Skills Universe */}
      <ChapterSection id="chapter-skills" style={{ minHeight: '150vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Core <span className="text-gradient-primary">Arsenal</span></h2>

        <ArsenalCard className="interactive-card" style={{ maxWidth: '1000px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <SkillCategory>
              <h4>Core</h4>
              <SkillChips>
                {['Flutter', 'Dart', 'Clean Architecture', 'MVVM', 'BLoC/Cubit', 'Riverpod'].map(skill => (
                  <div key={skill} className="chip" style={{ cursor: 'pointer' }} onClick={() => setSelectedSkill(skill)}>{skill}</div>
                ))}
              </SkillChips>
            </SkillCategory>

            <SkillCategory>
              <h4>Backend & DB</h4>
              <SkillChips>
                {['Firebase', 'SQLite', 'REST APIs', 'MongoDB', 'Node.js'].map(skill => (
                  <div key={skill} className="chip" style={{ cursor: 'pointer' }} onClick={() => setSelectedSkill(skill)}>{skill}</div>
                ))}
              </SkillChips>
            </SkillCategory>

            <SkillCategory>
              <h4>SDKs & Tools</h4>
              <SkillChips>
                {['Smallcase MF SDK', 'Finvu AA SDK', 'Razorpay', 'Git', 'Figma'].map(skill => (
                  <div key={skill} className="chip" style={{ cursor: 'pointer' }} onClick={() => setSelectedSkill(skill)}>{skill}</div>
                ))}
              </SkillChips>
            </SkillCategory>

            <SkillCategory>
              <h4>Testing</h4>
              <SkillChips>
                {['Widget Tests', 'Unit Tests', 'Integration Tests', 'Cubit Tests'].map(skill => (
                  <div key={skill} className="chip" style={{ cursor: 'pointer' }} onClick={() => setSelectedSkill(skill)}>{skill}</div>
                ))}
              </SkillChips>
            </SkillCategory>
          </div>
        </ArsenalCard>
      </ChapterSection>

      {/* Chapter 4: Featured Projects */}
      <ChapterSection id="chapter-projects" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Things I've <span className="text-gradient-primary">Built</span></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <ProjectCard className="interactive-card">
            <div className="role">Production App</div>
            <h3>SafeBox — Family Data Organizer</h3>
            <p>Personal finance + investment management app. Integrates mutual fund purchases, account aggregation, and loan flows with a seamless UX.</p>
            <p style={{ color: 'var(--text-primary)' }}>Impact: Real users, real money, real responsibility.</p>
          </ProjectCard>

          <ProjectCard className="interactive-card" style={{ alignSelf: 'flex-end' }}>
            <div className="role">Windows + Mobile</div>
            <h3>GameCafe Manager</h3>
            <p>Cross-platform billing solution for gaming cafés — GST engine, real-time session tracking, multi-role staff management.</p>
          </ProjectCard>

          <ProjectCard className="interactive-card">
            <div className="role">In Progress · ETA Aug 2026</div>
            <h3>Fintrack — Personal Finance Tracker</h3>
            <p>Offline-first finance tracker with beautiful data viz and budget intelligence. Building this to showcase Clean Architecture done right.</p>
          </ProjectCard>
        </div>
      </ChapterSection>

      {/* Chapter 5: Development Process */}
      <ChapterSection id="chapter-process" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>The <span className="text-gradient-primary">Process</span></h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1000px' }}>
          {['Idea', 'Research', 'Architecture', 'UI Design', 'Development', 'Testing', 'Deployment', 'Iteration'].map((step, i) => (
            <div key={step} className="process-step" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem 2.5rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
                <span style={{ color: 'var(--accent-primary)', marginRight: '8px' }}>{String(i + 1).padStart(2, '0')}.</span> {step}
              </div>
              {i < 7 && <ProcessArrow>→</ProcessArrow>}
            </div>
          ))}
        </div>
      </ChapterSection>

      {/* Chapter 6: Experience */}
      <ChapterSection id="chapter-experience" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Professional <span className="text-gradient-primary">Experience</span></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Beyondco Technologies</h3>
                <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>Flutter Developer</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Mar 2025 – Present</div>
                <div style={{ color: 'var(--text-secondary)' }}>Coimbatore, India</div>
              </div>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Integrated Smallcase MF SDK, Finvu Account Aggregator SDK, and Loan Fetch flows — real-money features used by real users</li>
              <li>Built complex animations with CustomPainter, AnimationController/Tween, and Lottie</li>
              <li>Maintained offline-first architecture (SQLite + Firebase sync) for zero data loss</li>
              <li>Full test coverage: widget, unit, integration, cubit, and model tests</li>
            </ul>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>T-NXT India Pvt. Ltd.</h3>
                <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>Flutter Developer</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Dec 2022 – Feb 2024</div>
                <div style={{ color: 'var(--text-secondary)' }}>Coimbatore, India</div>
              </div>
            </div>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Sole Flutter developer — owned the entire product lifecycle solo</li>
              <li>Built cross-platform Windows + Mobile billing app for gaming cafés</li>
              <li>GST billing engine, PDF/Excel reports, real-time session timers</li>
              <li>Multi-role access (Admin/Manager/Staff) with JWT authentication</li>
            </ul>
          </GlassCard>
        </div>
      </ChapterSection>

      {/* Chapter 7: Impact */}
      <ChapterSection id="chapter-impact" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '3.5rem' }}>By The <span className="text-gradient-primary">Numbers</span></h2>

        <StatGrid>
          <StatItem>
            <div className="value">2.9</div>
            <div className="label">Years Experience</div>
          </StatItem>
          <StatItem>
            <div className="value">10+</div>
            <div className="label">Features Shipped</div>
          </StatItem>
          <StatItem>
            <div className="value">3</div>
            <div className="label">SDKs Integrated</div>
          </StatItem>
          <StatItem>
            <div className="value">8.19</div>
            <div className="label">CGPA</div>
          </StatItem>
        </StatGrid>
      </ChapterSection>

      {/* Chapter 8: Vision */}
      <ChapterSection id="chapter-vision" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Future <span className="text-gradient-primary">Vision</span></h2>
        <div style={{ maxWidth: '800px' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', lineHeight: '1.8' }}>
            Building <span style={{ color: 'var(--accent-primary)' }}>startups</span>.
            Solving <span style={{ color: 'var(--accent-primary)' }}>meaningful problems</span>.<br />
            Continuously growing as a <span style={{ color: 'var(--accent-primary)' }}>product engineer</span>.
          </p>
        </div>
      </ChapterSection>

      {/* Chapter 9: Contact */}
      <ChapterSection id="chapter-contact" style={{ minHeight: '150vh', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', pointerEvents: 'auto' }}>
          <HeroHeading style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Let's Build Something Extraordinary.</HeroHeading>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '1rem' }}>Let's talk about your next product.</p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            <a href="mailto:bhuvaneshwaranoffl@gmail.com" style={{
              padding: '1rem 3rem',
              background: 'var(--accent-primary)',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '100px',
              fontWeight: '600',
              fontSize: '1.25rem',
              transition: 'transform 0.2s',
            }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
              Email Me
            </a>

            <a href="https://linkedin.com/in/bhuvaneshwaran-n" target="_blank" rel="noreferrer" style={{
              padding: '1rem 3rem',
              background: 'transparent',
              border: '1px solid var(--accent-cyan)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderRadius: '100px',
              fontWeight: '600',
              fontSize: '1.25rem',
              transition: 'background 0.2s',
            }} onMouseOver={e => e.target.style.background = 'rgba(0, 240, 255, 0.1)'} onMouseOut={e => e.target.style.background = 'transparent'}>
              LinkedIn
            </a>
          </div>

          <div style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Built with React Three Fiber, GSAP & obsession — Bhuvaneshwaran N · 2026
          </div>
        </div>
      </ChapterSection>

      {/* Skill Modal */}
      <ModalOverlay isOpen={!!selectedSkill} onClick={() => setSelectedSkill(null)}>
        <ModalContent isOpen={!!selectedSkill} onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelectedSkill(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div style={{ color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Technology</div>
          <h3>{selectedSkill}</h3>
          <p>{selectedSkill && (skillDescriptions[selectedSkill] || 'Experience working with this technology.')}</p>
        </ModalContent>
      </ModalOverlay>
    </OverlayContainer>
  );
};

export default Overlay;
