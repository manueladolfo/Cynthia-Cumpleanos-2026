// ===================================================================
// GENERADOR CINEMATOGRÁFICO DE VIDEO (Canvas 2D + MediaRecorder)
// Recorrido interactivo fiel a la experiencia web (~48 segundos)
// ===================================================================

import { 
  initAudioContext, 
  getAudioDestination, 
  startVideoSoundtrack, 
  stopVideoSoundtrack 
} from '../audio/retroAudioEngine';

// Carga segura de imagen con CORS
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('No se pudo cargar la imagen para el video:', src);
      resolve(null);
    };
    img.src = src;
  });
}

// Dibujar imagen manteniendo proporción y enfocando rostros
function drawFittedPhoto(ctx, img, dx, dy, size, isPhoto27 = false) {
  if (!img) {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(dx, dy, size, size);
    return;
  }

  const iw = img.width;
  const ih = img.height;
  let sx = 0, sy = 0, sw = iw, sh = ih;

  if (iw > ih) {
    sw = ih;
    sx = (iw - ih) / 2;
  } else if (ih > iw) {
    sh = iw;
    if (isPhoto27) {
      sy = 0; // Anclaje superior para la foto 27 (ambas caras completas)
    } else {
      sy = Math.max(0, (ih - iw) * 0.22); // Enfoque tercio superior para fotos verticales
    }
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, size, size);
}

// Dibujar corazón estilizado
function drawHeart(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.15);
  ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Dibujar copas de champagne brindando
