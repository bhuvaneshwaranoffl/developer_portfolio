import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import BackgroundStars from './scenes/BackgroundStars';
import ChapterArrival from './scenes/ChapterArrival';
import ChapterJourney from './scenes/ChapterJourney';
import ChapterSkills from './scenes/ChapterSkills';
import ChapterContact from './scenes/ChapterContact';

const CanvasContainer = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]} // Optimize for high DPI displays while maintaining performance
      gl={{ antialias: false, alpha: false }} // Alpha false since background is black anyway, helps performance
    >
      <color attach="background" args={['#040404']} />
      
      <Suspense fallback={null}>
        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00F0FF" />
        <directionalLight position={[-10, -10, 5]} intensity={0.5} color="#D946EF" />

        {/* Cinematic Universe Elements */}
        <BackgroundStars />
        <ChapterArrival />
        <ChapterJourney />
        <ChapterContact />
        
        {/* Post Processing for Cinematic Look */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9} 
            intensity={1.5} 
            mipmapBlur
          />
          <Noise opacity={0.035} />
        </EffectComposer>

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default CanvasContainer;
