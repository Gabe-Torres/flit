import { Application, Container, Graphics, Text } from 'pixi.js';
import { drawSpecies, type BirdId } from './birds.ts';
import type { ControlHints } from './controls.ts';
import { fieldName } from './holiday.ts';
import { WORLD, flightFacts, groundY, medalForScore, snatchPose, type MedalName, type Run } from './sim.ts';
import { drawThemedGate, type ThemeId } from './themes.ts';
import { terrainFor, weatherById } from './weather.ts';
import { drawAtmosphere, drawClouds, drawSeason, drawSky } from './weather-draw.ts';

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
  modeName: string;
  modeBest: number;
  // Tip joke. Null keeps the regular stats card. See src/tip-joke.ts.
  tipBeat: 'ask' | 'kidding' | null;
};

export type Stage = {
  render: (state: RenderState) => void;
  resize: () => void;
};

type Box = { left: number; top: number; right: number; bottom: number };

const INK = 0x2b2118;
const CREAM = 0xfffdf6;

function outlined(text: string, size: number, fill: number, stroke = INK, left = false): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: '"Lilita One", Nunito, ui-rounded, sans-serif',
      fontSize: size,
      fill,
      stroke: { color: stroke, width: Math.max(4, size / 9) },
      align: left ? 'left' : 'center',
      padding: Math.ceil(size / 6),
    },
  });
  label.anchor.set(left ? 0 : 0.5, left ? 0 : 0.5);
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

function ringBand(
  g: Graphics,
  x: number,
  y: number,
  inner: number,
  outer: number,
  colorAt: (mid: number) => number,
): void {
  const n = 28;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1.2) / n) * Math.PI * 2;
    const mid = (i + 0.5) / n * Math.PI * 2;
    g.poly(
      [
        x + Math.cos(a0) * inner,
        y + Math.sin(a0) * inner,
        x + Math.cos(a1) * inner,
        y + Math.sin(a1) * inner,
        x + Math.cos(a1) * outer,
        y + Math.sin(a1) * outer,
        x + Math.cos(a0) * outer,
        y + Math.sin(a0) * outer,
      ],
      true,
    ).fill(colorAt(mid));
  }
}

