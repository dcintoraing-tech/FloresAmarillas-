"use client"

import React, { useRef, useEffect, useState } from 'react';
import { FlowerParams } from '@/lib/flower-types';

interface FlowerCanvasProps {
  params: FlowerParams;
  backgroundColor: string;
}

class FlowerInstance {
  x: number;
  y: number;
  size: number;
  rotation: number;
  phase: number;
  petalCount: number;
  color: string;
  opacity: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 15 + Math.random() * 30;
    this.rotation = Math.random() * Math.PI * 2;
    this.phase = Math.random() * Math.PI * 2;
    this.petalCount = 5 + Math.floor(Math.random() * 3);
    const yellowVariations = ['#EBCE47', '#F3D662', '#FADF7D', '#E2C439'];
    this.color = yellowVariations[Math.floor(Math.random() * yellowVariations.length)];
    this.opacity = 0.6 + Math.random() * 0.4;
  }

  update(width: number, height: number, params: FlowerParams, time: number) {
    const { speed, swayMagnitude, driftDirection, driftSpeed, pulseEffect } = params;
    
    // Swaying
    this.rotation += Math.sin(time * 0.001 * speed + this.phase) * 0.005 * swayMagnitude;
    
    // Drifting
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

    // Pulse effect
    const pulse = 1 + Math.sin(time * 0.002 * speed + this.phase) * 0.1 * pulseEffect;

    // Wrap around screen
    if (this.x < -this.size * 2) this.x = width + this.size;
    if (this.x > width + this.size * 2) this.x = -this.size;
    if (this.y < -this.size * 2) this.y = height + this.size;
    if (this.y > height + this.size * 2) this.y = -this.size;

    return pulse;
  }

  draw(ctx: CanvasRenderingContext2D, pulse: number) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    
    const s = this.size * pulse;

    // Draw petals
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.petalCount; i++) {
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.6, s * 0.4, s * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate((Math.PI * 2) / this.petalCount);
    }

    // Draw center
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#C4A000';
    ctx.fill();
    
    // Tiny center dots
    ctx.fillStyle = '#E6C641';
    for(let i = 0; i < 5; i++) {
        ctx.beginPath();
        const ang = (i * Math.PI * 2) / 5;
        ctx.arc(Math.cos(ang) * s * 0.15, Math.sin(ang) * s * 0.15, s * 0.05, 0, Math.PI * 2);
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
      
      // Re-initialize flowers on significant resize or just fill up
      const count = Math.floor((canvas.width * canvas.height) / 15000) * params.density;
      flowersRef.current = Array.from({ length: count }, () => new FlowerInstance(canvas.width, canvas.height));
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update count if density changed
      const targetCount = Math.floor((canvas.width * canvas.height) / 15000) * params.density;
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

      requestRef.current = requestAnimFrame(animate);
    };

    const requestAnimFrame = (window.requestAnimationFrame || 
      (window as any).webkitRequestAnimationFrame || 
      (window as any).mozRequestAnimationFrame || 
      (window as any).oRequestAnimationFrame || 
      (window as any).msRequestAnimationFrame || 
      function(callback: FrameRequestCallback) {
        return window.setTimeout(callback, 1000 / 60);
      }).bind(window);

    requestRef.current = requestAnimFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [params.density]); // Re-init count logic on density change

  // Separate effect for background updates to avoid full canvas re-re-resize
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
