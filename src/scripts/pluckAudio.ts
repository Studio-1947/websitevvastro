/**
 * Audio for the pluckable Approach strings.
 *
 * One recording per string, five in all. Each recording holds FOUR notes played
 * in sequence on a strict half-second grid (verified by decoding the files and
 * measuring per-quarter energy — every quarter carries a fresh attack at
 * 0.0 / 0.5 / 1.0 / 1.5s). A strike plays ONE of those notes, and successive
 * strikes on the same string walk through its four before wrapping.
 *
 * The notes are played as slices of the decoded buffer rather than cut into
 * twenty separate files: no re-encoding, no quality loss, five requests instead
 * of twenty, and the grid is exact so the slice boundaries are trivial.
 *
 * Constraints this works within:
 *   • Browsers refuse to start an AudioContext until the user has interacted,
 *     so the context is created lazily on the first strike and never before.
 *   • Audio is fetched on first interaction too — visitors who never touch the
 *     strings download none of it.
 *   • If a file fails to decode, that string falls back to a synthesised pluck
 *     rather than going silent.
 */

/** One file per string, in string order (top to bottom). */
const SAMPLES = [
  '/assets/audio/string-1.mp3',
  '/assets/audio/string-2.mp3',
  '/assets/audio/string-3.mp3',
  '/assets/audio/string-4.mp3',
  '/assets/audio/string-5.mp3',
];

/** Each file: 4 notes, one every 0.5s. */
const NOTES_PER_FILE = 4;
const NOTE_LENGTH = 0.5;
/** Fade the tail so cutting the buffer mid-ring does not click. */
const NOTE_FADE = 0.06;

/** Fallback pitches (pentatonic) if a file cannot be decoded. */
const PITCHES = [261.63, 293.66, 329.63, 392.0, 440.0];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let buffers: (AudioBuffer | null)[] = [];
let loading: Promise<void> | null = null;
/** True once the fetch/decode pass has finished, whatever the outcome. */
let ready = false;
let muted = false;

/** Which of the four notes each string plays next. */
const cursor: number[] = new Array(SAMPLES.length).fill(0);

const MUTE_KEY = 'studio1947:approach-muted';

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? '1' : '0');
  } catch {
    /* private mode — in-memory only */
  }
  if (master && ctx) master.gain.setTargetAtTime(next ? 0 : 1, ctx.currentTime, 0.02);
}

export function initMuteState(): void {
  try {
    muted = localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    muted = false;
  }
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);
  return ctx;
}

async function loadSamples(): Promise<void> {
  if (!ctx) return;
  buffers = await Promise.all(
    SAMPLES.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        return await ctx!.decodeAudioData(await res.arrayBuffer());
      } catch {
        return null; // this string falls back to the synth
      }
    }),
  );
  ready = true;
}

/** Play note `n` of string `index` as a slice of its buffer. */
function playNote(index: number, n: number, velocity: number): boolean {
  const buf = buffers[index];
  if (!buf || !ctx || !master) return false;
  const t = ctx.currentTime;
  const offset = n * NOTE_LENGTH;
  if (offset >= buf.duration) return false;
  const dur = Math.min(NOTE_LENGTH, buf.duration - offset);

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const gain = ctx.createGain();
  const level = Math.max(0.08, Math.min(1, velocity));
  gain.gain.setValueAtTime(level, t);
  // Hold, then fade the tail so the cut is inaudible.
  gain.gain.setValueAtTime(level, t + Math.max(0, dur - NOTE_FADE));
  gain.gain.linearRampToValueAtTime(0.0001, t + dur);

  src.connect(gain).connect(master);
  src.start(t, offset, dur);
  src.stop(t + dur + 0.02);
  return true;
}

/** Fallback only — used when a recording could not be decoded. */
function synthPluck(index: number, velocity: number): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const freq = PITCHES[index % PITCHES.length];
  const decay = 1.1 + velocity * 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.02, velocity * 0.5), t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800 + velocity * 3200, t);
  filter.frequency.exponentialRampToValueAtTime(600, t + decay);

  const body = ctx.createOscillator();
  body.type = 'triangle';
  body.frequency.value = freq;

  body.connect(filter);
  filter.connect(gain).connect(master);
  body.start(t);
  body.stop(t + decay + 0.05);
}

/**
 * Strike string `index` at `velocity` (0–1, from how hard it was crossed).
 * Each strike advances that string to its next note.
 */
export function pluck(index: number, velocity: number): void {
  if (muted) return;
  const c = ensureContext();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  if (!loading) loading = loadSamples();

  const i = index % SAMPLES.length;
  const n = cursor[i];
  if (playNote(i, n, velocity)) {
    cursor[i] = (n + 1) % NOTES_PER_FILE;
  } else if (ready) {
    // The decode pass finished and this file genuinely failed — a synthesised
    // note is better than a dead string.
    synthPluck(i, velocity);
  }
  // Still decoding: stay silent. A synth beep against folk instruments reads as
  // broken, whereas one quiet strike reads as a light touch. The string still
  // moves, so the interaction never feels unresponsive.
}

/** Warm the context and start fetching on the first gesture. */
export function warmAudio(): void {
  const c = ensureContext();
  if (c && c.state === 'suspended') void c.resume();
  if (!loading) loading = loadSamples();
}
