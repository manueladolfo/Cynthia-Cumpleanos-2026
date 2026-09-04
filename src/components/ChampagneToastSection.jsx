import React, { useEffect, useRef, useState } from 'react';
import { playGlassClinkChime } from '../audio/retroAudioEngine';

export default function ChampagneToastSection({ 
  onSaveMoment, 
  isExporting, 
  exportProgress, 
  exportStatus 
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const hasChimed = useRef(false);

  // Control bidireccional continuo con el scroll (down clink, up un-clink)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // El brindis inicia cuando las copas entran en el 90% inferior de la pantalla
      // y se completa al llegar a la zona media (45% de la pantalla)
      const startY = windowHeight * 0.90;
      const endY = windowHeight * 0.45;

      const currentY = rect.top;
      let p = (startY - currentY) / (startY - endY);
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      setScrollProgress(p);

      // Sonido de tintineo al chocar en scroll down y rearme en scroll up
      if (p > 0.88 && !hasChimed.current) {
        hasChimed.current = true;
        playGlassClinkChime();
      } else if (p < 0.65) {
        hasChimed.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Comprobación inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Permitir también tocar las copas para brindar manualmente
  const handleManualClink = () => {
    playGlassClinkChime();
    setScrollProgress(0);
    setTimeout(() => setScrollProgress(1), 50);
  };

  // Cálculos dinámicos de posición y rotación según el scroll (0 a 1)
  const leftAngle = scrollProgress * 18; // 0deg a 18deg
  const rightAngle = -scrollProgress * 18; // 0deg a -18deg
  const leftTranslateX = scrollProgress * 14; // se mueven al centro
  const rightTranslateX = -scrollProgress * 14;
  const translateY = -scrollProgress * 4;

  // Los destellos y estrellas aparecen en la fase final del brindis
  const sparkleOpacity = Math.max(0, (scrollProgress - 0.75) / 0.25);
  const sparkleScale = Math.max(0, (scrollProgress - 0.70) / 0.30);

  return (
    <section 
      ref={containerRef} 
      className="w-full flex flex-col items-center select-none mt-10 mb-6"
      aria-label="Brindis de cumpleaños y dedicatoria final"
    >
      {/* Animación Interactiva de Copas de Champagne (Scroll Down une, Scroll Up separa) */}
      <div 
        onClick={handleManualClink}
        role="button" 
        tabIndex={0}
        aria-label="Brindar con copas de champagne (desliza arriba y abajo)"
        className="cursor-pointer relative flex items-center justify-center p-2 mb-2 transition-transform hover:scale-105 active:scale-95"
      >
        <svg 
          viewBox="0 0 200 130" 
          className="w-36 h-28 overflow-visible" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Destellos dorados, estrellas y burbujas al chocar */}
          <g 
            style={{
              opacity: sparkleOpacity,
              transform: `scale(${sparkleScale})`,
              transformOrigin: '100px 30px',
              transition: 'opacity 0.15s ease, transform 0.15s ease'
            }}
          >
            {/* Estrella central del choque */}
            <path 
              d="M 100 12 L 102 24 L 114 26 L 102 28 L 100 40 L 98 28 L 86 26 L 98 24 Z" 
              fill="#F59E0B" 
            />
            {/* Destello secundario izquierdo */}
            <path 
              d="M 88 16 L 89 22 L 95 23 L 89 24 L 88 30 L 87 24 L 81 23 L 87 22 Z" 
              fill="#FBBF24" 
            />
            {/* Destello secundario derecho */}
            <path 
              d="M 112 16 L 113 22 L 119 23 L 113 24 L 112 30 L 111 24 L 105 23 L 111 22 Z" 
              fill="#FDE047" 
            />
            {/* Gotitas brillantes de brindis */}
            <circle cx="100" cy="8" r="2.5" fill="#FBBF24" />
            <circle cx="82" cy="10" r="2" fill="#FDE68A" />
            <circle cx="118" cy="10" r="2" fill="#FDE68A" />
            <circle cx="93" cy="36" r="1.5" fill="#F59E0B" />
            <circle cx="107" cy="36" r="1.5" fill="#F59E0B" />
          </g>

          {/* ========================================================
              COPA IZQUIERDA (Inclinación y traslación reactiva al scroll)
              ======================================================== */}
          <g 
            style={{
              transform: `translate(${leftTranslateX}px, ${translateY}px) rotate(${leftAngle}deg)`,
              transformOrigin: '70px 110px',
              transition: 'transform 0.1s linear'
            }}
          >
            {/* Sombra de la base */}
            <ellipse cx="68" cy="115" rx="14" ry="3" fill="rgba(0,0,0,0.06)" />

            {/* Base circular de la copa */}
            <path d="M 54 114 C 54 112, 82 112, 82 114 C 82 116, 54 116, 54 114 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Tallo esbelto de cristal */}
            <line x1="68" y1="114" x2="68" y2="70" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="67.5" y1="114" x2="67.5" y2="70" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

            {/* Cáliz de cristal (fondo) */}
            <path 
              d="M 53 30 L 83 30 L 78 68 C 78 76, 58 76, 58 68 Z" 
              fill="rgba(255, 255, 255, 0.45)" 
              stroke="#94A3B8" 
              strokeWidth="1.8" 
            />

            {/* Líquido de Champagne Dorado */}
            <path 
              d="M 55 40 L 81 40 L 77 66 C 77 73, 59 73, 59 66 Z" 
              fill="url(#champagne-gold-left)" 
            />

            {/* Espuma dorada en el borde del champagne */}
            <ellipse cx="68" cy="40" rx="13" ry="2.2" fill="#FEF08A" opacity="0.85" />

            {/* Burbujas efervescentes en movimiento constante */}
            <circle cx="65" cy="62" r="1.5" fill="#FEF08A" className="champagne-bubble-1" />
            <circle cx="72" cy="58" r="1.2" fill="#FFFFFF" className="champagne-bubble-2" />
            <circle cx="63" cy="52" r="1.5" fill="#FEF08A" className="champagne-bubble-3" />
            <circle cx="70" cy="48" r="1.2" fill="#FFFFFF" className="champagne-bubble-4" />

            {/* Reflejos de cristal transparente */}
            <path d="M 55 33 L 56 64" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
            <path d="M 80 34 L 79 56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* ========================================================
              COPA DERECHA (Inclinación y traslación reactiva al scroll)
              ======================================================== */}
          <g 
            style={{
              transform: `translate(${rightTranslateX}px, ${translateY}px) rotate(${rightAngle}deg)`,
              transformOrigin: '130px 110px',
              transition: 'transform 0.1s linear'
            }}
          >
            {/* Sombra de la base */}
            <ellipse cx="132" cy="115" rx="14" ry="3" fill="rgba(0,0,0,0.06)" />

            {/* Base circular de la copa */}
            <path d="M 118 114 C 118 112, 146 112, 146 114 C 146 116, 118 116, 118 114 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Tallo esbelto de cristal */}
            <line x1="132" y1="114" x2="132" y2="70" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="131.5" y1="114" x2="131.5" y2="70" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

            {/* Cáliz de cristal (fondo) */}
            <path 
              d="M 117 30 L 147 30 L 142 68 C 142 76, 122 76, 122 68 Z" 
              fill="rgba(255, 255, 255, 0.45)" 
              stroke="#94A3B8" 
              strokeWidth="1.8" 
            />

            {/* Líquido de Champagne Dorado */}
            <path 
              d="M 119 40 L 145 40 L 141 66 C 141 73, 123 73, 123 66 Z" 
              fill="url(#champagne-gold-right)" 
            />

            {/* Espuma dorada en el borde del champagne */}
            <ellipse cx="132" cy="40" rx="13" ry="2.2" fill="#FEF08A" opacity="0.85" />

            {/* Burbujas efervescentes en movimiento constante */}
            <circle cx="129" cy="62" r="1.5" fill="#FEF08A" className="champagne-bubble-1" />
            <circle cx="136" cy="58" r="1.2" fill="#FFFFFF" className="champagne-bubble-2" />
            <circle cx="127" cy="52" r="1.5" fill="#FEF08A" className="champagne-bubble-3" />
            <circle cx="134" cy="48" r="1.2" fill="#FFFFFF" className="champagne-bubble-4" />

            {/* Reflejos de cristal transparente */}
            <path d="M 145 33 L 144 64" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
            <path d="M 120 34 L 121 56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Degradados de alta calidad para el champagne dorado */}
          <defs>
            <linearGradient id="champagne-gold-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="champagne-gold-right" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Texto Superior: "Por muchos cumpleaños más juntos" */}
      <h2 className="font-script text-3xl sm:text-4xl text-stone-800 font-normal text-center leading-relaxed tracking-wide my-3 px-3 max-w-[360px]">
        Por muchos cumpleaños más juntos
      </h2>

      {/* Fotografía de la pareja con bordes redondeados y sombra idéntica a la imagen */}
      <div className="w-full max-w-[320px] sm:max-w-[350px] aspect-square rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.12)] border border-stone-200/80 my-4 bg-stone-100">
        <img 
          src="/images/special_couple.jpg" 
          alt="Nosotros celebrando juntos" 
          className="w-full h-full object-cover block select-none pointer-events-none" 
          loading="lazy" 
        />
      </div>

      {/* Texto Inferior: "Gracias por compartir tu vida conmigo" */}
      <p className="font-script text-3xl sm:text-4xl text-stone-800 font-normal text-center leading-relaxed tracking-wide my-3 px-3 max-w-[360px]">
        Gracias por compartir tu vida conmigo
      </p>

      {/* Botón "Guardar este momento" con estética idéntica al ejemplo */}
      <div className="w-full flex flex-col items-center mt-3">
        <button
          type="button"
          onClick={onSaveMoment}
          disabled={isExporting}
          className="w-full max-w-[270px] py-3.5 px-6 rounded-full bg-[#8E3B27] hover:bg-[#7A3220] active:scale-98 text-white font-serif italic text-lg sm:text-xl tracking-wide shadow-md shadow-amber-950/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Guardar este momento
        </button>

        {/* Loader de Exportación */}
        {isExporting && (
          <div className="flex flex-col items-center gap-2 mt-3 w-full max-w-[250px]">
            <div className="w-7 h-7 rounded-full border-2 border-stone-300 border-t-[#8E3B27] animate-spin" />
            <p className="text-xs font-semibold text-stone-700 m-0">
              {exportStatus}
            </p>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8E3B27] rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Texto Final: "HECHO CON AMOR" */}
      <p className="font-serif text-[0.72rem] tracking-[0.28em] text-stone-400 uppercase text-center mt-8 mb-6">
        HECHO CON AMOR
      </p>
    </section>
  );
}