function drawStargate(g: Graphics, x: number, y: number, time: number): void {
  const spin = time * 1.8;
  const glow = 0.16 + Math.sin(time * 2.1) * 0.05;
  g.circle(x, y, 38).fill({ color: 0x7eb6ff, alpha: glow * 0.65 });
  g.circle(x, y, 30).fill({ color: 0xc5e4ff, alpha: glow });

  g.circle(x, y, 16.8).fill(0x0c2c52);
  g.circle(x, y, 14.6).fill(0x1864a4);
  for (let arm = 0; arm < 4; arm++) {
    const dir = arm % 2 === 0 ? 1 : -0.72;
    const base = spin * dir + (arm * Math.PI) / 2;
    for (let step = 0; step < 7; step++) {
      const t = step / 6;
      const a = base + t * 3.1;
      const rad = 1.2 + t * 12.4;
      const color = t < 0.3 ? 0xf4fbff : t < 0.65 ? 0x9ad4f6 : 0x3d92cc;
      g.circle(x + Math.cos(a) * rad, y + Math.sin(a) * rad, 3.15 * (1 - t * 0.5)).fill({
        color,
        alpha: 0.22 + (1 - t) * 0.55,
      });
    }
  }
  for (let i = 0; i < 8; i++) {
    const a = -spin * 1.6 + (i * Math.PI * 2) / 8;
    g.circle(x + Math.cos(a) * 12.4, y + Math.sin(a) * 12.4, i % 2 === 0 ? 1.15 : 0.7).fill({
      color: 0xf7fdff,
      alpha: 0.45 + (i % 2) * 0.4,
    });
  }
  for (let i = 0; i < 5; i++) {
    const a = spin * 1.35 + (i * Math.PI * 2) / 5;
    const rad = 6.2 + (i % 2) * 3.2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    const tangent = a + Math.PI / 2 + 0.45;
    const len = 3.8;
    const c = Math.cos(tangent);
    const s = Math.sin(tangent);
    g.poly(
      [px + c * len, py + s * len, px - s * 0.85, py + c * 0.85, px - c * len * 0.25, py - s * len * 0.25, px + s * 0.85, py - c * 0.85],
      true,
    ).fill({ color: 0xf7fdff, alpha: 0.78 });
  }
  const pulse = 4.4 + Math.sin(time * 3.2) * 0.75;
  g.circle(x, y, 7.4).fill({ color: 0xd6f2ff, alpha: 0.96 });
  g.circle(x, y, pulse).fill(0xffffff);
  g.circle(x - 1.5, y - 1.7, 1.45).fill({ color: 0xffffff, alpha: 0.95 });

  ringBand(g, x, y, 16.2, 18.2, () => 0x101820);
  ringBand(g, x, y, 18, 23.4, (mid) => {
    const light = Math.cos(mid - 2.2) * 0.5 + 0.5;
    if (light > 0.72) return 0xb7c6d4;
    if (light > 0.42) return 0x738494;
    return 0x3c4a58;
  });
  ringBand(g, x, y, 23.2, 25.6, (mid) => (Math.cos(mid - 2.2) > 0.35 ? 0x2a3440 : 0x161c24));

  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 9;
    const engaged = i === 0;
    const spread = 0.1;
    const outer = engaged ? 27.4 : 26.2;
    g.poly(
      [
        x + Math.cos(a - spread) * 19.2,
        y + Math.sin(a - spread) * 19.2,
        x + Math.cos(a + spread) * 19.2,
        y + Math.sin(a + spread) * 19.2,
        x + Math.cos(a + spread * 0.45) * outer,
        y + Math.sin(a + spread * 0.45) * outer,
        x + Math.cos(a - spread * 0.45) * outer,
        y + Math.sin(a - spread * 0.45) * outer,
      ],
      true,
    ).fill(engaged ? 0xe7f2fb : 0x9aabba);
    const lx = x + Math.cos(a) * 22.3;
    const ly = y + Math.sin(a) * 22.3;
    if (engaged) g.circle(lx, ly, 3.4).fill({ color: 0x9fd4ff, alpha: 0.7 });
    g.circle(lx, ly, engaged ? 1.85 : 1.4).fill(0xffffff);
    g.circle(lx - 0.35, ly - 0.4, engaged ? 0.55 : 0.4).fill({ color: 0xd7f1ff, alpha: 0.9 });
  }
}

