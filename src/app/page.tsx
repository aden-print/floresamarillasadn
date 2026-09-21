'use client';

import React, { useState } from 'react';
import { Intro } from '@/components/intro/Intro';
import { Universe } from '@/components/universe/Universe';
import { FlowerCard } from '@/components/universe/FlowerCard';
import { AudioPlayer } from '@/components/universe/AudioPlayer';
import { FinalMessage } from '@/components/final/FinalMessage';
import { UniverseNavigation } from '@/components/universe/UniverseNavigation';
import { SpecialActionAnimation } from '@/components/universe/SpecialActionAnimation';
import { FlowerData } from '@/lib/flowersData';

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerData | null>(null);
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [currentSpecialAnimation, setCurrentSpecialAnimation] = useState<string | null>(null);

  const handleSelectFlower = (flower: FlowerData) => {
    setSelectedFlower(flower);
  };

  const handleCloseCard = () => {
    setSelectedFlower(null);
  };

  const handleSpecialCardAction = (actionType: string) => {
    // 1. Cerrar la tarjeta
    setSelectedFlower(null);

    // 2. Disparar animación visual optimizada por GPU
    setCurrentSpecialAnimation(actionType);

    // 3. Si es flor central, activar el Gran Final de Corazón
    if (selectedFlower?.isCentral) {
      setTimeout(() => {
        setIsFinaleActive(true);
      }, 1200);
    }
  };

  const handleOpenMasterLetter = () => {
    setSelectedFlower({
      id: 'master_letter',
      type: 'girasol',
      title: 'Para Ti 💛',
      message: 'Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría. Gracias por iluminar cada uno de mis días. Eres simplemente hermosa. Te Amo Mucho.',
      subtitle: 'Carta de 21 de Septiembre 🌻',
      hasSpecialButton: true,
      specialButtonText: 'Enviar Amor Infinito 💕',
      actionType: 'infinite_love',
      x: 0,
      y: 0,
      z: 1.2,
      scale: 1.2,
      rotationSpeed: 0.003
    });
  };

  const handleResetFinale = () => {
    setIsFinaleActive(false);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#030308]">
      {/* 1. Introducción */}
      {!hasEntered && (
        <Intro onEnter={() => setHasEntered(true)} />
      )}

      {/* 2. Universo Principal de Flores Amarillas */}
      {hasEntered && (
        <>
          <AudioPlayer />
          
          <UniverseNavigation
            onOpenMasterLetter={handleOpenMasterLetter}
          />

          <Universe
            onSelectFlower={handleSelectFlower}
            selectedFlowerId={selectedFlower?.id || null}
            isFinaleActive={isFinaleActive}
          />

          {/* Animación Visual Completa (Ultra-optimizada a 60 FPS) */}
          <SpecialActionAnimation
            actionType={currentSpecialAnimation}
            onComplete={() => setCurrentSpecialAnimation(null)}
          />

          {/* 3. Tarjeta Flotante Ilustrada en Dorado */}
          <FlowerCard
            flower={selectedFlower}
            onClose={handleCloseCard}
            onSpecialAction={handleSpecialCardAction}
          />

          {/* 4. Gran Final */}
          <FinalMessage
            isVisible={isFinaleActive}
            onReset={handleResetFinale}
          />
        </>
      )}
    </main>
  );
}
