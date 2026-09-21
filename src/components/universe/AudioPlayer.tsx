'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '@/lib/audio';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play cuando el componente monta (usuario ya hizo clic en Intro)
  useEffect(() => {
    audioEngine.play();
    setIsPlaying(true);
  }, []);

  const handleToggle = () => {
    const active = audioEngine.toggle();
    setIsPlaying(active);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-5 right-5 z-40 p-3 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/20 text-yellow-200/80 hover:text-yellow-100 hover:border-yellow-500/50 transition-all duration-300 shadow-lg group"
      aria-label="Toggle music"
      title="Música"
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-yellow-400 animate-pulse group-hover:scale-110 transition-transform" />
      ) : (
        <VolumeX className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
};
