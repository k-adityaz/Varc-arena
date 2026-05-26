// ============================================================
// SOUND — Timer beep, success chime, wrong answer tone
// Uses Web Audio API (no external audio files needed)
// ============================================================

let audioCtx: AudioContext | null = null;

function getAudio(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Helper: play a tone with given settings
function playTone(freq: number, type: OscillatorType, volume: number, duration: number, delay = 0) {
  try {
    const ctx = getAudio();
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch { /* fail silently */ }
}

// Soft buzzy tick — plays every second during the quiz
export function playTick() {
  playTone(660, 'triangle', 0.07, 0.08);
}

// Louder, higher tick — plays during the last 10 seconds
export function playWarnTick() {
  playTone(880, 'triangle', 0.11, 0.1);
}

// Happy ascending chime — plays on correct answer
export function playSuccess() {
  playTone(523, 'sine', 0.14, 0.3, 0);    // C5
  playTone(659, 'sine', 0.14, 0.3, 0.12); // E5
  playTone(784, 'sine', 0.14, 0.3, 0.24); // G5
}

// Gentle descending tone — plays on wrong answer
export function playError() {
  playTone(440, 'sine', 0.1, 0.25, 0);     // A4
  playTone(349, 'sine', 0.08, 0.3, 0.18);  // F4
}

// Haptic vibration (mobile phones)
export function vibrate(pattern: number | number[] = 10) {
  try { navigator.vibrate?.(pattern); } catch { /* not supported */ }
}
