import { FillGradient, type Graphics } from 'pixi.js';
import type { HolidayId } from './holiday.ts';
import type { SeasonId } from './season.ts';
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

const SEASON_SKY: Record<SeasonId, FillGradient> = {
  spring: skyFill([
    { offset: 0, color: 0x8ec8f0 },
    { offset: 0.5, color: 0xf7c6de },
    { offset: 1, color: 0xfff0d0 },
  ]),
  summer: SKY.clear,
  autumn: skyFill([
    { offset: 0, color: 0xf09a5a },
    { offset: 0.48, color: 0xf6c27a },
    { offset: 1, color: 0xffe0b0 },
  ]),
  winter: skyFill([
    { offset: 0, color: 0x9eb8d4 },
    { offset: 0.5, color: 0xd5e4f0 },
    { offset: 1, color: 0xf4f7fb },
  ]),
};

const HOLIDAY_SKY: Record<HolidayId, FillGradient> = {
  newyear: skyFill([
    { offset: 0, color: 0x6a8ec4 },
    { offset: 0.5, color: 0xd5e4f4 },
    { offset: 1, color: 0xffe4a8 },
  ]),
  valentine: skyFill([
    { offset: 0, color: 0xf7b6c8 },
    { offset: 0.5, color: 0xffd6e4 },
    { offset: 1, color: 0xfff0e6 },
  ]),
  patrick: skyFill([
    { offset: 0, color: 0x67c48a },
    { offset: 0.5, color: 0xb7e6a0 },
    { offset: 1, color: 0xe8f6c8 },
  ]),
  easter: skyFill([
    { offset: 0, color: 0xf7c6de },
    { offset: 0.48, color: 0xfff3c4 },
    { offset: 1, color: 0xe7f6ff },
  ]),
  halloween: skyFill([
    { offset: 0, color: 0x5c3d78 },
    { offset: 0.5, color: 0xe07a4a },
    { offset: 1, color: 0xffc27a },
  ]),
  thanksgiving: skyFill([
    { offset: 0, color: 0xe09040 },
    { offset: 0.48, color: 0xf6c27a },
    { offset: 1, color: 0xffe0b0 },
  ]),
  christmas: skyFill([
    { offset: 0, color: 0x6ea0d4 },
    { offset: 0.5, color: 0xd7ecf8 },
    { offset: 1, color: 0xffe7c2 },
  ]),
};

const HOLIDAY_SUN: Record<HolidayId, { color: number; glow: number; radius: number }> = {
  newyear: { color: 0xffe08a, glow: 0.2, radius: 28 },
  valentine: { color: 0xffd0dc, glow: 0.28, radius: 34 },
  patrick: { color: 0xffe38a, glow: 0.22, radius: 32 },
  easter: { color: 0xfff6e0, glow: 0.26, radius: 34 },
  halloween: { color: 0xff8a3a, glow: 0.22, radius: 30 },
  thanksgiving: { color: 0xffb15a, glow: 0.24, radius: 32 },
  christmas: { color: 0xffe08a, glow: 0.2, radius: 26 },
};

function cloud(g: Graphics, x: number, y: number, s: number, color: number, alpha: number): void {
  const fill = { color, alpha };
  g.ellipse(x, y, 28 * s, 16 * s).fill(fill);
  g.ellipse(x + 22 * s, y + 4 * s, 20 * s, 13 * s).fill(fill);
  g.ellipse(x - 20 * s, y + 6 * s, 16 * s, 11 * s).fill(fill);
}

