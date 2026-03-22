"use client"

import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
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
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Carta de Amor */}
      <Card 
        className={`controls-overlay border-[#6D5400]/20 shadow-2xl p-8 transition-all duration-700 ease-in-out transform pointer-events-auto max-w-lg w-full mx-4 relative ${
          isOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-90 -translate-y-20 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#6D5400] hover:text-[#8B6B00] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-4 rounded-full animate-pulse">
              <Heart className="w-10 h-10 text-[#6D5400] fill-[#6D5400]" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline font-bold text-3xl text-[#6D5400]">
              Un detalle para ti
            </h2>
            <div className="space-y-4 text-[#4A3A00] leading-relaxed text-lg">
              <p>
                Hoy no pude estar allí para entregarte tus flores amarillas en mano, 
                pero no quería que pasara el día sin que tuvieras este detalle.
              </p>
              <p>
                He creado este jardín digital solo para ti. Son flores que no necesitan 
                agua ni sol, porque se alimentan de lo mucho que te amo. Estarán 
                brillando siempre para recordarte lo especial que eres en mi vida.
              </p>
              <p className="font-bold text-[#6D5400] text-xl italic border-t border-[#6D5400]/10 pt-4">
                Te amo muchísimo. Eres la luz que ilumina mi mundo.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D5400] bg-primary/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>SIEMPRE JUNTOS</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Botón Central */}
      {!isOpen && (
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 pointer-events-auto">
          <Button 
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-2xl bg-[#6D5400] hover:bg-[#4D3C00] text-white px-10 py-10 h-auto font-bold flex flex-col gap-2 group transition-all hover:scale-110 active:scale-95 border-8 border-white/80 animate-bounce"
          >
            <Heart className="w-10 h-10 group-hover:scale-125 transition-transform fill-current" />
            <span className="text-base tracking-widest uppercase">Ver mi regalo</span>
          </Button>
        </div>
      )}
    </div>
  );
};