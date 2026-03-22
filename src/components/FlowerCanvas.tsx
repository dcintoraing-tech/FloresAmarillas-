"use client"

import React, { useRef, useEffect, useState } from 'react';
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
    this.size = 18 + Math.random() * 25;
    this.rotation = Math.random() * Math.PI * 2;
    this.phase = Math.random() * Math.PI * 2;
    this.petalCount = 6 + Math.floor(Math.random() * 4);
    const yellowVariations = ['#EBCE47', '#F3D662', '#FADF7D', '#E2C439'];
    this.color = yellowVariations[Math.floor(Math.random() * yellowVariations.length)];
    this.opacity = 0.7 + Math.random() * 0.3;
    this.stemColor = '#4D7C0F'; // Un verde más oscuro y natural
  }

  update(width: number, height: number, params: FlowerParams, time: number) {
    const { speed, swayMagnitude, driftDirection, driftSpeed, pulseEffect } = params;
    
    // Movimiento de balanceo
    this.rotation += Math.sin(time * 0.001 * speed + this.phase) * 0.005 * swayMagnitude;
    
    // Movimiento de deriva
    let dx = 0;
    let dy = 0;
    const effectiveDrift = driftSpeed * speed * 0.5;

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
    const pulse = 1 + Math.sin(time * 0.002 * speed + this.phase) * 0.08 * pulseEffect;

    // Ajuste de pantalla infinita
    if (this.x < -this.size * 3) this.x = width + this.size;
    if (this.x > width + this.size * 3) this.x = -this.size;
    if (this.y < -this.size * 3) this.y = height + this.size;
    if (this.y > height + this.size * 3) this.y = -this.size;

    return pulse;
  }

  draw(ctx: CanvasRenderingContext2D, pulse: number) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    
    const s = this.size * pulse;

    // Dibujar el tallo (curvado para que se vea más natural)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(s * 0.3, s * 1.5, s * 0.1, s * 3.5);
    ctx.strokeStyle = this.stemColor;
    ctx.lineWidth = s * 0.12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dibujar una pequeña hoja en el tallo
    ctx.save();
    ctx.translate(s * 0.2, s * 1.8);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.3, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.stemColor;
    ctx.fill();
    ctx.restore();

    // Dibujar pétalos
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.petalCount; i++) {
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.65, s * 0.45, s * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate((Math.PI * 2) / this.petalCount);
    }

    // Dibujar centro de la flor
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#C4A000';
    ctx.fill();
    
    // Detalles del centro (estambres)
    ctx.fillStyle = '#E6C641';
    for(let i = 0; i < 6; i++) {
        ctx.beginPath();
        const ang = (i * Math.PI * 2) / 6;
        ctx.arc(Math.cos(ang) * s * 0.2, Math.sin(ang) * s * 0.2, s * 0.06, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  }
}

export const FlowerCanvas: React.FC<FlowerCanvasProps> = ({ params, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<FlowerInstance[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const count = Math.floor((canvas.width * canvas.height) / 18000) * params.density;
      flowersRef.current = Array.from({ length: count }, () => new FlowerInstance(canvas.width, canvas.height));
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const targetCount = Math.floor((canvas.width * canvas.height) / 18000) * params.density;
      if (flowersRef.current.length !== targetCount) {
        if (flowersRef.current.length < targetCount) {
          const toAdd = targetCount - flowersRef.current.length;
          for (let i = 0; i < toAdd; i++) flowersRef.current.push(new FlowerInstance(canvas.width, canvas.height));
        } else {
          flowersRef.current = flowersRef.current.slice(0, targetCount);
        }
      }

      flowersRef.current.forEach(flower => {
        const pulse = flower.update(canvas.width, canvas.height, params, time);
        flower.draw(ctx, pulse);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [params.density]);

  useEffect(() => {
    if (canvasRef.current) {
        canvasRef.current.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 transition-colors duration-1000 ease-in-out"
    />
  );
};