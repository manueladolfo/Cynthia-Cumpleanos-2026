/**
 * ===================================================================
 * APLICACIÓN WEB DE CUMPLEAÑOS PARA CYNTHIA (13 Septiembre 2026)
 * ===================================================================
 * 
 * Configuración fácil para personalizar fotos y mensajes:
 * Modifica el array MEMORIES_DATA a continuación con tus propias fotos
 * y dedicatorias personales.
 */

// ===================================================================
// 1. CONFIGURACIÓN DE FOTOS (POLAROIDS) Y MENSAJES INTERCALADOS
// ===================================================================
// Fotos que componen el carrusel interactivo dentro de la Polaroid con adhesivo
const CAROUSEL_PHOTOS = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo4.jpg',
  'images/photo3.jpg'
];

// Mensajes intercalados (cartas manuscritas para Cynthia)
const LETTER_MESSAGES = [
  {
    text: 'Cynthia, desde que llegaste a mi vida cada día tiene un color diferente. Tienes esa luz que transforma lo ordinario en algo completamente extraordinario.',
    signature: 'Siempre contigo'
  },
  {
    text: 'Admiro tu fuerza, tu sonrisa sincera y esa forma tan tuya de cuidar a quienes quieres. Eres mi persona favorita en todo el universo.',
    signature: 'Con todo mi corazón'
  },
  {
    text: 'Que este nuevo año de vida te traiga sueños cumplidos, viajes inolvidables y momentos llenos de paz y felicidad.',
    signature: 'Por muchos años más juntos'
  }
];

// Secuencia exacta de textos solicitada según el progreso
const PROGRESS_STAGES = [
  { progress: 0, text: 'Toca el corazón' },
  { progress: 20, text: 'Otra vez' },
  { progress: 40, text: 'Algo se está encendiendo...' },
  { progress: 60, text: 'Sigue, que esto se calienta' },
  { progress: 80, text: 'Un poquito más' },
  { progress: 95, text: 'No pares ahora' },
  { progress: 100, text: '¡Para ti, Cynthia! 💖' }
];

// ===================================================================
// 2. ESTADO GLOBAL
// ===================================================================
let currentProgress = 0;
let stageIndex = 0;
let audioCtx = null;
let isMusicPlaying = false;
let musicLoopTimeout = null;
let audioDestination = null;
let currentCarouselIndex = 0;

// ===================================================================
// 3. SÍNTESIS DE AUDIO RETRO 8-BIT CHIPTUNE (Game Boy / NES Arcade)
// ===================================================================
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// Partitura de Cumpleaños Feliz al estilo 8-bit rápido y alegre
const BIRTHDAY_SONG_8BIT = [
  { note: 'G4', dur: 0.22, pause: 0.05 },
  { note: 'G4', dur: 0.16, pause: 0.05 },
  { note: 'A4', dur: 0.38, pause: 0.05 },
  { note: 'G4', dur: 0.38, pause: 0.05 },
  { note: 'C5', dur: 0.38, pause: 0.05 },
  { note: 'B4', dur: 0.72, pause: 0.12 },

  { note: 'G4', dur: 0.22, pause: 0.05 },
  { note: 'G4', dur: 0.16, pause: 0.05 },
  { note: 'A4', dur: 0.38, pause: 0.05 },
  { note: 'G4', dur: 0.38, pause: 0.05 },
  { note: 'D5', dur: 0.38, pause: 0.05 },
  { note: 'C5', dur: 0.72, pause: 0.12 },

  { note: 'G4', dur: 0.22, pause: 0.05 },
  { note: 'G4', dur: 0.16, pause: 0.05 },
  { note: 'G5', dur: 0.38, pause: 0.05 },
  { note: 'E5', dur: 0.38, pause: 0.05 },
  { note: 'C5', dur: 0.38, pause: 0.05 },
  { note: 'B4', dur: 0.38, pause: 0.05 },
  { note: 'A4', dur: 0.72, pause: 0.12 },

  { note: 'F5', dur: 0.22, pause: 0.05 },
  { note: 'F5', dur: 0.16, pause: 0.05 },
  { note: 'E5', dur: 0.38, pause: 0.05 },
  { note: 'C5', dur: 0.38, pause: 0.05 },
  { note: 'D5', dur: 0.38, pause: 0.05 },
  { note: 'C5', dur: 0.85, pause: 0.28 }
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      try {
        audioDestination = audioCtx.createMediaStreamDestination();
      } catch (e) {
        console.warn('Audio destination stream not supported', e);
      }
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Generador de tono retro 8-bit (Onda cuadrada clásica Chiptune)
function play8BitNote(freq, startTime, duration, targetGainNode) {
  if (!audioCtx || !freq) return;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();

  // Ondas cuadradas típicas de la era 8 bits
  osc1.type = 'square';
  osc1.frequency.setValueAtTime(freq, startTime);

  osc2.type = 'square';
  osc2.frequency.setValueAtTime(freq, startTime);
  osc2.detune.setValueAtTime(5, startTime); // Sutil detuning analógico 8-bit

  // Envolvente Chiptune retro con ataque percusivo
  noteGain.gain.setValueAtTime(0.16, startTime);
  noteGain.gain.setValueAtTime(0.12, startTime + duration * 0.7);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc1.connect(noteGain);
  osc2.connect(noteGain);

  noteGain.connect(targetGainNode || audioCtx.destination);
  if (audioDestination) {
    noteGain.connect(audioDestination);
  }

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
}

// Canal de bajo 8-bit (Onda triangular)
function play8BitBass(freq, startTime, duration, targetGainNode) {
  if (!audioCtx || !freq) return;

  const oscBass = audioCtx.createOscillator();
  const bassGain = audioCtx.createGain();

  oscBass.type = 'triangle';
  oscBass.frequency.setValueAtTime(freq * 0.5, startTime);

  bassGain.gain.setValueAtTime(0.20, startTime);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscBass.connect(bassGain);
  bassGain.connect(targetGainNode || audioCtx.destination);
  if (audioDestination) {
    bassGain.connect(audioDestination);
  }

  oscBass.start(startTime);
  oscBass.stop(startTime + duration);
}

// Sonido sutil 8-bit de recompensa/salto al tocar el corazón
function playTapChime(index) {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const baseFreq = notes[index % notes.length];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.05);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    // Silencioso si no está habilitado
  }
}

