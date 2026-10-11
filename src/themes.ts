// Map skins for the gates. The solid column stays inside the hit width.
// Arms, fish, and leaves may stick out past it.

import type { Graphics } from 'pixi.js';
import { WORLD } from './sim.ts';

export type ThemeId = 'classic' | 'roman' | 'colony' | 'reef';

export const THEMES: { id: ThemeId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'roman', name: 'Roman' },
  { id: 'colony', name: 'Colony' },
  { id: 'reef', name: 'Reef' },
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
  vine(gate.openTop - lip - 52);
  vine(gate.openBot + lip + 36);
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

  function vine(y0: number): void {
    if (y0 < gate.ceil + 96 || y0 > gate.floor - 40) return;
    const side = unit(gate.seed) > 0.5 ? 1 : -1;
    const rootX = side > 0 ? x + PIPE_W - 8 : x + 8;
    const leafX = rootX + side * 10;
    g.moveTo(rootX, y0)
      .quadraticCurveTo(leafX, y0 + 14, rootX, y0 + 30)
      .stroke({ width: 3, color: 0x3c8f55, cap: 'round' });
    g.ellipse(leafX, y0 + 12, 6, 3.4).fill(0x4aaa52).stroke({ width: 1.6, color: 0x1e5c30 });
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
    if (sh > 96) {
      const lipY = toward > 0 ? gate.openTop : gate.openBot;
      const bob = Math.sin(time * 2.2 + gate.seed) * 5;
      crawler(g, x + 6, lipY - toward * 42 + bob, toward, -1, time);
    }
    if (sh > 190) crawler(g, x + PIPE_W - 6, sy + sh * 0.58, toward, 1, time + 1.7);
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

function crawler(g: Graphics, x: number, y: number, toward: 1 | -1, face: 1 | -1, time: number): void {
  const stroke = { width: 2.4, color: 0x0e1116, join: 'round' as const, cap: 'round' as const };
  const f = face;
  const t = toward;
  const reach = Math.sin(time * 3.1) * 5;
  g.moveTo(x + f * 4, y - t * 6)
    .quadraticCurveTo(x + f * 16, y - t * 30, x + f * 6, y - t * 52)
    .stroke({ width: 5, color: 0x141820, cap: 'round' });
  g.ellipse(x + f * 8, y - t * 4, 8, 13).fill(0x2c333c).stroke(stroke);
  for (let i = 0; i < 3; i++) {
    const ry = y - t * (8 + i * 8);
    g.moveTo(x + f * 2, ry)
      .lineTo(x + f * 14, ry + t * 2)
      .stroke({ width: 1.6, color: 0x6a7582 });
  }
  g.poly(
    [
      x + f * 2,
      y - t * 4,
      x + f * 0,
      y + t * 12,
      x + f * 18,
      y + t * (24 + reach * 0.15),
      x + f * 34,
      y + t * 10,
      x + f * 24,
      y - t * 8,
      x + f * 10,
      y - t * 16,
    ],
    true,
  )
    .fill(0x161b22)
    .stroke(stroke);
  g.ellipse(x + f * 16, y + t * 2, 7, 9).fill(0x3d4654);
  g.poly([x + f * 16, y + t * 6, x + f * 32, y + t * 16, x + f * 18, y + t * 14], true).fill(0xdfe7a4);
  g.moveTo(x + f * 4, y)
    .lineTo(x + f * (20 + reach), y + t * 16)
    .lineTo(x + f * (30 + reach), y + t * 22)
    .stroke({ width: 3, color: 0x12161c, cap: 'round', join: 'round' });
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
