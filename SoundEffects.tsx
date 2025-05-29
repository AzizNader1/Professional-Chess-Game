import React, { useState, useEffect } from 'react';

interface SoundEffectsProps {
  moveSound: boolean;
  captureSound: boolean;
  checkSound: boolean;
  gameEndSound: boolean;
}

// This component handles sound effects for the chess game
const SoundEffects: React.FC<SoundEffectsProps> = ({ 
  moveSound, 
  captureSound, 
  checkSound, 
  gameEndSound 
}) => {
  // Audio elements for different game events
  const [moveSoundElement, setMoveSoundElement] = useState<HTMLAudioElement | null>(null);
  const [captureSoundElement, setCaptureSoundElement] = useState<HTMLAudioElement | null>(null);
  const [checkSoundElement, setCheckSoundElement] = useState<HTMLAudioElement | null>(null);
  const [gameEndSoundElement, setGameEndSoundElement] = useState<HTMLAudioElement | null>(null);

  // Initialize audio elements on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMoveSoundElement(new Audio('/sounds/move.mp3'));
      setCaptureSoundElement(new Audio('/sounds/capture.mp3'));
      setCheckSoundElement(new Audio('/sounds/check.mp3'));
      setGameEndSoundElement(new Audio('/sounds/game-end.mp3'));
    }
  }, []);

  // Play move sound when moveSound prop changes to true
  useEffect(() => {
    if (moveSound && moveSoundElement) {
      moveSoundElement.currentTime = 0;
      moveSoundElement.play().catch(e => console.error("Error playing move sound:", e));
    }
  }, [moveSound, moveSoundElement]);

  // Play capture sound when captureSound prop changes to true
  useEffect(() => {
    if (captureSound && captureSoundElement) {
      captureSoundElement.currentTime = 0;
      captureSoundElement.play().catch(e => console.error("Error playing capture sound:", e));
    }
  }, [captureSound, captureSoundElement]);

  // Play check sound when checkSound prop changes to true
  useEffect(() => {
    if (checkSound && checkSoundElement) {
      checkSoundElement.currentTime = 0;
      checkSoundElement.play().catch(e => console.error("Error playing check sound:", e));
    }
  }, [checkSound, checkSoundElement]);

  // Play game end sound when gameEndSound prop changes to true
  useEffect(() => {
    if (gameEndSound && gameEndSoundElement) {
      gameEndSoundElement.currentTime = 0;
      gameEndSoundElement.play().catch(e => console.error("Error playing game end sound:", e));
    }
  }, [gameEndSound, gameEndSoundElement]);

  // This component doesn't render anything visible
  return null;
};

export default SoundEffects;
