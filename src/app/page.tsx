"use client"

import React, { useState } from 'react';
import { FlowerCanvas } from '@/components/FlowerCanvas';
import { ControlsOverlay } from '@/components/ControlsOverlay';
import { FlowerParams, BACKGROUND_OPTIONS } from '@/lib/flower-types';

export default function Home() {
  const [params, setParams] = useState<FlowerParams>({
    speed: 0.2, // Aún más lento para mayor suavidad
    density: 1.0, // Densidad máxima para que el campo se vea lleno
    swayMagnitude: 0.3,
    driftDirection: 'random',
    driftSpeed: 0.015,
    pulseEffect: 0.1
  });

  const [bgIndex, setBgIndex] = useState(1);

  const currentBg = BACKGROUND_OPTIONS[bgIndex];
  const bgStyle = currentBg.type === 'solid' 
    ? currentBg.color1 
    : `linear-gradient(135deg, ${currentBg.color1}, ${currentBg.color2})`;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 transition-all duration-1000 ease-in-out -z-20"
        style={{ 
            background: bgStyle 
        }}
      />

      {/* Hero Header */}
      <div className="pointer-events-none z-10 text-center space-y-4 md:space-y-6 select-none px-6 max-w-4xl mt-[-15vh] md:mt-[-10vh]">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-bold text-[#8B6B00] drop-shadow-md tracking-tight leading-tight">
          Un Jardín Eterno
        </h1>
        <p className="text-[#5C4800] text-base sm:text-xl md:text-3xl font-medium italic leading-relaxed bg-white/40 backdrop-blur-md py-2 px-6 md:py-3 rounded-full inline-block shadow-sm border border-white/20">
          "Flores que nunca se marchitan, como mi amor por ti."
        </p>
      </div>

      {/* Flower Canvas */}
      <FlowerCanvas 
        params={params} 
        backgroundColor={currentBg.color1} 
      />

      {/* UI Message / Controls Overlay */}
      <ControlsOverlay 
        params={params} 
        setParams={setParams} 
        bgIndex={bgIndex}
        setBgIndex={setBgIndex}
      />
    </main>
  );
}
