// Map skins for the gates. The solid column stays inside the hit width.
// Arms, fish, and leaves may stick out past it.

import type { Graphics } from 'pixi.js';
import { WORLD } from './sim.ts';

export type ThemeId = 'classic' | 'roman' | 'colony' | 'reef' | 'mars';

export const THEMES: { id: ThemeId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'roman', name: 'Roman' },
  { id: 'colony', name: 'Colony' },
  { id: 'reef', name: 'Coral' },
  { id: 'mars', name: 'Mars' },
];

export function isThemeId(id: string): id is ThemeId {
  return THEMES.some((theme) => theme.id === id);
}

const PIPE_W = WORLD.pipeW;
const INK = 0x2b2118;

type End = {
  x: number;
  openTop: number;
  openBot: number;
  ceil: number;
  floor: number;
  time: number;
  seed: number;
};

export function drawThemedGate(
  g: Graphics,
  theme: ThemeId,
  x: number,
  gapY: number,
  open: number,
  ceil: number,
  floor: number,
  time: number,
): void {
  const gate: End = {
    x,
    openTop: gapY - open / 2,
    openBot: gapY + open / 2,
    ceil,
    floor,
    time,
    seed: gapY,
  };
  if (theme === 'roman') {
    drawRoman(g, gate);
    return;
  }
  if (theme === 'colony') {
    drawColony(g, gate);
    return;
  }
  if (theme === 'reef') {
    drawReef(g, gate);
    return;
  }
  if (theme === 'mars') {
    drawMars(g, gate);
    return;
  }
  drawClassic(g, gate);
}

function drawClassic(g: Graphics, gate: End): void {
  const lip = 28;
  const inset = 7;
  const { x } = gate;
  const shaft = (sy: number, sh: number) => {
    if (sh <= 1) return;
    g.rect(x + inset, sy, PIPE_W - inset * 2, sh).fill(0x4aaa52);
    g.rect(x + inset + 6, sy, 6, sh).fill({ color: 0xffffff, alpha: 0.28 });
    g.rect(x + PIPE_W - inset - 8, sy, 5, sh).fill({ color: 0x1e5c30, alpha: 0.18 });
  };
  const topY = gate.ceil - 20;
  shaft(topY, gate.openTop - lip - topY);
  shaft(gate.openBot + lip, gate.floor - (gate.openBot + lip) + 4);
  const cap = (cy: number) => {
    g.roundRect(x, cy, PIPE_W, lip, 8).fill(0x349443).stroke({ width: 3, color: 0x1e5c30 });
    g.rect(x + 8, cy + 5, 7, lip - 10).fill({ color: 0xffffff, alpha: 0.35 });
  };
  cap(gate.openTop - lip);
  cap(gate.openBot);
}

