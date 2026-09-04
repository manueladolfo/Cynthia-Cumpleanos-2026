import React from 'react';

export default function VideoModal({ videoUrl, videoBlob, onClose }) {
  if (!videoUrl) return null;

  const fileName = 'Cumpleanos_Cynthia_13_Septiembre_2026.mp4';

  const handleDownload = async () => {
    // 1. Intentar File System Access API para elegir carpeta
    if (window.showSaveFilePicker && videoBlob) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Video de Cumpleaños MP4',
            accept: { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(videoBlob);
        await writable.close();
        return;
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn('Error con File System API:', e);
        }
      }
    }

    // 2. Descarga tradicional por enlace
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 2000);
  };

  const handleShare = async () => {
    if (navigator.canShare && videoBlob) {
      const file = new File([videoBlob], fileName, { type: videoBlob.type });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: '¡Feliz Cumpleaños Cynthia! 🎂✨',
            text: 'Un recuerdo especial para Cynthia ❤️'
          });
          return;
        } catch (e) {
          if (e.name !== 'AbortError') console.warn('Share error:', e);
        }
      }
    }
    // Fallback: descargar
    handleDownload();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-[420px] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar reproductor"
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xl font-bold transition-all"
        >
          &times;
        </button>

        <h3 className="font-heading text-xl font-bold text-slate-800 m-0 text-center">
          🎬 ¡Tu Video está Listo!
        </h3>

        {/* Reproductor de video integrado */}
        <div className="w-full aspect-[9/16] max-h-[380px] bg-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            playsInline 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Botones de acción */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 shadow-md shadow-rose-200 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>📥</span> Descargar a mi dispositivo
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 px-6 rounded-full font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/60 hover:bg-emerald-100 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>📱</span> Compartir en WhatsApp / Fotos
          </button>
        </div>

        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 w-full text-left leading-relaxed m-0">
          💡 <strong>Dónde encontrarlo:</strong> Se descargará automáticamente en tu carpeta de <em>Descargas</em> con el nombre <code>{fileName}</code>.
        </p>
      </div>
    </div>
  );
}
