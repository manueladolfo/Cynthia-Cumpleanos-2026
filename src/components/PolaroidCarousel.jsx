import React, { useState, useRef } from 'react';
import { CAROUSEL_PHOTOS } from '../data/memoriesData';

// Ajustes específicos de encuadre para fotos verticales o caras altas
const PHOTO_POSITIONS = {
  26: 'top center', // Foto 27: enfocar arriba para que Manuel y Cynthia salgan completos
};

export default function PolaroidCarousel({ onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const goToSlide = (index) => {
    let nextIdx = index;
    if (nextIdx < 0) nextIdx = CAROUSEL_PHOTOS.length - 1;
    if (nextIdx >= CAROUSEL_PHOTOS.length) nextIdx = 0;
    setCurrentIndex(nextIdx);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - touchStartX.current;

    if (diffX < -35) {
      goToSlide(currentIndex + 1);
    } else if (diffX > 35) {
      goToSlide(currentIndex - 1);
    }
  };

  const handlePhotoClick = () => {
    if (onOpenLightbox) {
      onOpenLightbox(CAROUSEL_PHOTOS[currentIndex]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tarjeta Polaroid Idéntica a la Imagen de Referencia */}
      <article className="relative bg-white p-3 sm:p-4 pb-4 sm:pb-5 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[340px] sm:max-w-[360px] mx-auto select-none border border-slate-100">
        
        {/* Marco cuadrado de la foto */}
        <div 
          className="relative w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {CAROUSEL_PHOTOS.map((src, idx) => (
              <div 
                key={idx} 
                className="min-w-full h-full relative"
                onClick={handlePhotoClick}
              >
                <img 
                  src={src} 
                  alt={`Momento ${idx + 1}`} 
                  style={{ objectPosition: PHOTO_POSITIONS[idx] || 'center center' }}
                  className="w-full h-full object-cover block select-none pointer-events-none" 
                  loading="lazy" 
                />
              </div>
            ))}
          </div>

          {/* Flechas de navegación sutiles */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToSlide(currentIndex - 1); }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm border-none shadow flex items-center justify-center text-slate-700 text-xs opacity-75 hover:opacity-100 active:scale-95 transition-all z-10"
          >
            &#10094;
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToSlide(currentIndex + 1); }}
            aria-label="Siguiente foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm border-none shadow flex items-center justify-center text-slate-700 text-xs opacity-75 hover:opacity-100 active:scale-95 transition-all z-10"
          >
            &#10095;
          </button>
        </div>

        {/* Puntos de paginación pequeños */}
        <div className="flex flex-wrap justify-center items-center gap-1 mt-3 mb-1 px-4 max-w-[260px] mx-auto">
          {CAROUSEL_PHOTOS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Ir a foto ${idx + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
                idx === currentIndex 
                  ? 'bg-slate-700 scale-125' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Motivo Festivo Inferior: Rayos Estrellados + Guirnalda de Banderitas de Colores */}
        <div className="w-full flex justify-center items-center py-1">
          <svg 
            viewBox="0 0 240 36" 
            className="w-full max-w-[210px] h-8 overflow-visible" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Estrella de rayos izquierda (8 líneas) */}
            <g stroke="#78716C" strokeWidth="1.2" strokeLinecap="round">
              <line x1="20" y1="18" x2="48" y2="18" />
              <line x1="34" y1="4" x2="34" y2="32" />
              <line x1="24" y1="8" x2="44" y2="28" />
              <line x1="24" y1="28" x2="44" y2="8" />
            </g>

            {/* Guirnalda curvada con banderitas triangulares de colores */}
            <g>
              {/* Hilo de la guirnalda */}
              <path 
                d="M 68 11 Q 120 22, 172 11" 
                stroke="#78716C" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* 7 Banderitas triangulares colgantes */}
              {/* Banderita 1 - Rojo */}
              <polygon points="76,12 83,21 90,14" fill="#DC2626" />
              {/* Banderita 2 - Azul Marino */}
              <polygon points="91,14 98,24 105,16" fill="#1D4ED8" />
              {/* Banderita 3 - Amarillo */}
              <polygon points="106,16 113,26 120,18" fill="#F59E0B" />
              {/* Banderita 4 - Verde */}
              <polygon points="121,18 128,26 135,17" fill="#16A34A" />
              {/* Banderita 5 - Rojo/Granate */}
              <polygon points="136,17 143,24 150,15" fill="#B91C1C" />
              {/* Banderita 6 - Azul Cielo */}
              <polygon points="151,15 158,22 165,12" fill="#0284C7" />
              {/* Banderita 7 - Verde Lima */}
              <polygon points="163,12 168,19 173,10" fill="#65A30D" />
            </g>

            {/* Estrella de rayos derecha (8 líneas) */}
            <g stroke="#78716C" strokeWidth="1.2" strokeLinecap="round">
              <line x1="192" y1="18" x2="220" y2="18" />
              <line x1="206" y1="4" x2="206" y2="32" />
              <line x1="196" y1="8" x2="216" y2="28" />
              <line x1="196" y1="28" x2="216" y2="8" />
            </g>
          </svg>
        </div>
      </article>

      {/* Separador Ondulado (Tilde / Wavy flourish idéntico al de la imagen) */}
      <div className="flex justify-center my-6">
        <svg viewBox="0 0 80 20" className="w-16 h-5 text-[#8C7A6B]/50" fill="none">
          <path 
            d="M 12 10 C 26 4, 38 16, 52 10 C 60 6, 66 12, 68 10" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
          <circle cx="10" cy="10" r="1.8" fill="currentColor" />
          <circle cx="70" cy="10" r="1.8" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
