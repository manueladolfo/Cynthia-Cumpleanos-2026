import React, { useState, useEffect } from 'react';
import { toggleBirthdayMelody, subscribeAudioStatus, isAudioPlaying } from '../audio/retroAudioEngine';

export default function MusicToggleButton() {
  const [playing, setPlaying] = useState(isAudioPlaying());

  useEffect(() => {
    // Mantenerse 100% sincronizado con el motor de audio en tiempo real
    const unsubscribe = subscribeAudioStatus((status) => {
      setPlaying(status);
    });
    return unsubscribe;
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleBirthdayMelody();
  };

  return (
    <button
      type="button"
      id="music-toggle-btn"
      onClick={handleToggle}
      aria-label={playing ? "Silenciar música de fondo" : "Activar música de fondo"}
      title={playing ? "Pausar música 8-Bit" : "Reproducir música 8-Bit"}
      className={`fixed top-4 left-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer shadow-md font-badge font-bold text-lg transition-all duration-200 backdrop-blur-md select-none border-2 active:scale-95 ${
        playing 
          ? 'bg-rose-50/95 text-rose-700 border-rose-500 shadow-rose-200 hover:bg-rose-100' 
          : 'bg-white/90 text-slate-700 border-slate-300 hover:border-rose-400 hover:text-rose-600'
      }`}
    >
      <span className={`text-xl inline-block ${playing ? 'animate-bounce' : 'opacity-75'}`}>
        {playing ? '👾' : '🔇'}
      </span>
      <span>{playing ? '8-BIT' : 'MÚSICA'}</span>
      {playing && (
        <span className="flex items-center gap-0.5 ml-0.5" aria-hidden="true">
          <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse" />
          <span className="w-1 h-4 bg-rose-600 rounded-full animate-pulse delay-75" />
          <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse delay-150" />
        </span>
      )}
    </button>
  );
}