// Reproducción continua de la canción 8-bit
function startBirthdayMelody() {
  if (isMusicPlaying) return;
  initAudioContext();
  isMusicPlaying = true;
  updateMusicButtonUI(true);

  function scheduleMelody() {
    if (!isMusicPlaying || !audioCtx) return;

    let time = audioCtx.currentTime + 0.05;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, time);
    masterGain.connect(audioCtx.destination);

    BIRTHDAY_SONG_8BIT.forEach(item => {
      const freq = NOTES[item.note];
      play8BitNote(freq, time, item.dur, masterGain);
      play8BitBass(freq, time, item.dur, masterGain);
      time += item.dur + item.pause;
    });

    const totalDuration = (time - audioCtx.currentTime) * 1000;
    musicLoopTimeout = setTimeout(() => {
      if (isMusicPlaying) {
        scheduleMelody();
      }
    }, totalDuration);
  }

  scheduleMelody();
}

function stopBirthdayMelody() {
  isMusicPlaying = false;
  if (musicLoopTimeout) {
    clearTimeout(musicLoopTimeout);
  }
  updateMusicButtonUI(false);
}

function updateMusicButtonUI(playing) {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!musicBtn) return;
  if (playing) {
    musicBtn.classList.add('playing');
  } else {
    musicBtn.classList.remove('playing');
  }
}

// ===================================================================
// 4. MOTOR DE PARTÍCULAS (Brillos de fondo y confeti al 100%)
// ===================================================================
const sparkleCanvas = document.getElementById('sparkle-canvas');
const sparkleCtx = sparkleCanvas ? sparkleCanvas.getContext('2d') : null;
let sparkles = [];
let confettiList = [];
let isConfettiActive = false;

function resizeSparkleCanvas() {
  if (!sparkleCanvas) return;
  sparkleCanvas.width = window.innerWidth;
  sparkleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeSparkleCanvas);
resizeSparkleCanvas();

// Crear partículas sutiles de fondo
for (let i = 0; i < 25; i++) {
  sparkles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,
    alpha: Math.random() * 0.5 + 0.2,
    speedY: -Math.random() * 0.4 - 0.1,
    speedX: (Math.random() - 0.5) * 0.3
  });
}

function triggerConfetti() {
  isConfettiActive = true;
  confettiList = [];
  const colors = ['#E11D48', '#FB7185', '#F43F5E', '#FDE047', '#F59E0B', '#FDA4AF', '#FFFFFF'];
  
  for (let i = 0; i < 90; i++) {
    confettiList.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 60,
      y: window.innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.2) * 14,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? 'rect' : 'heart',
      alpha: 1,
      decay: Math.random() * 0.008 + 0.004
    });
  }

  // Detener confeti después de unos segundos
  setTimeout(() => {
    isConfettiActive = false;
  }, 4500);
}

