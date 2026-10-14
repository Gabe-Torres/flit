// Rules for Flit. The hit circle is smaller than the drawn bird so a
// near miss on the beak or the tail still counts as a pass.

import { holidayForDate, type HolidayId } from './holiday.ts';
import { seasonForDate, type SeasonId } from './season.ts';

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

export type PowerKind = 'slow' | 'fast';

export type Power = {
  kind: PowerKind;
  age: number;
  shots: number;
};

export type Pickup = {
  x: number;
  y: number;
  kind: PowerKind;
};

export type Cue = 'pickup';

// Test keeps the original gates. One power at a time: a new pickup replaces
// whatever you hold. Slow motion and fast motion wear off.
export const POWER_SECONDS = { slow: 6, fast: 3.5 } as const;
const POWER_KINDS: PowerKind[] = ['slow', 'fast'];
const PICKUP_REACH = 28;
const SLOW_PACE = 0.5;
const FAST_PACE = 1.65;

export type ModeId = 'easy' | 'normal' | 'hard' | 'test';

export const MODES: { id: ModeId; name: string }[] = [
  { id: 'easy', name: 'Easy' },
  { id: 'normal', name: 'Normal' },
  { id: 'hard', name: 'Hard' },
  { id: 'test', name: 'Test' },
];

export function isModeId(id: string): id is ModeId {
  return MODES.some((mode) => mode.id === id);
}

