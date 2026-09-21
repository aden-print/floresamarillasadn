'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import { FlowerData } from '@/lib/flowersData';

interface FlowerCardProps {
  flower: FlowerData | null;
  onClose: () => void;
  onSpecialAction: (actionType: string) => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({ flower, onClose, onSpecialAction }) => {
  const openTimeRef = useRef<number>(0);

  useEffect(() => {
    if (flower) {
      openTimeRef.current = Date.now();
    }
  }, [flower]);

  if (!flower) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Evitar que toques rápidos o el mismo toque que abrió la tarjeta la cierre al instante en celular
    if (Date.now() - openTimeRef.current < 400) {
      return;
    }
    onClose();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpecialAction(flower.actionType || 'light_burst');
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-auto select-none"
        onClick={handleBackdropClick}
      >
        {/* Backdrop desenfocado */}
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Tarjeta Cálida e Ilustrada (Completamente Adaptada a Celular) */}
        <motion.div
          className="relative w-[92vw] max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto scrollbar-none p-5 sm:p-7 md:p-8 rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-[#FFFDE7] via-[#FFF9C4] to-[#FFE082] text-gray-800 shadow-[0_20px_60px_rgba(255,215,0,0.35)] border-4 border-[#FFD700] z-10 my-auto"
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()} // Previene cierre accidental al tocar dentro de la tarjeta
        >
          {/* Resplandor interno */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          {/* Botón de Cierre */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 active:bg-amber-900/30 text-amber-900/80 transition-all duration-200 z-20"
            aria-label="Cerrar tarjeta"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag de la Constelación */}
          <div className="text-center mb-1.5 sm:mb-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-900 font-sans text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>{flower.subtitle || "21 de septiembre"}</span>
            </span>
          </div>

          {/* Título Manuscrito */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-romantic text-center text-[#4E342E] mb-2 sm:mb-3 drop-shadow-sm leading-tight">
            {flower.title}
          </h2>

          {/* Mensaje Romántico */}
          <div className="relative px-1 sm:px-2 py-1.5 sm:py-2 text-center my-1 sm:my-2">
            <p className="text-sm sm:text-base md:text-lg font-sans leading-relaxed text-[#3E2723] font-medium">
              "{flower.message}"
            </p>
          </div>

          {/* Firma "Te Amo Mucho" */}
          <div className="flex items-center justify-center space-x-2 my-2 sm:my-3 text-center">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-bounce" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-romantic text-[#5D4037] font-bold">
              Te Amo Mucho
            </span>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-bounce delay-100" />
          </div>

          {/* Ilustración SVG de Girasol */}
          <div className="relative w-full h-20 sm:h-24 md:h-28 my-1 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 200 120" className="w-36 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 drop-shadow-md">
              <path d="M70,80 Q50,70 60,95 Q80,95 70,80 Z" fill="#4CAF50" />
              <path d="M130,80 Q150,70 140,95 Q120,95 130,80 Z" fill="#4CAF50" />
              <path d="M100,85 Q80,105 100,115 Q120,105 100,85 Z" fill="#388E3C" />
              <rect x="96" y="70" width="8" height="40" rx="4" fill="#4CAF50" />

              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                return (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="50"
                    rx="6"
                    ry="26"
                    fill={i % 2 === 0 ? "#FFD700" : "#FFC107"}
                    transform={`rotate(${angle}, 100, 50)`}
                  />
                );
              })}

              <circle cx="100" cy="50" r="15" fill="#4E342E" />
              <circle cx="100" cy="50" r="12" fill="#3E2723" />
              <circle cx="97" cy="47" r="3" fill="#8D6E63" />
            </svg>
          </div>

          {/* Botones de Acción */}
          <div className="mt-2 sm:mt-3 pt-2 flex flex-col space-y-2 items-center">
            {flower.hasSpecialButton && (
              <button
                onClick={handleButtonClick}
                className="w-full py-2.5 sm:py-3 px-5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-amber-950 font-sans text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(255,193,7,0.5)] transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{flower.specialButtonText || "Para Ti 🌻"}</span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950 animate-spin" />
              </button>
            )}

            <button
              onClick={onClose}
              className="py-1 px-5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 active:bg-amber-900/30 text-amber-900 text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
