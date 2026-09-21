'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/config';
import { RotateCcw } from 'lucide-react';

interface FinalMessageProps {
  isVisible: boolean;
  onReset: () => void;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ isVisible, onReset }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-6 pointer-events-none select-none">
        <motion.div
          className="relative max-w-xl text-center space-y-6 pointer-events-auto bg-space-deep/40 backdrop-blur-sm p-8 rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(255,215,0,0.15)]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
        >
          {/* Título Principal */}
          <motion.h1
            className="text-3xl md:text-5xl font-cinzel text-yellow-100 font-bold tracking-wide drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.2 }}
          >
            {SITE_CONFIG.finalMessage.title}
          </motion.h1>

          {/* Subtítulo / Mensaje Poético */}
          <motion.p
            className="text-lg md:text-xl font-sans leading-relaxed text-amber-100/90 font-light whitespace-pre-line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.8 }}
          >
            {SITE_CONFIG.finalMessage.subtitle}
          </motion.p>

          {/* Firma */}
          <motion.p
            className="text-2xl font-romantic text-yellow-300/80 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 2.4 }}
          >
            {SITE_CONFIG.finalMessage.author}
          </motion.p>

          {/* Botón para volver a explorar */}
          <motion.div
            className="pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 3.0 }}
          >
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 text-xs tracking-widest uppercase transition-all duration-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a explorar</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