function drawRoman(g: Graphics, gate: End): void {
  const lip = 34;
  const { x } = gate;
  const stone = 0xf4e6cf;
  const shade = 0xd9c4a2;
  const groove = 0xb08968;
  const stroke = { width: 3, color: INK, join: 'round' as const, cap: 'round' as const };
  const shaft = (sy: number, sh: number) => {
    if (sh <= 1) return;
    g.roundRect(x + 6, sy, PIPE_W - 12, sh, 2).fill(stone).stroke(stroke);
    g.rect(x + 8, sy, 5, sh).fill(shade);
    for (const at of [0.34, 0.5, 0.66]) {
      g.moveTo(x + PIPE_W * at, sy + 2)
        .lineTo(x + PIPE_W * at, sy + sh - 2)
        .stroke({ width: 2, color: groove, cap: 'round' });
    }
  };
  const topY = gate.ceil - 20;
  shaft(topY, gate.openTop - lip - topY);
  shaft(gate.openBot + lip, gate.floor - (gate.openBot + lip) + 4);
  grow(topY + 10, gate.openTop - lip - 2);
  grow(gate.openBot + lip + 6, gate.floor - 12);
  capital(g, x, gate.openTop - lip, true);
  capital(g, x, gate.openBot, false);
  base(g, x, gate.floor - 16);

  function capital(gfx: Graphics, cx: number, cy: number, hanging: boolean): void {
    gfx.roundRect(cx + 2, cy + 8, PIPE_W - 4, lip - 12, 3).fill(stone).stroke(stroke);
    const slab = hanging ? cy + lip - 9 : cy;
    gfx.rect(cx, slab, PIPE_W, 9).fill(0xefe0c8).stroke(stroke);
    const neck = hanging ? cy + 4 : cy + lip - 8;
    gfx.rect(cx + 8, neck, PIPE_W - 16, 4).fill(0xe2b340);
    const vy = hanging ? cy + 16 : cy + 18;
    for (const vx of [cx + 16, cx + PIPE_W - 16]) {
      gfx.circle(vx, vy, 6.5).fill(0xf7ead8).stroke(stroke);
      gfx.circle(vx, vy, 2.4).fill(groove);
    }
  }

  function base(gfx: Graphics, cx: number, cy: number): void {
    gfx.rect(cx + 2, cy, PIPE_W - 4, 8).fill(0xefe0c8).stroke(stroke);
    gfx.rect(cx, cy + 7, PIPE_W, 7).fill(shade).stroke(stroke);
  }

  function grow(yStart: number, yEnd: number): void {
    const top = Math.max(yStart, gate.ceil + 96);
    const bot = Math.min(yEnd, gate.floor - 40);
    const step = 46;
    const first: 1 | -1 = unit(gate.seed + yStart) > 0.5 ? 1 : -1;
    let i = 0;
    for (let y0 = top + 4; y0 + 36 <= bot; y0 += step) {
      const side: 1 | -1 = i % 2 === 0 ? first : first === 1 ? -1 : 1;
      vine(y0, side, i);
      if (i % 2 === 0) climb(y0 + 8, i);
      i += 1;
    }
  }

  function vine(y0: number, side: 1 | -1, n: number): void {
    const sway = Math.sin(gate.time * 1.6 + n * 1.7 + gate.seed) * 3;
    const rootX = side > 0 ? x + PIPE_W - 7 : x + 7;
    const reach = side * (11 + (n % 3) * 4);
    const leafX = rootX + reach + sway;
    const drop = 30 + (n % 2) * 6;
    g.moveTo(rootX, y0)
      .quadraticCurveTo(leafX, y0 + 12, rootX + side * 3 + sway * 0.35, y0 + drop)
      .stroke({ width: 2.6, color: 0x2f7a48, cap: 'round' });
    g.moveTo(rootX + side, y0 + 7)
      .quadraticCurveTo(rootX + reach * 0.75, y0 + 18, rootX + side * 4, y0 + 26)
      .stroke({ width: 2, color: 0x3c8f55, cap: 'round' });
    leaf(leafX, y0 + 11, 6.4, 3.3, 0x4aaa52);
    leaf(rootX + reach * 0.62, y0 + 21, 5.2, 2.8, 0x3d8f46);
    leaf(rootX + side * 4 + sway * 0.3, y0 + drop - 3, 4.5, 2.5, 0x67c45a);
  }

  function climb(y0: number, n: number): void {
    if (y0 < gate.ceil + 96 || y0 + 34 > gate.floor - 40) return;
    const at = 0.28 + (n % 3) * 0.22;
    const cx = x + PIPE_W * at;
    const lean = Math.sin(gate.time * 1.4 + n) * 2;
    g.moveTo(cx, y0)
      .quadraticCurveTo(cx + 8 + lean, y0 + 16, cx - 3, y0 + 34)
      .stroke({ width: 2.2, color: 0x2f7a48, cap: 'round' });
    leaf(cx + 8 + lean, y0 + 14, 4.6, 2.5, 0x4aaa52);
    leaf(cx - 7, y0 + 26, 4.2, 2.3, 0x67c45a);
  }

  function leaf(lx: number, ly: number, rx: number, ry: number, fill: number): void {
    g.ellipse(lx, ly, rx, ry).fill(fill).stroke({ width: 1.3, color: 0x1e5c30 });
  }
}