function animateSparkles() {
  if (!sparkleCtx || !sparkleCanvas) return;
  sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);

  // 1. Partículas sutiles de fondo
  sparkles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y < 0) p.y = sparkleCanvas.height;
    if (p.x < 0) p.x = sparkleCanvas.width;
    if (p.x > sparkleCanvas.width) p.x = 0;

    sparkleCtx.beginPath();
    sparkleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    sparkleCtx.fillStyle = `rgba(244, 63, 94, ${p.alpha})`;
    sparkleCtx.fill();
  });

  // 2. Confeti festivo
  if (isConfettiActive || confettiList.length > 0) {
    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.28; // Gravedad
      c.rotation += c.rotSpeed;
      c.alpha -= c.decay;

      if (c.alpha <= 0 || c.y > sparkleCanvas.height + 20) {
        confettiList.splice(i, 1);
        continue;
      }

      sparkleCtx.save();
      sparkleCtx.translate(c.x, c.y);
      sparkleCtx.rotate((c.rotation * Math.PI) / 180);
      sparkleCtx.globalAlpha = c.alpha;
      sparkleCtx.fillStyle = c.color;

      if (c.shape === 'rect') {
        sparkleCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
      } else {
        // Forma de pequeño corazón
        const s = c.size * 0.6;
        sparkleCtx.beginPath();
        sparkleCtx.moveTo(0, s / 3);
        sparkleCtx.bezierCurveTo(-s, -s, -s * 1.5, s / 2, 0, s * 1.5);
        sparkleCtx.bezierCurveTo(s * 1.5, s / 2, s, -s, 0, s / 3);
        sparkleCtx.fill();
      }
      sparkleCtx.restore();
    }
  }

  requestAnimationFrame(animateSparkles);
}
requestAnimationFrame(animateSparkles);

