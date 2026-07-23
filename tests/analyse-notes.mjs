/**
 * Find the note onsets inside each string's audio file.
 *
 * Each recording holds several notes played in sequence. Rather than cutting
 * them into separate files (re-encoding, quality loss, more requests), the
 * runtime plays a slice of one buffer — an audio sprite. This works out the
 * slice boundaries.
 *
 * Decoding happens in Chromium because Playwright's bundled ffmpeg is a
 * video-only build with no MP3 decoder, and the browser's decoder is the same
 * one that will run in production anyway.
 *
 * Usage: node tests/analyse-notes.mjs   (needs the preview server on :4321)
 */
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4321/', { waitUntil: 'load' });

const result = await page.evaluate(async () => {
  const ctx = new OfflineAudioContext(1, 44100, 44100);
  const out = [];

  for (let i = 1; i <= 5; i++) {
    const url = `/assets/audio/string-${i}.mp3`;
    let buf;
    try {
      const res = await fetch(url);
      buf = await ctx.decodeAudioData(await res.arrayBuffer());
    } catch (e) {
      out.push({ i, error: String(e).slice(0, 80) });
      continue;
    }

    const data = buf.getChannelData(0);
    const sr = buf.sampleRate;

    // Short-window RMS envelope.
    const win = Math.floor(sr * 0.01); // 10ms
    const env = [];
    for (let s = 0; s + win < data.length; s += win) {
      let sum = 0;
      for (let k = 0; k < win; k++) sum += data[s + k] * data[s + k];
      env.push(Math.sqrt(sum / win));
    }
    const peak = Math.max(...env);

    // Onset = envelope rising through a fraction of peak after being quiet,
    // with a refractory gap so one note's attack is not counted twice.
    const openGate = peak * 0.12;
    const closeGate = peak * 0.05;
    const onsets = [];
    let armed = true;
    let lastIdx = -999;
    for (let k = 0; k < env.length; k++) {
      if (armed && env[k] > openGate && k - lastIdx > 12) {
        onsets.push(+(k * 0.01).toFixed(3));
        lastIdx = k;
        armed = false;
      } else if (!armed && env[k] < closeGate) {
        armed = true;
      }
    }

    out.push({
      i,
      duration: +buf.duration.toFixed(3),
      sampleRate: sr,
      channels: buf.numberOfChannels,
      peak: +peak.toFixed(4),
      onsets,
      notes: onsets.length,
    });
  }
  return out;
});

console.log('file  dur(s)  rate   ch  peak    notes  onsets(s)');
for (const r of result) {
  if (r.error) { console.log(`string-${r.i}  DECODE FAILED — ${r.error}`); continue; }
  console.log(
    `string-${r.i}  ${String(r.duration).padStart(6)}  ${r.sampleRate}  ${r.channels}   ${String(r.peak).padEnd(6)}  ${String(r.notes).padStart(5)}  ${r.onsets.join(', ')}`,
  );
}
await browser.close();
