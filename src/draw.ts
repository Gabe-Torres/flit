import { Application, Container, Graphics, Text } from 'pixi.js';
import { drawSpecies, type BirdId } from './birds.ts';
import type { ControlHints } from './controls.ts';
import { fieldName } from './holiday.ts';
import { WORLD, flightFacts, groundY, snatchPose, type Run } from './sim.ts';
import { drawThemedGate, type ThemeId } from './themes.ts';
import { terrainFor, weatherById } from './weather.ts';
import { drawAtmosphere, drawClouds, drawSeason, drawSky, drawTornado } from './weather-draw.ts';

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
  bird: BirdId;
  controls: ControlHints;
  theme: ThemeId;
};

export type Stage = {
  render: (state: RenderState) => void;
  resize: () => void;
};

type Box = { left: number; top: number; right: number; bottom: number };

const INK = 0x2b2118;
const CREAM = 0xfffdf6;

function outlined(text: string, size: number, fill: number, stroke = INK): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: '"Lilita One", Nunito, ui-rounded, sans-serif',
      fontSize: size,
      fill,
      stroke: { color: stroke, width: Math.max(4, size / 9) },
      align: 'center',
      padding: Math.ceil(size / 6),
    },
  });
  label.anchor.set(0.5);
  return label;
}

function plain(text: string, size: number, fill: number): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: 'Nunito, ui-rounded, "Trebuchet MS", sans-serif',
      fontWeight: '800',
      fontSize: size,
      fill,
      align: 'center',
    },
  });
  label.anchor.set(0.5);
  return label;
}

function hill(
  g: Graphics,
  base: number,
  color: number,
  amp: number,
  period: number,
  scroll: number,
  left: number,
  right: number,
  floor: number,
): void {
  const points: number[] = [left, floor];
  for (let x = left; x <= right; x += 8) {
    points.push(x, base + Math.sin((x + scroll) / period) * amp);
  }
  points.push(right, floor);
  g.poly(points, true).fill(color);
}

