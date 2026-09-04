import React, { useState, useEffect } from 'react';
import { startBirthdayMelody, stopBirthdayMelody, isAudioPlaying } from '../audio/retroAudioEngine';

export default function MusicToggleButton({ visible }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(isAudioPlaying());
  }, []);

  if (!visible) return null;

  const handleToggle = () => {
    if (playing) {
      stopBirthdayMelody((status) => setPlaying(status));
    } else {
      startBirthdayMelody((status) => setPlaying(status));
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Música de fondo 8-Bit"
      title="Activar/desactivar música 8-Bit"
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full cursor-pointer shadow-md font-badge font-bold text-lg transition-all duration-200 backdrop-blur-md select-none ${
        playing 
          ? 'bg-rose-50 text-rose-700 border-2 border-rose-500 shadow-rose-200' 
          : 'bg-white/90 text-slate-800 border-2 border-slate-200 hover:border-rose-300'
      }`}
    >
      <span className="text-xl inline-block animate-bounce">👾</span>
      <span>8-BIT</span>
    </button>
  );
}
