'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/config';
import { audioEngine } from '@/lib/audio';

interface IntroProps {
  onEnter: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onEnter }) => {
  const [showContent, setShowContent] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Precargar audio sin reproducir
    audioEngine.preload();
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    // El AudioPlayer arranca el audio cuando monta (despues de onEnter)
    setTimeout(() => onEnter(), 800);
  };

  return (
    <AnimatePresence>
      {!isLeaving && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030308] text-white px-6 overflow-hidden cursor-pointer"
          onClick={handleStart}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Fondo sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Destello pulsante */}
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {showContent && (
            <div className="relative z-10 text-center max-w-lg space-y-6 select-none">
              <motion.h1
                className="text-4xl md:text-6xl font-cinzel tracking-wider text-yellow-100 font-semibold drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                {SITE_CONFIG.title}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl font-sans tracking-widest text-amber-200/80 uppercase font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
              >
                {SITE_CONFIG.dateSubtitle}
              </motion.p>

              <motion.div
                className="pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.4 }}
              >
                <span className="text-xs md:text-sm tracking-widest text-yellow-100/60 uppercase font-sans border border-yellow-500/30 px-6 py-2.5 rounded-full bg-yellow-500/5 backdrop-blur-sm">
                  {SITE_CONFIG.introPrompt}
                </span>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
