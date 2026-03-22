"use client"

import React, { useState } from 'react';
import { Settings, Wind, Sparkles, SlidersHorizontal, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FlowerParams, BACKGROUND_OPTIONS } from '@/lib/flower-types';
import { customizeAnimationStyle } from '@/ai/flows/animation-style-customization';

interface ControlsOverlayProps {
  params: FlowerParams;
  setParams: React.Dispatch<React.SetStateAction<FlowerParams>>;
  bgIndex: number;
  setBgIndex: (index: number) => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  params,
  setParams,
  bgIndex,
  setBgIndex
}) => {
  const [aiDescription, setAiDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAiStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiDescription.trim()) return;

    setIsProcessing(true);
    try {
      const result = await customizeAnimationStyle({ description: aiDescription });
      setParams(prev => ({
        ...prev,
        swayMagnitude: result.swayMagnitude,
        driftDirection: result.driftDirection as any,
        driftSpeed: result.driftSpeed,
        pulseEffect: result.pulseEffect,
        speed: prev.speed * result.speedMultiplier // Combine with manual speed
      }));
      setAiDescription('');
    } catch (error) {
      console.error('Failed to apply AI style:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Card className={`controls-overlay border-none shadow-2xl p-6 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Bloom Controls
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Density
              </label>
              <Slider 
                value={[params.density]} 
                min={0.5} 
                max={5} 
                step={0.1}
                onValueChange={([val]) => setParams(p => ({ ...p, density: val }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Flow Speed
              </label>
              <Slider 
                value={[params.speed]} 
                min={0.1} 
                max={3} 
                step={0.1}
                onValueChange={([val]) => setParams(p => ({ ...p, speed: val }))}
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium flex items-center gap-2">
               <Palette className="w-4 h-4" /> Ambience
             </label>
             <div className="flex gap-2">
                {BACKGROUND_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setBgIndex(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${bgIndex === i ? 'border-primary scale-110 shadow-lg' : 'border-transparent'}`}
                    style={{ 
                        background: opt.type === 'solid' ? opt.color1 : `linear-gradient(135deg, ${opt.color1}, ${opt.color2})`
                    }}
                    aria-label={`Select background ${i + 1}`}
                  />
                ))}
             </div>
          </div>

          <form onSubmit={handleAiStyle} className="space-y-3 pt-2 border-t">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Animation Stylist
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., gentle breeze, lively dance..."
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                className="bg-background/50 border-none focus-visible:ring-primary"
              />
              <Button type="submit" disabled={isProcessing} className="bg-primary hover:bg-primary/80">
                {isProcessing ? 'Thinking...' : 'Style'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 h-auto font-bold flex gap-2 group transition-all hover:scale-105"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          Customize Your Blooms
        </Button>
      )}
    </div>
  );
};
