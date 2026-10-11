// Rules for Flit. The hit circle is smaller than the drawn bird so a
// near miss on the beak or the tail still counts as a pass.

import { holidayForDate, type HolidayId } from './holiday.ts';
import { seasonForDate, type SeasonId } from './season.ts';
import { weatherForSeed, type WeatherId } from './weather.ts';

export const WORLD = {
  w: 390,
  h: 680,
  ground: 108,
  birdX: 124,
  birdR: 16,
  hitR: 12,
  readyY: 320,
  gravity: 1550,
  flap: -540,
  maxFall: 760,
  scroll: 162,
  gap: 168,
  pipeW: 70,
  spacing: 232,
  firstX: 420,
  margin: 68,
  gapStep: 116,
} as const;

export type Phase = 'ready' | 'play' | 'dying' | 'snatched' | 'over';

export type Bird = {
  y: number;
  vy: number;
  rot: number;
};

export type Gate = {
  x: number;
  gapY: number;
  open: number;
  scored: boolean;
};

export type Run = {
  phase: Phase;
  bird: Bird;
  gates: Gate[];
  score: number;
  scroll: number;
  time: number;
  seed: number;
  shake: number;
  sinceFlap: number;
  weather: WeatherId;
  season: SeasonId;
  holiday: HolidayId | null;
  taps: number;
  playTime: number;
  snatchAt: number | null;
  snatchTime: number;
  caughtY: number;
};

export function groundY(): number {
  return WORLD.h - WORLD.ground;
}

