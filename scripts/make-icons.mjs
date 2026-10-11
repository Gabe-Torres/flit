import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
}

function encodePng(width, height, data) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    data.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodeIco(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32;
  header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

function canvas(width, height) {
  const data = Buffer.alloc(width * height * 4);
  const api = {
    width,
    height,
    data,
    fill(r, g, b) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    },
    shade(y0, y1, stops) {
      for (let y = Math.max(0, y0); y < Math.min(height, y1); y++) {
        const t = (y - y0) / Math.max(1, y1 - y0);
        let a = stops[0];
        let b = stops[stops.length - 1];
        for (let i = 0; i < stops.length - 1; i++) {
          if (t >= stops[i].t && t <= stops[i + 1].t) {
            a = stops[i];
            b = stops[i + 1];
            break;
          }
        }
        const u = (t - a.t) / Math.max(0.0001, b.t - a.t);
        const r = a.r + (b.r - a.r) * u;
        const g = a.g + (b.g - a.g) * u;
        const bl = a.b + (b.b - a.b) * u;
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = bl;
          data[i + 3] = 255;
        }
      }
    },
    plot(x, y, r, g, b, a) {
      x = Math.round(x);
      y = Math.round(y);
      if (x < 0 || y < 0 || x >= width || y >= height || a <= 0) return;
      const i = (y * width + x) * 4;
      const sa = Math.min(1, a);
      const da = data[i + 3] / 255;
      const out = sa + da * (1 - sa);
      data[i] = (r * sa + data[i] * da * (1 - sa)) / out;
      data[i + 1] = (g * sa + data[i + 1] * da * (1 - sa)) / out;
      data[i + 2] = (b * sa + data[i + 2] * da * (1 - sa)) / out;
      data[i + 3] = out * 255;
    },
    rect(x, y, w, h, r, g, b) {
      const x0 = Math.max(0, Math.floor(x));
      const y0 = Math.max(0, Math.floor(y));
      const x1 = Math.min(width, Math.ceil(x + w));
      const y1 = Math.min(height, Math.ceil(y + h));
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) api.plot(xx, yy, r, g, b, 1);
      }
    },
    circle(cx, cy, rad, r, g, b) {
      const x0 = Math.floor(cx - rad - 1);
      const y0 = Math.floor(cy - rad - 1);
      const x1 = Math.ceil(cx + rad + 1);
      const y1 = Math.ceil(cy + rad + 1);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
          api.plot(x, y, r, g, b, Math.min(1, rad + 0.6 - d));
        }
      }
    },
    ellipse(cx, cy, rx, ry, r, g, b) {
      const x0 = Math.floor(cx - rx - 1);
      const y0 = Math.floor(cy - ry - 1);
      const x1 = Math.ceil(cx + rx + 1);
      const y1 = Math.ceil(cy + ry + 1);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = (x + 0.5 - cx) / rx;
          const dy = (y + 0.5 - cy) / ry;
          const d = Math.hypot(dx, dy);
          api.plot(x, y, r, g, b, Math.min(1, (1.05 - d) * Math.min(rx, ry)));
        }
      }
    },
  };
  return api;
}