// ===================================================================
// 5. EFECTO DE MICRO-CORAZONES AL PULSAR (Tap Particles)
// ===================================================================
function spawnHeartTapParticles(buttonEl) {
  const rect = buttonEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const heartIcons = ['💖', '❤️', '💕', '✨', '🌹'];
  const count = 5;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'tap-particle';
    particle.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    // Coordenadas iniciales
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    // Desplazamiento aleatorio
    const tx = (Math.random() - 0.5) * 160;
    const ty = -Math.random() * 120 - 40;
    const rot = (Math.random() - 0.5) * 60;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

// ===================================================================
// 6. LÓGICA DE ESTADO 1: PULSACIONES Y PROGRESO
// ===================================================================
const heartBtn = document.getElementById('heart-btn');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercentEl = document.getElementById('progress-percent');
const dynamicTextEl = document.getElementById('dynamic-progress-text');
const state1El = document.getElementById('state-1');
const state2El = document.getElementById('state-2');
const musicToggleBtn = document.getElementById('music-toggle-btn');

function updateProgressUI() {
  progressBarFill.style.width = `${currentProgress}%`;
  progressPercentEl.textContent = `${currentProgress}%`;

  // Buscar texto correspondiente
  const currentStage = PROGRESS_STAGES[stageIndex];
  if (currentStage) {
    dynamicTextEl.classList.remove('updated');
    void dynamicTextEl.offsetWidth; // Trigger reflow
    dynamicTextEl.textContent = currentStage.text;
    dynamicTextEl.classList.add('updated');
  }
}

function handleHeartTap(e) {
  e.preventDefault();

  // Si ya llegó al 100%, no procesar más taps
  if (currentProgress >= 100) return;

  // Vibración háptica táctil en dispositivos móviles
  if (navigator.vibrate) {
    try { navigator.vibrate(35); } catch (_) {}
  }

  // Efecto visual en el botón
  heartBtn.classList.remove('tapped');
  void heartBtn.offsetWidth;
  heartBtn.classList.add('tapped');

  // Generar partículas de corazones
  spawnHeartTapParticles(heartBtn);

  // Sonido de campana suave
  playTapChime(stageIndex);

  // Avanzar al siguiente escalón
  stageIndex++;
  if (stageIndex < PROGRESS_STAGES.length) {
    currentProgress = PROGRESS_STAGES[stageIndex].progress;
  } else {
    currentProgress = 100;
  }

  updateProgressUI();

  // Si se alcanza el 100%, detonar la transición a Estado 2
  if (currentProgress >= 100) {
    onProgressComplete();
  }
}

function onProgressComplete() {
  // Desactivar botón corazón
  heartBtn.disabled = true;

  // Explosión de confeti y corazones
  triggerConfetti();

  // Iniciar transición suave (fade out) tras una pequeña pausa para apreciar el 100%
  setTimeout(() => {
    state1El.classList.add('fade-out');

    setTimeout(() => {
      state1El.classList.add('hidden');
      state2El.classList.remove('hidden');

      // Mostrar botón de música y arrancar la melodía suavemente
      musicToggleBtn.classList.remove('hidden');
      startBirthdayMelody();

      // Desplazar arriba con suavidad
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  }, 900);
}

// ===================================================================
// 7. RENDERIZADO DEL FEED EN ESTADO 2
// ===================================================================
const memoriesContainer = document.getElementById('memories-feed-container');

function renderMemoriesFeed() {
  if (!memoriesContainer) return;
  memoriesContainer.innerHTML = '';

  // 1. Polaroid Principal con Adhesivo y Carrusel Interactivo
  const carouselCard = document.createElement('article');
  carouselCard.className = 'polaroid-card polaroid-carousel-card';
  carouselCard.setAttribute('aria-label', 'Carrusel de fotos: Algunos Momentos');

  carouselCard.innerHTML = `
    <div class="polaroid-photo-frame" id="carousel-frame">
      <div class="carousel-slider" id="carousel-slider">
        ${CAROUSEL_PHOTOS.map((src, i) => `
          <div class="carousel-slide" data-index="${i}">
            <img class="polaroid-img" src="${src}" alt="Momento especial ${i + 1}" loading="lazy">
          </div>
        `).join('')}
      </div>
      <button class="carousel-btn prev-btn" id="carousel-prev" aria-label="Foto anterior">&#10094;</button>
      <button class="carousel-btn next-btn" id="carousel-next" aria-label="Siguiente foto">&#10095;</button>
    </div>
    
    <!-- Puntos de navegación correspondientes al número de fotos -->
    <div class="carousel-dots-container" id="carousel-dots-container">
      ${CAROUSEL_PHOTOS.map((_, i) => `
        <span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" role="button" aria-label="Ir a foto ${i + 1}"></span>
      `).join('')}
    </div>

    <!-- Pie de foto con símbolos decorativos y 'Algunos Momentos' -->
    <div class="polaroid-footer">
      <p class="polaroid-caption-moments">
        <span class="deco-symbol">✨ ❀</span>
        <span>Algunos Momentos</span>
        <span class="deco-symbol">❀ ✨</span>
      </p>
    </div>
  `;

  memoriesContainer.appendChild(carouselCard);
  setupCarousel();

  // 2. Sobre animado interactivo con matasellos rojo clásico ("DESCÚBRELO")
  const envelopeContainer = document.createElement('section');
  envelopeContainer.className = 'interactive-envelope-container';
  envelopeContainer.setAttribute('aria-label', 'Sobre de carta secreta para Cynthia');

  envelopeContainer.innerHTML = `
    <div class="envelope-hint-badge" id="envelope-hint">
      <span>✉️ Toca el matasellos para descubrir</span>
    </div>

    <div class="envelope-outer" id="envelope-outer">
      <!-- Cuerpo del sobre -->
      <div class="envelope-pocket" id="envelope-pocket" role="button" tabindex="0" aria-expanded="false" aria-label="Abrir sobre de carta">
        <!-- Solapa triangular superior con matasellos de cera rojo -->
        <div class="envelope-flap" id="envelope-flap">
          <div class="envelope-flap-triangle"></div>
          
          <!-- Matasellos de cera rojo clásico con texto Descúbrelo sin sobresalir -->
          <button class="wax-seal-stamp" id="wax-seal-btn" type="button" aria-label="Descúbrelo">
            <div class="wax-seal-ring"></div>
            <div class="wax-seal-core">
              <span class="wax-seal-mini-star">✦</span>
              <span class="wax-seal-caption">DESCÚBRELO</span>
              <span class="wax-seal-mini-star">✦</span>
            </div>
          </button>
        </div>

        <div class="envelope-inner-fold left-fold"></div>
        <div class="envelope-inner-fold right-fold"></div>
        <div class="envelope-inner-fold bottom-fold"></div>
      </div>

      <!-- Hoja de la carta que se despliega al abrir el sobre -->
      <article class="letter-sheet" id="letter-sheet" aria-live="polite">
        <div class="letter-sheet-texture">
          <span class="letter-quote-mark">“</span>
          <div class="letter-sheet-body">
            <p class="letter-text">
              Cynthia, desde que llegaste a mi vida cada día tiene un color diferente. Tienes esa luz que transforma lo ordinario en algo completamente extraordinario.
            </p>
            <p class="letter-signature">— Siempre contigo</p>

            <div class="letter-divider">
              <span>❦</span>
            </div>

            <p class="letter-text">
              Admiro tu fuerza, tu sonrisa sincera y esa forma tan tuya de cuidar a quienes quieres. Eres mi persona favorita en todo el universo.
            </p>
            <p class="letter-signature">— Con todo mi corazón</p>
          </div>
        </div>
      </article>
    </div>
  `;

  memoriesContainer.appendChild(envelopeContainer);
  setupInteractiveEnvelope();
}

function setupInteractiveEnvelope() {
  const outer = document.getElementById('envelope-outer');
  const pocket = document.getElementById('envelope-pocket');
  const sealBtn = document.getElementById('wax-seal-btn');
  const hint = document.getElementById('envelope-hint');

  if (!outer || !sealBtn) return;

  let isOpen = false;

  function toggleEnvelope(e) {
    if (e) e.stopPropagation();
    isOpen = !isOpen;
    outer.classList.toggle('is-open', isOpen);
    if (pocket) pocket.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      if (hint) hint.innerHTML = '<span>💌 Tu carta de cumpleaños está abierta</span>';
      playEnvelopeOpenChime();
    } else {
      if (hint) hint.innerHTML = '<span>✉️ Toca el matasellos para descubrir</span>';
    }
  }

  sealBtn.addEventListener('click', toggleEnvelope);
  if (pocket) {
    pocket.addEventListener('click', (e) => {
      if (!isOpen) {
        toggleEnvelope(e);
      }
    });
    pocket.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEnvelope(e);
      }
    });
  }
}

