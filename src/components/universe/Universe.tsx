'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleSystem } from '@/lib/canvas/ParticleSystem';
import { FlowerField } from '@/lib/canvas/FlowerField';
import { FlowerData } from '@/lib/flowersData';

interface UniverseProps {
  onSelectFlower: (flower: FlowerData) => void;
  selectedFlowerId: string | null;
  isFinaleActive: boolean;
}

export const Universe: React.FC<UniverseProps> = ({
  onSelectFlower,
  selectedFlowerId,
  isFinaleActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const flowerFieldRef = useRef<FlowerField | null>(null);

  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const targetMouseOffsetRef = useRef({ x: 0, y: 0 });

  const selectedFlowerIdRef = useRef(selectedFlowerId);
  useEffect(() => { selectedFlowerIdRef.current = selectedFlowerId; }, [selectedFlowerId]);

  const isFinaleActiveRef = useRef(isFinaleActive);
  useEffect(() => {
    isFinaleActiveRef.current = isFinaleActive;
    if (flowerFieldRef.current) {
      if (isFinaleActive) flowerFieldRef.current.activateFinale();
      else flowerFieldRef.current.resetFinale();
    }
  }, [isFinaleActive]);

  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const isMobileRef = useRef(false);
  const wCacheRef = useRef(0);
  const hCacheRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const particleSystem = new ParticleSystem();
    const flowerField = new FlowerField();
    particleSystemRef.current = particleSystem;
    flowerFieldRef.current = flowerField;

    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      isMobileRef.current = isMobile;
      // DPR: 1 en movil, max 1.5 en desktop
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      wCacheRef.current = w;
      hCacheRef.current = h;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset antes de escalar
      ctx.scale(dpr, dpr);

      particleSystem.resize(w, h, isMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let animationFrameId: number;
    const startTime = performance.now();
    let lastFrameTime = 0;
    let lastRenderTime = 0;
    // Movil: ~24fps (41ms), Desktop: ~60fps (16ms)
    const MOBILE_INTERVAL = 41;
    const DESKTOP_INTERVAL = 16;

    const render = (now: number) => {
      const isMobile = isMobileRef.current;
      const interval = isMobile ? MOBILE_INTERVAL : DESKTOP_INTERVAL;

      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastRenderTime;
      if (elapsed < interval) return; // throttle

      const deltaTime = Math.min(now - lastFrameTime, 100); // cap deltaTime a 100ms
      lastFrameTime = now;
      lastRenderTime = now;

      const time = now - startTime;
      const w = wCacheRef.current;
      const h = hCacheRef.current;

      // Suavizado del mouse — mas rapido en movil
      const lerpFactor = isMobile ? 0.1 : 0.05;
      mouseOffsetRef.current.x += (targetMouseOffsetRef.current.x - mouseOffsetRef.current.x) * lerpFactor;
      mouseOffsetRef.current.y += (targetMouseOffsetRef.current.y - mouseOffsetRef.current.y) * lerpFactor;

      particleSystem.update(time, mouseOffsetRef.current.x, mouseOffsetRef.current.y);
      flowerField.update(
        time, w, h,
        mouseOffsetRef.current.x,
        mouseOffsetRef.current.y,
        selectedFlowerIdRef.current,
        deltaTime  // <-- tiempo real del frame para finale correcto
      );

      particleSystem.drawBackgroundLayers(ctx, time);
      flowerField.draw(ctx, time, w, h);
      particleSystem.drawForegroundLayers(ctx);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isMobileRef.current) return; // sin parallax en movil

    const w = wCacheRef.current;
    const h = hCacheRef.current;
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);
    targetMouseOffsetRef.current = { x: normX * 0.4, y: normY * 0.4 };

    if (flowerFieldRef.current) {
      const hit = flowerFieldRef.current.hitTest(e.clientX, e.clientY);
      setHoveredTitle(hit ? hit.title : null);
    }
  }, []);

  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!flowerFieldRef.current) return;
    const hit = flowerFieldRef.current.hitTest(e.clientX, e.clientY);
    if (!hit) return;

    if (isMobileRef.current) {
      const now = Date.now();
      const last = lastTapRef.current;
      if (last && last.id === hit.id && now - last.time < 350) return;
      lastTapRef.current = { id: hit.id, time: now };
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = setTimeout(() => onSelectFlower(hit), 80);
    } else {
      onSelectFlower(hit);
    }
  }, [onSelectFlower]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030308]">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="block w-full h-full cursor-pointer touch-none"
      />
      {hoveredTitle && !selectedFlowerId && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-30 px-5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-yellow-500/30 text-yellow-100 text-xs font-sans tracking-widest uppercase shadow-lg animate-pulse">
          ✨ {hoveredTitle} ✨
        </div>
      )}
    </div>
  );
};
