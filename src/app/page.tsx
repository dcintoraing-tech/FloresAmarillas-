"use client"

import React, { useState } from 'react';
import { FlowerCanvas } from '@/components/FlowerCanvas';
import { ControlsOverlay } from '@/components/ControlsOverlay';
import { Snoopy } from '@/components/Snoopy';
import { FlowerParams, BACKGROUND_OPTIONS } from '@/lib/flower-types';

export default function Home() {
  const [params, setParams] = useState<FlowerParams>({
    speed: 1.0,
    density: 1.0,
    swayMagnitude: 0.5,
    driftDirection: 'random',
    driftSpeed: 0.1,
    pulseEffect: 0.2
  });

  const [bgIndex, setBgIndex] = useState(0);

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
      <div className="pointer-events-none z-10 text-center space-y-2 select-none mb-20">
        <h1 className="text-6xl md:text-8xl font-headline font-bold text-primary drop-shadow-sm opacity-90 tracking-tight">
          SunnyBlooms
        </h1>
        <p className="text-foreground/60 text-lg md:text-xl font-medium">
          Un escape tranquilo entre pétalos dorados.
        </p>
      </div>

      {/* Flower Canvas */}
      <FlowerCanvas 
        params={params} 
        backgroundColor={currentBg.color1} 
      />

      {/* Snoopy Guest */}
      <Snoopy />

      {/* UI Controls */}
      <ControlsOverlay 
        params={params} 
        setParams={setParams} 
        bgIndex={bgIndex}
        setBgIndex={setBgIndex}
      />

      {/* Bottom hint */}
      <div className="fixed bottom-4 text-xs text-foreground/30 pointer-events-none font-medium">
        Diseñado para la serenidad.
      </div>
    </main>
  );
}
