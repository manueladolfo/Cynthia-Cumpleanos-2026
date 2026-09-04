import React, { useState } from 'react';
import { playEnvelopeOpenChime } from '../audio/retroAudioEngine';

export default function AnimatedEnvelope() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      playEnvelopeOpenChime();
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <section className="w-full flex flex-col items-center select-none my-2" aria-label="Sobre interactivo con carta secreta">
      {/* Contenedor 3D del Sobre */}
      <div className="w-full max-w-[340px] sm:max-w-[360px] relative envelope-container-3d">
        
        {/* El Sobre Físico */}
        <div 
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label="Abrir sobre de carta para Cynthia"
          className={`relative w-full h-[200px] sm:h-[210px] rounded-xl overflow-hidden cursor-pointer shadow-[0_12px_28px_rgba(0,0,0,0.09)] border border-[#DAC6A0] transition-all duration-500 bg-[#E6D6B3] flex flex-col items-center justify-between p-3 ${
            isOpen ? 'shadow-md opacity-90' : 'hover:-translate-y-1 hover:shadow-xl'
          }`}
          style={{
            background: 'linear-gradient(145deg, #EADBC0 0%, #DEC8A0 100%)'
          }}
        >
          {/* Pliegues interiores triangulares del sobre (izquierda y derecha) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Pliegue izquierdo */}
            <div 
              className="absolute top-0 left-0 bottom-0 w-1/2" 
              style={{
                background: 'linear-gradient(to top right, rgba(200, 178, 140, 0.45) 50%, transparent 50%)'
              }}
            />
            {/* Pliegue derecho */}
            <div 
              className="absolute top-0 right-0 bottom-0 w-1/2" 
              style={{
                background: 'linear-gradient(to top left, rgba(200, 178, 140, 0.45) 50%, transparent 50%)'
              }}
            />
            {/* Pliegue inferior */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/2" 
              style={{
                background: 'linear-gradient(to top, rgba(190, 168, 130, 0.35) 0%, transparent 100%)'
              }}
            />
          </div>

          {/* Solapa Superior Triangular (Animación 3D) */}
          <div 
            className={`absolute top-0 left-0 right-0 h-[105px] envelope-flap-top z-20 pointer-events-none ${
              isOpen ? 'is-open' : ''
            }`}
          >
            {/* Triángulo de la solapa orientado hacia abajo */}
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, #EFE3CA 0%, #DEC8A0 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.12))'
              }}
            />
          </div>

          {/* Matasellos de cera rojo clásico centrado en el medio */}
          <div 
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 flex items-center justify-center ${
              isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'scale-100 hover:scale-105 active:scale-95'
            }`}
          >
            <div 
              className="w-[66px] h-[66px] sm:w-[70px] sm:h-[70px] rounded-full shadow-[0_6px_16px_rgba(139,0,0,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-rose-200/40 flex items-center justify-center text-center p-0 m-0"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #DC2626 0%, #991B1B 65%, #7F1D1D 100%)'
              }}
            >
              {/* Texto "Descúbrelo" en cursiva perfectamente centrado */}
              <span className="font-serif italic font-medium text-[#FFFDF2] text-[0.84rem] sm:text-[0.88rem] tracking-wide leading-none text-center select-none block drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                Descúbrelo
              </span>
            </div>
          </div>

          {/* Espacio superior para balancear el flex */}
          <div className="w-full h-4" />

          {/* Texto "Hay algo dentro para ti" en la parte inferior del sobre */}
          <p className="font-serif italic text-[#694827] text-lg sm:text-xl font-normal tracking-wide text-center z-10 m-0 pb-2 drop-shadow-sm select-none">
            Hay algo dentro para ti
          </p>
        </div>

        {/* Hoja de la carta que sale y se despliega al abrir el sobre */}
        <div className={`letter-paper-animated ${isOpen ? 'is-visible' : 'is-hidden'}`}>
          <article className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_14px_35px_rgba(0,0,0,0.08)] relative">
            
            {/* Comilla inicial decorativa */}
            <span className="font-serif text-5xl text-rose-300/40 absolute top-2 left-3 select-none pointer-events-none leading-none">
              “
            </span>

            <div className="relative z-10 pt-1">
              {/* Primer mensaje */}
              <p className="font-script text-3xl sm:text-4xl font-normal leading-relaxed text-slate-800 mb-2 indent-3 tracking-wide">
                Cynthia, desde que llegaste a mi vida cada día tiene un color diferente. Tienes esa luz que transforma lo ordinario en algo completamente extraordinario.
              </p>
              <p className="font-subheading text-lg sm:text-xl font-normal text-right text-rose-800 m-0">
                — Siempre contigo
              </p>

              {/* Divisor sutil */}
              <div className="flex items-center justify-center my-4 text-rose-400 text-xl opacity-60">
                <span>❦</span>
              </div>

              {/* Segundo mensaje */}
              <p className="font-script text-3xl sm:text-4xl font-normal leading-relaxed text-slate-800 mb-2 indent-3 tracking-wide">
                Admiro tu fuerza, tu sonrisa sincera y esa forma tan tuya de cuidar a quienes quieres. Eres mi persona favorita en todo el universo.
              </p>
              <p className="font-subheading text-lg sm:text-xl font-normal text-right text-rose-800 m-0">
                — Con todo mi corazón
              </p>

              {/* Botón sutil para volver a doblar */}
              <div className="mt-5 pt-3 border-t border-amber-100 flex justify-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs text-amber-800/70 hover:text-amber-900 font-sans tracking-wide bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/60 rounded-full px-4 py-1 cursor-pointer transition-colors"
                >
                  ✉️ Volver a doblar la carta
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
