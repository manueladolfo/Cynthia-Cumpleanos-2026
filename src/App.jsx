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
      setExportStatus('Hubo un inconveniente creando el video.');
      setTimeout(() => setIsExporting(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-6 px-4 sm:px-6">
      {/* Botón flotante de música 8-Bit */}
      <MusicToggleButton visible={hasStarted} />

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
          <PolaroidCarousel onOpenLightbox={(src, caption) => setLightboxData({ src, caption })} />

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightboxData(null)}
        >
          <div className="relative max-w-[420px] w-full bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setLightboxData(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center"
            >
              &times;
            </button>
            <img 
              src={lightboxData.src} 
              alt={lightboxData.caption} 
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <p className="font-handwriting text-xl font-bold text-slate-800 m-0">
              {lightboxData.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
