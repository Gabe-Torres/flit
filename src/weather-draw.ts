import { FillGradient, type Graphics } from 'pixi.js';
import { terrainFor, type WeatherId } from './weather.ts';

type Box = { left: number; top: number; right: number; bottom: number };

function skyFill(stops: { offset: number; color: number }[]): FillGradient {
  return new FillGradient({
    type: 'linear',
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: stops,
  });
}

const SKY: Record<WeatherId, FillGradient> = {
  clear: skyFill([
    { offset: 0, color: 0x67c4f6 },
    { offset: 0.55, color: 0xb7e6fb },
    { offset: 1, color: 0xffe7b8 },
  ]),
  rain: skyFill([
    { offset: 0, color: 0x6d8ea3 },
    { offset: 0.55, color: 0x9bb4c4 },
    { offset: 1, color: 0xc9d5c4 },
  ]),
  storm: skyFill([
    { offset: 0, color: 0x243140 },
    { offset: 0.5, color: 0x3e5364 },
    { offset: 1, color: 0x6a7568 },
  ]),
  blizzard: skyFill([
    { offset: 0, color: 0xc5d6e4 },
    { offset: 0.45, color: 0xe4eef4 },
    { offset: 1, color: 0xf7f4ee },
  ]),
  heat: skyFill([
    { offset: 0, color: 0xff9a3c },
    { offset: 0.4, color: 0xffc15a },
    { offset: 1, color: 0xffe3a0 },
  ]),
  fog: skyFill([
    { offset: 0, color: 0xb7c4ce },
    { offset: 0.5, color: 0xd5dde4 },
    { offset: 1, color: 0xe6ece8 },
  ]),
  wind: skyFill([
    { offset: 0, color: 0x67c4f6 },
    { offset: 0.55, color: 0xb7e6fb },
    { offset: 1, color: 0xffe7b8 },
  ]),
};

function cloud(g: Graphics, x: number, y: number, s: number, color: number, alpha: number): void {
  const fill = { color, alpha };
  g.ellipse(x, y, 28 * s, 16 * s).fill(fill);
  g.ellipse(x + 22 * s, y + 4 * s, 20 * s, 13 * s).fill(fill);
  g.ellipse(x - 20 * s, y + 6 * s, 16 * s, 11 * s).fill(fill);
}

export function drawSky(g: Graphics, id: WeatherId, box: Box, floor: number): void {
  const top = Math.min(box.top, floor - 1);
  const dirt = terrainFor(id).dirt;
  g.rect(box.left, top, box.right - box.left, Math.max(1, floor - top)).fill(SKY[id]);
  if (box.bottom > floor) g.rect(box.left, floor, box.right - box.left, box.bottom - floor).fill(dirt);

  if (id === 'storm' || id === 'blizzard') return;

  const sunX = box.left + (box.right - box.left) * (id === 'heat' ? 0.86 : 0.2);
  const sunY = box.top + (floor - box.top) * (id === 'heat' ? 0.14 : 0.2);
  if (id === 'heat') {
    g.circle(sunX, sunY, 118).fill({ color: 0xfff1c2, alpha: 0.34 });
    g.circle(sunX, sunY, 72).fill({ color: 0xffd27a, alpha: 0.55 });
    g.circle(sunX, sunY, 38).fill(0xfff3c4);
    return;
  }
  if (id === 'fog') {
    g.circle(sunX, sunY, 70).fill({ color: 0xfff6e0, alpha: 0.18 });
    g.circle(sunX, sunY, 28).fill({ color: 0xfff6e0, alpha: 0.35 });
    return;
  }
  if (id === 'rain') {
    g.circle(sunX, sunY, 46).fill({ color: 0xfff6e0, alpha: 0.16 });
    return;
  }
  g.circle(sunX, sunY, 110).fill({ color: 0xffe896, alpha: 0.22 });
  g.circle(sunX, sunY, 68).fill({ color: 0xffe896, alpha: 0.28 });
  g.circle(sunX, sunY, 34).fill(0xffe38a);
}

export function drawClouds(g: Graphics, id: WeatherId, scroll: number, box: Box): void {
  const speed = id === 'wind' ? 0.9 : id === 'storm' ? 0.45 : 0.22;
  const band = id === 'storm' ? 380 : 520;
  const drift = scroll * speed;
  const tint =
    id === 'storm' ? 0x5c6770 : id === 'rain' ? 0xd5dde6 : id === 'heat' ? 0xfff1d2 : 0xffffff;
  const alpha = id === 'heat' ? 0.72 : id === 'fog' ? 0.55 : id === 'storm' ? 0.96 : 0.94;
  const start = Math.floor((box.left + drift) / band) - 1;
  const end = Math.floor((box.right + drift) / band) + 1;
  for (let i = start; i <= end; i++) {
    const origin = i * band - drift;
    const low = id === 'storm' ? 70 : 0;
    cloud(g, origin + 36, 38 + low, id === 'storm' ? 1.15 : 0.82, tint, alpha);
    if (id !== 'heat') cloud(g, origin + 250, id === 'blizzard' ? 180 : 448, 0.7, tint, alpha * 0.9);
    cloud(g, origin + 430, 34 + low * 0.4, id === 'storm' ? 1.25 : 1, tint, alpha);
  }
}

