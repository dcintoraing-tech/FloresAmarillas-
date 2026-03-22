"use client"

import React, { useState } from 'react';
import { FlowerCanvas } from '@/components/FlowerCanvas';
import { ControlsOverlay } from '@/components/ControlsOverlay';
import { Snoopy } from '@/components/Snoopy';
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

      {/* Hero Header - Personalized for Naomy */}
      <div className="pointer-events-none z-10 text-center space-y-4 select-none mb-20 px-6">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary drop-shadow-sm opacity-90 tracking-tight">
          Flores para Naomy
        </h1>
        <p className="text-foreground/70 text-lg md:text-2xl font-medium max-w-2xl mx-auto italic leading-relaxed">
          "Porque un amor como el tuyo merece flores que nunca se marchiten."
        </p>
      </div>

      {/* Flower Canvas */}
      <FlowerCanvas 
        params={params} 
        backgroundColor={currentBg.color1} 
      />

      {/* Snoopy Guest */}
      <Snoopy />

      {/* UI Message / Controls Overlay */}
      <ControlsOverlay 
        params={params} 
        setParams={setParams} 
        bgIndex={bgIndex}
        setBgIndex={setBgIndex}
      />

      {/* Bottom hint */}
      <div className="fixed bottom-4 text-xs text-foreground/30 pointer-events-none font-medium">
        Hecho con todo mi amor para ti.
      </div>
    </main>
  );
}
