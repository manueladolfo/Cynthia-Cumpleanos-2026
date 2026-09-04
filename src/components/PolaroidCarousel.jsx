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

        {/* Motivo Festivo Inferior: Corazón Rosa Central con Guirnaldas de Colores a Ambos Lados */}
        <div className="w-full flex justify-center items-center py-1 select-none" aria-hidden="true">
          <svg className="w-full max-w-[240px] h-8 overflow-visible" viewBox="0 0 240 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Guirnalda Izquierda */}
            <path d="M 12 12 Q 58 24 102 12" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
            {/* Banderitas / pétalos de colores en la guirnalda izquierda */}
            <polygon points="28,15 38,17 33,26" fill="#FFB703" />
            <polygon points="48,18 58,19 53,28" fill="#00A896" />
            <polygon points="68,18 78,17 73,27" fill="#FB8500" />
            <polygon points="86,16 96,14 91,24" fill="#2D6A4F" />

            {/* Bolitas decorativas de colores */}
            <circle cx="20" cy="13" r="3.5" fill="#E4007C" />
            <circle cx="43" cy="18" r="3" fill="#FB7185" />
            <circle cx="63" cy="19" r="3" fill="#FFB703" />
            <circle cx="82" cy="17" r="3" fill="#00A896" />
            <circle cx="100" cy="13" r="3.5" fill="#E4007C" />

            {/* Corazón Rosa Central Destacado */}
            <g transform="translate(120, 16) scale(0.9)">
              {/* Aura suave */}
              <circle cx="0" cy="0" r="16" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1.5" />
              {/* Corazón Rosa */}
              <path 
                d="M 0 -6 C -3 -13, -13 -10, -12 0 C -11 6, -1 11, 0 14 C 1 11, 11 6, 12 0 C 13 -10, 3 -13, 0 -6 Z" 
                fill="#E4007C" 
              />
              {/* Brillo blanco sutil */}
              <circle cx="-4" cy="-4" r="1.5" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Guirnalda Derecha */}
            <path d="M 138 12 Q 182 24 228 12" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
            {/* Banderitas / pétalos de colores en la guirnalda derecha */}
            <polygon points="144,14 154,16 149,24" fill="#2D6A4F" />
            <polygon points="162,17 172,18 167,27" fill="#FB8500" />
            <polygon points="182,19 192,18 187,28" fill="#00A896" />
            <polygon points="202,17 212,15 207,26" fill="#FFB703" />

            {/* Bolitas decorativas de colores */}
            <circle cx="140" cy="13" r="3.5" fill="#E4007C" />
            <circle cx="158" cy="17" r="3" fill="#00A896" />
            <circle cx="177" cy="19" r="3" fill="#FFB703" />
            <circle cx="197" cy="18" r="3" fill="#FB7185" />
            <circle cx="220" cy="13" r="3.5" fill="#E4007C" />
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
