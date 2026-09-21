'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpecialActionAnimationProps {
  actionType: string | null;
  onComplete: () => void;
}

function buildItems(type: string) {
  switch (type) {
    case 'sunflowers':
      return Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: (i * 4.5 + (i % 3) * 2) % 100,
        delay: (i * 0.09) % 1.4,
        duration: 3.2 + (i % 4) * 0.4,
        size: 32 + (i % 4) * 8,
        sway: (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 15),
      }));

    case 'petals':
      return Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: (i * 3.6 + (i % 5) * 1.5) % 100,
        delay: (i * 0.08) % 1.5,
        duration: 2.8 + (i % 5) * 0.3,
        size: 20 + (i % 3) * 6,
        sway: (i % 2 === 0 ? 1 : -1) * (25 + (i % 3) * 15),
      }));

    case 'shooting_star':
    case 'meteor':
      return Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        startX: 5 + i * 16,
        startY: 5 + (i % 3) * 15,
        delay: i * 0.3,
        duration: 1.1,
        length: 180 + i * 30,
        angle: 35,
      }));

    case 'hearts':
    case 'infinite_love': {
      const colors = ['#FFD700', '#FFCA28', '#FF6090', '#FF80AB', '#FFE082', '#FF4081'];
      return Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: 5 + (i * 3.1 + (i % 7) * 2) % 90,
        delay: (i * 0.07) % 1.8,
        duration: 3.0 + (i % 4) * 0.35,
        size: 22 + (i % 3) * 10,
        color: colors[i % colors.length],
        sway: (i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 10),
      }));
    }

    case 'butterflies':
      return Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: 15 + (i * 4.5) % 70,
        delay: i * 0.12,
        duration: 3.5,
        size: 26 + (i % 3) * 6,
      }));

    case 'celebration':
    case 'cosmic_sparks': {
      return Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * 360) / 32;
        const dist = 120 + (i % 4) * 50;
        return {
          id: i,
          targetX: Math.cos((angle * Math.PI) / 180) * dist,
          targetY: Math.sin((angle * Math.PI) / 180) * dist,
          color: ['#FFD700', '#FFF59D', '#FFCA28', '#FFFFFF', '#FF80AB'][i % 5],
          size: 6 + (i % 4) * 3,
        };
      });
    }

    case 'breeze': {
      const flowerEmojis = ['🌸', '🌼', '🌺', '✿', '🏵️', '❀'];
      return Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        y: 5 + (i * 3.8 + (i % 6) * 4) % 90,
        delay: (i * 0.15) % 2.2,
        duration: 3.2 + (i % 4) * 0.5,
        size: 24 + (i % 4) * 10,
        wobble: (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 8),
        emoji: flowerEmojis[i % flowerEmojis.length],
      }));
    }

    case 'starlight': {
      return Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        x: 2 + (i * 2.7 + (i % 9) * 3) % 96,
        y: 2 + (i * 2.9 + (i % 7) * 4) % 96,
        delay: (i * 0.09) % 2.0,
        duration: 0.8 + (i % 4) * 0.4,
        size: 12 + (i % 5) * 8,
        color: ['#FFD700', '#FFFFFF', '#FFF59D', '#FFFDE7', '#FFECB3'][i % 5],
      }));
    }

    default:
      return [];
  }
}

