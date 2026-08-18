/**
 * Intrinsic pixel size of an image in /public, read at build time.
 *
 * Figures without width/height leave the browser no idea how tall they will be
 * until each file arrives, so the page reflows under the reader as it scrolls
 * and the scroll stutters. Stamping the real dimensions on the <img> lets the
 * browser reserve the space up front.
 *
 * Headers are read directly rather than through an image library: the size
 * lives in the first few bytes of every one of these formats, so this stays a
 * cheap synchronous read during the build.
 */
import { openSync, readSync, closeSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface Size { width: number; height: number }

const cache = new Map<string, Size | null>();

function head(path: string, bytes = 512): Buffer | null {
  try {
    const fd = openSync(path, 'r');
    const buf = Buffer.alloc(bytes);
    const read = readSync(fd, buf, 0, bytes, 0);
    closeSync(fd);
    return buf.subarray(0, read);
  } catch {
    return null;
  }
}

function parse(b: Buffer): Size | null {
  // PNG: IHDR width/height at bytes 16..24
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF: little-endian width/height at bytes 6..10
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP: VP8X / VP8 / VP8L each store the size differently
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8X') {
      return {
        width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
      };
    }
    if (kind === 'VP8 ') {
      return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    }
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  // JPEG: walk the segments to the first frame header
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

/** `src` is a site-absolute path ("/assets/img/…"); returns null if unknown. */
export function imageSize(src: string): Size | null {
  if (cache.has(src)) return cache.get(src)!;
  let size: Size | null = null;
  if (src.startsWith('/')) {
    const file = join(process.cwd(), 'public', decodeURIComponent(src));
    if (existsSync(file)) {
      // JPEGs can carry a long EXIF block before the frame header.
      const b = head(file, src.match(/\.jpe?g$/i) ? 65536 : 512);
      if (b) size = parse(b);
    }
  }
  cache.set(src, size);
  return size;
}