// Efecto de sonido 8-bit especial al desellar y abrir la carta
function playEnvelopeOpenChime() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const arpNotes = [523.25, 659.25, 783.99, 1046.50]; // Arpegio Do-Mi-Sol-Do agudo

    arpNotes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  } catch (e) {}
}

function setupCarousel() {
  const slider = document.getElementById('carousel-slider');
  const frame = document.getElementById('carousel-frame');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!slider) return;

  function goToSlide(index) {
    if (index < 0) index = CAROUSEL_PHOTOS.length - 1;
    if (index >= CAROUSEL_PHOTOS.length) index = 0;
    currentCarouselIndex = index;

    slider.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentCarouselIndex);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.dataset.index, 10);
      goToSlide(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentCarouselIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentCarouselIndex + 1);
    });
  }

  // Soporte gestual táctil con el dedo (swipe) para móvil
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  if (frame) {
    frame.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    frame.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const diffX = e.touches[0].clientX - startX;
      const diffY = e.touches[0].clientY - startY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });

    frame.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;

      if (diffX < -35) {
        goToSlide(currentCarouselIndex + 1);
      } else if (diffX > 35) {
        goToSlide(currentCarouselIndex - 1);
      }
    });

    // Abrir foto ampliada al hacer clic si no se deslizó
    frame.addEventListener('click', (e) => {
      if (e.target.closest('.carousel-btn')) return;
      openPhotoModal(CAROUSEL_PHOTOS[currentCarouselIndex], '✨ ❀ Algunos Momentos ❀ ✨');
    });
  }
}

// ===================================================================
// 8. MODAL DE FOTO (LIGHTBOX)
// ===================================================================
const photoModal = document.getElementById('photo-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalCloseBtn = document.getElementById('modal-close-btn');

function openPhotoModal(src, caption) {
  if (!photoModal) return;
  modalImg.src = src;
  modalCaption.textContent = caption;
  photoModal.classList.remove('hidden');
}

function closePhotoModal() {
  if (!photoModal) return;
  photoModal.classList.add('hidden');
  modalImg.src = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePhotoModal);
if (photoModal) {
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal || e.target.classList.contains('modal-backdrop')) {
      closePhotoModal();
    }
  });
}

// ===================================================================
// 9. BOTÓN "GUARDAR ESTE MOMENTO" (GENERADOR DE VIDEO MP4 CON MÚSICA)
// ===================================================================
const saveMomentBtn = document.getElementById('save-moment-btn');
const exportLoader = document.getElementById('export-loader');
const exportProgressFill = document.getElementById('export-progress-fill');
const exportStatusText = document.getElementById('export-status-text');
const renderCanvas = document.getElementById('video-render-canvas');
const renderCtx = renderCanvas ? renderCanvas.getContext('2d') : null;

