// ===================================================================
// MOTOR DE AUDIO RETRO 8-BIT CHIPTUNE (Web Audio API)
// ===================================================================

const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

export const BIRTHDAY_SONG_8BIT = [
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

let audioCtx = null;
let audioDestination = null;
let musicLoopTimeout = null;
let isPlaying = false;

export function initAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      try {
        audioDestination = audioCtx.createMediaStreamDestination();
      } catch (e) {
        console.warn('Audio destination stream not supported:', e);
      }
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAudioDestination() {
  return audioDestination;
}

export function play8BitNote(freq, startTime, duration, targetGainNode) {
  if (!audioCtx || !freq) return;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();

  osc1.type = 'square';
  osc1.frequency.setValueAtTime(freq, startTime);

  osc2.type = 'square';
  osc2.frequency.setValueAtTime(freq, startTime);
  osc2.detune.setValueAtTime(5, startTime);

  noteGain.gain.setValueAtTime(0.16, startTime);
  noteGain.gain.setValueAtTime(0.12, startTime + duration * 0.7);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc1.connect(noteGain);
  osc2.connect(noteGain);

  noteGain.connect(targetGainNode || audioCtx.destination);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
}

export function play8BitBass(freq, startTime, duration, targetGainNode) {
  if (!audioCtx || !freq) return;

  const oscBass = audioCtx.createOscillator();
  const bassGain = audioCtx.createGain();

  oscBass.type = 'triangle';
  oscBass.frequency.setValueAtTime(freq * 0.5, startTime);

  bassGain.gain.setValueAtTime(0.20, startTime);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscBass.connect(bassGain);
  bassGain.connect(targetGainNode || audioCtx.destination);

  oscBass.start(startTime);
  oscBass.stop(startTime + duration);
}

export function playTapChime(index) {
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
  } catch (e) {}
}

export function playEnvelopeOpenChime() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const arpNotes = [523.25, 659.25, 783.99, 1046.50];

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

export function startBirthdayMelody(onStatusChange) {
  if (isPlaying) return;
  initAudioContext();
  isPlaying = true;
  if (onStatusChange) onStatusChange(true);

  function scheduleMelody() {
    if (!isPlaying || !audioCtx) return;

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
      if (isPlaying) {
        scheduleMelody();
      }
    }, totalDuration);
  }

  scheduleMelody();
}

export function stopBirthdayMelody(onStatusChange) {
  isPlaying = false;
  if (musicLoopTimeout) {
    clearTimeout(musicLoopTimeout);
  }
  if (onStatusChange) onStatusChange(false);
}

export function isAudioPlaying() {
  return isPlaying;
}

let wasMusicPlayingBeforeVideo = false;

export function startVideoSoundtrack(totalDurationSeconds = 48) {
  initAudioContext();
  if (!audioCtx) return;

  wasMusicPlayingBeforeVideo = isPlaying;
  if (isPlaying) {
    stopBirthdayMelody();
  }

  const videoMasterGain = audioCtx.createGain();
  videoMasterGain.gain.setValueAtTime(0.40, audioCtx.currentTime);

  if (audioDestination) {
    videoMasterGain.connect(audioDestination);
  }
  // Permitir escucharla mientras se graba para una experiencia inmersiva
  videoMasterGain.connect(audioCtx.destination);

  let scheduleTime = audioCtx.currentTime + 0.05;
  const endTime = scheduleTime + totalDurationSeconds + 2;

  while (scheduleTime < endTime) {
    BIRTHDAY_SONG_8BIT.forEach(item => {
      const freq = NOTES[item.note];
      play8BitNote(freq, scheduleTime, item.dur, videoMasterGain);
      play8BitBass(freq, scheduleTime, item.dur, videoMasterGain);
      scheduleTime += item.dur + item.pause;
    });
  }
}

export function stopVideoSoundtrack() {
  if (wasMusicPlayingBeforeVideo) {
    startBirthdayMelody();
  }
}

// Sonido cristalino realista al chocar las copas
export function playGlassClinkChime() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Frecuencias altas de cristal resonante (C7 y G7)
    [2093, 3136].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.02);

      gain.gain.setValueAtTime(0.08, now + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.02 + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.02);
      osc.stop(now + i * 0.02 + 0.6);
    });
  } catch (e) {}
}