function tornado(g: Graphics, x: number, floor: number, time: number): void {
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const y = floor - 4 - t * 250;
    const sway = Math.sin(time * 5 + i * 0.65) * (5 + t * 16);
    const rx = 36 * t * t + 5;
    const color = i % 2 === 0 ? 0x55636c : 0x8d9aa2;
    g.ellipse(x + sway, y, rx, 7).fill({ color, alpha: 0.58 + (1 - t) * 0.28 });
  }
  for (let i = 0; i < 7; i++) {
    const a = time * 4.2 + (i * Math.PI * 2) / 7;
    g.circle(x + Math.cos(a) * 32, floor - 8 + Math.sin(a) * 5, 2.2).fill({ color: 0x6b4423, alpha: 0.75 });
  }
}

function streaks(
  g: Graphics,
  count: number,
  time: number,
  scroll: number,
  box: Box,
  floor: number,
  speed: number,
  lean: number,
  length: number,
  color: number,
  alpha: number,
  width: number,
): void {
  const spanW = Math.max(1, box.right - box.left);
  const spanH = Math.max(1, floor - box.top);
  for (let i = 0; i < count; i++) {
    const x = box.left + ((i * 97 + scroll * 0.35) % spanW);
    const y = box.top + ((i * 53 + time * speed) % spanH);
    g.moveTo(x, y).lineTo(x + lean, y + length).stroke({ width, color, alpha, cap: 'round' });
  }
}

export function drawTornado(g: Graphics, id: WeatherId, time: number, box: Box, floor: number): void {
  if (id !== 'storm') return;
  const span = box.right - box.left + 220;
  const x = box.left - 90 + ((time * 62) % span);
  tornado(g, x, floor, time);
}

export function drawAtmosphere(
  g: Graphics,
  id: WeatherId,
  time: number,
  scroll: number,
  box: Box,
  floor: number,
  reduceMotion: boolean,
): void {
  const wide = box.right - box.left;
  const tall = floor - box.top;

  if (id === 'rain' || id === 'storm') {
    const heavy = id === 'storm';
    streaks(g, heavy ? 90 : 48, time, scroll, box, floor, heavy ? 620 : 460, heavy ? -10 : -7, heavy ? 22 : 16, 0xd7e9f6, heavy ? 0.55 : 0.45, heavy ? 2 : 1.5);
    if (heavy && !reduceMotion && time % 3.4 < 0.1) {
      g.rect(box.left, box.top, wide, tall + 8).fill({ color: 0xfff6d8, alpha: 0.38 });
      const bx = box.left + wide * (0.25 + (Math.floor(time / 3.4) % 3) * 0.22);
      g.poly([bx, box.top + 8, bx + 10, box.top + 48, bx - 6, box.top + 48, bx + 14, box.top + 110], false).stroke({
        width: 3,
        color: 0xfff6c2,
        cap: 'round',
        join: 'round',
      });
    }
  }

  if (id === 'blizzard') {
    const spanW = Math.max(1, wide);
    const spanH = Math.max(1, tall);
    for (let i = 0; i < 70; i++) {
      const x = box.left + ((i * 61 + time * 36 + scroll * 0.2) % spanW);
      const y = box.top + ((i * 47 + time * 70) % spanH);
      g.circle(x, y, 1.1 + (i % 3) * 0.7).fill({ color: 0xffffff, alpha: 0.88 });
    }
  }

  if (id === 'heat') {
    for (let i = 0; i < 6; i++) {
      const y = floor - 36 - i * 26;
      let x = box.left;
      g.moveTo(x, y);
      for (; x <= box.right; x += 18) {
        g.lineTo(x, y + Math.sin((x + time * (reduceMotion ? 8 : 36)) / 16 + i) * 3);
      }
      g.stroke({ width: 2, color: 0xfff3c4, alpha: 0.28, cap: 'round' });
    }
  }

  if (id === 'fog') {
    const span = wide + 280;
    for (let i = 0; i < 5; i++) {
      const x = box.left - 80 + ((scroll * 0.12 + i * 210) % span);
      const y = floor - 60 - i * 78;
      g.ellipse(x, y, 180, 32).fill({ color: 0xffffff, alpha: 0.22 });
    }
  }

  if (id === 'wind') {
    const spanW = Math.max(1, wide);
    const spanH = Math.max(1, tall);
    for (let i = 0; i < 16; i++) {
      const x = box.left + ((i * 140 + time * (reduceMotion ? 40 : 220)) % spanW);
      const y = box.top + 30 + ((i * 97) % spanH);
      g.poly([x, y, x + 12, y - 2, x + 5, y + 2], true).fill({ color: 0x8dcc62, alpha: 0.85 });
    }
  }
}
