import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CanvasContainer from './components/CanvasContainer';
import Overlay from './components/ui/Overlay';
import SplashScreen from './components/ui/SplashScreen';
import CustomCursor from './components/ui/CustomCursor';
import NavBar from './components/ui/NavBar';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;
    window.lenis = lenis;

    // Stop scrolling initially until splash finishes
    if (!splashFinished) {
      lenis.stop();
    } else {
      lenis.start();
    }

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [splashFinished]);

  return (
    <>
      <CustomCursor />
      {!splashFinished && <SplashScreen onComplete={() => setSplashFinished(true)} />}
      {splashFinished && <NavBar />}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <CanvasContainer />
      </div>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', pointerEvents: 'none' }}>
        <Overlay splashFinished={splashFinished} />
      </div>
    </>
  );
}

export default App;
