// ===================================================================
// GENERADOR CINEMATOGRÁFICO DE VIDEO (Canvas 2D + MediaRecorder)
// Recorrido fiel a la experiencia web (~56 segundos)
// Sincronizado en tiempo real para iPhone / iOS Safari y PC
// ===================================================================

import { 
  initAudioContext, 
  createVideoAudioTrack 
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

// Dibujar imagen manteniendo proporción y encuadrando caras de forma segura (sin subpíxeles impares)
function drawFittedPhoto(ctx, img, dx, dy, size, isPhoto27 = false) {
  if (!img) {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(Math.floor(dx), Math.floor(dy), Math.floor(size), Math.floor(size));
    return;
  }

  const iw = img.width;
  const ih = img.height;
  let sx = 0, sy = 0, sw = iw, sh = ih;

  if (iw > ih) {
    sw = ih;
    sx = Math.floor((iw - ih) / 2);
  } else if (ih > iw) {
    sh = iw;
    if (isPhoto27) {
      sy = 0; // Anclaje superior para foto 27 (ambas cabezas completas)
    } else {
      sy = Math.floor(Math.max(0, (ih - iw) * 0.22)); // Enfoque tercio superior para fotos verticales
    }
  }

  // Asegurar que las coordenadas no excedan las dimensiones de la imagen
  sw = Math.min(sw, iw - sx);
  sh = Math.min(sh, ih - sy);

  ctx.drawImage(
    img, 
    Math.floor(sx), 
    Math.floor(sy), 
    Math.floor(sw), 
    Math.floor(sh), 
    Math.floor(dx), 
    Math.floor(dy), 
    Math.floor(size), 
    Math.floor(size)
  );
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

  // Líquido dorado
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
  onStatus('Cargando los 29 recuerdos y preparando la música...');
  onProgress(5);

  initAudioContext();

  // 1. Cargar TODAS las 29 fotos y la foto de pareja
  const [loadedCarousel, specialCoupleImg] = await Promise.all([
    Promise.all(carouselPhotos.map(src => loadImage(src))),
    loadImage('/images/special_couple.jpg')
  ]);

  onProgress(12);
  onStatus('Iniciando grabación cinematográfica...');

  // 2. Configurar Canvas 720x1280 (9:16 vertical móvil)
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  const fps = 30;
  const totalDurationSeconds = 56; // 56 segundos para las 29 fotos completas, carta y brindis

  const stream = canvas.captureStream(fps);

  // Iniciar pista de audio sincronizada con timestamps limpios (evita desfase en iOS Safari)
  const audioInfo = createVideoAudioTrack(totalDurationSeconds);
  if (audioInfo && audioInfo.track) {
    stream.addTrack(audioInfo.track);
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
  const recorder = new MediaRecorder(stream, { mimeType });
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  // Vaciar buffer cada 1000ms para evitar desbordamiento de memoria en VideoToolbox (iOS)
  recorder.start(1000);

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
    vRot: (Math.random() - 0.5) * 0.25
  }));

  // Preparar la lista con TODAS las fotos (las 29 fotos)
  const allPhotos = loadedCarousel.map((img, idx) => ({
    img,
    index: idx,
    isPhoto27: idx === 26 // Foto 27: ajuste de caras
  }));

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      if (audioInfo && audioInfo.cleanup) audioInfo.cleanup();
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url });
    };

    recorder.onerror = (err) => {
      if (audioInfo && audioInfo.cleanup) audioInfo.cleanup();
      reject(err);
    };

    let startTime = null;

    // Bucle de renderizado basado en tiempo real (evita desincronización en pantallas 120Hz/60Hz)
    function renderLoop(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      if (elapsed >= totalDurationSeconds) {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        return;
      }

      // 1. Fondo degradado base
      const bg = ctx.createLinearGradient(0, 0, 720, 1280);
      bg.addColorStop(0, '#FFF6F7');
      bg.addColorStop(0.5, '#FAF6F0');
      bg.addColorStop(1, '#F4EBE4');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 720, 1280);

      // ===============================================================
      // ESCENA 1: Intro y Desbloqueo de Corazón (0.0s - 4.5s)
      // ===============================================================
      if (elapsed < 4.5) {
        onStatus('Generando escena: Desbloqueo y bienvenida...');

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

        // Corazón pulsante
        const pulse = 1 + Math.sin(elapsed * 7) * 0.08;
        const heartSize = 130 * pulse;
        const heartColor = elapsed >= 2.8 ? '#E11D48' : '#F43F5E';
        drawHeart(ctx, 360, 560, heartSize, heartColor);

        // Barra de progreso interactiva
        const fillProgress = Math.min(100, Math.round((elapsed / 2.8) * 100));
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

        // Ráfaga de confeti festivo a partir de 2.8s
        if (elapsed >= 2.8) {
          const confettiAge = (elapsed - 2.8) / 1.7;
          confettiParticles.forEach(p => {
            p.x += p.vx * 0.7;
            p.y += p.vy * 0.7;
            p.vy += 0.45; // gravedad
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - confettiAge * 0.8);
            ctx.fillRect(-p.sizeW / 2, -p.sizeH / 2, p.sizeW, p.sizeH);
            ctx.restore();
          });
        }
      }

      // ===============================================================
      // ESCENA 2: Carrusel Polaroid LIMPIO con las 29 Fotos (4.5s - 40.5s)
      // Duración: 36 segundos / 29 fotos = ~1.24s por foto
      // ===============================================================
      else if (elapsed >= 4.5 && elapsed < 40.5) {
        onStatus('Generando escena: Recuerdos en fotos Polaroid...');
        const carouselElapsed = elapsed - 4.5;
        const totalPhotos = allPhotos.length;
        const timePerPhoto = 36.0 / totalPhotos; // ~1.24s por foto

        const currentPhotoIdx = Math.min(Math.floor(carouselElapsed / timePerPhoto), totalPhotos - 1);
        const photoProgress = (carouselElapsed % timePerPhoto) / timePerPhoto;

        const currentPhoto = allPhotos[currentPhotoIdx];
        const nextPhoto = allPhotos[Math.min(currentPhotoIdx + 1, totalPhotos - 1)];

        // Título limpio y elegante superior
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 42px Georgia, serif';
        ctx.fillText('✨ Nuestros Recuerdos ✨', 360, 170);
        ctx.restore();

        // Marco Polaroid Blanco Clásico
        const pCardW = 540;
        const pCardH = 650;
        const pCardX = (720 - pCardW) / 2;
        const pCardY = 250;

        // Sombra suave realista
        ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
        ctx.beginPath();
        ctx.roundRect(pCardX + 10, pCardY + 14, pCardW, pCardH, 12);
        ctx.fill();

        // Cartulina polaroid blanca limpia
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(pCardX, pCardY, pCardW, pCardH, 12);
        ctx.fill();

        // Ventana cuadrada de foto
        const photoSize = pCardW - 48; // 492x492
        const photoX = pCardX + 24;
        const photoY = pCardY + 24;

        // Clip de la ventana para deslizar fotos
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoSize, photoSize);
        ctx.clip();

        // Transición de deslizamiento horizontal (último 22% del tiempo de cada foto)
        let slideOffset = 0;
        if (photoProgress > 0.78) {
          const slideRatio = (photoProgress - 0.78) / 0.22;
          const easeSlide = slideRatio * slideRatio * (3 - 2 * slideRatio);
          slideOffset = -easeSlide * photoSize;
        }

        // Dibujar foto actual con sutil zoom
        ctx.save();
        ctx.translate(slideOffset, 0);
        const subtleZoom = 1 + photoProgress * 0.025;
        ctx.translate(photoX + photoSize / 2, photoY + photoSize / 2);
        ctx.scale(subtleZoom, subtleZoom);
        ctx.translate(-(photoX + photoSize / 2), -(photoY + photoSize / 2));
        drawFittedPhoto(ctx, currentPhoto.img, photoX, photoY, photoSize, currentPhoto.isPhoto27);
        ctx.restore();

        // Si está deslizando, dibujar la siguiente entrando desde la derecha
        if (slideOffset < 0 && nextPhoto && currentPhotoIdx < totalPhotos - 1) {
          ctx.save();
          ctx.translate(slideOffset + photoSize, 0);
          drawFittedPhoto(ctx, nextPhoto.img, photoX, photoY, photoSize, nextPhoto.isPhoto27);
          ctx.restore();
        }
        ctx.restore(); // Fin clip foto

        // Pie de foto de la Polaroid: LIMPIO Y ELEGANTE (SIN NINGÚN TEXTO ARTIFICIAL)
        ctx.save();
        ctx.fillStyle = '#E11D48';
        ctx.font = '28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('❤️', 360, pCardY + photoSize + 62);
        ctx.restore();
      }

      // ===============================================================
      // ESCENA 3: Sobre Artesanal y Carta Secreta (40.5s - 47.5s)
      // ===============================================================
      else if (elapsed >= 40.5 && elapsed < 47.5) {
        onStatus('Generando escena: Carta secreta...');

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 44px Georgia, serif';
        ctx.fillText('✉️ Hay algo dentro para ti', 360, 160);

        // Carta que se despliega
        const cardW = 620;
        const cardH = 840;
        const cardX = (720 - cardW) / 2;
        const cardY = 200;

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

        // Comillas decorativas
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.font = 'bold 90px Georgia, serif';
        ctx.fillText('“', cardX + 45, cardY + 85);

        // Estrofas del Poema (Texto definitivo exacto)
        let ty = cardY + 80;

        // Estrofa 1
        ctx.fillStyle = '#1E293B';
        ctx.font = '25px "Caveat", cursive, Georgia, serif';
        ctx.fillText('Hay personas que cuando llegan a tu vida, lo cambian todo.', 360, ty);
        ty += 32;
        ctx.fillText('Creo que ni el destino escribiendo las mejores historias,', 360, ty);
        ty += 32;
        ctx.fillText('habría creado a alguien tan especial para mí como tú.', 360, ty);

        // Divisor 1
        ty += 32;
        ctx.fillStyle = '#F43F5E';
        ctx.font = '18px Georgia, serif';
        ctx.fillText('❦', 360, ty);

        // Estrofa 2
        ty += 32;
        ctx.fillStyle = '#1E293B';
        ctx.font = '25px "Caveat", cursive, Georgia, serif';
        ctx.fillText('Hoy me gustaría celebrarte tus mejores y peores momentos', 360, ty);
        ty += 32;
        ctx.fillText('y hacerte saber que siempre estoy y estaré para ti,', 360, ty);
        ty += 32;
        ctx.fillText('tanto para los unos como para los otros...', 360, ty);
        ty += 30;
        ctx.fillStyle = '#9F1239';
        ctx.font = 'italic 23px "Caveat", cursive, Georgia, serif';
        ctx.fillText('(aunque también me gustan más los buenos).', 360, ty);

        // Divisor 2
        ty += 32;
        ctx.fillStyle = '#F43F5E';
        ctx.font = '18px Georgia, serif';
        ctx.fillText('❦', 360, ty);

        // Estrofa 3
        ty += 32;
        ctx.fillStyle = '#1E293B';
        ctx.font = '25px "Caveat", cursive, Georgia, serif';
        ctx.fillText('Me gustaría celebrar contigo, tu forma de ser,', 360, ty);
        ty += 32;
        ctx.fillText('tu sonrisa y tu luz.', 360, ty);
        ty += 32;
        ctx.fillText('Que la vida te siga mostrando que no hay nada más especial', 360, ty);
        ty += 32;
        ctx.fillText('que cada instante vivido y nadie más especial que TÚ.', 360, ty);

        // Divisor 3
        ty += 32;
        ctx.fillStyle = '#F43F5E';
        ctx.font = '18px Georgia, serif';
        ctx.fillText('❦', 360, ty);

        // Estrofa 4
        ty += 32;
        ctx.fillStyle = '#1E293B';
        ctx.font = '25px "Caveat", cursive, Georgia, serif';
        ctx.fillText('Cada año que cumples,', 360, ty);
        ty += 32;
        ctx.fillText('es un nuevo capítulo que pienso compartir contigo.', 360, ty);

        // Cierre
        ty += 38;
        ctx.fillStyle = '#9F1239';
        ctx.font = 'bold italic 25px Georgia, serif';
        ctx.fillText('— Siempre contigo ❤️', 470, ty);

        // Sello de lacre rojo en la parte inferior
        ctx.beginPath();
        ctx.arc(360, cardY + cardH - 45, 34, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.strokeStyle = '#991B1B';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FFFDF2';
        ctx.font = 'bold italic 15px Georgia, serif';
        ctx.fillText('Para ti', 360, cardY + cardH - 40);

        ctx.restore();
      }

      // ===============================================================
      // ESCENA 4: Brindis con Champagne & Foto de Pareja (47.5s - 52.5s)
      // ===============================================================
      else if (elapsed >= 47.5 && elapsed < 52.5) {
        onStatus('Generando escena: Brindis y foto especial...');
        const toastElapsed = elapsed - 47.5;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E3B27';
        ctx.font = 'italic bold 44px Georgia, serif';
        ctx.fillText('🥂 ¡Un Brindis por Ti! 🥂', 360, 160);

        // Animación de copas
        const clinkProgress = Math.min(1, toastElapsed / 1.5);
        const glassSeparation = 130 * (1 - Math.min(1, clinkProgress * 1.5));
        const tiltLeft = 0.20 * Math.min(1, clinkProgress * 2);
        const tiltRight = -0.20 * Math.min(1, clinkProgress * 2);

        drawChampagneGlass(ctx, 360 - 45 - glassSeparation, 300, tiltLeft, '#F59E0B');
        drawChampagneGlass(ctx, 360 + 45 + glassSeparation, 300, tiltRight, '#F59E0B');

        // Destello de choque
        if (clinkProgress > 0.6) {
          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 36px Georgia, serif';
          ctx.fillText('✨ ¡SALUD! ✨', 360, 420);
        }

        // Título foto de pareja
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 38px "Great Vibes", cursive, Georgia, serif';
        ctx.fillText('Por muchos cumpleaños más juntos', 360, 475);

        // Foto de Pareja Enmarcada
        const cPhotoSize = 440;
        const cPhotoX = (720 - cPhotoSize) / 2;
        const cPhotoY = 515;

        // Marco elegante
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.roundRect(cPhotoX + 8, cPhotoY + 12, cPhotoSize, cPhotoSize, 24);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cPhotoX, cPhotoY, cPhotoSize, cPhotoSize, 24);
        ctx.fill();

        // Foto centrada
        if (specialCoupleImg) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(cPhotoX + 16, cPhotoY + 16, cPhotoSize - 32, cPhotoSize - 32, 16);
          ctx.clip();
          drawFittedPhoto(ctx, specialCoupleImg, cPhotoX + 16, cPhotoY + 16, cPhotoSize - 32);
          ctx.restore();
        }

        ctx.fillStyle = '#8E3B27';
        ctx.font = 'bold 36px "Caveat", cursive, Georgia, serif';
        ctx.fillText('“Gracias por compartir tu vida conmigo”', 360, 1020);
        ctx.fillStyle = '#64748B';
        ctx.font = '24px Georgia, serif';
        ctx.fillText('Siempre juntos ❤️', 360, 1065);
        ctx.restore();
      }

      // ===============================================================
      // ESCENA 5: Cierre Emotivo (52.5s - 56.0s)
      // ===============================================================
      else {
        onStatus('Finalizando video...');
        const outroElapsed = elapsed - 52.5;

        const endBg = ctx.createLinearGradient(0, 0, 720, 1280);
        endBg.addColorStop(0, '#FFE4E6');
        endBg.addColorStop(0.6, '#FFF1F2');
        endBg.addColorStop(1, '#FFE4E6');
        ctx.fillStyle = endBg;
        ctx.fillRect(0, 0, 720, 1280);

        // Corazones flotantes suaves
        ctx.save();
        for (let i = 0; i < 12; i++) {
          const hx = 100 + (i * 65) % 560;
          const hy = 1100 - ((outroElapsed * 120 + i * 90) % 950);
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

      const currentPct = Math.min(98, Math.round((elapsed / totalDurationSeconds) * 88) + 12);
      onProgress(currentPct);

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  });
}