function star(g: Graphics, x: number, y: number, r: number, color: number): void {
  const points: number[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  g.poly(points, true).fill(color);
}

function medalFor(score: number): { name: string; fill: number; rim: number } | null {
  if (score >= 100) return { name: 'ruby', fill: 0xe85d75, rim: 0x9d2944 };
  if (score >= 70) return { name: 'silver', fill: 0xd5dbe3, rim: 0x7d8794 };
  if (score >= 30) return { name: 'bronze', fill: 0xe0a36a, rim: 0x8a5a32 };
  return null;
}

function drawRubyMedal(g: Graphics, x: number, y: number): void {
  const s = 3.7;
  const cut = [
    x,
    y - 8 * s,
    x + 5.5 * s,
    y - 2 * s,
    x + 3.2 * s,
    y + 5 * s,
    x - 3.2 * s,
    y + 5 * s,
    x - 5.5 * s,
    y - 2 * s,
  ];
  g.poly(cut, true).fill(0xe85d75);
  g.poly([x, y - 8 * s, x - 5.5 * s, y - 2 * s, x - 3.2 * s, y + 5 * s, x, y + 1.4 * s], true).fill(0x9d2944);
  g.poly([x, y - 8 * s, x + 5.5 * s, y - 2 * s, x + 2.4 * s, y + 0.6 * s, x, y - 1.2 * s], true).fill(0xff8fa6);
  g.poly([x, y + 1.4 * s, x + 3.2 * s, y + 5 * s, x - 3.2 * s, y + 5 * s], true).fill(0xb1334c);
  g.poly([x - 0.4 * s, y - 6.6 * s, x + 2.3 * s, y - 2.4 * s, x + 0.2 * s, y - 1.2 * s], true).fill({
    color: 0xfffdf6,
    alpha: 0.92,
  });
  g.poly(cut, true).stroke({ width: 3, color: 0x9d2944, join: 'round' });
  star(g, x + 6.4 * s, y - 9.2 * s, 3.4, 0xfffdf6);
}

function fit(cssW: number, cssH: number): { scale: number; ox: number; oy: number; box: Box } {
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
  return {
    scale,
    ox,
    oy,
    box: {
      left: -ox / scale,
      top: -oy / scale,
      right: -ox / scale + cssW / scale,
      bottom: -oy / scale + cssH / scale,
    },
  };
}

export async function createStage(canvas: HTMLCanvasElement): Promise<Stage> {
  const app = new Application();
  await app.init({
    canvas,
    resizeTo: window,
    autoDensity: true,
    antialias: true,
    autoStart: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    background: 0x67c4f6,
  });
  app.stage.eventMode = 'none';

  const world = new Container();
  const ui = new Container();
  const sky = new Graphics();
  const scenery = new Graphics();
  const gateLayer = new Graphics();
  const ground = new Graphics();
  const atmosphere = new Graphics();
  const fx = new Graphics();
  const dino = new Graphics();
  const bird = new Container();
  const wing = new Graphics();
  const body = new Graphics();
  const uiGfx = new Graphics();
  bird.addChild(wing, body);
  world.addChild(sky, scenery, gateLayer, ground, atmosphere, fx, bird, dino);

  const title = outlined('FLIT', 92, CREAM);
  const flyHint = plain('tap to fly', 26, INK);
  const bestHint = plain('', 20, 0x6d5848);
  const scoreText = outlined('0', 64, CREAM);
  const pauseTitle = outlined('PAUSED', 40, CREAM);
  const pauseHint = plain('tap to resume', 20, 0x6d5848);
  const overTitle = outlined('GAME OVER', 36, 0xef5d4a);
  const medalName = plain('', 16, 0x6d5848);
  const overScore = outlined('0', 54, INK, CREAM);
  const overBest = plain('', 22, 0x6d5848);
  const overStats = plain('', 18, 0x6d5848);
  overStats.style.lineHeight = 26;
  const retry = plain('tap to try again', 18, 0x8a7362);
  const weatherLabel = outlined('', 22, CREAM);
  ui.addChild(
    uiGfx,
    title,
    flyHint,
    bestHint,
    scoreText,
    pauseTitle,
    pauseHint,
    overTitle,
    medalName,
    overScore,
    overBest,
    overStats,
    retry,
    weatherLabel,
  );
  app.stage.addChild(world, ui);

  const render = (state: RenderState): void => {
    const cssW = Math.max(1, app.screen.width);
    const cssH = Math.max(1, app.screen.height);
    const { scale, ox, oy, box } = fit(cssW, cssH);
    const floor = groundY();
    const { run } = state;
    const mag = state.reduceMotion || run.shake <= 0 ? 0 : 8 * (run.shake / 0.32);
    world.position.set(ox + (Math.random() - 0.5) * 2 * mag, oy + (Math.random() - 0.5) * 2 * mag);
    world.scale.set(scale);
    ui.position.set(ox, oy);
    ui.scale.set(scale);

    sky.clear();
    scenery.clear();
    gateLayer.clear();
    ground.clear();
    atmosphere.clear();
    fx.clear();
    uiGfx.clear();
    const weather = run.weather;
    const season = run.season;
    const holiday = run.holiday;
    const land = terrainFor(weather, season, holiday);
    drawSky(sky, weather, season, holiday, box, floor);
    drawClouds(scenery, weather, run.scroll, box);
    hill(scenery, floor - 78, land.hillFar, 16, 90, run.scroll * 0.35, box.left, box.right, floor);
    hill(scenery, floor - 36, land.hillNear, 12, 54, run.scroll * 0.55, box.left, box.right, floor);
    drawSeason(scenery, season, holiday, weather, run.time, run.scroll, box, floor, state.reduceMotion);
    drawTornado(scenery, weather, run.time, box, floor);
    const themeTime = state.reduceMotion ? 0 : run.time;
    if (run.phase === 'ready') drawThemedGate(gateLayer, state.theme, 326, 300, 156, box.top, floor, themeTime);
    for (const gate of run.gates) {
      drawThemedGate(gateLayer, state.theme, gate.x, gate.gapY, gate.open, box.top, floor, themeTime);
    }
    drawGround(ground, run, box, floor, land);
    drawAtmosphere(atmosphere, weather, run.time, run.scroll, box, floor, state.reduceMotion);

    const altitude = Math.max(0, floor - run.bird.y);
    fx.ellipse(WORLD.birdX, floor - 2, Math.max(8, 20 - altitude * 0.03), 5).fill({ color: 0x462e16, alpha: 0.18 });
    for (const p of state.particles) {
      fx.circle(p.x, p.y, p.r).fill({ color: p.color, alpha: Math.max(0, p.life / p.max) });
    }

    dino.clear();
    const carried = run.phase === 'snatched';
    bird.visible = !(run.phase === 'over' && run.snatchTime >= 0);
    bird.scale.set(1 + state.squash * 0.12, 1 - state.squash * 0.16);
    if (carried) {
      const pose = snatchPose(run.snatchTime, run.caughtY, box.right + 130);
      dino.position.set(pose.dinoX, pose.dinoY);
      drawPterodactyl(dino, pose.wing, pose.grabbed);
      bird.position.set(pose.birdX, pose.birdY);
      bird.rotation = pose.grabbed ? 0.7 : run.bird.rot;
    } else {
      dino.position.set(0, 0);
      bird.position.set(WORLD.birdX, run.bird.y);
      bird.rotation = run.bird.rot;
    }
    drawSpecies(body, wing, state.wing, state.bird);

    drawUi(uiGfx, state, box, {
      title,
      flyHint,
      bestHint,
      scoreText,
      pauseTitle,
      pauseHint,
      overTitle,
      medalName,
      overScore,
      overBest,
      overStats,
      retry,
      weatherLabel,
    });
    app.render();
  };

  return {
    render,
    resize: () => app.resize(),
  };
}

function drawGround(
  g: Graphics,
  run: Run,
  box: Box,
  floor: number,
  land: { dirt: number; grass: number; grassDark: number; tuft: number; lean: number },
): void {
  g.rect(box.left, floor, box.right - box.left, Math.max(4, box.bottom - floor + 4)).fill(land.dirt);
  g.rect(box.left, floor, box.right - box.left, 18).fill(land.grass);
  g.rect(box.left, floor + 16, box.right - box.left, 7).fill(land.grassDark);

  const tuft = 18;
  for (let x = box.left - (run.scroll % tuft) - tuft; x < box.right; x += tuft) {
    g.poly([x, floor + 2, x + 5 + land.lean, floor - 8, x + 10, floor + 2], true).fill(land.tuft);
  }

  const stone = 42;
  const first = Math.floor((box.left + run.scroll) / stone) - 1;
  const last = Math.floor((box.right + run.scroll) / stone) + 1;
  for (let i = first; i <= last; i++) {
    const n = Math.sin(i * 12.9898) * 43758.5453;
    if (n - Math.floor(n) < 0.62) continue;
    const x = i * stone - run.scroll;
    g.rect(x, floor + 36 + (i % 3) * 8, 8 + (i % 4) * 3, 4).fill({ color: 0x965a24, alpha: 0.28 });
  }

  const gem = 96;
  const gemFirst = Math.floor((box.left + run.scroll) / gem) - 1;
  const gemLast = Math.floor((box.right + run.scroll) / gem) + 1;
  for (let i = gemFirst; i <= gemLast; i++) {
    const roll = hashUnit(i);
    if (roll < 0.62) continue;
    const x = i * gem - run.scroll + 22;
    const depth = 28 + hashUnit(i + 101) * 42;
    const big = roll > 0.93;
    const scale = big ? 1.55 : roll > 0.82 ? 1.15 : 0.95;
    const sparkle = big ? 0.55 + 0.45 * Math.sin(run.time * 4 + i) : 0;
    const y = floor + depth;
    drawBuriedRuby(g, x, y, scale, land.dirt, sparkle);
    if (!big) continue;
    g.moveTo(x - 9, y - 22)
      .lineTo(x + 9, y - 12)
      .stroke({ width: 2.2, color: 0x6a3d16, cap: 'round' });
    g.moveTo(x - 9, y - 12)
      .lineTo(x + 9, y - 22)
      .stroke({ width: 2.2, color: 0x8a5a32, cap: 'round' });
  }
}

function hashUnit(i: number): number {
  let n = Math.imul(i | 0, 0x45d9f3b) >>> 0;
  n = ((n >>> 16) ^ n) >>> 0;
  n = Math.imul(n, 0x45d9f3b) >>> 0;
  n = ((n >>> 16) ^ n) >>> 0;
  return n / 4294967296;
}

function drawBuriedRuby(g: Graphics, x: number, y: number, scale: number, dirt: number, sparkle: number): void {
  const s = scale;
  g.ellipse(x, y + 4 * s, 13 * s, 5 * s).fill({ color: 0x6a3d16, alpha: 0.22 });
  g.poly(
    [x, y - 8 * s, x + 5.5 * s, y - 2 * s, x + 3.2 * s, y + 5 * s, x - 3.2 * s, y + 5 * s, x - 5.5 * s, y - 2 * s],
    true,
  )
    .fill(0xe85d75)
    .stroke({ width: 1.6, color: 0x9d2944 });
  g.poly([x, y - 7 * s, x + 2.4 * s, y - 2 * s, x, y + 0.4 * s], true).fill({ color: 0xfff4f6, alpha: 0.82 });
  g.ellipse(x, y + 6 * s, 12 * s, 3.4 * s).fill(dirt);
  if (sparkle > 0.35) star(g, x + 7 * s, y - 10 * s, 2.4 + sparkle * 1.6, 0xfffdf6);
}

function drawPterodactyl(g: Graphics, flap: number, grabbed: boolean): void {
  const out = { width: 2.6, color: 0x6a3d16, join: 'round' as const, cap: 'round' as const };
  const lift = flap * 36;
  g.poly([12, -8, 92, -58 - lift * 0.8, 118, -6 - lift * 0.15, 28, 10], true).fill(0x8a4b2a).stroke(out);
  g.poly([-10, -10, -86, -70 + lift, -128, -2 + lift * 0.12, -18, 12], true).fill(0xb56538).stroke(out);
  g.moveTo(-8, -8)
    .lineTo(-84, -60 + lift)
    .stroke({ width: 5, color: 0x6b3a22, cap: 'round' });
  g.circle(-84, -60 + lift, 3.4).fill(0xf2c14b);
  g.ellipse(2, 2, 32, 14).fill(0xd4843f).stroke(out);
  g.ellipse(8, 8, 17, 7).fill(0xf6d7a2);
  g.poly([26, -2, 50, -14, 44, 10], true).fill(0xc47a3a).stroke(out);
  g.moveTo(-20, -2)
    .quadraticCurveTo(-36, -18, -48, -8)
    .stroke({ width: 10, color: 0x6a3d16, cap: 'round' });
  g.moveTo(-20, -2)
    .quadraticCurveTo(-36, -18, -48, -8)
    .stroke({ width: 6, color: 0xd4843f, cap: 'round' });
  g.circle(-50, -10, 10).fill(0xd4843f).stroke(out);
  g.poly([-48, -16, -32, -42, -38, -10], true).fill(0xe15a42).stroke(out);
  g.poly([-56, -12, -96, -4, -56, -2], true).fill(0xf2c14b).stroke(out);
  g.poly([-56, -1, -84, 4, -56, 6], true).fill(0xe7a23a).stroke(out);
  g.circle(-52, -13, 3.2).fill(0xfffdf6).stroke({ width: 1.6, color: 0x6a3d16 });
  g.circle(-53.2, -13, 1.5).fill(0x2b2118);
  const footY = grabbed ? 34 : 20;
  g.moveTo(-8, 12)
    .lineTo(-12, footY)
    .stroke({ width: 3.4, color: 0x6b3a22, cap: 'round' });
  g.moveTo(10, 12)
    .lineTo(6, footY + 2)
    .stroke({ width: 3.4, color: 0x6b3a22, cap: 'round' });
  const claws = (x: number, y: number) => {
    g.moveTo(x, y)
      .lineTo(x - 11, y + 8)
      .stroke({ width: 2.7, color: 0x4a2a14, cap: 'round' });
    g.moveTo(x, y)
      .lineTo(x + 1, y + 10)
      .stroke({ width: 2.7, color: 0x4a2a14, cap: 'round' });
    g.moveTo(x, y)
      .lineTo(x + 10, y + 5)
      .stroke({ width: 2.7, color: 0x4a2a14, cap: 'round' });
  };
  claws(-12, footY);
  claws(6, footY + 2);
}

type Labels = {
  title: Text;
  flyHint: Text;
  bestHint: Text;
  scoreText: Text;
  pauseTitle: Text;
  pauseHint: Text;
  overTitle: Text;
  medalName: Text;
  overScore: Text;
  overBest: Text;
  overStats: Text;
  retry: Text;
  weatherLabel: Text;
};

function card(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.roundRect(x + 4, y + 6, w, h, 24).fill({ color: INK, alpha: 0.16 });
  g.roundRect(x, y, w, h, 24).fill(0xfff8ea).stroke({ width: 4, color: INK });
}

function drawUi(g: Graphics, state: RenderState, box: Box, labels: Labels): void {
  const { run } = state;
  const cx = WORLD.w / 2;
  const ready = run.phase === 'ready';
  const playing = run.phase === 'play' || run.phase === 'dying' || run.phase === 'snatched';
  const over = run.phase === 'over';
  const wide = box.right - box.left;
  const tall = box.bottom - box.top;

  labels.title.visible = ready;
  labels.flyHint.visible = ready;
  labels.bestHint.visible = ready && state.best > 0;
  labels.scoreText.visible = playing;
  labels.pauseTitle.visible = state.paused;
  labels.pauseHint.visible = state.paused;
  labels.overTitle.visible = over;
  labels.medalName.visible = false;
  labels.overScore.visible = over;
  labels.overBest.visible = over;
  labels.overStats.visible = over;
  labels.retry.visible = over;
  const controls = state.controls;
  labels.flyHint.text = controls.fly;
  labels.flyHint.style.fontSize = controls.touch ? 26 : 22;
  labels.pauseHint.text = controls.resume;
  labels.pauseHint.style.fontSize = controls.touch ? 20 : 18;
  labels.retry.text = controls.retry;
  labels.retry.style.fontSize = controls.touch ? 18 : 16;
  labels.weatherLabel.visible = true;
  const skyLine = `${fieldName(run.season, run.holiday)}  ·  ${weatherById(run.weather).name}`;
  const reserve = 116;
  const edge = box.right - reserve;
  labels.weatherLabel.text = skyLine;
  let skySize = 22;
  labels.weatherLabel.style.fontSize = skySize;
  const room = Math.max(120, edge - box.left - 16);
  while (skySize > 14 && labels.weatherLabel.width > room) {
    skySize -= 1;
    labels.weatherLabel.style.fontSize = skySize;
  }
  const half = labels.weatherLabel.width / 2;
  const mid = (box.left + box.right) / 2;
  labels.weatherLabel.position.set(Math.min(mid, edge - half), box.top + 30);

  if (ready) {
    labels.title.position.set(cx, 128);
    labels.flyHint.position.set(cx, 214);
    labels.flyHint.alpha = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(run.time * 3));
    if (state.best > 0) {
      labels.bestHint.text = `best ${state.best}`;
      labels.bestHint.position.set(cx, 256);
    }
  }

  if (playing) {
    const pop = 1 + state.pop * 0.35;
    labels.scoreText.text = String(run.score);
    labels.scoreText.position.set(cx, 74);
    labels.scoreText.scale.set(pop);
  }

  if (run.shake > 0) {
    g.rect(box.left, box.top, wide, tall).fill({ color: 0xffffff, alpha: run.shake * 0.45 });
  }

  if (state.paused) {
    g.rect(box.left, box.top, wide, tall).fill({ color: 0x14283c, alpha: 0.28 });
    const cardW = state.controls.touch ? 250 : 330;
    const cardH = 112;
    const cardX = (WORLD.w - cardW) / 2;
    const cardY = 132;
    g.roundRect(cardX, cardY, cardW, cardH, 20).fill(0xfff8ea).stroke({ width: 4, color: INK });
    labels.pauseTitle.position.set(cx, cardY + 40);
    labels.pauseHint.position.set(cx, cardY + 80);
  }

  if (!over) return;

  g.rect(box.left, box.top, wide, tall).fill({ color: 0x14283c, alpha: 0.28 });
  const award = medalFor(run.score);
  const cardW = 304;
  const cardH = award ? 388 : 300;
  const x = (WORLD.w - cardW) / 2;
  const y = award ? 48 : 124;
  card(g, x, y, cardW, cardH);
  labels.overTitle.text = run.snatchTime >= 0 ? 'SNATCHED' : 'GAME OVER';
  labels.overTitle.position.set(cx, y + 42);
  if (award) {
    if (award.name === 'ruby') drawRubyMedal(g, cx, y + 116);
    else {
      g.circle(cx, y + 112, 28).fill(award.rim);
      g.circle(cx, y + 112, 22).fill(award.fill);
      star(g, cx, y + 110, 12, CREAM);
    }
    labels.medalName.visible = true;
    labels.medalName.text = award.name;
    labels.medalName.position.set(cx, y + 152);
  }
  const scoreY = award ? y + 200 : y + 108;
  labels.overScore.text = String(run.score);
  labels.overScore.position.set(cx, scoreY);
  labels.overBest.text = `BEST  ${state.best}`;
  labels.overBest.position.set(cx, scoreY + 50);
  const facts = flightFacts(run);
  labels.overStats.text = `${facts.taps}  ·  ${facts.pipes}\n${facts.seconds}`;
  labels.overStats.position.set(cx, scoreY + 100);
  labels.retry.position.set(cx, y + cardH - 30);
}