async function generateBirthdayVideo() {
  if (!renderCanvas || !renderCtx) return;

  // Deshabilitar botón y mostrar loader
  saveMomentBtn.disabled = true;
  exportLoader.classList.remove('hidden');
  exportProgressFill.style.width = '5%';
  exportStatusText.textContent = 'Preparando fotos y música de cumpleaños...';

  try {
    initAudioContext();

    // 1. Cargar todas las imágenes del carrusel para el video
    const loadedImages = await Promise.all(
      CAROUSEL_PHOTOS.map((src, idx) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve({ img, caption: '✨ ❀ Algunos Momentos ❀ ✨', date: `Recuerdo ${idx + 1}` });
          img.onerror = () => resolve({ img: null, caption: '✨ ❀ Algunos Momentos ❀ ✨', date: `Recuerdo ${idx + 1}` });
          img.src = src;
        });
      })
    );

    // 2. Configurar Canvas Stream & MediaRecorder
    const stream = renderCanvas.captureStream(30);

    // Conectar pista de audio sintetizada
    if (audioDestination && audioDestination.stream.getAudioTracks().length > 0) {
      const audioTrack = audioDestination.stream.getAudioTracks()[0];
      stream.addTrack(audioTrack);
    }

    // Determinar formato compatible (preferir MP4 o WebM)
    let mimeType = 'video/webm;codecs=vp9';
    let fileExtension = 'mp4';

    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
      mimeType = 'video/mp4;codecs=avc1';
      fileExtension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
      fileExtension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
      mimeType = 'video/webm;codecs=h264';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    }

    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 3000000 // Alta calidad 3Mbps
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    let currentVideoBlob = null;
    let currentVideoUrl = null;

    mediaRecorder.onstop = () => {
      currentVideoBlob = new Blob(recordedChunks, { type: mimeType });
      
      // Liberar URL anterior si existiera pero mantener activa la actual para que no falle la descarga
      if (currentVideoUrl) {
        URL.revokeObjectURL(currentVideoUrl);
      }
      currentVideoUrl = URL.createObjectURL(currentVideoBlob);
      const fileName = `Cumpleanos_Cynthia_13_Septiembre_2026.${fileExtension}`;
      
      // 1. Intentar descarga directa en segundo plano
      try {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = currentVideoUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 3000);
      } catch (dlErr) {
        console.warn('Error en descarga automática:', dlErr);
      }

      exportStatusText.textContent = '¡Video creado con éxito! 🎉';
      exportProgressFill.style.width = '100%';

      setTimeout(() => {
        exportLoader.classList.add('hidden');
        saveMomentBtn.disabled = false;
        
        // 2. Abrir inmediatamente el modal para que el usuario pueda VER el video y localizarlo
        openVideoResultModal(currentVideoUrl, currentVideoBlob, fileName);
      }, 700);
    };

    mediaRecorder.start(100);

    // 3. Renderizar diapositivas con música
    exportStatusText.textContent = 'Grabando video con música de cumpleaños...';
    
    // Reproducir música sincronizada en el audioDestination
    playVideoSoundtrack();

    // Animación de diapositivas en Canvas
    const totalFrames = 300; // ~10 segundos a 30fps
    let currentFrame = 0;
    const slides = [
      { type: 'title' },
      ...loadedImages.map(item => ({ type: 'photo', ...item })),
      { type: 'final' }
    ];

    const framesPerSlide = Math.floor(totalFrames / slides.length);

    function drawVideoFrame() {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const slideIndex = Math.min(Math.floor(currentFrame / framesPerSlide), slides.length - 1);
      const slideProgress = (currentFrame % framesPerSlide) / framesPerSlide;
      const slide = slides[slideIndex];

      renderCanvasFrame(slide, slideProgress);

      currentFrame++;
      const percent = Math.min(95, Math.round((currentFrame / totalFrames) * 90) + 5);
      exportProgressFill.style.width = `${percent}%`;

      requestAnimationFrame(drawVideoFrame);
    }

    drawVideoFrame();

  } catch (err) {
    console.error('Error al generar video:', err);
    exportStatusText.textContent = 'Hubo un inconveniente creando el archivo.';
    setTimeout(() => {
      exportLoader.classList.add('hidden');
      saveMomentBtn.disabled = false;
    }, 2500);
  }
}

