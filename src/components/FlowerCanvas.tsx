
"use client"

import React, { useRef, useEffect } from 'react';
import { FlowerParams } from '@/lib/flower-types';

class FlowerInstance {
  x: number;
  y: number;
  size: number;
  rotation: number;
  phase: number;
  petalCount: number;
  color: string;
  opacity: number;
  stemColor: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 15 + Math.random() * 20;
    this.rotation = Math.random() * Math.PI * 2;
    this.phase = Math.random() * Math.PI * 2;
    this.petalCount = 6 + Math.floor(Math.random() * 3);
    const yellowVariations = ['#EBCE47', '#F3D662', '#FADF7D', '#E2C439'];
    this.color = yellowVariations[Math.floor(Math.random() * yellowVariations.length)];
    this.opacity = 0.6 + Math.random() * 0.4;
    this.stemColor = '#3F6212'; // Verde bosque más profundo
  }

  update(width: number, height: number, params: FlowerParams, time: number, deltaTime: number) {
    const { speed, swayMagnitude, driftDirection, driftSpeed, pulseEffect } = params;
    
    // Ajuste de velocidad basado en tiempo real para evitar lag visual
    const timeFactor = deltaTime * 0.06; 
    
    // Movimiento de balanceo (sway)
    this.rotation += Math.sin(time * 0.001 * speed + this.phase) * 0.002 * swayMagnitude * timeFactor;
    
    // Movimiento de deriva (drift)
    let dx = 0;
    let dy = 0;
    const effectiveDrift = driftSpeed * speed * 0.5 * timeFactor;

    switch (driftDirection) {
      case 'left': dx = -effectiveDrift; break;
      case 'right': dx = effectiveDrift; break;
      case 'up': dy = -effectiveDrift; break;
      case 'down': dy = effectiveDrift; break;
      case 'random':
        dx = Math.cos(this.phase + time * 0.0001) * effectiveDrift;
        dy = Math.sin(this.phase + time * 0.0001) * effectiveDrift;
        break;
    }

    this.x += dx;
    this.y += dy;

    // Efecto de pulsación
    const pulse = 1 + Math.sin(time * 0.002 * speed + this.phase) * 0.05 * pulseEffect;

    // Ajuste de pantalla infinita con margen para evitar "popping"
    const margin = this.size * 5;
    if (this.x < -margin) this.x = width + margin;
    if (this.x > width + margin) this.x = -margin;
    if (this.y < -margin) this.y = height + margin;
    if (this.y > height + margin) this.y = -margin;

    return pulse;
  }

  draw(ctx: CanvasRenderingContext2D, pulse: number) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    
    const s = this.size * pulse;

    // Dibujar el tallo
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(s * 0.3, s * 1.5, s * 0.1, s * 4);
    ctx.strokeStyle = this.stemColor;
    ctx.lineWidth = s * 0.15;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dibujar hoja
    ctx.save();
    ctx.translate(s * 0.2, s * 2);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.4, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.stemColor;
    ctx.fill();
    ctx.restore();

    // Dibujar pétalos
    ctx.fillStyle = this.color;
    const petalAngle = (Math.PI * 2) / this.petalCount;
    for (let i = 0; i < this.petalCount; i++) {
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.7, s * 0.5, s * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(petalAngle);
    }

    // Centro de la flor
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#A16207'; // Marrón ocre para el centro
    ctx.fill();
    
    ctx.restore();
  }
}

interface FlowerCanvasProps {
  params: FlowerParams;
  backgroundColor: string;
}

export const FlowerCanvas: React.FC<FlowerCanvasProps> = ({ params, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<FlowerInstance[]>([]);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const initFlowers = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const targetCount = Math.floor((canvas.width * canvas.height) / 25000) * params.density;
      
      // En lugar de resetear, ajustamos la cantidad
      if (flowersRef.current.length < targetCount) {
        const toAdd = targetCount - flowersRef.current.length;
        for (let i = 0; i < toAdd; i++) {
          flowersRef.current.push(new FlowerInstance(canvas.width, canvas.height));
        }
      } else if (flowersRef.current.length > targetCount) {
        flowersRef.current = flowersRef.current.slice(0, targetCount);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // No re-inicializamos las flores aquí para evitar que desaparezcan
    };

    window.addEventListener('resize', handleResize);
    initFlowers();

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Limpieza con color de fondo para evitar trails y mejorar rendimiento
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      flowersRef.current.forEach(flower => {
        const pulse = flower.update(canvas.width, canvas.height, params, time, deltaTime);
        flower.draw(ctx, pulse);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [params.density, backgroundColor]); // Solo re-inicializamos si la densidad o el fondo cambian radicalmente

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ touchAction: 'none' }}
    />
  );
};
