
"use client"

import React, { useState } from 'react';
import { FlowerCanvas } from '@/components/FlowerCanvas';
import { ControlsOverlay } from '@/components/ControlsOverlay';
import { FlowerParams, BACKGROUND_OPTIONS } from '@/lib/flower-types';

export default function Home() {
  const [params, setParams] = useState<FlowerParams>({
    speed: 0.8,
    density: 1.2,
    swayMagnitude: 0.6,
    driftDirection: 'random',
    driftSpeed: 0.1,
    pulseEffect: 0.3
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
      <div className="pointer-events-none z-10 text-center space-y-6 select-none px-6 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-headline font-bold text-[#8B6B00] drop-shadow-md tracking-tight">
          Un Jardín Eterno
        </h1>
        <p className="text-[#5C4800] text-xl md:text-3xl font-medium italic leading-relaxed bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
          "Flores amarillas que nunca se marchitan, como mi amor por ti."
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

      {/* Bottom hint */}
      <div className="fixed bottom-4 text-sm text-[#8B6B00]/60 pointer-events-none font-bold uppercase tracking-widest">
        Para mi Naomy favorita
      </div>
    </main>
  );
}
