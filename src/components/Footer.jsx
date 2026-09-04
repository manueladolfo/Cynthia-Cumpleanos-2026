import React from 'react';

export default function Footer({ onSaveMoment, isExporting, exportProgress, exportStatus }) {
  return (
    <footer className="w-full flex flex-col items-center mt-4 mb-6 text-center">
      {/* Botón Guardar este Momento */}
      <div className="w-full flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onSaveMoment}
          disabled={isExporting}
          className="w-full max-w-[300px] py-3.5 px-6 rounded-full font-fuerte text-base tracking-wider text-white bg-gradient-to-r from-rose-600 to-rose-700 shadow-md shadow-rose-600/30 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg">✨</span>
          <span>Guardar este momento</span>
        </button>

        {/* Loader de Exportación */}
        {isExporting && (
          <div className="flex flex-col items-center gap-2 mt-2 w-full max-w-[260px]">
            <div className="w-7 h-7 rounded-full border-2 border-rose-200 border-t-rose-600 animate-spin" />
            <p className="text-xs font-semibold text-rose-800 m-0">
              {exportStatus}
            </p>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
