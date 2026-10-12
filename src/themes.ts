// Map skins for the gates. The solid column stays inside the hit width.
// Arms and leaves may stick out past it.

import type { Graphics } from 'pixi.js';
import { WORLD } from './sim.ts';

export type ThemeId = 'classic' | 'roman';

export const THEMES: { id: ThemeId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'roman', name: 'Roman' },
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

function unit(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
