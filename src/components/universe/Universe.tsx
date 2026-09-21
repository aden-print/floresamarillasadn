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

  // Refs para evitar que el canvas se destruya en re-renders
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const particleSystem = new ParticleSystem();
    const flowerField = new FlowerField();
    particleSystemRef.current = particleSystem;
    flowerFieldRef.current = flowerField;

    let dprCache = 1;
    let wCache = 0;
    let hCache = 0;

    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      isMobileRef.current = isMobile;
      // En movil capeamos DPR a 1 para mayor rendimiento
      dprCache = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      wCache = window.innerWidth;
      hCache = window.innerHeight;

      canvas.width = wCache * dprCache;
      canvas.height = hCache * dprCache;
      canvas.style.width = `${wCache}px`;
      canvas.style.height = `${hCache}px`;

      ctx.scale(dprCache, dprCache);
      particleSystem.resize(wCache, hCache, isMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let animationFrameId: number;
    const startTime = performance.now();
    // Frame skip para movil: renderizamos a ~30fps en lugar de 60fps
    let lastFrameTime = 0;
    const MOBILE_FRAME_MS = 33; // ~30fps
    const DESKTOP_FRAME_MS = 16; // ~60fps

    const render = (now: number) => {
      const isMobile = isMobileRef.current;
      const frameThreshold = isMobile ? MOBILE_FRAME_MS : DESKTOP_FRAME_MS;

      // Throttle de frames para movil
      if (now - lastFrameTime < frameThreshold) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;

      const time = now - startTime;
      const w = wCache;
      const h = hCache;

      // Suavizado de mouse/touch mas rapido en movil (no hay efecto parallax intenso)
      const lerpFactor = isMobile ? 0.08 : 0.05;
      mouseOffsetRef.current.x += (targetMouseOffsetRef.current.x - mouseOffsetRef.current.x) * lerpFactor;
      mouseOffsetRef.current.y += (targetMouseOffsetRef.current.y - mouseOffsetRef.current.y) * lerpFactor;

      particleSystem.update(time, mouseOffsetRef.current.x, mouseOffsetRef.current.y);
      flowerField.update(time, w, h, mouseOffsetRef.current.x, mouseOffsetRef.current.y, selectedFlowerIdRef.current);

      particleSystem.drawBackgroundLayers(ctx, time);
      flowerField.draw(ctx, time, w, h);
      particleSystem.drawForegroundLayers(ctx);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    // En movil no aplicamos parallax para ahorrar CPU
    if (isMobileRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);
    targetMouseOffsetRef.current = { x: normX * 0.4, y: normY * 0.4 };

    if (flowerFieldRef.current) {
      const hit = flowerFieldRef.current.hitTest(e.clientX, e.clientY);
      setHoveredTitle(hit ? hit.title : null);
    }
  }, []);

  // Timeout ref para debounce del tap en movil
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!flowerFieldRef.current) return;
    const hit = flowerFieldRef.current.hitTest(e.clientX, e.clientY);
    if (!hit) return;

    const isMobile = isMobileRef.current;

    if (isMobile) {
      // En movil: debounce de 350ms para evitar que la carta se cierre inmediatamente
      const now = Date.now();
      const last = lastTapRef.current;
      if (last && last.id === hit.id && now - last.time < 400) {
        return; // Doble tap rapido: ignorar
      }
      lastTapRef.current = { id: hit.id, time: now };

      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = setTimeout(() => {
        onSelectFlower(hit);
      }, 80);
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

      {/* Tooltip de nombre al hacer hover (solo desktop) */}
      {hoveredTitle && !selectedFlowerId && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-30 px-5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-yellow-500/30 text-yellow-100 text-xs font-sans tracking-widest uppercase shadow-lg animate-pulse">
          ✨ {hoveredTitle} ✨
        </div>
      )}
    </div>
  );
};