export function drawSky(
  g: Graphics,
  id: WeatherId,
  season: SeasonId,
  holiday: HolidayId | null,
  box: Box,
  floor: number,
): void {
  const top = Math.min(box.top, floor - 1);
  const dirt = terrainFor(id, season, holiday).dirt;
  const festive = holiday && (id === 'clear' || id === 'wind');
  const sky = festive ? HOLIDAY_SKY[holiday] : id === 'clear' || id === 'wind' ? SEASON_SKY[season] : SKY[id];
  g.rect(box.left, top, box.right - box.left, Math.max(1, floor - top)).fill(sky);
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
  if (holiday) {
    const sun = HOLIDAY_SUN[holiday];
    g.circle(sunX, sunY, sun.radius * 3).fill({ color: sun.color, alpha: sun.glow });
    g.circle(sunX, sunY, sun.radius * 1.8).fill({ color: sun.color, alpha: sun.glow + 0.08 });
    g.circle(sunX, sunY, sun.radius).fill(sun.color);
    return;
  }
  const sun = season === 'autumn' ? 0xffb15a : season === 'winter' ? 0xfff6e0 : 0xffe38a;
  const glow = season === 'winter' ? 0.14 : 0.24;
  g.circle(sunX, sunY, season === 'winter' ? 78 : 110).fill({ color: sun, alpha: glow });
  g.circle(sunX, sunY, season === 'winter' ? 46 : 68).fill({ color: sun, alpha: glow + 0.08 });
  g.circle(sunX, sunY, season === 'winter' ? 24 : 34).fill(sun);
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

function heart(g: Graphics, x: number, y: number, s: number, color: number, alpha = 1): void {
  const fill = { color, alpha };
  g.circle(x - s * 0.32, y - s * 0.12, s * 0.38).fill(fill);
  g.circle(x + s * 0.32, y - s * 0.12, s * 0.38).fill(fill);
  g.poly([x - s * 0.62, y + s * 0.05, x + s * 0.62, y + s * 0.05, x, y + s * 0.95], true).fill(fill);
}

function shamrock(g: Graphics, x: number, y: number, s: number, color: number): void {
  g.circle(x, y - s, s).fill(color);
  g.circle(x - s * 0.9, y + s * 0.35, s).fill(color);
  g.circle(x + s * 0.9, y + s * 0.35, s).fill(color);
  g.rect(x - s * 0.16, y + s * 0.15, s * 0.32, s * 1.25).fill(0x2a6b32);
}

function drawHoliday(
  g: Graphics,
  holiday: HolidayId,
  time: number,
  scroll: number,
  box: Box,
  floor: number,
  reduceMotion: boolean,
): void {
  const drift = scroll * 0.35;
  const span = 280;
  const start = Math.floor((box.left + drift) / span) - 1;
  const end = Math.floor((box.right + drift) / span) + 1;
  for (let i = start; i <= end; i++) {
    const x = i * span - drift + 48;
    const ground = floor - 78 + Math.sin((x + drift) / 90) * 16;
    if (holiday === 'christmas' || holiday === 'newyear') {
      g.rect(x - 3, ground - 8, 6, 8).fill(0x6a3d16);
      g.poly([x, ground - 42, x - 16, ground - 8, x + 16, ground - 8], true).fill(0x1f7a3a);
      g.poly([x, ground - 30, x - 11, ground - 16, x + 11, ground - 16], true).fill(0x2e9a4a);
      g.circle(x, ground - 44, 3).fill(holiday === 'newyear' ? 0xffe08a : 0xfffdf6);
      if (holiday === 'christmas') {
        g.circle(x - 6, ground - 24, 2.1).fill(0xe23d3d);
        g.circle(x + 5, ground - 18, 2.1).fill(0xffe08a);
        g.circle(x - 2, ground - 14, 1.8).fill(0x7ec8e3);
      }
      continue;
    }
    g.rect(x - 3, ground - 18, 6, 18).fill(0x6a3d16);
    if (holiday === 'valentine') {
      heart(g, x, ground - 34, 14, 0xe23d4a);
      continue;
    }
    if (holiday === 'patrick') {
      g.circle(x, ground - 30, 15).fill(0x2f9e44);
      g.circle(x - 11, ground - 20, 10).fill(0x46b85a);
      shamrock(g, x + 16, ground - 4, 4, 0x2f9e44);
      continue;
    }
    if (holiday === 'easter') {
      g.circle(x, ground - 30, 14).fill(0xf7c6de);
      g.circle(x - 11, ground - 20, 10).fill(0xfff3b0);
      g.circle(x + 12, ground - 18, 9).fill(0xc6e6ff);
      g.ellipse(x + 18, ground - 2, 4, 5.4).fill(0xf48cb8);
      g.rect(x + 14, ground - 2, 8, 1.6).fill(0xfffdf6);
      continue;
    }
    if (holiday === 'halloween') {
      g.circle(x, ground - 28, 14).fill(0x3a2458);
      g.circle(x - 10, ground - 18, 9).fill(0x2b1b40);
      g.ellipse(x + 2, ground - 4, 9, 7).fill(0xe2582a);
      g.rect(x + 1, ground - 12, 2.2, 4).fill(0x3d6b32);
      g.circle(x - 1, ground - 5, 1.1).fill(0x2b2118);
      g.circle(x + 4, ground - 5, 1.1).fill(0x2b2118);
      continue;
    }
    g.circle(x, ground - 30, 16).fill(0xe2582a);
    g.circle(x - 12, ground - 20, 11).fill(0xf0a030);
    g.circle(x + 13, ground - 18, 12).fill(0xc4382a);
  }

  const wide = Math.max(1, box.right - box.left);
  const tall = Math.max(1, floor - box.top);
  const pace = reduceMotion ? 0.25 : 1;
  if (holiday === 'valentine') {
    for (let i = 0; i < 14; i++) {
      const x = box.left + ((i * 83 + time * 22 * pace + scroll * 0.1) % wide);
      const y = box.top + ((i * 57 + time * 30 * pace) % tall);
      heart(g, x, y, 6, i % 2 === 0 ? 0xe23d4a : 0xf48cb8, 0.92);
    }
  }
  if (holiday === 'patrick') {
    const step = 64;
    for (let x = box.left - (scroll % step) - step; x < box.right; x += step) {
      shamrock(g, x, floor - 10, 3.2, 0x2f9e44);
    }
  }
  if (holiday === 'easter') {
    const colors = [0xf48cb8, 0xfff3b0, 0xc6e6ff, 0xb7e6a0];
    const step = 58;
    for (let i = 0, x = box.left - (scroll % step) - step; x < box.right; x += step, i++) {
      g.ellipse(x, floor - 8, 4.2, 5.6).fill(colors[i % colors.length]);
      g.rect(x - 4.2, floor - 8, 8.4, 1.5).fill(0xfffdf6);
    }
  }
  if (holiday === 'halloween') {
    for (let i = 0; i < 10; i++) {
      const x = box.left + ((i * 97 + time * 28 * pace + scroll * 0.16) % wide);
      const y = box.top + ((i * 61 + time * 18 * pace) % (tall * 0.72));
      g.poly([x, y, x - 8, y - 4, x - 3, y, x, y + 2, x + 3, y, x + 8, y - 4], true).fill({ color: 0x2b2118, alpha: 0.9 });
    }
  }
  if (holiday === 'thanksgiving') {
    const colors = [0xe2582a, 0xf0a030, 0xc4382a, 0xe8c15a];
    for (let i = 0; i < 16; i++) {
      const sway = Math.sin(time * pace * 2 + i) * 12;
      const x = box.left + ((i * 71 + time * 20 * pace + scroll * 0.16 + sway) % wide);
      const y = box.top + ((i * 49 + time * 42 * pace) % tall);
      g.poly([x, y, x + 7, y + 3, x + 3, y + 8, x - 3, y + 4], true).fill({ color: colors[i % colors.length], alpha: 0.92 });
    }
  }
  if (holiday === 'christmas' || holiday === 'newyear') {
    for (let i = 0; i < 18; i++) {
      const x = box.left + ((i * 67 + time * 16 * pace + scroll * 0.08) % wide);
      const y = box.top + ((i * 43 + time * 28 * pace) % tall);
      const spark = holiday === 'newyear' && i % 3 === 0;
      g.circle(x, y, spark ? 2.2 : 1.3 + (i % 3) * 0.4).fill({ color: spark ? 0xffe08a : 0xffffff, alpha: 0.92 });
    }
  }
}

export function drawSeason(
  g: Graphics,
  season: SeasonId,
  holiday: HolidayId | null,
  weather: WeatherId,
  time: number,
  scroll: number,
  box: Box,
  floor: number,
  reduceMotion: boolean,
): void {
  if (weather === 'blizzard' || weather === 'heat') return;
  if (holiday) {
    drawHoliday(g, holiday, time, scroll, box, floor, reduceMotion);
    return;
  }
  const drift = scroll * 0.35;
  const span = 280;
  const start = Math.floor((box.left + drift) / span) - 1;
  const end = Math.floor((box.right + drift) / span) + 1;
  for (let i = start; i <= end; i++) {
    const x = i * span - drift + 48;
    const ground = floor - 78 + Math.sin((x + drift) / 90) * 16;
    const trunk = season === 'winter' ? 34 : 18;
    g.rect(x - 3, ground - trunk, 6, trunk).fill(0x6a3d16);
    if (season === 'winter') {
      g.moveTo(x, ground - trunk)
        .lineTo(x - 16, ground - trunk - 18)
        .stroke({ width: 2.4, color: 0x6a3d16, cap: 'round' });
      g.moveTo(x, ground - trunk)
        .lineTo(x + 18, ground - trunk - 16)
        .stroke({ width: 2.4, color: 0x6a3d16, cap: 'round' });
      g.moveTo(x, ground - trunk - 8)
        .lineTo(x + 12, ground - trunk - 4)
        .stroke({ width: 2, color: 0x6a3d16, cap: 'round' });
      continue;
    }
    const leaf = season === 'spring' ? 0xf2a0c4 : season === 'autumn' ? 0xe2582a : 0x3f9a3a;
    const leaf2 = season === 'spring' ? 0xfffdf6 : season === 'autumn' ? 0xf0a030 : 0x67b84e;
    g.circle(x, ground - trunk - 12, 16).fill(leaf);
    g.circle(x - 12, ground - trunk - 4, 11).fill(leaf2);
    g.circle(x + 13, ground - trunk - 3, 12).fill(leaf);
  }

  const wide = Math.max(1, box.right - box.left);
  const tall = Math.max(1, floor - box.top);
  const pace = reduceMotion ? 0.25 : 1;
  if (season === 'spring') {
    for (let i = 0; i < 16; i++) {
      const x = box.left + ((i * 83 + time * 26 * pace + scroll * 0.12) % wide);
      const y = box.top + ((i * 57 + time * 36 * pace) % tall);
      g.ellipse(x, y, 4.2, 2.2).fill({ color: i % 2 === 0 ? 0xf48cb8 : 0xfffdf6, alpha: 0.9 });
    }
  }
  if (season === 'summer') {
    const step = 52;
    for (let x = box.left - (scroll % step) - step; x < box.right; x += step) {
      g.circle(x, floor - 7, 3.1).fill(0xf2c14b);
      g.circle(x + 9, floor - 5, 2.3).fill(0xfffdf6);
    }
  }
  if (season === 'autumn') {
    const colors = [0xe2582a, 0xf0a030, 0xc4382a, 0xe8c15a];
    for (let i = 0; i < 18; i++) {
      const sway = Math.sin(time * pace * 2 + i) * 12;
      const x = box.left + ((i * 71 + time * 22 * pace + scroll * 0.18 + sway) % wide);
      const y = box.top + ((i * 49 + time * 48 * pace) % tall);
      const color = colors[i % colors.length];
      g.poly([x, y, x + 7, y + 3, x + 3, y + 8, x - 3, y + 4], true).fill({ color, alpha: 0.92 });
    }
  }
  if (season === 'winter') {
    for (let i = 0; i < 22; i++) {
      const x = box.left + ((i * 67 + time * 18 * pace + scroll * 0.08) % wide);
      const y = box.top + ((i * 43 + time * 32 * pace) % tall);
      g.circle(x, y, 1.2 + (i % 3) * 0.5).fill({ color: 0xffffff, alpha: 0.9 });
    }
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
