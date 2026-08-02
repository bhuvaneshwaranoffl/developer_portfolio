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
  font-size: clamp(2.5rem, 8vw, 6.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
`;

const SubHeading = styled.h2`
  font-size: clamp(1.25rem, 4vw, 2.5rem);
  font-weight: 500;
  color: var(--text-secondary);
  max-width: 800px;
  line-height: 1.4;
  margin-bottom: 2rem;
  letter-spacing: -0.01em;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: transform 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SkillCategory = styled.div`
  margin-bottom: 3rem;
  
  h4 {
    color: var(--accent-cyan);
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
  
  .chip {
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    font-weight: 500;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 240, 255, 0.1);
      border-color: var(--accent-cyan);
      transform: translateY(-2px);
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
    color: var(--accent-cyan);
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
    color: var(--accent-cyan);
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

const ProcessArrow = styled.div`
  color: var(--accent-cyan);
  font-size: 1.5rem;
  opacity: 0.5;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Overlay = ({ splashFinished }) => {
  const heroRef = useRef();

  useLayoutEffect(() => {
    if (splashFinished && heroRef.current) {
      gsap.fromTo(heroRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }

    // Cinematic reveal for Process steps
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

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [splashFinished]);

  return (
    <OverlayContainer>
      
      {/* Chapter 1: Arrival */}
      <ChapterSection id="chapter-arrival">
        <div ref={heroRef} style={{ opacity: splashFinished ? 1 : 0 }} className="arrival-content">
          <HeroHeading>
            Hi, I'm <span className="text-gradient-cyan">Bhuvaneshwaran.</span>
          </HeroHeading>
          <SubHeading>
            Flutter Developer.<br/>
            Product Builder.<br/>
            Problem Solver.
          </SubHeading>
          <p style={{ marginTop: '3rem', fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: '1.7' }}>
            2.9 years shipping production apps — from Smallcase MF SDK to offline-first architecture. Clean code. Real impact.
            <br/><br/>
            "I don't just write code. <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>I own features — from requirement to deployment.</span>"
          </p>
        </div>
      </ChapterSection>

      {/* Chapter 2: The Journey */}
      <ChapterSection id="chapter-journey" style={{ minHeight: '150vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>The Developer Behind The <span className="text-gradient-cyan">Code</span></h2>
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
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Core <span className="text-gradient-cyan">Arsenal</span></h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1000px' }}>
          <SkillCategory>
            <h4>Core</h4>
            <SkillChips>
              {['Flutter', 'Dart', 'Clean Architecture', 'MVVM', 'BLoC/Cubit', 'Riverpod'].map(skill => (
                <div key={skill} className="chip">{skill}</div>
              ))}
            </SkillChips>
          </SkillCategory>

          <SkillCategory>
            <h4>Backend & DB</h4>
            <SkillChips>
              {['Firebase', 'SQLite', 'REST APIs', 'MongoDB', 'Node.js'].map(skill => (
                <div key={skill} className="chip">{skill}</div>
              ))}
            </SkillChips>
          </SkillCategory>

          <SkillCategory>
            <h4>SDKs & Tools</h4>
            <SkillChips>
              {['Smallcase MF SDK', 'Finvu AA SDK', 'Razorpay', 'Git', 'Figma'].map(skill => (
                <div key={skill} className="chip">{skill}</div>
              ))}
            </SkillChips>
          </SkillCategory>
          
          <SkillCategory>
            <h4>Testing</h4>
            <SkillChips>
              {['Widget Tests', 'Unit Tests', 'Integration Tests', 'Cubit Tests'].map(skill => (
                <div key={skill} className="chip">{skill}</div>
              ))}
            </SkillChips>
          </SkillCategory>
        </div>
      </ChapterSection>

      {/* Chapter 4: Featured Projects */}
      <ChapterSection id="chapter-projects" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Things I've <span className="text-gradient-cyan">Built</span></h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <ProjectCard>
            <div className="role">Production App</div>
            <h3>SafeBox — Family Data Organizer</h3>
            <p>Personal finance + investment management app. Integrates mutual fund purchases, account aggregation, and loan flows with a seamless UX.</p>
            <p style={{ color: 'var(--text-primary)' }}>Impact: Real users, real money, real responsibility.</p>
          </ProjectCard>

          <ProjectCard style={{ alignSelf: 'flex-end' }}>
            <div className="role">Windows + Mobile</div>
            <h3>GameCafe Manager</h3>
            <p>Cross-platform billing solution for gaming cafés — GST engine, real-time session tracking, multi-role staff management.</p>
          </ProjectCard>

          <ProjectCard>
            <div className="role">In Progress · ETA Aug 2026</div>
            <h3>Fintrack — Personal Finance Tracker</h3>
            <p>Offline-first finance tracker with beautiful data viz and budget intelligence. Building this to showcase Clean Architecture done right.</p>
          </ProjectCard>
        </div>
      </ChapterSection>

      {/* Chapter 5: Development Process */}
      <ChapterSection id="chapter-process" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>The <span className="text-gradient-cyan">Process</span></h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1000px' }}>
          {['Idea', 'Research', 'Architecture', 'UI Design', 'Development', 'Testing', 'Deployment', 'Iteration'].map((step, i) => (
            <div key={step} className="process-step" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem 2.5rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
                <span style={{ color: 'var(--accent-cyan)', marginRight: '8px' }}>{String(i + 1).padStart(2, '0')}.</span> {step}
              </div>
              {i < 7 && <ProcessArrow>→</ProcessArrow>}
            </div>
          ))}
        </div>
      </ChapterSection>

      {/* Chapter 6: Experience */}
      <ChapterSection id="chapter-experience" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Professional <span className="text-gradient-cyan">Experience</span></h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Beyondco Technologies</h3>
                <div style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', marginBottom: '1rem' }}>Flutter Developer</div>
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
                <div style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', marginBottom: '1rem' }}>Flutter Developer</div>
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
        <h2 style={{ fontSize: '3.5rem' }}>By The <span className="text-gradient-cyan">Numbers</span></h2>
        
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
        <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Future <span className="text-gradient-cyan">Vision</span></h2>
        <div style={{ maxWidth: '800px' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', lineHeight: '1.8' }}>
            Building <span style={{ color: 'var(--accent-cyan)' }}>startups</span>.
            Solving <span style={{ color: 'var(--accent-cyan)' }}>meaningful problems</span>.<br/>
            Continuously growing as a <span style={{ color: 'var(--accent-cyan)' }}>product engineer</span>.
          </p>
        </div>
      </ChapterSection>

      {/* Chapter 9: Contact */}
      <ChapterSection id="chapter-contact" style={{ minHeight: '150vh', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', pointerEvents: 'auto' }}>
          <HeroHeading style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Let's Build Something Extraordinary.</HeroHeading>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '1rem' }}>Let's talk about your next family data organizer product.</p>
          
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            <a href="mailto:bhuvaneshwaranoffl@gmail.com" style={{ 
              padding: '1rem 3rem', 
              background: 'var(--accent-cyan)', 
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

    </OverlayContainer>
  );
};

export default Overlay;