// Melodía para el video sincronizado
function playVideoSoundtrack() {
  if (!audioCtx) return;
  let time = audioCtx.currentTime + 0.05;
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.4, time);

  if (audioDestination) {
    masterGain.connect(audioDestination);
  }
  masterGain.connect(audioCtx.destination);

  BIRTHDAY_SONG_8BIT.forEach(item => {
    const freq = NOTES[item.note];
    play8BitNote(freq, time, item.dur, masterGain);
    play8BitBass(freq, time, item.dur, masterGain);
    time += item.dur + item.pause;
  });
}

// Dibuja cada frame en el canvas de video (720 x 1280)
function renderCanvasFrame(slide, progress) {
  const w = renderCanvas.width;
  const h = renderCanvas.height;

  // Fondo gradiente elegante
  const bgGrad = renderCtx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#FFF5F6');
  bgGrad.addColorStop(0.5, '#FAF6F0');
  bgGrad.addColorStop(1, '#F3E8E2');
  renderCtx.fillStyle = bgGrad;
  renderCtx.fillRect(0, 0, w, h);

  // Partículas doradas suaves
  for (let i = 0; i < 15; i++) {
    const px = (Math.sin(i * 99 + progress * 4) * 0.5 + 0.5) * w;
    const py = (Math.cos(i * 33 + progress * 2) * 0.5 + 0.5) * h;
    renderCtx.beginPath();
    renderCtx.arc(px, py, 3, 0, Math.PI * 2);
    renderCtx.fillStyle = 'rgba(217, 119, 6, 0.25)';
    renderCtx.fill();
  }

  if (slide.type === 'title') {
    // Portada del video
    renderCtx.fillStyle = '#BE123C';
    renderCtx.font = 'bold 36px Georgia, serif';
    renderCtx.textAlign = 'center';
    renderCtx.fillText('✨ 13 SEPTIEMBRE 2026 ✨', w / 2, h * 0.36);

    renderCtx.fillStyle = '#1C1917';
    renderCtx.font = 'bold 58px "Cinzel Decorative", Georgia, serif';
    renderCtx.fillText('¡Feliz Cumpleaños,', w / 2, h * 0.44);
    
    renderCtx.fillStyle = '#0B4F6C';
    renderCtx.font = '96px "Great Vibes", cursive, Georgia, serif';
    renderCtx.fillText('Cynthia', w / 2, h * 0.54);

    renderCtx.fillStyle = '#57534E';
    renderCtx.font = '32px sans-serif';
    renderCtx.fillText('Hoy celebramos a mi persona favorita ❤️', w / 2, h * 0.63);

  } else if (slide.type === 'photo') {
    // Polaroid animada en video con Ken-Burns zoom
    const zoom = 1 + progress * 0.05;
    const cardW = 540;
    const cardH = 680;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2 - 20;

    renderCtx.save();
    renderCtx.translate(w / 2, h / 2);
    renderCtx.rotate((Math.sin(progress * Math.PI) * 0.03));
    renderCtx.scale(zoom, zoom);
    renderCtx.translate(-w / 2, -h / 2);

    // Sombra polaroid
    renderCtx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    renderCtx.fillRect(cardX + 8, cardY + 12, cardW, cardH);

    // Marco blanco polaroid
    renderCtx.fillStyle = '#FFFFFF';
    renderCtx.fillRect(cardX, cardY, cardW, cardH);

    // Foto
    const photoPad = 24;
    const photoSize = cardW - photoPad * 2;
    if (slide.img) {
      renderCtx.drawImage(slide.img, cardX + photoPad, cardY + photoPad, photoSize, photoSize);
    } else {
      renderCtx.fillStyle = '#E2E8F0';
      renderCtx.fillRect(cardX + photoPad, cardY + photoPad, photoSize, photoSize);
    }

    // Pie de foto manuscrito
    renderCtx.fillStyle = '#18181B';
    renderCtx.font = 'bold 36px "Caveat", cursive, sans-serif';
    renderCtx.textAlign = 'center';
    renderCtx.fillText(slide.caption, w / 2, cardY + photoSize + 70);

    if (slide.date) {
      renderCtx.fillStyle = '#78716C';
      renderCtx.font = 'italic 24px Georgia, serif';
      renderCtx.fillText(slide.date, w / 2, cardY + photoSize + 110);
    }

    renderCtx.restore();

  } else if (slide.type === 'final') {
    // Diapositiva final
    renderCtx.fillStyle = '#E11D48';
    renderCtx.font = 'bold 60px Georgia, serif';
    renderCtx.textAlign = 'center';
    renderCtx.fillText('Hecho con Amor ❤️', w / 2, h * 0.44);

    renderCtx.fillStyle = '#27272A';
    renderCtx.font = 'italic 38px Georgia, serif';
    renderCtx.fillText('Por siempre a tu lado, Cynthia.', w / 2, h * 0.52);

    renderCtx.fillStyle = '#D97706';
    renderCtx.font = 'bold 32px sans-serif';
    renderCtx.fillText('13 de Septiembre de 2026', w / 2, h * 0.60);
  }
}

