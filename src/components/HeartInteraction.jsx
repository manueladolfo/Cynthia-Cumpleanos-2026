import React, { useState } from 'react';
import { playTapChime } from '../audio/retroAudioEngine';

export default function HeartInteraction({ onHeartTap, tapCount }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleClick = (e) => {
    // Sonido retro 8-bit
    playTapChime(tapCount);

    // Animación de rebote al pulsar
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 180);

    if (onHeartTap) {
      onHeartTap();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative py-2 z-10">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Tocar el corazón para revelar la sorpresa"
        className={`relative w-[130px] h-[130px] sm:w-[145px] sm:h-[145px] border-none bg-transparent cursor-pointer flex items-center justify-center p-0 transition-transform duration-150 outline-none select-none ${
          isTapped ? 'scale-90' : 'animate-heart-pulse active:scale-95'
        }`}
      >
        {/* Resplandor pulsante */}
        <div className="absolute inset-2 rounded-full bg-rose-500/20 blur-xl pointer-events-none animate-pulse" />

        {/* SVG Corazón Rojo */}
        <svg 
          className="w-full h-full text-rose-600 drop-shadow-[0_12px_24px_rgba(225,29,72,0.45)] transition-colors hover:text-rose-500" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      {/* Indicador táctil sutil */}
      <span className="mt-3 font-handwriting text-rose-900/80 font-bold text-xl tracking-wide select-none flex items-center gap-1.5">
        <span className="text-sm">👆</span> Pulsa el corazón
      </span>
    </div>
  );
}