function drawTitleStargate(g: Graphics, box: Box, time: number, reduce: boolean): void {
  const r = 27;
  const hudBottom = box.top + 62;
  const titleTop = 74;
  const bob = reduce ? 0 : Math.sin(time * 0.85) * 5;
  const gap = titleTop - hudBottom;
  const y = gap > r * 2 + 18 ? (hudBottom + titleTop) / 2 + bob : hudBottom + r + 14 + bob;
  const span = box.right - box.left + r * 4;
  const travel = reduce ? span * 0.22 : (time * 34) % span;
  drawStargate(g, box.left - r * 2 + travel, y, reduce ? 0.6 : time);
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

type GemPt = readonly [number, number];

// Original faceted cut in the same family as a ruby gem: offset crown, pale table,
// dark pavilion on the left, bright pavilion on the right. Not a copied logo.
const RUBY_CUT: readonly GemPt[] = [
  [1.2, -6.2],
  [4.8, -3.6],
  [6.2, -0.2],
  [5.2, 3.4],
  [2.2, 5.6],
  [-1.6, 6.6],
  [-4.6, 3.8],
  [-6.0, 0.4],
  [-4.4, -2.8],
  [-0.8, -4.8],
];

const RUBY_FACETS: readonly { pts: readonly GemPt[]; color: number }[] = [
  { pts: [[1.2, -6.2], [2.4, -3.8], [0.2, -3.2], [-0.8, -4.8]], color: 0xf6d4cc },
  { pts: [[1.2, -6.2], [4.8, -3.6], [2.4, -3.8]], color: 0xf06448 },
  { pts: [[4.8, -3.6], [6.2, -0.2], [3.4, 0.8], [2.4, -3.8]], color: 0xc42012 },
  { pts: [[6.2, -0.2], [5.2, 3.4], [3.4, 0.8]], color: 0x8a120c },
  { pts: [[5.2, 3.4], [2.2, 5.6], [1.4, 2.4], [3.4, 0.8]], color: 0xe23a20 },
  { pts: [[2.2, 5.6], [-1.6, 6.6], [-0.6, 4.2], [1.4, 2.4]], color: 0xb01810 },
  { pts: [[-1.6, 6.6], [-4.6, 3.8], [-6.0, 0.4], [-2.6, 1.8], [-0.6, 4.2]], color: 0x6e100a },
  { pts: [[-6.0, 0.4], [-4.4, -2.8], [-2.2, -1.4], [-2.6, 1.8]], color: 0x9e140c },
  { pts: [[-0.8, -4.8], [0.2, -3.2], [0.8, -0.8], [-2.2, -1.4], [-4.4, -2.8]], color: 0xffece6 },
  { pts: [[0.2, -3.2], [2.4, -3.8], [3.4, 0.8], [0.8, -0.8]], color: 0xd42618 },
  { pts: [[0.8, -0.8], [3.4, 0.8], [1.4, 2.4], [-0.6, 4.2]], color: 0xa8140c },
  { pts: [[0.8, -0.8], [-0.6, 4.2], [-2.6, 1.8], [-2.2, -1.4]], color: 0xb81e12 },
];

function layGem(x: number, y: number, s: number, pts: readonly GemPt[]): number[] {
  const flat: number[] = new Array(pts.length * 2);
  for (let i = 0; i < pts.length; i++) {
    flat[i * 2] = x + pts[i][0] * s;
    flat[i * 2 + 1] = y + pts[i][1] * s;
  }
  return flat;
}

function sparkClock(reduce: boolean): number {
  return reduce ? 0 : performance.now() / 1000;
}

function twinkle(g: Graphics, x: number, y: number, r: number, alpha: number): void {
  if (alpha < 0.08 || r < 0.45) return;
  const w = r * 0.28;
  g.poly(
    [x, y - r, x + w, y - w, x + r, y, x + w, y + w, x, y + r, x - w, y + w, x - r, y, x - w, y - w],
    true,
  ).fill({ color: 0xfffdf6, alpha });
}

function drawRubyTwinkle(g: Graphics, x: number, y: number, s: number, time: number, reduce: boolean): void {
  const a = reduce ? 0.88 : 0.5 + 0.5 * Math.sin(time * 6);
  const b = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(time * 6 + 2.15);
  twinkle(g, x + 6.6 * s, y - 5.2 * s, Math.max(1.25, s * (0.5 + 0.75 * a)), 0.22 + 0.78 * a);
  twinkle(g, x - 4.8 * s, y - 5.6 * s, Math.max(0.9, s * (0.32 + 0.48 * b)), 0.18 + 0.72 * b);
  if (a > 0.62) twinkle(g, x + 2.8 * s, y + 0.6 * s, Math.max(0.7, s * 0.48), reduce ? 0.45 : (a - 0.62) * 2.2);
}

function paintRuby(g: Graphics, x: number, y: number, s: number, time: number, reduce: boolean): void {
  for (const facet of RUBY_FACETS) g.poly(layGem(x, y, s, facet.pts), true).fill(facet.color);
  const gleam = reduce ? 0.94 : 0.38 + 0.62 * (0.5 + 0.5 * Math.sin(time * 5.4));
  g.poly(layGem(x, y, s, [[-0.55, -4.05], [0.75, -2.7], [-1.35, -2.15]]), true).fill({
    color: 0xffffff,
    alpha: gleam,
  });
  g.poly(layGem(x, y, s, RUBY_CUT), true).stroke({
    width: Math.max(1, s * 0.42),
    color: 0x6a100c,
    join: 'round',
  });
}

function drawRubyGem(g: Graphics, x: number, y: number, s: number, time: number, reduce: boolean): void {
  paintRuby(g, x, y, s, time, reduce);
  drawRubyTwinkle(g, x, y, s, time, reduce);
}

function drawMetalMedal(g: Graphics, x: number, y: number, r: number, metal: 'bronze' | 'silver'): void {
  const gold = metal === 'bronze';
  if (r >= 20) {
    const rw = r * 0.28;
    const rh = r * 0.7;
    const top = y - r - r * 0.38;
    g.roundRect(x - r * 0.5, top, rw, rh, 3).fill(gold ? 0xb4232c : 0x2c5c90);
    g.roundRect(x + r * 0.22, top, rw, rh, 3).fill(gold ? 0xe24b45 : 0x6ea0d0);
  }
  const rim = gold ? 0x7a4e12 : 0x4d5966;
  const lip = gold ? 0xffe29a : 0xf7f9fc;
  const groove = gold ? 0xa86a20 : 0x8492a0;
  const face = gold ? 0xf2b434 : 0xd7e0ea;
  const hot = gold ? 0xfff6d2 : 0xffffff;
  g.circle(x, y, r).fill(rim);
  g.circle(x, y, r * 0.88).fill(lip);
  g.circle(x, y, r * 0.78).fill(groove);
  g.circle(x, y, r * 0.7).fill(face);
  g.circle(x, y, r * 0.56).stroke({ width: Math.max(1.15, r * 0.06), color: groove });
  const shine = r * 0.6;
  const shineStart = Math.PI * 1.16;
  g.moveTo(x + Math.cos(shineStart) * shine, y + Math.sin(shineStart) * shine);
  g.arc(x, y, shine, shineStart, Math.PI * 1.8).stroke({
    width: Math.max(1.4, r * 0.085),
    color: hot,
    cap: 'round',
  });
  if (r >= 20) star(g, x + 0.7, y + r * 0.04 + 1, r * 0.36, gold ? 0xc48a28 : 0x8b97a6);
  star(g, x, y + r * 0.02, r * 0.36, hot);
  g.circle(x, y + r * 0.02, Math.max(0.7, r * 0.065)).fill(gold ? 0xe8a020 : 0xb7c3d0);
}

function drawHudMedal(g: Graphics, x: number, y: number, award: MedalName, time: number, reduce: boolean): void {
  if (award === 'ruby') {
    drawRubyGem(g, x, y + 1, 1.5, time, reduce);
    return;
  }
  drawMetalMedal(g, x, y, 11, award);
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
  const modeName = outlined('Easy', 18, CREAM, INK, true);
  const modeScore = outlined('0', 32, CREAM, INK, true);
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
    modeName,
    modeScore,
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
    if (run.phase === 'ready') drawTitleStargate(sky, box, run.time, state.reduceMotion);
    drawClouds(scenery, weather, run.scroll, box);
    hill(scenery, floor - 78, land.hillFar, 16, 90, run.scroll * 0.35, box.left, box.right, floor);
    hill(scenery, floor - 36, land.hillNear, 12, 54, run.scroll * 0.55, box.left, box.right, floor);
    drawSeason(scenery, season, holiday, weather, run.time, run.scroll, box, floor, state.reduceMotion);
    const themeTime = state.reduceMotion ? 0 : run.time;
    if (run.phase === 'ready') drawThemedGate(gateLayer, state.theme, 326, 300, 156, box.top, floor, themeTime);
    for (const gate of run.gates) {
      drawThemedGate(gateLayer, state.theme, gate.x, gate.gapY, gate.open, box.top, floor, themeTime);
    }
    drawGround(ground, run, box, floor, land, state.reduceMotion);
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

    drawUi(uiGfx, state, box, scale, ox, {
      title,
      flyHint,
      modeName,
      modeScore,
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
  reduce: boolean,
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
    const y = floor + depth;
    drawBuriedRuby(g, x, y, scale, land.dirt, sparkClock(reduce) + i * 0.73, reduce);
  }
}

function hashUnit(i: number): number {
  let n = Math.imul(i | 0, 0x45d9f3b) >>> 0;
  n = ((n >>> 16) ^ n) >>> 0;
  n = Math.imul(n, 0x45d9f3b) >>> 0;
  n = ((n >>> 16) ^ n) >>> 0;
  return n / 4294967296;
}

function drawBuriedRuby(
  g: Graphics,
  x: number,
  y: number,
  scale: number,
  dirt: number,
  time: number,
  reduce: boolean,
): void {
  const s = scale;
  g.ellipse(x, y + 3.2 * s, 10 * s, 3.2 * s).fill({ color: 0x6a3d16, alpha: 0.22 });
  paintRuby(g, x, y, s, time, reduce);
  g.ellipse(x, y + 5.2 * s, 11 * s, 3.5 * s).fill(dirt);
  drawRubyTwinkle(g, x, y, s, time, reduce);
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
  modeName: Text;
  modeScore: Text;
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

function drawUi(g: Graphics, state: RenderState, box: Box, scale: number, ox: number, labels: Labels): void {
  const { run } = state;
  const cx = WORLD.w / 2;
  const ready = run.phase === 'ready';
  const playing = run.phase === 'play' || run.phase === 'dying' || run.phase === 'snatched';
  const over = run.phase === 'over';
  const joke = state.tipBeat !== null;
  const wide = box.right - box.left;
  const tall = box.bottom - box.top;

  labels.title.visible = ready;
  labels.flyHint.visible = ready;
  labels.scoreText.visible = playing;
  labels.pauseTitle.visible = state.paused;
  labels.pauseHint.visible = state.paused;
  labels.overTitle.visible = over && !joke;
  labels.medalName.visible = false;
  labels.overScore.visible = over && !joke;
  labels.overBest.visible = over && !joke;
  labels.overStats.visible = over && !joke;
  labels.retry.visible = over && !joke;
  const controls = state.controls;
  labels.flyHint.text = controls.fly;
  labels.flyHint.style.fontSize = controls.touch ? 26 : 22;
  labels.pauseHint.text = controls.resume;
  labels.pauseHint.style.fontSize = controls.touch ? 20 : 18;
  labels.retry.text = controls.retry;
  labels.retry.style.fontSize = controls.touch ? 18 : 16;
  labels.modeName.style.fontSize = controls.touch ? 22 : 18;
  labels.modeScore.style.fontSize = controls.touch ? 36 : 32;
  const hudMedal = medalForScore(state.modeBest);
  const cornerClear = !over || box.top < -48;
  labels.modeName.visible = cornerClear;
  labels.modeScore.visible = cornerClear;
  let hudMedalAt: { x: number; y: number } | null = null;
  let hudRight = box.left + 108;
  if (cornerClear) {
    labels.modeName.text = state.modeName;
    labels.modeScore.text = String(state.modeBest);
    const hudX = box.left + 16;
    const hudY = box.top + 10;
    const scoreDrop = controls.touch ? 30 : 24;
    labels.modeName.position.set(hudX, hudY);
    labels.modeScore.position.set(hudX, hudY + scoreDrop);
    const pad = Math.ceil(Number(labels.modeScore.style.fontSize) / 6);
    hudRight = hudX + Math.max(labels.modeName.width, labels.modeScore.width - pad);
    if (hudMedal) {
      hudMedalAt = {
        x: hudX + labels.modeScore.width - pad + 22,
        y: hudY + scoreDrop + labels.modeScore.height / 2,
      };
      hudRight = Math.max(hudRight, hudMedalAt.x + 18);
    }
  }

  labels.weatherLabel.visible = true;
  const skyLine = `${fieldName(run.season, run.holiday)}  ·  ${weatherById(run.weather).name}`;
  const picking = run.phase === 'ready' || run.phase === 'over';
  const toolPx = picking ? 178 : 116;
  const belowTools = controls.touch && ox < 24;
  const titleGate = run.phase === 'ready' ? Math.max(0, box.right - 318) : 0;
  const rightReserve = belowTools ? Math.max(18, titleGate) : Math.max(116, toolPx / scale, titleGate);
  const leftReserve = cornerClear ? Math.max(128, hudRight - box.left + 12) : 128;
  const edge = box.right - rightReserve;
  labels.weatherLabel.text = skyLine;
  let skySize = controls.touch ? 26 : 22;
  labels.weatherLabel.style.fontSize = skySize;
  const room = Math.max(80, edge - box.left - leftReserve);
  while (skySize > 13 && labels.weatherLabel.width > room) {
    skySize -= 1;
    labels.weatherLabel.style.fontSize = skySize;
  }
  const half = labels.weatherLabel.width / 2;
  const mid = (box.left + box.right) / 2;
  const leftLimit = box.left + leftReserve + half;
  const rightLimit = edge - half;
  const skyX = leftLimit <= rightLimit ? Math.min(rightLimit, Math.max(leftLimit, mid)) : mid;
  labels.weatherLabel.position.set(skyX, box.top + (belowTools ? 78 / scale : 30));

  if (ready) {
    labels.title.position.set(cx, 128);
    labels.flyHint.position.set(cx, 214);
    labels.flyHint.alpha = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(run.time * 3));
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

  if (!over) {
    if (hudMedal && hudMedalAt) drawHudMedal(g, hudMedalAt.x, hudMedalAt.y, hudMedal, sparkClock(state.reduceMotion), state.reduceMotion);
    return;
  }

  g.rect(box.left, box.top, wide, tall).fill({ color: 0x14283c, alpha: 0.28 });
  if (joke) {
    if (hudMedal && hudMedalAt) drawHudMedal(g, hudMedalAt.x, hudMedalAt.y, hudMedal, sparkClock(state.reduceMotion), state.reduceMotion);
    return;
  }
  const award = medalForScore(run.score);
  const cardW = 304;
  const cardH = award ? 388 : 300;
  const x = (WORLD.w - cardW) / 2;
  const y = award ? 48 : 124;
  card(g, x, y, cardW, cardH);
  labels.overTitle.text = run.snatchTime >= 0 ? 'SNATCHED' : 'GAME OVER';
  labels.overTitle.position.set(cx, y + 42);
  if (award) {
    if (award === 'ruby') drawRubyGem(g, cx, y + 112, 3.15, sparkClock(state.reduceMotion), state.reduceMotion);
    else drawMetalMedal(g, cx, y + 114, 28, award);
    labels.medalName.visible = true;
    labels.medalName.text = award;
    labels.medalName.position.set(cx, y + 152);
  }
  const scoreY = award ? y + 200 : y + 108;
  labels.overScore.text = String(run.score);
  labels.overScore.position.set(cx, scoreY);
  labels.overBest.text = `BEST  ${state.best}`;
  labels.overBest.position.set(cx, scoreY + 50);
  const bestMedal = medalForScore(state.best);
  const clock = sparkClock(state.reduceMotion);
  if (bestMedal) drawHudMedal(g, cx + labels.overBest.width / 2 + 16, scoreY + 50, bestMedal, clock, state.reduceMotion);
  if (hudMedal && hudMedalAt) drawHudMedal(g, hudMedalAt.x, hudMedalAt.y, hudMedal, clock, state.reduceMotion);
  const facts = flightFacts(run);
  labels.overStats.text = `${facts.taps}  ·  ${facts.pipes}\n${facts.seconds}`;
  labels.overStats.position.set(cx, scoreY + 100);
  labels.retry.position.set(cx, y + cardH - 30);
}