export const SpecialActionAnimation: React.FC<SpecialActionAnimationProps> = ({
  actionType,
  onComplete,
}) => {
  const [active, setActive] = useState<string | null>(null);
  const itemsRef = useRef<ReturnType<typeof buildItems>>([]);

  useEffect(() => {
    if (!actionType) {
      setActive(null);
      return;
    }
    itemsRef.current = buildItems(actionType);
    setActive(actionType);

    const timer = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => clearTimeout(timer);
  }, [actionType, onComplete]);

  if (!active) return null;

  const items = itemsRef.current;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      <AnimatePresence mode="wait">

        {active === 'hug' && (
          <motion.div key="hug" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute w-[85vw] h-[85vw] max-w-[650px] max-h-[650px] rounded-full bg-amber-500/25 blur-3xl"
              initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.2, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3.2, ease: 'easeOut' }} />
            {[0, 0.5, 1.0].map((delay, idx) => (
              <motion.div key={idx} className="absolute rounded-full border-2 border-yellow-300/70"
                initial={{ width: 60, height: 60, opacity: 1 }}
                animate={{ width: ['10vw', '95vw'], height: ['10vw', '95vw'], opacity: [1, 0.5, 0] }}
                transition={{ duration: 2.8, delay, ease: 'easeOut' }} />
            ))}
            <motion.div className="relative flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1, 0], opacity: [0, 1, 0.9, 0] }}
              transition={{ duration: 3.2, ease: 'easeInOut' }}>
              <div className="w-40 h-40 rounded-full bg-yellow-400/30 blur-xl" />
              <svg className="absolute w-24 h-24 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5" fill="#FFD700" />
                <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#FFF59D" strokeWidth="2" />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {active === 'sunflowers' && (
          <motion.div key="sunflowers" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.x}%`, top: '-8%', width: item.size, height: item.size }}
                initial={{ y: -40, opacity: 0, rotate: 0 }}
                animate={{ y: ['0vh', '112vh'], x: [0, item.sway, -item.sway, 0], rotate: [0, 360], opacity: [0, 1, 1, 0] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}>
                <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
                  {Array.from({ length: 10 }).map((_, pIdx) => (
                    <ellipse key={pIdx} cx="30" cy="30" rx="5" ry="22" fill="#FFD700"
                      transform={`rotate(${(pIdx * 360) / 10}, 30, 30)`} />
                  ))}
                  <circle cx="30" cy="30" r="12" fill="#4E342E" />
                  <circle cx="30" cy="30" r="8" fill="#FFC107" opacity="0.6" />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}

        {active === 'petals' && (
          <motion.div key="petals" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.x}%`, top: '-5%', width: item.size, height: item.size * 1.5 }}
                initial={{ y: -30, opacity: 0, rotate: 0 }}
                animate={{ y: ['0vh', '112vh'], x: [0, item.sway, -item.sway, 0], rotate: [0, 260], opacity: [0, 1, 1, 0] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}>
                <svg viewBox="0 0 30 50" className="w-full h-full drop-shadow-sm">
                  <path d="M15,0 Q28,22 15,50 Q2,22 15,0 Z" fill="#FFD700" />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(active === 'shooting_star' || active === 'meteor') && (
          <motion.div key="shooting_star" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.startX}%`, top: `${item.startY}%`, transform: `rotate(${item.angle}deg)` }}
                initial={{ x: -60, y: -40, opacity: 0, scale: 0.3 }}
                animate={{ x: [0, 700], y: [0, 450], opacity: [0, 1, 0.85, 0], scale: [0.3, 1, 0.7, 0] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeOut' }}>
                <div className="relative flex items-center">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#FFF,0_0_24px_#FFD700]" />
                  <div className="h-1 bg-gradient-to-l from-transparent via-yellow-200 to-white"
                    style={{ width: `${item.length}px`, marginLeft: '-4px' }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(active === 'hearts' || active === 'infinite_love') && (
          <motion.div key="hearts" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,105,144,0.18) 0%, rgba(255,200,100,0.08) 60%, transparent 100%)' }}
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3.5 }} />
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.x}%`, bottom: '-6%', width: item.size, height: item.size }}
                initial={{ y: 0, opacity: 0, scale: 0.4 }}
                animate={{ y: ['0vh', '-115vh'], x: [0, item.sway, -item.sway, 0], opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.6] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}>
                <svg viewBox="0 0 24 24" fill={item.color} className="w-full h-full"
                  style={{ filter: `drop-shadow(0 0 6px ${item.color})` }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}

        {active === 'butterflies' && (
          <motion.div key="butterflies" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.x}%`, bottom: '-5%', width: item.size, height: item.size }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: ['0vh', '-115vh'], x: [0, 30, -20, 25, 0], opacity: [0, 1, 0.9, 0] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}>
                <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">🦋</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(active === 'light_burst' || active === 'sun_dawn') && (
          <motion.div key="light_burst" className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-[85vw] h-[85vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tr from-amber-400/40 via-yellow-300/30 to-white/40 blur-3xl"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.4, 1.8], opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.8, ease: 'easeOut' }} />
            <motion.div className="absolute flex items-center justify-center"
              initial={{ scale: 0.3, rotate: 0, opacity: 0 }}
              animate={{ scale: [0.3, 1.3, 1.8], rotate: 120, opacity: [0, 1, 0] }}
              transition={{ duration: 3.2, ease: 'easeOut' }}>
              <svg className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px]" viewBox="0 0 200 200">
                {Array.from({ length: 16 }).map((_, rIdx) => {
                  const angle = (rIdx * 360) / 16;
                  return <line key={rIdx} x1="100" y1="100"
                    x2={100 + Math.cos((angle * Math.PI) / 180) * 90}
                    y2={100 + Math.sin((angle * Math.PI) / 180) * 90}
                    stroke="#FFF59D" strokeWidth="2.5" strokeDasharray="4 8" />;
                })}
              </svg>
            </motion.div>
          </motion.div>
        )}

        {active === 'starlight' && (
          <motion.div key="starlight" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(120,60,200,0.15) 0%, rgba(255,200,0,0.06) 60%, transparent 100%)' }}
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3.5 }} />
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.9, 0], scale: [0, 1.2, 1, 0] }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut', repeat: 1, repeatDelay: 0.4 }}>
                <svg viewBox="0 0 40 40"
                  style={{ width: item.size, height: item.size, filter: `drop-shadow(0 0 8px ${item.color}) drop-shadow(0 0 14px ${item.color})` }}>
                  <path d="M20,2 L22,18 L38,20 L22,22 L20,38 L18,22 L2,20 L18,18 Z" fill={item.color} />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(active === 'celebration' || active === 'cosmic_sparks') && (
          <motion.div key="celebration" className="absolute inset-0 flex items-center justify-center">
            {items.map((item) => (
              <motion.div key={item.id} className="absolute rounded-full will-change-transform"
                style={{ backgroundColor: item.color, width: item.size, height: item.size }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: item.targetX, y: item.targetY, opacity: [1, 0.8, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 2.2, ease: 'easeOut' }} />
            ))}
          </motion.div>
        )}

        {active === 'breeze' && (
          <motion.div key="breeze" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {items.map((item) => (
              <motion.div key={item.id} className="absolute will-change-transform"
                style={{ top: `${item.y}%`, left: '-10%' }}
                initial={{ x: '-10vw', opacity: 0, rotate: -15 }}
                animate={{
                  x: ['-10vw', '120vw'],
                  y: [0, item.wobble, -item.wobble * 0.5, 0],
                  rotate: [-15, 5, -10, 5],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}>
                <span style={{ fontSize: item.size, lineHeight: 1, display: 'block', filter: 'drop-shadow(0 0 6px rgba(255,200,100,0.7))' }}>
                  {item.emoji}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
