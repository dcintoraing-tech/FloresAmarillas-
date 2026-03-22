"use client"

import React from 'react';

export const Snoopy: React.FC = () => {
  return (
    <div className="fixed bottom-12 right-12 md:right-24 z-0 pointer-events-none select-none opacity-90 animate-bounce-slow">
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Cuerpo/Cabeza - Estilo minimalista tipo Snoopy */}
        <path
          d="M80 50C80 35 65 25 50 25C35 25 20 35 20 55C20 75 40 85 60 85C80 85 80 70 80 50Z"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="3"
        />
        
        {/* Oreja negra caída */}
        <path
          d="M75 40C85 40 95 50 95 65C95 80 85 85 75 80L70 60L75 40Z"
          fill="#1A1A1A"
        />
        
        {/* Ojo */}
        <circle cx="45" cy="45" r="2" fill="#1A1A1A" />
        
        {/* Nariz */}
        <ellipse cx="20" cy="55" rx="5" ry="4" fill="#1A1A1A" />
        
        {/* Collar Rojo */}
        <path
          d="M58 80C65 80 75 78 78 72"
          stroke="#EF4444"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Pequeña sonrisa */}
        <path
          d="M35 60C40 65 45 65 50 62"
          stroke="#1A1A1A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Sombra en el suelo */}
      <div className="w-20 h-4 bg-black/10 blur-md rounded-full mx-auto -mt-2" />
    </div>
  );
};