function drawColony(g: Graphics, gate: End): void {
  const lip = 26;
  const { x, time } = gate;
  const metal = 0x3a4553;
  const dark = 0x1c242e;
  const stroke = { width: 3, color: 0x12171d, join: 'round' as const, cap: 'round' as const };
  const blink = 0.35 + 0.65 * Math.abs(Math.sin(time * 6 + gate.seed));
  const shaft = (sy: number, sh: number, toward: 1 | -1) => {
    if (sh <= 1) return;
    g.rect(x, sy, PIPE_W, sh).fill(metal).stroke(stroke);
    g.rect(x + 5, sy, 7, sh).fill({ color: 0x9aabbd, alpha: 0.28 });
    g.rect(x + PIPE_W - 9, sy, 4, sh).fill({ color: 0x000000, alpha: 0.28 });
    for (let yy = sy + 18; yy < sy + sh - 10; yy += 28) {
      g.rect(x + 4, yy, PIPE_W - 8, 3).fill(dark);
      g.circle(x + 14, yy + 9, 1.7).fill(0xa8b3c0);
      g.circle(x + PIPE_W - 14, yy + 9, 1.7).fill(0xa8b3c0);
    }
    const bite = sy + Math.min(sh * 0.35, 64);
    if (bite > sy + 16 && bite < sy + sh - 24) {
      g.poly([x + 2, bite, x - 10, bite + 9, x + 2, bite + 20, x + 12, bite + 12], true).fill(dark);
    }
    if (sh > 70) {
      g.moveTo(x + 18, sy + 16)
        .quadraticCurveTo(x + 42, sy + 30, x + 20, sy + 52)
        .stroke({ width: 2.4, color: 0x141a22, cap: 'round' });
    }
    g.circle(x + PIPE_W - 14, sy + 14, 3.2).fill({ color: 0xd23b2e, alpha: blink }).stroke({ width: 1.5, color: dark });
    if (Math.sin(time * 9 + gate.seed) > 0.72) g.circle(x + 30, sy + sh * 0.45, 2.2).fill(0xf2c14b);
    if (sh > 120) {
      const lipY = toward > 0 ? gate.openTop : gate.openBot;
      const bob = Math.sin(time * 2.2 + gate.seed) * 3;
      xenomorph(g, x + 4, lipY - toward * 34 + bob, toward, -1, time);
    }
    if (sh > 240) {
      const face: 1 | -1 = toward > 0 ? -1 : 1;
      const yy = sy + sh * 0.62;
      if (yy > 188 && yy < gate.floor - 130) {
        const hx = face > 0 ? x + PIPE_W - 4 : x + 4;
        xenomorph(g, hx, yy, toward, face, time + 1.7);
      }
    }
  };
  const topY = gate.ceil - 20;
  shaft(topY, gate.openTop - lip - topY, 1);
  shaft(gate.openBot + lip, gate.floor - (gate.openBot + lip) + 4, -1);
  hazard(g, x, gate.openTop - lip);
  hazard(g, x, gate.openBot);
  g.moveTo(x + 12, gate.openTop - 8)
    .lineTo(x + 12, gate.openTop - 18)
    .stroke({ width: 3, color: 0xc6d36a, cap: 'round' });
  g.circle(x + 12, gate.openTop - 7, 2.2).fill(0xc6d36a);
  g.moveTo(x + PIPE_W - 16, gate.openBot + 8)
    .lineTo(x + PIPE_W - 16, gate.openBot + 18)
    .stroke({ width: 3, color: 0xc6d36a, cap: 'round' });
  g.circle(x + PIPE_W - 16, gate.openBot + 8, 2.2).fill(0xc6d36a);

  function hazard(gfx: Graphics, hx: number, hy: number): void {
    gfx.roundRect(hx, hy, PIPE_W, lip, 5).fill(0xf0c14b).stroke(stroke);
    for (let i = 0; i < 4; i++) {
      const sx = hx + 6 + i * 16;
      gfx.poly([sx, hy + lip - 4, sx + 8, hy + 4, sx + 14, hy + lip - 4], true).fill(dark);
    }
  }
}

function xenomorph(g: Graphics, x: number, y: number, toward: 1 | -1, face: 1 | -1, time: number): void {
  const stroke = { width: 2, color: 0x07080a, join: 'round' as const, cap: 'round' as const };
  const f = face;
  const t = toward;
  const ink = 0x14181c;
  const jaw = 1.5 + Math.sin(time * 7) * 1.5;

  g.moveTo(x + f * 1, y)
    .quadraticCurveTo(x + f * 14, y - t * 8, x + f * 24, y + t * 1)
    .stroke({ width: 3.4, color: ink, cap: 'round' });

  g.ellipse(x + f * 8, y + t * 1, 7, 4.6).fill(ink).stroke(stroke);
  for (let i = 0; i < 3; i++) {
    const rx = x + f * (4 + i * 3.4);
    g.moveTo(rx, y - t * 2.6)
      .lineTo(rx, y + t * 3)
      .stroke({ width: 1.1, color: 0x9aa6b2 });
  }
  g.moveTo(x + f * 4, y - t * 2)
    .quadraticCurveTo(x + f * 8, y - t * 8, x + f * 12, y - t * 2)
    .stroke({ width: 2, color: 0x0c0e12, cap: 'round' });

  g.moveTo(x + f * 4, y + t * 3)
    .lineTo(x - f * 4, y + t * 7)
    .stroke({ width: 2.4, color: ink, cap: 'round' });

  g.ellipse(x + f * 12, y + t * 13, 8.4, 12.4).fill(ink).stroke(stroke);
  g.ellipse(x + f * 10, y + t * 8, 3, 5.2).fill({ color: 0xd5dee6, alpha: 0.9 });
  g.ellipse(x + f * 12, y + t * 22, 3.6, 2.3).fill(0x07080a);
  g.ellipse(x + f * 12, y + t * (26 + jaw * 0.4), 2, 3.6).fill(0xe8d8c0).stroke({ width: 1.1, color: 0x2a241c });
  g.circle(x + f * 12, y + t * (28.2 + jaw * 0.4), 1.2).fill(0xc4473a);
}

