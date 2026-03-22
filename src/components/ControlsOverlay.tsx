"use client"

import React, { useState } from 'react';
import { Heart, Sparkles, X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlowerParams } from '@/lib/flower-types';

interface ControlsOverlayProps {
  params: FlowerParams;
  setParams: React.Dispatch<React.SetStateAction<FlowerParams>>;
  bgIndex: number;
  setBgIndex: (index: number) => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  params,
  setParams,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      {/* Romantic Message Card */}
      <Card 
        className={`controls-overlay border-primary/20 shadow-2xl p-8 transition-all duration-500 ease-out transform ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-20 scale-95 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full animate-pulse">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline font-bold text-2xl text-primary">
              Para mi niña hermosa, Naomy
            </h2>
            <div className="space-y-3 text-foreground/80 leading-relaxed text-lg">
              <p>
                Perdóname por no poder entregarte tus flores amarillas en persona hoy, 
                pero no quería que te quedaras sin ellas.
              </p>
              <p>
                Así que creé este pequeño rincón digital solo para ti. Estas flores 
                nunca se marchitarán, siempre estarán brillando y moviéndose con la 
                suavidad de tu sonrisa.
              </p>
              <p className="font-bold text-primary italic">
                Te amo muchísimo, Naomy. Eres el sol que ilumina todos mis días y 
                mi razón favorita para sonreír.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Eternas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 px-3 py-1 rounded-full">
              <Heart className="w-3 h-3 text-red-400" />
              <span>Infinito</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Love Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-8 h-auto font-bold flex flex-col gap-1 group transition-all hover:scale-110 active:scale-95 border-4 border-white"
        >
          <Heart className="w-8 h-8 group-hover:scale-125 transition-transform fill-current" />
          <span className="text-sm tracking-widest uppercase">Abrir mi corazón</span>
        </Button>
      )}
    </div>
  );
};