function drawChampagneGlass(ctx, x, y, tiltAngle, liquidColor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tiltAngle);

  // Base
  ctx.beginPath();
  ctx.ellipse(0, 100, 25, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  // Tallo
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(0, 35);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Copa (cáliz)
  ctx.beginPath();
  ctx.moveTo(-25, -60);
  ctx.lineTo(25, -60);
  ctx.lineTo(18, 25);
  ctx.quadraticCurveTo(0, 38, -18, 25);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();

  // Líquido dorado con degradado
  ctx.beginPath();
  ctx.moveTo(-22, -35);
  ctx.lineTo(22, -35);
  ctx.lineTo(16, 22);
  ctx.quadraticCurveTo(0, 34, -16, 22);
  ctx.closePath();
  ctx.fillStyle = liquidColor;
  ctx.fill();

  // Burbujitas
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-5, -5, 2.5, 0, Math.PI * 2);
  ctx.arc(8, 5, 2, 0, Math.PI * 2);
  ctx.arc(-2, 18, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export async function generateCinematicVideo({
  carouselPhotos,
  onProgress,
  onStatus
}) {
  onStatus('Cargando recuerdos y preparando la música...');
  onProgress(5);

  initAudioContext();

  // 1. Cargar todas las fotos
  const [loadedCarousel, specialCoupleImg] = await Promise.all([
    Promise.all(carouselPhotos.map(src => loadImage(src))),
    loadImage('images/special_couple.jpg')
  ]);

  onProgress(15);
  onStatus('Iniciando grabación cinematográfica...');

  // 2. Configurar Canvas 720x1280 (9:16 vertical)
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  const fps = 30;
  const totalDurationSeconds = 48;
  const totalFrames = fps * totalDurationSeconds; // 1440 frames

  const stream = canvas.captureStream(fps);
  const audioDest = getAudioDestination();
  if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
    stream.addTrack(audioDest.stream.getAudioTracks()[0]);
  }

  let mimeType = 'video/webm;codecs=vp9';
  if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
    mimeType = 'video/mp4;codecs=avc1';
  } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    mimeType = 'video/mp4';
  } else if (MediaRecorder.isTypeSupported('video/webm')) {
    mimeType = 'video/webm';
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3500000 });
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  // Iniciar audio limpio sin eco
  startVideoSoundtrack(totalDurationSeconds);
  recorder.start();

  // Partículas de confetti para la escena 1
  const confettiColors = ['#E11D48', '#FFB703', '#00A896', '#E4007C', '#FB8500', '#2563EB'];
  const confettiParticles = Array.from({ length: 80 }, () => ({
    x: 360 + (Math.random() - 0.5) * 80,
    y: 640 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 22,
    vy: -Math.random() * 20 - 8,
    sizeW: Math.random() * 12 + 8,
    sizeH: Math.random() * 8 + 6,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.25,
    wobble: Math.random() * Math.PI * 2
  }));

  // Selección de momentos para el carrusel en el video (~8 fotos destacadas, asegurando foto 27)
  const selectedIndices = [0, 4, 8, 14, 18, 21, 26, 28]; // Incluye 26 (foto 27)
  const featuredPhotos = selectedIndices.map(idx => ({
    img: loadedCarousel[idx] || loadedCarousel[0],
    index: idx,
    isPhoto27: idx === 26,
    caption: idx === 26 ? 'Un momento inolvidable' : `Recuerdo especial ${idx + 1}`
  }));

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      stopVideoSoundtrack();
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url });
    };

    recorder.onerror = (err) => {
      stopVideoSoundtrack();
      reject(err);
    };

    let frame = 0;

    function renderFrame() {
      if (frame >= totalFrames) {
        recorder.stop();
        return;
      }

      // Fondo degradado base
      const bg = ctx.createLinearGradient(0, 0, 720, 1280);
      bg.addColorStop(0, '#FFF6F7');
      bg.addColorStop(0.5, '#FAF6F0');
      bg.addColorStop(1, '#F4EBE4');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 720, 1280);

      // ===============================================================
      // ESCENA 1: Intro, Corazón interactivo & Lluvia de Confetti (0s - 7.5s, f: 0..225)
      // ===============================================================
      if (frame < 225) {
        onStatus('Generando escena: Desbloqueo y bienvenida...');
        const introProgress = frame / 225;

        // Cabecera festiva superior
        ctx.save();
        ctx.textAlign = 'center';
        
        // Cinta distintiva
        ctx.fillStyle = '#FFE4E6';
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.roundRect(160, 140, 400, 52, 26);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#9F1239';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('PARA ALGUIEN MUY ESPECIAL', 360, 174);

        // Título Cynthia en caligrafía
        ctx.fillStyle = '#0B4F6C';
        ctx.font = 'bold 110px "Great Vibes", cursive, Georgia, serif';
        ctx.fillText('Cynthia', 360, 310);

        // Subtítulo
        ctx.fillStyle = '#475569';
        ctx.font = '30px sans-serif';
        ctx.fillText('Tengo una sorpresa preparada para ti', 360, 380);
        ctx.restore();

        // Corazón pulsante (Frames 0 a 150)
        const pulse = 1 + Math.sin(frame * 0.18) * 0.08;
        const heartSize = 130 * pulse;
        const heartColor = frame >= 140 ? '#E11D48' : '#F43F5E';
        drawHeart(ctx, 360, 560, heartSize, heartColor);

        // Barra de progreso y texto que sube hasta 100%
        const fillProgress = Math.min(100, Math.round((frame / 140) * 100));
        let statusText = 'Toca el corazón';
        if (fillProgress >= 25) statusText = 'Algo se está encendiendo...';
        if (fillProgress >= 65) statusText = 'Sigue, que esto se calienta';
        if (fillProgress >= 90) statusText = 'Un poquito más';
        if (fillProgress >= 100) statusText = '¡Para ti, Cynthia! 💖';

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 36px "Patrick Hand", cursive, sans-serif';
        ctx.fillText(statusText, 360, 750);

        // Barra
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(160, 780, 400, 24, 12);
        ctx.fill();

        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.roundRect(160, 780, (400 * fillProgress) / 100, 24, 12);
        ctx.fill();

        ctx.fillStyle = '#9F1239';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`${fillProgress}%`, 590, 800);
        ctx.restore();

        // Confetti burst a partir del frame 140
        if (frame >= 140) {
          const confettiAge = (frame - 140) / 85;
          confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.55; // gravedad
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - confettiAge * 0.7);
            ctx.fillRect(-p.sizeW / 2, -p.sizeH / 2, p.sizeW, p.sizeH);
            ctx.restore();
          });
        }
      }

      // ===============================================================
      // ESCENA 2: Carrusel Polaroid Deslizante (7.5s - 27.5s, f: 225..825)
      // ===============================================================
      else if (frame >= 225 && frame < 825) {
        onStatus('Generando escena: Recuerdos en Polaroid...');
        const carouselframe = frame - 225;
        const totalCarouselFrames = 600;
        const framesPerPhoto = totalCarouselFrames / featuredPhotos.length; // 75 frames = 2.5s por foto
        const currentPhotoIdx = Math.min(Math.floor(carouselframe / framesPerPhoto), featuredPhotos.length - 1);
        const photoLocalProgress = (carouselframe % framesPerPhoto) / framesPerPhoto;

        const currentPhoto = featuredPhotos[currentPhotoIdx];
        const nextPhoto = featuredPhotos[Math.min(currentPhotoIdx + 1, featuredPhotos.length - 1)];

        // Título de la sección
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 44px Georgia, serif';
        ctx.fillText('✨ Algunos Momentos ✨', 360, 170);
        ctx.fillStyle = '#64748B';
        ctx.font = '24px sans-serif';
        ctx.fillText('Nuestros mejores recuerdos juntos', 360, 215);

        // Marco Polaroid Blanco
        const pCardW = 540;
        const pCardH = 680;
        const pCardX = (720 - pCardW) / 2;
        const pCardY = 270;

        // Sombra suave
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.roundRect(pCardX + 10, pCardY + 14, pCardW, pCardH, 8);
        ctx.fill();

        // Cartulina polaroid
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(pCardX, pCardY, pCardW, pCardH, 8);
        ctx.fill();

        // Marco cuadrado de foto
        const photoSize = pCardW - 48; // 492x492
        const photoX = pCardX + 24;
        const photoY = pCardY + 24;

        // Clip de la ventana de foto para deslizar
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoSize, photoSize);
        ctx.clip();

        // Transición de deslizamiento horizontal (como el carrusel web)
        let slideOffset = 0;
        if (photoLocalProgress > 0.82) {
          const slideOutRatio = (photoLocalProgress - 0.82) / 0.18;
          slideOffset = -slideOutRatio * photoSize;
        }

        // Dibujar foto actual
        ctx.save();
        ctx.translate(slideOffset, 0);
        const subtleZoom = 1 + photoLocalProgress * 0.03;
        ctx.translate(photoX + photoSize / 2, photoY + photoSize / 2);
        ctx.scale(subtleZoom, subtleZoom);
        ctx.translate(-(photoX + photoSize / 2), -(photoY + photoSize / 2));
        drawFittedPhoto(ctx, currentPhoto.img, photoX, photoY, photoSize, currentPhoto.isPhoto27);
        ctx.restore();

        // Si está deslizando, dibujar la siguiente entrando desde la derecha
        if (slideOffset < 0 && nextPhoto) {
          ctx.save();
          ctx.translate(slideOffset + photoSize, 0);
          drawFittedPhoto(ctx, nextPhoto.img, photoX, photoY, photoSize, nextPhoto.isPhoto27);
          ctx.restore();
        }
        ctx.restore(); // fin de clip

        // Motivo festivo inferior: banderitas mexicanas y rayos estrellados
        const garlandY = pCardY + photoSize + 48;
        ctx.save();
        ctx.strokeStyle = '#78716C';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(pCardX + 130, garlandY);
        ctx.quadraticCurveTo(360, garlandY + 16, pCardX + pCardW - 130, garlandY);
        ctx.stroke();

        // Banderitas de colores
        const flagColors = ['#DC2626', '#1D4ED8', '#F59E0B', '#16A34A', '#B91C1C', '#0284C7'];
        for (let i = 0; i < 6; i++) {
          const fx = pCardX + 165 + i * 36;
          const fy = garlandY + 5 + Math.sin((i / 5) * Math.PI) * 7;
          ctx.fillStyle = flagColors[i];
          ctx.beginPath();
          ctx.moveTo(fx - 10, fy);
          ctx.lineTo(fx + 10, fy);
          ctx.lineTo(fx, fy + 15);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Pie de foto manuscrito
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 38px "Patrick Hand", cursive, sans-serif';
        ctx.fillText(currentPhoto.caption, 360, pCardY + photoSize + 115);

        // Indicador de foto
        ctx.fillStyle = '#64748B';
        ctx.font = '22px sans-serif';
        ctx.fillText(`Foto ${currentPhotoIdx + 1} de ${featuredPhotos.length}`, 360, 1010);
        ctx.restore();
      }

      // ===============================================================
      // ESCENA 3: Sobre Artesanal y Carta Secreta (27.5s - 36.5s, f: 825..1095)
      // ===============================================================
      else if (frame >= 825 && frame < 1095) {
        onStatus('Generando escena: Carta secreta...');
        const letterFrame = frame - 825;
        const letterProgress = letterFrame / 270;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 44px Georgia, serif';
        ctx.fillText('✉️ Hay algo dentro para ti', 360, 170);

        // Carta que se despliega
        const cardW = 580;
        const cardH = 740;
        const cardX = (720 - cardW) / 2;
        const cardY = 260;

        // Fondo pergamino de la carta
        const letterBg = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        letterBg.addColorStop(0, '#FFFDF8');
        letterBg.addColorStop(1, '#FDFBF0');

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.roundRect(cardX + 8, cardY + 12, cardW, cardH, 20);
        ctx.fill();

        ctx.fillStyle = letterBg;
        ctx.strokeStyle = '#EADBC0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();

        // Comillas grandes rosadas
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.font = 'bold 120px Georgia, serif';
        ctx.fillText('“', cardX + 60, cardY + 110);

        // Texto poético con caligrafía
        ctx.fillStyle = '#1E293B';
        ctx.font = '36px "Caveat", cursive, Georgia, serif';
        
        ctx.fillText('Cynthia, desde que llegaste a mi vida', 360, cardY + 140);
        ctx.fillText('cada día tiene un color diferente.', 360, cardY + 190);
        ctx.fillText('Tienes esa luz que transforma lo ordinario', 360, cardY + 240);
        ctx.fillText('en algo completamente extraordinario.', 360, cardY + 290);

        ctx.fillStyle = '#9F1239';
        ctx.font = 'bold italic 28px Georgia, serif';
        ctx.fillText('— Siempre contigo', 460, cardY + 350);

        // Floritura central
        ctx.fillStyle = '#F43F5E';
        ctx.font = '34px Georgia, serif';
        ctx.fillText('❦ ❦ ❦', 360, cardY + 410);

        ctx.fillStyle = '#1E293B';
        ctx.font = '36px "Caveat", cursive, Georgia, serif';
        ctx.fillText('Admiro tu fuerza, tu sonrisa sincera y esa', 360, cardY + 470);
        ctx.fillText('forma tan tuya de cuidar a quienes quieres.', 360, cardY + 520);
        ctx.fillText('Eres mi persona favorita en todo el universo.', 360, cardY + 570);

        ctx.fillStyle = '#9F1239';
        ctx.font = 'bold italic 28px Georgia, serif';
        ctx.fillText('— Con todo mi corazón', 450, cardY + 630);

        // Sello de lacre rojo en la parte inferior
        ctx.beginPath();
        ctx.arc(360, cardY + cardH - 45, 34, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.strokeStyle = '#991B1B';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FFFDF2';
        ctx.font = 'italic bold 18px Georgia, serif';
        ctx.fillText('Descúbrelo', 360, cardY + cardH - 39);
        ctx.restore();
      }

      // ===============================================================
      // ESCENA 4: Brindis con Copas & Foto Especial (36.5s - 43.5s, f: 1095..1305)
      // ===============================================================
      else if (frame >= 1095 && frame < 1305) {
        onStatus('Generando escena: Brindis de cumpleaños...');
        const toastFrame = frame - 1095;
        const toastProgress = toastFrame / 210;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 44px Georgia, serif';
        ctx.fillText('🥂 Por muchos cumpleaños más', 360, 170);

        // Animación de las copas acercándose y brindando
        const clinkPoint = Math.min(1, toastProgress * 3.5);
        const leftGlassX = 260 + (1 - clinkPoint) * -50;
        const rightGlassX = 460 + (1 - clinkPoint) * 50;
        const tiltL = 0.25 * clinkPoint;
        const tiltR = -0.25 * clinkPoint;

        drawChampagneGlass(ctx, leftGlassX, 330, tiltL, '#FBBF24');
        drawChampagneGlass(ctx, rightGlassX, 330, tiltR, '#FBBF24');

        // Destello dorado en el contacto
        if (toastProgress > 0.25) {
          const sparkleScale = 1 + Math.sin(toastFrame * 0.3) * 0.3;
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(360, 310, 8 * sparkleScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Marco de la Foto Especial (special_couple.jpg)
        const sSize = 460;
        const sX = (720 - sSize) / 2;
        const sY = 480;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.beginPath();
        ctx.roundRect(sX + 8, sY + 12, sSize, sSize, 24);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(sX, sY, sSize, sSize, 24);
        ctx.fill();

        // Imagen especial recortada con esquinas suaves
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(sX + 16, sY + 16, sSize - 32, sSize - 32, 16);
        ctx.clip();
        drawFittedPhoto(ctx, specialCoupleImg, sX + 16, sY + 16, sSize - 32, false);
        ctx.restore();

        // Dedicatoria final bajo la foto
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'bold 36px "Caveat", cursive, Georgia, serif';
        ctx.fillText('“Gracias por compartir tu vida conmigo”', 360, 1020);
        ctx.fillStyle = '#64748B';
        ctx.font = '24px Georgia, serif';
        ctx.fillText('Siempre juntos ❤️', 360, 1065);
        ctx.restore();
      }

      // ===============================================================
      // ESCENA 5: Cierre Emotivo (43.5s - 48s, f: 1305..1440)
      // ===============================================================
      else {
        onStatus('Finalizando video...');
        const outroFrame = frame - 1305;
        const outroProgress = outroFrame / 135;

        // Fondo romántico suave
        const endBg = ctx.createLinearGradient(0, 0, 720, 1280);
        endBg.addColorStop(0, '#FFE4E6');
        endBg.addColorStop(0.6, '#FFF1F2');
        endBg.addColorStop(1, '#FFE4E6');
        ctx.fillStyle = endBg;
        ctx.fillRect(0, 0, 720, 1280);

        // Corazones suaves flotando
        ctx.save();
        for (let i = 0; i < 12; i++) {
          const hx = 100 + (i * 65) % 560;
          const hy = 1100 - ((outroFrame * 4 + i * 90) % 950);
          drawHeart(ctx, hx, hy, 26, 'rgba(244, 63, 94, 0.35)');
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#0B4F6C';
        ctx.font = 'bold 96px "Great Vibes", cursive, Georgia, serif';
        ctx.fillText('¡Feliz Cumpleaños,', 360, 520);
        ctx.fillText('Cynthia!', 360, 630);

        ctx.fillStyle = '#E11D48';
        ctx.font = 'bold 36px Georgia, serif';
        ctx.fillText('✨ 13 Septiembre 2026 ✨', 360, 730);

        ctx.fillStyle = '#881337';
        ctx.font = 'italic bold 32px Georgia, serif';
        ctx.fillText('Hecho con Amor ❤️', 360, 830);

        ctx.fillStyle = '#475569';
        ctx.font = '26px sans-serif';
        ctx.fillText('Para mi persona favorita en el universo', 360, 880);
        ctx.restore();
      }

      frame++;
      const currentPct = Math.min(98, Math.round((frame / totalFrames) * 85) + 15);
      onProgress(currentPct);
      requestAnimationFrame(renderFrame);
    }

    renderFrame();
  });
}