const FONT = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  Y: ['10001', '01010', '00100', '00100', '00100', '00100', '00100'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

function textWidth(text, scale, gap) {
  return text.length * (5 * scale + gap) - gap;
}

function drawText(board, text, x, y, scale, gap, r, g, b) {
  let cursor = x;
  for (const ch of text) {
    const rows = FONT[ch];
    if (rows) {
      for (let row = 0; row < rows.length; row++) {
        for (let col = 0; col < rows[row].length; col++) {
          if (rows[row][col] === '1') {
            board.rect(cursor + col * scale, y + row * scale, scale, scale, r, g, b);
          }
        }
      }
    }
    cursor += 5 * scale + gap;
  }
}

function drawBird(board, cx, cy, s) {
  board.ellipse(cx - 6 * s, cy + 2 * s, 10 * s, 7 * s, 231, 163, 34);
  board.ellipse(cx, cy, 18 * s, 15 * s, 255, 211, 77);
  board.ellipse(cx + 2 * s, cy + 4 * s, 10 * s, 8 * s, 255, 243, 196);
  board.circle(cx + 16 * s, cy + 1 * s, 5 * s, 239, 122, 47);
  board.circle(cx + 22 * s, cy + 1 * s, 3.2 * s, 239, 122, 47);
  board.circle(cx + 7 * s, cy - 4 * s, 5 * s, 255, 255, 255);
  board.circle(cx + 8.5 * s, cy - 4 * s, 2.4 * s, 43, 33, 24);
  board.circle(cx + 7.6 * s, cy - 5 * s, 1 * s, 255, 255, 255);
}

function paintIcon(size) {
  const board = canvas(size, size);
  board.shade(0, size, [
    { t: 0, r: 103, g: 196, b: 246 },
    { t: 1, r: 183, g: 230, b: 251 },
  ]);
  const ground = size * 0.78;
  board.rect(0, ground, size, size - ground, 227, 180, 92);
  board.rect(0, ground, size, size * 0.06, 99, 180, 74);
  drawBird(board, size * 0.46, size * 0.46, size / 64);
  return board;
}

function paintOg() {
  const board = canvas(1200, 630);
  board.shade(0, 630, [
    { t: 0, r: 103, g: 196, b: 246 },
    { t: 0.62, r: 183, g: 230, b: 251 },
    { t: 1, r: 255, g: 231, b: 184 },
  ]);
  board.circle(900, 150, 120, 255, 228, 150);
  board.circle(900, 150, 46, 255, 227, 138);
  board.ellipse(260, 120, 70, 36, 255, 255, 255);
  board.ellipse(320, 132, 48, 28, 255, 255, 255);
  const gate = (x, open) => {
    board.rect(x, 0, 64, open, 61, 157, 73);
    board.rect(x - 10, open - 32, 84, 32, 52, 148, 67);
    board.rect(x - 10, open + 168, 84, 32, 52, 148, 67);
    board.rect(x, open + 200, 64, 520 - (open + 200), 61, 157, 73);
  };
  gate(24, 300);
  gate(1090, 250);

  board.rect(0, 520, 1200, 110, 227, 180, 92);
  board.rect(0, 520, 1200, 26, 99, 180, 74);
  drawBird(board, 300, 420, 4.2);

  const title = 'FLIT';
  const scale = 20;
  const gap = 8;
  const sub = 'TAP TO FLY';
  const subScale = 6;
  const subGap = 4;
  const blockW = Math.max(textWidth(title, scale, gap), textWidth(sub, subScale, subGap));
  const titleH = 7 * scale;
  const blockH = titleH + 16 + 7 * subScale;
  const x = (1200 - blockW) / 2;
  const y = 42;
  const padX = 28;
  const padY = 18;
  board.rect(x - padX, y - padY, blockW + padX * 2, blockH + padY * 2, 43, 33, 24);
  board.rect(x - padX + 6, y - padY + 6, blockW + padX * 2 - 12, blockH + padY * 2 - 12, 255, 248, 234);
  const titleX = (1200 - textWidth(title, scale, gap)) / 2;
  drawText(board, title, titleX, y, scale, gap, 43, 33, 24);
  const subX = (1200 - textWidth(sub, subScale, subGap)) / 2;
  drawText(board, sub, subX, y + titleH + 16, subScale, subGap, 43, 33, 24);
  return board;
}

await mkdir(out, { recursive: true });

const icons = [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['icon-180.png', 180],
  ['favicon-32.png', 32],
];

for (const [name, size] of icons) {
  const board = paintIcon(size);
  await writeFile(path.join(out, name), encodePng(size, size, board.data));
}

const favicon = paintIcon(32);
const png32 = encodePng(32, 32, favicon.data);
await writeFile(path.join(out, 'favicon-32.png'), png32);
await writeFile(path.join(out, 'favicon.ico'), encodeIco(png32));

const og = paintOg();
await writeFile(path.join(out, 'og.png'), encodePng(og.width, og.height, og.data));
console.log('wrote icons');
