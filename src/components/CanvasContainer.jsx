import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import BackgroundStars from './scenes/BackgroundStars';
import ChapterArrival from './scenes/ChapterArrival';
import ChapterJourney from './scenes/ChapterJourney';
import ChapterContact from './scenes/ChapterContact';

const CanvasContainer = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <color attach="background" args={['#040404']} />
      
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00F0FF" />
        <directionalLight position={[-10, -10, 5]} intensity={0.5} color="#D946EF" />

        <BackgroundStars />
        <ChapterArrival />
        <ChapterJourney />
        <ChapterContact />
        
        {!isMobile && (
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9} 
              intensity={1.5} 
              mipmapBlur
            />
          </EffectComposer>
        )}

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default CanvasContainer;
