import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import HeaderState1 from './components/HeaderState1';
import HeartInteraction from './components/HeartInteraction';
import ProgressBar from './components/ProgressBar';
import MusicToggleButton from './components/MusicToggleButton';
import PolaroidCarousel from './components/PolaroidCarousel';
import { CAROUSEL_PHOTOS } from './data/memoriesData';
import AnimatedEnvelope from './components/AnimatedEnvelope';
import ChampagneToastSection from './components/ChampagneToastSection';
import VideoModal from './components/VideoModal';
import { 
  initAudioContext, 
  startBirthdayMelody 
} from './audio/retroAudioEngine';
import { generateCinematicVideo } from './utils/videoCanvasGenerator';

export default function App() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Modal de video
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  // Lightbox de fotos
  const [lightboxData, setLightboxData] = useState(null);

  // Manejador del toque en el corazón
  const handleHeartTap = () => {
    setHasStarted(true);
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Incremento de progreso (~20% por toque)
    const increments = [20, 20, 20, 20, 15, 5];
    const add = increments[Math.min(tapCount, increments.length - 1)];
    const nextProgress = Math.min(100, progress + add);
    setProgress(nextProgress);

    // Ráfaga ligera de confeti en cada toque
    confetti({
      particleCount: 15,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#FB7185', '#F43F5E', '#FFB703', '#E4007C']
    });

    // Si llega al 100% -> Transición al Estado 2
    if (nextProgress >= 100) {
      setTimeout(() => {
        triggerCelebrationTransition();
      }, 500);
    }
  };

  const triggerCelebrationTransition = () => {
    // Gran explosión festiva de confeti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E11D48', '#FFB703', '#00A896', '#E4007C', '#FB8500']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E11D48', '#FFB703', '#00A896', '#E4007C', '#FB8500']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Cambiar a Estado 2 e iniciar música 8-bit
    setStep(2);
    setTimeout(() => {
      startBirthdayMelody();
    }, 400);
  };

  // Ráfaga suave periódica de confeti cada 30 segundos (efecto festivo no invasivo)
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
      // Pausa inteligente: no lanzar si hay un modal abierto, se está exportando video o la pestaña está oculta
      if (document.hidden || videoModalOpen || lightboxData || isExporting) return;

      confetti({
        particleCount: 18,
        angle: 60,
        spread: 45,
        startVelocity: 26,
        origin: { x: 0.05, y: 0.35 },
        colors: ['#E11D48', '#FFB703', '#00A896', '#E4007C', '#FB8500'],
        ticks: 200,
        gravity: 0.7,
        scalar: 0.85
      });
      confetti({
        particleCount: 18,
        angle: 120,
        spread: 45,
        startVelocity: 26,
        origin: { x: 0.95, y: 0.35 },
        colors: ['#E11D48', '#FFB703', '#00A896', '#E4007C', '#FB8500'],
        ticks: 200,
        gravity: 0.7,
        scalar: 0.85
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [step, videoModalOpen, lightboxData, isExporting]);

  // Generador de video cinemático MP4/WebM
  const handleSaveMoment = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(5);
    setExportStatus('Preparando recuerdos y música de cumpleaños...');

    try {
      const { blob, url } = await generateCinematicVideo({
        carouselPhotos: CAROUSEL_PHOTOS,
        onProgress: (p) => setExportProgress(p),
        onStatus: (s) => setExportStatus(s)
      });

      setVideoBlob(blob);
      setVideoUrl(url);
      setIsExporting(false);
      setVideoModalOpen(true);
    } catch (err) {
      console.error('Error generando video:', err);
      const detail = err?.message || err?.name || String(err);
      setExportStatus(`Hubo un inconveniente: ${detail}`);
      setTimeout(() => setIsExporting(false), 4000);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-6 px-4 sm:px-6">
      {/* Botón flotante de música 8-Bit (arriba a la izquierda, siempre accesible) */}
      <MusicToggleButton />

      {/* ESTADO 1: Pantalla de Interacción Inicial */}
      {step === 1 && (
        <main className="w-full max-w-[430px] min-h-[85vh] bg-white/80 backdrop-blur-xl border border-white/90 rounded-[36px] shadow-soft p-8 sm:p-9 flex flex-col justify-between items-center relative overflow-hidden transition-all duration-500 animate-scale-up">
          <HeaderState1 />
          <HeartInteraction onHeartTap={handleHeartTap} tapCount={tapCount} />
          <ProgressBar progress={progress} />
        </main>
      )}

      {/* ESTADO 2: Landing Page de Revelación */}
      {step === 2 && (
        <main className="w-full max-w-[440px] flex flex-col items-center animate-fade-in">
          {/* Cabecera Estado 2 */}
          <header className="w-full text-center my-6 flex flex-col items-center">
            <span className="font-badge text-2xl font-bold tracking-widest text-[#9F1239] bg-rose-50 border-2 border-dashed border-rose-300 px-5 py-1 rounded-full mb-3 shadow-sm">
              ✨ 13 SEPTIEMBRE DE 2026 ✨
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide leading-snug max-w-[360px] m-0">
              Hoy es el cumpleaños de mi persona favorita
            </h1>
            <p className="font-subheading text-slate-600 text-lg mt-2 m-0">
              Un recorrido por lo que te hace tan única
            </p>
          </header>

          {/* Carrusel interactivo de fotos Polaroid */}
          <PolaroidCarousel onOpenLightbox={(src) => setLightboxData({ src })} />

          {/* Sobre animado con matasellos rojo clásico "DESCÚBRELO" */}
          <AnimatedEnvelope />

          {/* Sección de brindis con copas de champagne, foto de pareja y botón Guardar este momento */}
          <ChampagneToastSection 
            onSaveMoment={handleSaveMoment}
            isExporting={isExporting}
            exportProgress={exportProgress}
            exportStatus={exportStatus}
          />
        </main>
      )}

      {/* Modal de Video */}
      {videoModalOpen && (
        <VideoModal 
          videoUrl={videoUrl}
          videoBlob={videoBlob}
          onClose={() => setVideoModalOpen(false)}
        />
      )}

      {/* Lightbox para ampliar fotos del carrusel */}
      {lightboxData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer animate-fade-in"
          onClick={() => setLightboxData(null)}
        >
          <div 
            className="relative max-w-[420px] w-full bg-white p-3.5 pb-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2 border border-rose-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxData(null)}
              aria-label="Cerrar foto"
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
            >
              &times;
            </button>
            <img 
              src={lightboxData.src} 
              alt="Momento especial" 
              className="w-full max-h-[70vh] object-contain rounded-2xl shadow-sm"
            />
            {/* Adorno festivo: corazón rosa central con guirnaldas de colores a ambos lados */}
            <div className="flex items-center justify-center w-full pt-1 pb-0.5 select-none" aria-hidden="true">
              <svg className="w-full max-w-[280px] h-8 overflow-visible" viewBox="0 0 240 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
        </div>
      )}
    </div>
  );
}