// ===================================================================
// MODAL DE RESULTADO DE VIDEO Y GUARDADO
// ===================================================================
const videoResultModal = document.getElementById('video-result-modal');
const previewVideoEl = document.getElementById('preview-video-element');
const directDownloadLink = document.getElementById('direct-download-link');
const shareVideoBtn = document.getElementById('share-video-btn');
const videoModalCloseBtn = document.getElementById('video-modal-close-btn');

let activeVideoBlob = null;
let activeFileName = '';

function openVideoResultModal(videoUrl, videoBlob, fileName) {
  if (!videoResultModal || !previewVideoEl) return;
  activeVideoBlob = videoBlob;
  activeFileName = fileName;

  previewVideoEl.src = videoUrl;
  directDownloadLink.href = videoUrl;
  directDownloadLink.download = fileName;

  // Pausar música ambiental si estaba sonando para que no interfiera con el video
  if (isMusicPlaying) {
    stopBirthdayMelody();
  }

  videoResultModal.classList.remove('hidden');

  try {
    previewVideoEl.play().catch(() => {});
  } catch (_) {}
}

function closeVideoResultModal() {
  if (!videoResultModal) return;
  videoResultModal.classList.add('hidden');
  if (previewVideoEl) {
    previewVideoEl.pause();
  }
}

if (videoModalCloseBtn) {
  videoModalCloseBtn.addEventListener('click', closeVideoResultModal);
}
if (videoResultModal) {
  videoResultModal.addEventListener('click', (e) => {
    if (e.target === videoResultModal || e.target.classList.contains('video-modal-backdrop')) {
      closeVideoResultModal();
    }
  });
}

// Botón de compartir en WhatsApp / Fotos
if (shareVideoBtn) {
  shareVideoBtn.addEventListener('click', async () => {
    if (!activeVideoBlob) return;
    try {
      const file = new File([activeVideoBlob], activeFileName, { type: activeVideoBlob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Feliz Cumpleaños Cynthia ❤️',
          text: 'Un momento inolvidable para Cynthia (13 Septiembre 2026)',
          files: [file]
        });
      } else {
        // En navegadores que no admiten share de archivos, disparar descarga y avisar
        directDownloadLink.click();
        alert('El video se ha guardado en tu carpeta de "Descargas" de este dispositivo. ¡Ya puedes abrirlo y compartirlo!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        directDownloadLink.click();
      }
    }
  });
}

// Botón de descarga con selección de carpeta (File System Access API) o descarga directa
if (directDownloadLink) {
  directDownloadLink.addEventListener('click', async (e) => {
    if (window.showSaveFilePicker && activeVideoBlob) {
      e.preventDefault();
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: activeFileName,
          types: [{
            description: 'Video de Cumpleaños',
            accept: {
              'video/mp4': ['.mp4'],
              'video/webm': ['.webm']
            }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(activeVideoBlob);
        await writable.close();
        alert('¡Genial! Tu video se ha guardado correctamente en la carpeta que seleccionaste.');
      } catch (pickerErr) {
        // Si el usuario cancela el diálogo no hacemos nada, si no es soportado permitimos la descarga normal
        if (pickerErr.name !== 'AbortError') {
          // Fallback a descarga nativa normal
          const a = document.createElement('a');
          a.href = directDownloadLink.href;
          a.download = directDownloadLink.download;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      }
    }
  });
}

// ===================================================================
// 10. INICIALIZACIÓN DE EVENTOS
// ===================================================================
function initApp() {
  // Renderizar contenido de fotos y cartas
  renderMemoriesFeed();

  // Listener para el botón corazón
  if (heartBtn) {
    heartBtn.addEventListener('click', handleHeartTap);
    heartBtn.addEventListener('touchend', (e) => {
      // Prevención de doble disparo en móvil
      e.preventDefault();
      handleHeartTap(e);
    });
  }

  // Listener botón de música
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        stopBirthdayMelody();
      } else {
        startBirthdayMelody();
      }
    });
  }

  // Listener botón "Guardar este momento"
  if (saveMomentBtn) {
    saveMomentBtn.addEventListener('click', generateBirthdayVideo);
  }
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', initApp);