function drawReef(g: Graphics, gate: End): void {
  const lip = 30;
  const { x, time } = gate;
  const stroke = { width: 3, color: 0x6a2438, join: 'round' as const, cap: 'round' as const };
  const sway = Math.sin(time * 2.4 + gate.seed) * 4;
  const shaft = (sy: number, sh: number) => {
    if (sh <= 1) return;
    g.roundRect(x + 8, sy, PIPE_W - 16, sh, 18).fill(0xe25b86).stroke(stroke);
    g.rect(x + 14, sy, 6, sh).fill({ color: 0xffd0dc, alpha: 0.45 });
    const sprigs = Math.max(0, Math.floor(sh / 52));
    for (let i = 0; i < sprigs; i++) {
      const yy = sy + 24 + i * 52;
      if (yy > sy + sh - 18) break;
      g.ellipse(x + 2, yy, 11, 7).fill(0xf08a3c).stroke({ width: 2.2, color: 0x8a3d12 });
      g.ellipse(x + PIPE_W - 2, yy + 18, 10, 6).fill(0xc86bdc).stroke({ width: 2.2, color: 0x6a3480 });
    }
    const fishY = sy + sh * (0.35 + 0.3 * Math.sin(time * 1.5 + gate.seed));
    if (fishY > sy + 12 && fishY < sy + sh - 12) fish(g, x - 16, fishY, time);
    const bubble = sy + ((time * 26 + gate.seed) % Math.max(sh, 1));
    g.circle(x + PIPE_W + 12, sy + sh - bubble, 3.2).fill({ color: 0xffffff, alpha: 0.72 });
    g.circle(x + PIPE_W + 18, sy + sh - ((bubble + 18) % sh), 2).fill({ color: 0xffffff, alpha: 0.5 });
  };
  const topY = gate.ceil - 20;
  shaft(topY, gate.openTop - lip - topY);
  shaft(gate.openBot + lip, gate.floor - (gate.openBot + lip) + 4);
  head(g, x, gate.openTop - lip, true);
  head(g, x, gate.openBot, false);

  function head(gfx: Graphics, hx: number, hy: number, hanging: boolean): void {
    const cy = hanging ? hy + 16 : hy + 14;
    gfx.ellipse(hx + PIPE_W / 2, cy, 32, 14).fill(0xff7b59).stroke({ width: 3, color: 0x8a3418 });
    gfx.ellipse(hx + 22, cy - 2, 10, 7).fill(0xffb086);
    gfx.ellipse(hx + 46, cy + 2, 9, 6).fill(0xf2c14b);
    gfx.circle(hx + 30, cy + 1, 2).fill(0xfffdf6);
    gfx.circle(hx + 42, cy - 1, 1.6).fill(0xfffdf6);
    const root = hanging ? hy + 6 : hy + lip - 6;
    const away = hanging ? -1 : 1;
    for (let i = 0; i < 4; i++) {
      const rx = hx + 12 + i * 14;
      const lean = sway + i * 1.4;
      gfx
        .moveTo(rx, root)
        .quadraticCurveTo(rx + lean, root + away * 8, rx - 2, root + away * 15)
        .stroke({ width: 2.4, color: 0x7d4bb0, cap: 'round' });
    }
  }
}

