import { createAudio } from './audio.ts';
import { BIRDS, birdById, isBirdId, type BirdId } from './birds.ts';
import { createStage, type Particle, type Stage } from './draw.ts';
import { WORLD, createRun, flap, step, type Run } from './sim.ts';
import { weatherById } from './weather.ts';

const canvas = document.querySelector<HTMLCanvasElement>('#view');
const statusEl = document.querySelector<HTMLElement>('#status');
const pauseQuery = document.querySelector<HTMLButtonElement>('#pause');
const muteQuery = document.querySelector<HTMLButtonElement>('#mute');
const rosterQuery = document.querySelector<HTMLElement>('#roster');
const birdNameQuery = document.querySelector<HTMLElement>('#bird-name');
const birdsQuery = document.querySelector<HTMLElement>('#birds');
if (!canvas || !statusEl || !pauseQuery || !muteQuery || !rosterQuery || !birdNameQuery || !birdsQuery) {
  throw new Error('Flit is missing a page element');
}
const view = canvas;
const statusNode = statusEl;
const pauseBtn = pauseQuery;
const muteBtn = muteQuery;
const roster = rosterQuery;
const birdNameEl = birdNameQuery;
const birdsEl = birdsQuery;

const audio = createAudio();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let run: Run = createRun(mixSeed());
let best = readNumber('flit-best');
let birdId = readBird();
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

function readBird(): BirdId {
  try {
    const saved = localStorage.getItem('flit-bird');
    if (saved && isBirdId(saved)) return saved;
  } catch {
    // Storage can be blocked. The finch is the default.
  }
  return 'finch';
}

function writeBird(id: BirdId): void {
  try {
    localStorage.setItem('flit-bird', id);
  } catch {
    // The choice still lasts for this visit.
  }
}

function paintForecast(): void {
  const text = `${birdById(birdId).name} · ${weatherById(run.weather).name}`;
  if (birdNameEl.textContent !== text) birdNameEl.textContent = text;
}

function paintBird(): void {
  paintForecast();
  for (const button of birdsEl.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', button.dataset.bird === birdId ? 'true' : 'false');
  }
}

function chooseBird(id: BirdId): void {
  if (id === birdId) return;
  birdId = id;
  writeBird(id);
  paintBird();
  describe();
}

function paintRoster(): void {
  const open = run.phase === 'ready' || run.phase === 'over';
  roster.classList.toggle('is-hidden', !open);
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
  const sky = weatherById(run.weather).name;
  if (paused) {
    setStatus(`Paused. Score ${run.score}. ${sky}.`);
    return;
  }
  if (run.phase === 'ready') {
    const name = birdById(birdId).name;
    setStatus(
      best > 0 ? `Flit. ${name}. ${sky}. Tap to fly. Best ${best}.` : `Flit. ${name}. ${sky}. Tap to fly.`,
    );
    return;
  }
  if (run.phase === 'over') {
    setStatus(`Game over. Score ${run.score}. Best ${best}. ${sky}.`);
    return;
  }
  setStatus(`Score ${run.score}. ${sky}.`);
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
      color: Math.random() > 0.4 ? birdById(birdId).feather : '#fffdf6',
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

function fromRoster(event: Event): boolean {
  return event.composedPath().includes(roster);
}

function resize(): void {
  stage?.resize();
}

window.addEventListener('pointerdown', (event) => {
  if (fromButton(event) || fromRoster(event)) return;
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

for (const bird of BIRDS) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.bird = bird.id;
  button.setAttribute('aria-label', bird.name);
  button.innerHTML = bird.icon;
  button.addEventListener('click', () => chooseBird(bird.id));
  birdsEl.append(button);
}

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
paintBird();
paintRoster();
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
      get bird() {
        return birdId;
      },
      choose: chooseBird,
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
  paintForecast();
  paintRoster();
  stage?.render({
    run,
    best,
    paused,
    wing,
    pop,
    squash,
    reduceMotion,
    particles,
    bird: birdId,
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
