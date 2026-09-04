import React from 'react';

const PROGRESS_STAGES = [
  { progress: 0, text: 'Toca el corazón' },
  { progress: 20, text: 'Otra vez' },
  { progress: 40, text: 'Algo se está encendiendo...' },
  { progress: 60, text: 'Sigue, que esto se calienta' },
  { progress: 80, text: 'Un poquito más' },
  { progress: 95, text: 'No pares ahora' },
  { progress: 100, text: '¡Para ti, Cynthia! 💖' }
];

export function getDynamicText(progress) {
  let matched = PROGRESS_STAGES[0].text;
  for (const stage of PROGRESS_STAGES) {
    if (progress >= stage.progress) {
      matched = stage.text;
    }
  }
  return matched;
}

export default function ProgressBar({ progress }) {
  const currentText = getDynamicText(progress);

  return (
    <div className="w-full max-w-[340px] flex flex-col items-center gap-2.5 relative z-10 select-none mt-4">
      {/* Texto Dinámico Superior */}
      <div className="flex items-center justify-between w-full px-1">
        <p className="font-handwriting text-2xl font-bold text-slate-800 m-0 transition-all duration-300 drop-shadow-sm">
          {currentText}
        </p>
        <span className="font-handwriting text-lg font-bold text-rose-700 bg-rose-100/90 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-sm">
          {progress}%
        </span>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full h-4 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/50 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 rounded-full transition-all duration-400 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Brillo sutil interior */}
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