function drawMars(g: Graphics, gate: End): void {
  const lip = 24;
  const { x, time } = gate;
  const rust = 0xc45c38;
  const dust = 0xe8a888;
  const dark = 0x6a2c1c;
  const stroke = { width: 3, color: 0x3d1a12, join: 'round' as const, cap: 'round' as const };
  const drift = Math.sin(time * 1.6 + gate.seed) * 3;
  const shaft = (sy: number, sh: number) => {
    if (sh <= 1) return;
    g.roundRect(x + 6, sy, PIPE_W - 12, sh, 4).fill(rust).stroke(stroke);
    g.rect(x + 12, sy, 6, sh).fill({ color: dust, alpha: 0.5 });
    g.rect(x + PIPE_W - 16, sy, 4, sh).fill({ color: dark, alpha: 0.38 });
    for (let yy = sy + 22; yy < sy + sh - 12; yy += 36) {
      g.rect(x + 8, yy, PIPE_W - 16, 3).fill(dark);
      g.circle(x + 16, yy + 10, 1.6).fill(0xf0d2b4);
      g.circle(x + PIPE_W - 16, yy + 10, 1.6).fill(0xf0d2b4);
    }
    if (sh > 54) g.roundRect(x + 20, sy + 30, 20, 12, 2).fill(0xe2b340).stroke({ width: 1.6, color: 0x8a6412 });
    g.circle(x - 10 + drift, sy + sh * 0.42, 3.1).fill({ color: 0xe7b89a, alpha: 0.5 });
    g.circle(x + PIPE_W + 12 - drift, sy + sh * 0.66, 2.2).fill({ color: 0xe7b89a, alpha: 0.38 });
  };
  const topY = gate.ceil - 20;
  shaft(topY, gate.openTop - lip - topY);
  shaft(gate.openBot + lip, gate.floor - (gate.openBot + lip) + 4);
  collar(g, x, gate.openTop - lip, true);
  collar(g, x, gate.openBot, false);
  const dishY = gate.openTop - 18;
  if (dishY > gate.ceil + 96) {
    g.moveTo(x + 8, dishY)
      .lineTo(x - 16, dishY - 14)
      .stroke({ width: 2.6, color: 0x3d1a12, cap: 'round' });
    g.ellipse(x - 26, dishY - 16, 13, 5.2).fill(0xf4f7fb).stroke({ width: 2.2, color: 0x3d1a12 });
    g.circle(x - 26, dishY - 16, 2.2).fill(0x163044);
  }
  const panelY = gate.openBot + 20;
  if (panelY < gate.floor - 70) {
    g.roundRect(x - 38, panelY, 34, 18, 3).fill(0x1d4e89).stroke({ width: 2.2, color: 0x163044 });
    for (const px of [x - 26, x - 14]) {
      g.moveTo(px, panelY + 2)
        .lineTo(px, panelY + 16)
        .stroke({ width: 1.4, color: 0x7ec8e3 });
    }
    g.moveTo(x - 36, panelY + 9)
      .lineTo(x - 6, panelY + 9)
      .stroke({ width: 1.4, color: 0x7ec8e3 });
  }

  function collar(gfx: Graphics, hx: number, hy: number, hanging: boolean): void {
    gfx.roundRect(hx, hy, PIPE_W, lip, 6).fill(0xd46a42).stroke(stroke);
    const band = hanging ? hy + lip - 7 : hy + 3;
    gfx.rect(hx + 4, band, PIPE_W - 8, 4).fill(0xe2b340);
    for (let i = 0; i < 3; i++) {
      const py = hanging ? hy + 8 : hy + lip - 8;
      gfx.ellipse(hx + 14 + i * 18, py, 4, 2.2).fill(0x3d1a12);
    }
    const flame = 0.65 + 0.35 * Math.sin(time * 8 + gate.seed);
    const fy = hanging ? hy + 1 : hy + lip - 1;
    const away = hanging ? -1 : 1;
    gfx.poly([hx + 28, fy, hx + 35, fy + away * 11 * flame, hx + 42, fy], true).fill({ color: 0xf08a2a, alpha: 0.9 });
    gfx.poly([hx + 31, fy, hx + 35, fy + away * 6 * flame, hx + 39, fy], true).fill(0xfff6d0);
  }
}

function fish(g: Graphics, x: number, y: number, time: number): void {
  const wag = Math.sin(time * 8) * 2;
  g.ellipse(x, y, 8, 4.2).fill(0x3b82e0).stroke({ width: 2, color: 0x1d4e89 });
  g.poly([x - 7, y, x - 14, y - 4 - wag, x - 14, y + 4 + wag], true).fill(0xf2c14b);
  g.circle(x + 3, y - 1, 1.1).fill(0xfffdf6);
}

function unit(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
