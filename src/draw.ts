import { WORLD, groundY, type Run } from './sim.ts';

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  color: string;
};

export type RenderState = {
  run: Run;
  best: number;
  paused: boolean;
  wing: number;
  pop: number;
  squash: number;
  reduceMotion: boolean;
  particles: Particle[];
};

type Box = { left: number; top: number; right: number; bottom: number };

const INK = '#2b2118';
const CREAM = '#fffdf6';

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  if (w <= 0 || h <= 0) return;
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function outlined(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  stroke = INK,
): void {
  ctx.font = `400 ${size}px "Lilita One", Nunito, ui-rounded, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(4, size / 9);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.font = `800 ${size}px Nunito, ui-rounded, "Trebuchet MS", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.beginPath();
  ctx.ellipse(x, y, 28 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 22 * s, y + 4 * s, 20 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 20 * s, y + 6 * s, 16 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function hills(
  ctx: CanvasRenderingContext2D,
  base: number,
  color: string,
  amp: number,
  period: number,
  scroll: number,
  left: number,
  right: number,
  floor: number,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(left, floor);
  for (let x = left; x <= right; x += 8) {
    ctx.lineTo(x, base + Math.sin((x + scroll) / period) * amp);
  }
  ctx.lineTo(right, floor);
  ctx.closePath();
  ctx.fill();
}

function drawSky(ctx: CanvasRenderingContext2D, box: Box, floor: number): void {
  const sky = ctx.createLinearGradient(0, box.top, 0, floor);
  sky.addColorStop(0, '#67c4f6');
  sky.addColorStop(0.55, '#b7e6fb');
  sky.addColorStop(1, '#ffe7b8');
  ctx.fillStyle = sky;
  ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);

  const sunX = box.left + (box.right - box.left) * 0.2;
  const sunY = box.top + (floor - box.top) * 0.2;
  const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 110);
  glow.addColorStop(0, 'rgba(255, 232, 150, 0.95)');
  glow.addColorStop(1, 'rgba(255, 232, 150, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffe38a';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
  ctx.fill();
}

function drawClouds(ctx: CanvasRenderingContext2D, run: Run, box: Box): void {
  const band = 520;
  const drift = run.scroll * 0.22;
  const start = Math.floor((box.left + drift) / band) - 1;
  const end = Math.floor((box.right + drift) / band) + 1;
  for (let i = start; i <= end; i++) {
    const origin = i * band - drift;
    cloud(ctx, origin + 36, 38, 0.82);
    cloud(ctx, origin + 250, 448, 0.7);
    cloud(ctx, origin + 430, 34, 1);
  }
}

function drawGround(ctx: CanvasRenderingContext2D, run: Run, box: Box, floor: number): void {
  ctx.fillStyle = '#e3b45c';
  ctx.fillRect(box.left, floor, box.right - box.left, box.bottom - floor + 4);
  ctx.fillStyle = '#63b44a';
  ctx.fillRect(box.left, floor, box.right - box.left, 18);
  ctx.fillStyle = '#4b9a38';
  ctx.fillRect(box.left, floor + 16, box.right - box.left, 7);

  ctx.fillStyle = '#7dcc55';
  const tuft = 18;
  for (let x = box.left - (run.scroll % tuft) - tuft; x < box.right; x += tuft) {
    ctx.beginPath();
    ctx.moveTo(x, floor + 2);
    ctx.lineTo(x + 5, floor - 8);
    ctx.lineTo(x + 10, floor + 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(150, 90, 36, 0.28)';
  const stone = 42;
  const first = Math.floor((box.left + run.scroll) / stone) - 1;
  const last = Math.floor((box.right + run.scroll) / stone) + 1;
  for (let i = first; i <= last; i++) {
    const n = Math.sin(i * 12.9898) * 43758.5453;
    const frac = n - Math.floor(n);
    if (frac < 0.62) continue;
    const x = i * stone - run.scroll;
    ctx.fillRect(x, floor + 36 + (i % 3) * 8, 8 + (i % 4) * 3, 4);
  }
}

function drawGate(ctx: CanvasRenderingContext2D, x: number, gapY: number, box: Box, floor: number): void {
  const openTop = gapY - WORLD.gap / 2;
  const openBot = gapY + WORLD.gap / 2;
  const lip = 28;
  const inset = 7;
  const w = WORLD.pipeW;

  const body = ctx.createLinearGradient(x, 0, x + w, 0);
  body.addColorStop(0, '#3d9d49');
  body.addColorStop(0.35, '#6ed86a');
  body.addColorStop(1, '#2f8a40');

  const shaft = (sx: number, sy: number, sh: number) => {
    if (sh <= 1) return;
    ctx.fillStyle = body;
    ctx.fillRect(sx, sy, w - inset * 2, sh);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(sx + 6, sy, 6, sh);
  };

  shaft(x + inset, box.top - 20, openTop - lip - (box.top - 20));
  shaft(x + inset, openBot + lip, floor - (openBot + lip) + 4);

  const cap = (cy: number) => {
    ctx.fillStyle = '#349443';
    rounded(ctx, x, cy, w, lip, 8);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1e5c30';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x + 8, cy + 5, 7, lip - 10);
  };

  cap(openTop - lip);
  cap(openBot);
}

function drawBird(ctx: CanvasRenderingContext2D, wing: number, squash: number): void {
  ctx.save();
  ctx.scale(1 + squash * 0.12, 1 - squash * 0.16);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#6a3d16';

  const flapAngle = Math.sin(wing);
  ctx.fillStyle = '#f0b429';
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(-22, -8 - flapAngle * 3);
  ctx.lineTo(-16, 7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(-2, 0);
  ctx.rotate(flapAngle * 1.05);
  ctx.fillStyle = '#e7a322';
  ctx.beginPath();
  ctx.ellipse(0, 11, 13, 7.5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#ffd34d';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 14.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fff3c4';
  ctx.beginPath();
  ctx.ellipse(3, 4, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f4a0a0';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(8, 5, 3.2, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#ef7a2f';
  ctx.beginPath();
  ctx.moveTo(12, -1);
  ctx.lineTo(26, 2);
  ctx.lineTo(12, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8, -4, 5.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(9.6, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8.8, -5, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function medalFor(score: number): { name: string; fill: string; rim: string } | null {
  if (score >= 40) return { name: 'ruby', fill: '#e85d75', rim: '#9d2944' };
  if (score >= 20) return { name: 'gold', fill: '#f2c14b', rim: '#a67c12' };
  if (score >= 10) return { name: 'silver', fill: '#d5dbe3', rim: '#7d8794' };
  if (score >= 5) return { name: 'bronze', fill: '#e0a36a', rim: '#8a5a32' };
  return null;
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawMedal(ctx: CanvasRenderingContext2D, x: number, y: number, score: number): void {
  const medal = medalFor(score);
  if (!medal) return;
  ctx.fillStyle = medal.rim;
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = medal.fill;
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();
  star(ctx, x, y - 2, 12, CREAM);
  label(ctx, medal.name, x, y + 40, 16, '#6d5848');
}

function drawUi(ctx: CanvasRenderingContext2D, state: RenderState, box: Box): void {
  const { run } = state;
  const cx = WORLD.w / 2;

  if (run.phase === 'ready') {
    outlined(ctx, 'FLIT', cx, 128, 92, CREAM);
    const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(run.time * 3));
    ctx.globalAlpha = pulse;
    label(ctx, 'tap to fly', cx, 214, 26, INK);
    ctx.globalAlpha = 1;
    if (state.best > 0) label(ctx, `best ${state.best}`, cx, 256, 20, '#6d5848');
  }

  if (run.phase === 'play' || run.phase === 'dying') {
    const scale = 1 + state.pop * 0.35;
    ctx.save();
    ctx.translate(cx, 74);
    ctx.scale(scale, scale);
    outlined(ctx, String(run.score), 0, 0, 64, CREAM);
    ctx.restore();
  }

  if (run.shake > 0) {
    ctx.fillStyle = `rgba(255,255,255,${run.shake * 0.45})`;
    ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
  }

  if (state.paused) {
    ctx.fillStyle = 'rgba(20, 40, 60, 0.28)';
    ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    const cardW = 250;
    const cardH = 112;
    const cardX = (WORLD.w - cardW) / 2;
    const cardY = 132;
    ctx.fillStyle = '#fff8ea';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    rounded(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.stroke();
    outlined(ctx, 'PAUSED', cx, cardY + 40, 40, CREAM);
    label(ctx, 'tap to resume', cx, cardY + 80, 20, '#6d5848');
  }

  if (run.phase !== 'over') return;

  ctx.fillStyle = 'rgba(20, 40, 60, 0.28)';
  ctx.fillRect(box.left, box.top, box.right - box.left, box.bottom - box.top);

  const award = medalFor(run.score);
  const cardW = 304;
  const cardH = award ? 356 : 252;
  const x = (WORLD.w - cardW) / 2;
  const y = award ? 112 : 168;

  ctx.fillStyle = 'rgba(43, 33, 24, 0.16)';
  rounded(ctx, x + 4, y + 6, cardW, cardH, 24);
  ctx.fill();
  ctx.fillStyle = '#fff8ea';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  rounded(ctx, x, y, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();

  outlined(ctx, 'GAME OVER', cx, y + 46, 36, '#ef5d4a');
  if (award) drawMedal(ctx, cx, y + 120, run.score);
  const scoreY = award ? y + 228 : y + 118;
  outlined(ctx, String(run.score), cx, scoreY, 54, INK, CREAM);
  label(ctx, `BEST  ${state.best}`, cx, scoreY + 52, 22, '#6d5848');
  label(ctx, 'tap to try again', cx, y + cardH - 32, 18, '#8a7362');
}

export function render(
  ctx: CanvasRenderingContext2D,
  cssW: number,
  cssH: number,
  dpr: number,
  state: RenderState,
): void {
  const worldAspect = WORLD.w / WORLD.h;
  const screenAspect = cssW / Math.max(1, cssH);
  let scale: number;
  let ox: number;
  let oy: number;
  if (screenAspect < worldAspect) {
    scale = cssW / WORLD.w;
    ox = 0;
    oy = cssH - WORLD.h * scale;
  } else {
    scale = cssH / WORLD.h;
    ox = (cssW - WORLD.w * scale) / 2;
    oy = 0;
  }

  const box: Box = {
    left: -ox / scale,
    top: -oy / scale,
    right: -ox / scale + cssW / scale,
    bottom: -oy / scale + cssH / scale,
  };
  const floor = groundY();
  const { run } = state;
  const mag = state.reduceMotion || run.shake <= 0 ? 0 : 8 * (run.shake / 0.32);
  const sx = (Math.random() - 0.5) * 2 * mag;
  const sy = (Math.random() - 0.5) * 2 * mag;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.fillStyle = '#67c4f6';
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (ox + sx), dpr * (oy + sy));
  drawSky(ctx, box, floor);
  drawClouds(ctx, run, box);
  hills(ctx, floor - 78, '#c5e39a', 16, 90, run.scroll * 0.35, box.left, box.right, floor);
  hills(ctx, floor - 36, '#8bc56a', 12, 54, run.scroll * 0.55, box.left, box.right, floor);

  for (const gate of run.gates) drawGate(ctx, gate.x, gate.gapY, box, floor);
  drawGround(ctx, run, box, floor);

  ctx.fillStyle = 'rgba(70, 46, 22, 0.18)';
  const altitude = Math.max(0, floor - run.bird.y);
  const shadowW = Math.max(8, 20 - altitude * 0.03);
  ctx.beginPath();
  ctx.ellipse(WORLD.birdX, floor - 2, shadowW, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(WORLD.birdX, run.bird.y);
  ctx.rotate(run.bird.rot);
  drawBird(ctx, state.wing, state.squash);
  ctx.restore();

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
  drawUi(ctx, state, box);
}