// The resting pose is nose-down, so the center sits higher than the hit circle
// or the beak plants in the dirt.
export function restY(): number {
  return groundY() - 32;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function createRun(seed = 1): Run {
  const safe = seed >>> 0 || 1;
  return {
    phase: 'ready',
    bird: { y: WORLD.readyY, vy: 0, rot: 0 },
    gates: [],
    score: 0,
    scroll: 0,
    time: 0,
    seed: safe,
    shake: 0,
    sinceFlap: 10,
    weather: weatherForSeed(safe),
    season: seasonForDate(new Date()),
    holiday: holidayForDate(new Date()),
    taps: 0,
    playTime: 0,
    snatchAt: null,
    snatchTime: -1,
    caughtY: WORLD.readyY,
  };
}

// One run in 100. 42949673 / 2^32 is the closest whole rate. The grab is timed
// anywhere before pipe 25, then the chance is gone.
export const SNATCH_CHANCE_NUMERATOR = Math.round(2 ** 32 / 100);
export const SNATCH_PIPE_LIMIT = 25;
export const SNATCH_APPROACH = 0.92;
export const SNATCH_CARRY = 1.28;
export const SNATCH_DURATION = SNATCH_APPROACH + SNATCH_CARRY;
const TALON_X = -6;
const TALON_Y = 40;

// Every 10 pipes, the next gate sits 30px closer and its opening is 30px shorter.
// WORLD.spacing and WORLD.gap are the tightest.
const EASE_EVERY = 10;
const EASE_STEP = 30;
const EASE_STEPS = 4;

function easeLeft(cleared: number): number {
  const steps = Math.min(EASE_STEPS, Math.max(0, Math.floor(cleared / EASE_EVERY)));
  return (EASE_STEPS - steps) * EASE_STEP;
}

export function pipeSpacing(cleared: number): number {
  return WORLD.spacing + easeLeft(cleared);
}

export function pipeOpening(cleared: number): number {
  return WORLD.gap + easeLeft(cleared);
}

export function pipesClearTime(pipes = SNATCH_PIPE_LIMIT): number {
  let travel = WORLD.firstX + WORLD.pipeW - WORLD.birdX;
  for (let i = 0; i < pipes - 1; i++) travel += pipeSpacing(i);
  return travel / WORLD.scroll;
}

function mix(n: number): number {
  let x = n >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

export function planSnatch(seed: number): number | null {
  if (mix(seed ^ 0xa5a5a5a5) >= SNATCH_CHANCE_NUMERATOR) return null;
  const latest = pipesClearTime();
  const when = 0.55 + (mix(seed ^ 0x3c6ef372) / 4294967296) * (latest - 0.55);
  return when;
}

export function snatchPose(
  time: number,
  caughtY: number,
  entryX: number,
): { birdX: number; birdY: number; dinoX: number; dinoY: number; grabbed: boolean; wing: number } {
  const wing = Math.sin(time * 26);
  const grabX = WORLD.birdX - TALON_X;
  const grabY = caughtY - TALON_Y;
  if (time < SNATCH_APPROACH) {
    const u = time / SNATCH_APPROACH;
    const ease = u * u * (3 - 2 * u);
    const dinoX = entryX + (grabX - entryX) * ease;
    const dinoY = caughtY - 190 + (grabY - (caughtY - 190)) * ease + Math.sin(u * Math.PI) * 80;
    return { birdX: WORLD.birdX, birdY: caughtY, dinoX, dinoY, grabbed: false, wing };
  }
  const u = clamp((time - SNATCH_APPROACH) / SNATCH_CARRY, 0, 1);
  const ease = 1 - (1 - u) * (1 - u);
  const dinoX = grabX + (-260 - grabX) * ease;
  const dinoY = grabY + (-200 - grabY) * ease;
  return {
    birdX: dinoX + TALON_X,
    birdY: dinoY + TALON_Y,
    dinoX,
    dinoY,
    grabbed: true,
    wing,
  };
}

export function flightFacts(run: Run): { taps: string; pipes: string; seconds: string } {
  const seconds = (Math.round(run.playTime * 10) / 10).toFixed(1);
  return {
    taps: run.taps === 1 ? '1 tap' : `${run.taps} taps`,
    pipes: run.score === 1 ? '1 pipe' : `${run.score} pipes`,
    seconds: `${seconds}s`,
  };
}

function rand(run: Run): number {
  run.seed = (Math.imul(run.seed, 1664525) + 1013904223) >>> 0;
  return run.seed / 4294967296;
}

function nextGap(run: Run, around: number, open: number): number {
  const half = open / 2;
  const min = WORLD.margin + half;
  const max = groundY() - WORLD.margin - half;
  const raw = min + rand(run) * (max - min);
  return clamp(raw, Math.max(min, around - WORLD.gapStep), Math.min(max, around + WORLD.gapStep));
}

function spawn(run: Run): void {
  const last = run.gates[run.gates.length - 1];
  const open = pipeOpening(run.score);
  if (!last) {
    run.gates.push({ x: WORLD.firstX, gapY: nextGap(run, WORLD.readyY, open), open, scored: false });
    return;
  }
  const spacing = pipeSpacing(run.score);
  if (last.x <= WORLD.w + 36 - spacing) {
    run.gates.push({
      x: last.x + spacing,
      gapY: nextGap(run, last.gapY, open),
      open,
      scored: false,
    });
  }
}

export function circleHits(
  cx: number,
  cy: number,
  r: number,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  if (w <= 0 || h <= 0) return false;
  const nx = clamp(cx, x, x + w);
  const ny = clamp(cy, y, y + h);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < r * r;
}

export function hits(run: Run): boolean {
  const y = run.bird.y;
  const r = WORLD.hitR;
  if (y + r >= groundY()) return true;
  const x = WORLD.birdX;
  for (const gate of run.gates) {
    const openTop = gate.gapY - gate.open / 2;
    const openBot = gate.gapY + gate.open / 2;
    if (circleHits(x, y, r, gate.x, -400, WORLD.pipeW, openTop + 400)) return true;
    if (circleHits(x, y, r, gate.x, openBot, WORLD.pipeW, 4000)) return true;
  }
  return false;
}

export function flap(run: Run): boolean {
  if (run.phase === 'dying' || run.phase === 'snatched' || run.phase === 'over') return false;
  if (run.phase === 'ready') {
    run.phase = 'play';
    run.snatchAt = planSnatch(run.seed);
  }
  run.taps += 1;
  run.bird.vy = WORLD.flap;
  run.bird.rot = Math.min(run.bird.rot, -0.25);
  run.sinceFlap = 0;
  return true;
}

function integrate(run: Run, dt: number): void {
  run.bird.vy = Math.min(WORLD.maxFall, run.bird.vy + WORLD.gravity * dt);
  run.bird.y += run.bird.vy * dt;
  if (run.bird.y < -28) {
    run.bird.y = -28;
    if (run.bird.vy < 0) run.bird.vy = 0;
  }
  const target = clamp(run.bird.vy / 640, -0.6, 1.25);
  const rate = run.bird.vy < 0 ? 16 : 8;
  run.bird.rot += (target - run.bird.rot) * Math.min(1, dt * rate);
}

export function step(run: Run, dt: number): void {
  dt = clamp(dt, 0, 0.05);
  run.shake = Math.max(0, run.shake - dt);

  if (run.phase === 'ready') {
    run.time += dt;
    run.scroll += WORLD.scroll * 0.35 * dt;
    run.bird.y = WORLD.readyY + Math.sin(run.time * 2.6) * 7;
    run.bird.vy = 0;
    run.bird.rot = Math.sin(run.time * 2.6) * 0.06;
    return;
  }

  if (run.phase === 'dying') {
    run.time += dt;
    run.sinceFlap += dt;
    run.bird.vy = Math.min(WORLD.maxFall, run.bird.vy + WORLD.gravity * dt);
    run.bird.y += run.bird.vy * dt;
    run.bird.rot += (1.45 - run.bird.rot) * Math.min(1, dt * 6);
    if (run.bird.y >= restY()) {
      run.bird.y = restY();
      run.bird.vy = 0;
      run.phase = 'over';
    }
    return;
  }

  if (run.phase === 'snatched') {
    run.time += dt;
    run.snatchTime += dt;
    const pose = snatchPose(run.snatchTime, run.caughtY, 560);
    run.bird.y = pose.birdY;
    run.bird.vy = 0;
    const tilt = pose.grabbed ? 0.65 : 0.1;
    run.bird.rot += (tilt - run.bird.rot) * Math.min(1, dt * 8);
    if (run.snatchTime >= SNATCH_DURATION) {
      run.phase = 'over';
      run.bird.y = -800;
      run.bird.vy = 0;
    }
    return;
  }

  if (run.phase === 'over') return;

  run.time += dt;
  run.playTime += dt;
  run.sinceFlap += dt;
  run.scroll += WORLD.scroll * dt;
  integrate(run, dt);
  for (const gate of run.gates) gate.x -= WORLD.scroll * dt;
  run.gates = run.gates.filter((gate) => gate.x + WORLD.pipeW > -80);
  spawn(run);

  if (run.score >= SNATCH_PIPE_LIMIT) run.snatchAt = null;
  if (run.snatchAt != null && run.playTime >= run.snatchAt && run.score < SNATCH_PIPE_LIMIT) {
    run.phase = 'snatched';
    run.snatchTime = 0;
    run.caughtY = run.bird.y;
    run.bird.vy = 0;
    run.shake = 0.28;
    return;
  }

  if (hits(run)) {
    run.phase = 'dying';
    run.bird.vy = Math.min(run.bird.vy, -240);
    run.shake = 0.32;
    if (run.bird.y > restY()) run.bird.y = restY();
    return;
  }

  for (const gate of run.gates) {
    if (!gate.scored && gate.x + WORLD.pipeW < WORLD.birdX) {
      gate.scored = true;
      run.score += 1;
    }
  }
  if (run.score >= SNATCH_PIPE_LIMIT) run.snatchAt = null;
}
