import { createAudio } from './audio.ts';
import { createStage, type Particle, type Stage } from './draw.ts';
import { WORLD, createRun, flap, step, type Run } from './sim.ts';

const canvas = document.querySelector<HTMLCanvasElement>('#view');
const statusEl = document.querySelector<HTMLElement>('#status');
const pauseQuery = document.querySelector<HTMLButtonElement>('#pause');
const muteQuery = document.querySelector<HTMLButtonElement>('#mute');
if (!canvas || !statusEl || !pauseQuery || !muteQuery) {
  throw new Error('Flit is missing a page element');
}
const view = canvas;
const statusNode = statusEl;
const pauseBtn = pauseQuery;
const muteBtn = muteQuery;

const audio = createAudio();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let run: Run = createRun(mixSeed());
let best = readNumber('flit-best');
let paused = false;
let wing = 0;
let pop = 0;
let squash = 0;
let particles: Particle[] = [];
let lastStatus = '';
let stage: Stage | null = null;

function mixSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0 || 1;
}

function readNumber(key: string): number {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore storage failures. The score still shows for this visit.
  }
}

function paintMute(): void {
  const muted = audio.muted();
  muteBtn.classList.toggle('is-muted', muted);
  muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
}

function paintPause(): void {
  pauseBtn.classList.toggle('is-paused', paused);
  pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
  pauseBtn.setAttribute('aria-label', paused ? 'Resume' : 'Pause');
}

function setStatus(text: string): void {
  if (text === lastStatus) return;
  lastStatus = text;
  statusNode.textContent = text;
}

function describe(): void {
  if (paused) {
    setStatus(`Paused. Score ${run.score}.`);
    return;
  }
  if (run.phase === 'ready') {
    setStatus(best > 0 ? `Flit. Tap to fly. Best ${best}.` : 'Flit. Tap to fly.');
    return;
  }
  if (run.phase === 'over') {
    setStatus(`Game over. Score ${run.score}. Best ${best}.`);
    return;
  }
  setStatus(`Score ${run.score}.`);
}

function puff(count: number, life: number, spread: number): void {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: WORLD.birdX - 6,
      y: run.bird.y,
      vx: -30 - Math.random() * spread,
      vy: (Math.random() - 0.4) * spread,
      life,
      max: life,
      r: 2.5 + Math.random() * 2.5,
      color: Math.random() > 0.4 ? '#ffe08a' : '#fffdf6',
    });
  }
}

function resetRun(andFly: boolean): void {
  run = createRun(mixSeed());
  particles = [];
  pop = 0;
  squash = 0;
  paused = false;
  paintPause();
  if (!andFly) {
    describe();
    return;
  }
  flap(run);
  squash = 1;
  audio.unlock();
  audio.flap();
  puff(5, 0.35, 90);
  describe();
}

function onFly(): void {
  audio.unlock();
  if (paused) {
    paused = false;
    paintPause();
    describe();
    return;
  }
  if (run.phase === 'over') {
    resetRun(true);
    return;
  }
  if (!flap(run)) return;
  squash = 1;
  audio.flap();
  puff(5, 0.32, 80);
  describe();
}

function togglePause(): void {
  if (run.phase !== 'play' && !paused) return;
  paused = !paused;
  paintPause();
  describe();
}

function toggleMute(): void {
  audio.toggle();
  paintMute();
}

function fromButton(event: Event): boolean {
  return event.composedPath().some((node) => node instanceof HTMLButtonElement);
}

function resize(): void {
  stage?.resize();
}

window.addEventListener('pointerdown', (event) => {
  if (fromButton(event)) return;
  event.preventDefault();
  onFly();
});

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
    event.preventDefault();
    onFly();
    return;
  }
  if (event.code === 'KeyP') {
    event.preventDefault();
    togglePause();
    return;
  }
  if (event.code === 'KeyM') {
    event.preventDefault();
    toggleMute();
    return;
  }
  if (event.code === 'KeyR') {
    event.preventDefault();
    resetRun(false);
  }
});

pauseBtn.addEventListener('click', togglePause);
muteBtn.addEventListener('click', toggleMute);
window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
window.addEventListener('contextmenu', (event) => event.preventDefault());

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // The game still runs if the worker cannot install.
    });
  });
}

paintMute();
paintPause();
resize();
describe();

if (import.meta.env.DEV) {
  Object.assign(window, {
    __flit: {
      get run() {
        return run;
      },
      get best() {
        return best;
      },
      fly: onFly,
      reset: () => resetRun(false),
    },
  });
}

let last = performance.now();

function frame(now: number): void {
  const dt = Math.min(0.034, Math.max(0, (now - last) / 1000));
  last = now;
  const phase = run.phase;
  const score = run.score;
  const scrolled = run.scroll;

  if (!paused) step(run, dt);

  const moved = run.scroll - scrolled;
  if (run.phase === 'dying' && phase !== 'dying') {
    audio.hit();
    puff(14, 0.5, 160);
  }
  if (run.score !== score) {
    audio.score();
    pop = 1;
    puff(6, 0.28, 50);
  }
  if (run.phase === 'over' && phase !== 'over' && run.score > best) {
    best = run.score;
    writeNumber('flit-best', best);
  }

  if (!paused) {
    const boost = Math.max(0, 1 - run.sinceFlap / 0.28);
    wing += dt * ((run.phase === 'ready' ? 6 : 8) + boost * 26);
    squash = Math.max(0, squash - dt * 3.2);
    pop = Math.max(0, pop - dt * 2.5);
    for (const p of particles) {
      p.life -= dt;
      p.vy += 260 * dt;
      p.x += p.vx * dt - moved;
      p.y += p.vy * dt;
    }
    if (particles.length > 64) particles.splice(0, particles.length - 64);
    particles = particles.filter((p) => p.life > 0);
  }

  describe();
  stage?.render({
    run,
    best,
    paused,
    wing,
    pop,
    squash,
    reduceMotion,
    particles,
  });
  requestAnimationFrame(frame);
}

let started = false;
async function start(): Promise<void> {
  if (started) return;
  started = true;
  stage = await createStage(view);
  last = performance.now();
  requestAnimationFrame(frame);
}

void Promise.race([
  document.fonts.ready,
  new Promise((resolve) => window.setTimeout(resolve, 700)),
]).then(() => start());