export type Run = {
  phase: Phase;
  bird: Bird;
  gates: Gate[];
  score: number;
  scroll: number;
  time: number;
  seed: number;
  origin: number;
  mode: ModeId;
  shake: number;
  sinceFlap: number;
  season: SeasonId;
  holiday: HolidayId | null;
  taps: number;
  playTime: number;
  snatchAt: number | null;
  snatchTime: number;
  caughtY: number;
  placed: number;
  power: Power | null;
  pickups: Pickup[];
  cues: Cue[];
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

export function createRun(seed = 1, mode: ModeId = 'easy'): Run {
  const safe = seed >>> 0 || 1;
  return {
    phase: 'ready',
    bird: { y: WORLD.readyY, vy: 0, rot: 0 },
    gates: [],
    score: 0,
    scroll: 0,
    time: 0,
    seed: safe,
    origin: safe,
    mode,
    shake: 0,
    sinceFlap: 10,
    season: seasonForDate(new Date()),
    holiday: holidayForDate(new Date()),
    taps: 0,
    playTime: 0,
    snatchAt: null,
    snatchTime: -1,
    caughtY: WORLD.readyY,
    placed: 0,
    power: null,
    pickups: [],
    cues: [],
  };
}

// One run in 100. 42949673 / 2^32 is the closest whole rate. A hit is timed
// after the first pipe clears and before pipe 25. Then the chance is gone.
export const SNATCH_CHANCE_NUMERATOR = Math.round(2 ** 32 / 100);
export const SNATCH_PIPE_LIMIT = 25;
export const SNATCH_APPROACH = 0.92;
export const SNATCH_CARRY = 1.28;
export const SNATCH_DURATION = SNATCH_APPROACH + SNATCH_CARRY;
const TALON_X = -6;
const TALON_Y = 40;

// Easy tightens every 5 pipes, by 30px of distance and 30px of opening.
// The floor is the original distance and opening. Normal stays on that floor.
// Hard stays on that floor or tighter, and its hole can sit anywhere.
const EASE_EVERY = 5;
const EASE_STEP = 30;
const EASE_STEPS = 4;
const HARD_SPACE = 64;
const HARD_OPEN = 48;

function easeLeft(cleared: number): number {
  const steps = Math.min(EASE_STEPS, Math.max(0, Math.floor(cleared / EASE_EVERY)));
  return (EASE_STEPS - steps) * EASE_STEP;
}

function roll(origin: number, index: number, salt: number): number {
  return mix(origin ^ Math.imul(index + 1, 0x9e3779b1) ^ salt) / 4294967296;
}

export function pipeSpacing(cleared: number, mode: ModeId = 'easy', origin = 1): number {
  if (mode === 'normal' || mode === 'test') return WORLD.spacing;
  if (mode === 'hard') return WORLD.spacing - roll(origin, cleared, 0x51a7c0de) * HARD_SPACE;
  return WORLD.spacing + easeLeft(cleared);
}

export function pipeOpening(cleared: number, mode: ModeId = 'easy', origin = 1): number {
  if (mode === 'normal' || mode === 'test') return WORLD.gap;
  if (mode === 'hard') return WORLD.gap - roll(origin, cleared, 0xc0ffee21) * HARD_OPEN;
  return WORLD.gap + easeLeft(cleared);
}

export function pipesClearTime(pipes = SNATCH_PIPE_LIMIT, mode: ModeId = 'easy', origin = 1): number {
  let travel = WORLD.firstX + WORLD.pipeW - WORLD.birdX;
  for (let i = 0; i < pipes - 1; i++) travel += pipeSpacing(i, mode, origin);
  return travel / WORLD.scroll;
}

function mix(n: number): number {
  let x = n >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

export function planSnatch(seed: number, mode: ModeId = 'easy'): number | null {
  if (mix(seed ^ 0xa5a5a5a5) >= SNATCH_CHANCE_NUMERATOR) return null;
  const earliest = pipesClearTime(1, mode, seed);
  const latest = pipesClearTime(SNATCH_PIPE_LIMIT, mode, seed);
  return earliest + (mix(seed ^ 0x3c6ef372) / 4294967296) * (latest - earliest);
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

export type MedalName = 'bronze' | 'silver' | 'ruby';

export function medalForScore(score: number): MedalName | null {
  if (score >= 100) return 'ruby';
  if (score >= 70) return 'silver';
  if (score >= 30) return 'bronze';
  return null;
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
  if (run.mode === 'hard') return raw;
  return clamp(raw, Math.max(min, around - WORLD.gapStep), Math.min(max, around + WORLD.gapStep));
}

function spawn(run: Run): void {
  const last = run.gates[run.gates.length - 1];
  // Hard gates vary in distance, so the roll follows how many have been placed.
  // Easy and normal still follow the cleared score.
  const slot = run.mode === 'hard' ? Math.max(0, run.placed - 1) : run.score;
  const open = pipeOpening(slot, run.mode, run.origin);
  if (!last) {
    run.gates.push({ x: WORLD.firstX, gapY: nextGap(run, WORLD.readyY, open), open, scored: false });
    run.placed += 1;
    return;
  }
  const spacing = pipeSpacing(slot, run.mode, run.origin);
  if (last.x <= WORLD.w + 36 - spacing) {
    const x = last.x + spacing;
    run.gates.push({
      x,
      gapY: nextGap(run, last.gapY, open),
      open,
      scored: false,
    });
    run.placed += 1;
    if (run.mode === 'test') fillGap(run, last.x, x);
  }
}

function fillGap(run: Run, left: number, right: number): void {
  if (run.placed % 2 !== 0) return;
  const mid = (left + right) / 2;
  const kind = POWER_KINDS[Math.floor(rand(run) * POWER_KINDS.length)];
  const top = 96;
  const bot = groundY() - 72;
  run.pickups.push({ x: mid, y: top + rand(run) * (bot - top), kind });
}

export function motionPace(run: Run): number {
  if (run.power?.kind === 'slow') return SLOW_PACE;
  if (run.power?.kind === 'fast') return FAST_PACE;
  return 1;
}

function grant(run: Run, kind: PowerKind): void {
  run.power = { kind, age: 0, shots: 0 };
  run.cues.push('pickup');
}

function expirePower(run: Run, dt: number): void {
  const power = run.power;
  if (!power) return;
  power.age += dt;
  if (power.age >= POWER_SECONDS[power.kind]) run.power = null;
}

function collectPickups(run: Run): void {
  const keep: Pickup[] = [];
  for (const pickup of run.pickups) {
    const dx = pickup.x - WORLD.birdX;
    const dy = pickup.y - run.bird.y;
    if (dx * dx + dy * dy <= PICKUP_REACH * PICKUP_REACH) grant(run, pickup.kind);
    else keep.push(pickup);
  }
  run.pickups = keep;
}

export function powerLabel(run: Run): string | null {
  const power = run.power;
  if (!power) return null;
  const left = Math.max(0, Math.ceil(POWER_SECONDS[power.kind] - power.age));
  const name = power.kind === 'slow' ? 'Slow' : 'Fast';
  return `${name} ${left}`;
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
    run.snatchAt = planSnatch(run.origin, run.mode);
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
  run.cues = [];
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
  const pace = motionPace(run);
  const travel = WORLD.scroll * pace * dt;
  run.scroll += travel;
  integrate(run, dt * pace);
  for (const gate of run.gates) gate.x -= travel;
  for (const pickup of run.pickups) pickup.x -= travel;
  run.gates = run.gates.filter((gate) => gate.x + WORLD.pipeW > -80);
  run.pickups = run.pickups.filter((pickup) => pickup.x > -80);
  spawn(run);
  expirePower(run, dt);
  collectPickups(run);

  if (run.score >= SNATCH_PIPE_LIMIT) run.snatchAt = null;
  // Scoring happens below, so a grab on the frame pipe 1 clears waits one step.
  if (run.snatchAt != null && run.playTime >= run.snatchAt && run.score >= 1 && run.score < SNATCH_PIPE_LIMIT) {
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
