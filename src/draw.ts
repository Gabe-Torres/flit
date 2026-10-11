import { Application, Container, FillGradient, Graphics, Text } from 'pixi.js';
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

export type Stage = {
  render: (state: RenderState) => void;
  resize: () => void;
};

type Box = { left: number; top: number; right: number; bottom: number };

const INK = 0x2b2118;
const CREAM = 0xfffdf6;
const OUTLINE = { width: 2.5, color: 0x6a3d16, join: 'round' as const, cap: 'round' as const };
const SKY = new FillGradient({
  type: 'linear',
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
  colorStops: [
    { offset: 0, color: 0x67c4f6 },
    { offset: 0.55, color: 0xb7e6fb },
    { offset: 1, color: 0xffe7b8 },
  ],
});

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

function cloud(g: Graphics, x: number, y: number, s: number): void {
  const white = { color: 0xffffff, alpha: 0.94 };
  g.ellipse(x, y, 28 * s, 16 * s).fill(white);
  g.ellipse(x + 22 * s, y + 4 * s, 20 * s, 13 * s).fill(white);
  g.ellipse(x - 20 * s, y + 6 * s, 16 * s, 11 * s).fill(white);
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
  if (score >= 40) return { name: 'ruby', fill: 0xe85d75, rim: 0x9d2944 };
  if (score >= 20) return { name: 'gold', fill: 0xf2c14b, rim: 0xa67c12 };
  if (score >= 10) return { name: 'silver', fill: 0xd5dbe3, rim: 0x7d8794 };
  if (score >= 5) return { name: 'bronze', fill: 0xe0a36a, rim: 0x8a5a32 };
  return null;
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
  const fx = new Graphics();
  const bird = new Container();
  const wing = new Graphics();
  const body = new Graphics();
  const uiGfx = new Graphics();
  bird.addChild(wing, body);
  world.addChild(sky, scenery, gateLayer, ground, fx, bird);

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
  const retry = plain('tap to try again', 18, 0x8a7362);
  ui.addChild(uiGfx, title, flyHint, bestHint, scoreText, pauseTitle, pauseHint, overTitle, medalName, overScore, overBest, retry);
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
    fx.clear();
    uiGfx.clear();
    drawSky(sky, box, floor);
    drawClouds(scenery, run, box);
    hill(scenery, floor - 78, 0xc5e39a, 16, 90, run.scroll * 0.35, box.left, box.right, floor);
    hill(scenery, floor - 36, 0x8bc56a, 12, 54, run.scroll * 0.55, box.left, box.right, floor);
    for (const gate of run.gates) drawGate(gateLayer, gate.x, gate.gapY, box, floor);
    drawGround(ground, run, box, floor);

    const altitude = Math.max(0, floor - run.bird.y);
    fx.ellipse(WORLD.birdX, floor - 2, Math.max(8, 20 - altitude * 0.03), 5).fill({ color: 0x462e16, alpha: 0.18 });
    for (const p of state.particles) {
      fx.circle(p.x, p.y, p.r).fill({ color: p.color, alpha: Math.max(0, p.life / p.max) });
    }

    bird.position.set(WORLD.birdX, run.bird.y);
    bird.rotation = run.bird.rot;
    bird.scale.set(1 + state.squash * 0.12, 1 - state.squash * 0.16);
    drawBird(body, wing, state.wing);

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
      retry,
    });
    app.render();
  };

  return {
    render,
    resize: () => app.resize(),
  };
}

function drawSky(g: Graphics, box: Box, floor: number): void {
  const top = Math.min(box.top, floor - 1);
  g.rect(box.left, top, box.right - box.left, Math.max(1, floor - top)).fill(SKY);
  if (box.bottom > floor) g.rect(box.left, floor, box.right - box.left, box.bottom - floor).fill(0xe3b45c);

  const sunX = box.left + (box.right - box.left) * 0.2;
  const sunY = box.top + (floor - box.top) * 0.2;
  g.circle(sunX, sunY, 110).fill({ color: 0xffe896, alpha: 0.22 });
  g.circle(sunX, sunY, 68).fill({ color: 0xffe896, alpha: 0.28 });
  g.circle(sunX, sunY, 34).fill(0xffe38a);
}

function drawClouds(g: Graphics, run: Run, box: Box): void {
  const band = 520;
  const drift = run.scroll * 0.22;
  const start = Math.floor((box.left + drift) / band) - 1;
  const end = Math.floor((box.right + drift) / band) + 1;
  for (let i = start; i <= end; i++) {
    const origin = i * band - drift;
    cloud(g, origin + 36, 38, 0.82);
    cloud(g, origin + 250, 448, 0.7);
    cloud(g, origin + 430, 34, 1);
  }
}

function drawGround(g: Graphics, run: Run, box: Box, floor: number): void {
  g.rect(box.left, floor, box.right - box.left, Math.max(4, box.bottom - floor + 4)).fill(0xe3b45c);
  g.rect(box.left, floor, box.right - box.left, 18).fill(0x63b44a);
  g.rect(box.left, floor + 16, box.right - box.left, 7).fill(0x4b9a38);

  const tuft = 18;
  for (let x = box.left - (run.scroll % tuft) - tuft; x < box.right; x += tuft) {
    g.poly([x, floor + 2, x + 5, floor - 8, x + 10, floor + 2], true).fill(0x7dcc55);
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
}

function drawGate(g: Graphics, x: number, gapY: number, box: Box, floor: number): void {
  const openTop = gapY - WORLD.gap / 2;
  const openBot = gapY + WORLD.gap / 2;
  const lip = 28;
  const inset = 7;
  const w = WORLD.pipeW;
  const shaft = (sy: number, sh: number) => {
    if (sh <= 1) return;
    g.rect(x + inset, sy, w - inset * 2, sh).fill(0x4aaa52);
    g.rect(x + inset + 6, sy, 6, sh).fill({ color: 0xffffff, alpha: 0.28 });
    g.rect(x + w - inset - 8, sy, 5, sh).fill({ color: 0x1e5c30, alpha: 0.18 });
  };
  shaft(box.top - 20, openTop - lip - (box.top - 20));
  shaft(openBot + lip, floor - (openBot + lip) + 4);
  const cap = (cy: number) => {
    g.roundRect(x, cy, w, lip, 8).fill(0x349443).stroke({ width: 3, color: 0x1e5c30 });
    g.rect(x + 8, cy + 5, 7, lip - 10).fill({ color: 0xffffff, alpha: 0.35 });
  };
  cap(openTop - lip);
  cap(openBot);
}

function drawBird(body: Graphics, wingGfx: Graphics, wingPhase: number): void {
  const flapAngle = Math.sin(wingPhase);
  body.clear();
  body.poly([-6, 0, -22, -8 - flapAngle * 3, -16, 7], true).fill(0xf0b429).stroke(OUTLINE);

  wingGfx.position.set(-2, 0);
  wingGfx.rotation = flapAngle * 1.05 - 0.15;
  wingGfx.clear();
  wingGfx.ellipse(0, 11, 13, 7.5).fill(0xe7a322).stroke(OUTLINE);

  body.ellipse(0, 0, 18, 14.5).fill(0xffd34d).stroke(OUTLINE);
  body.ellipse(3, 4, 10, 8).fill(0xfff3c4);
  body.ellipse(8, 5, 3.2, 2.2).fill({ color: 0xf4a0a0, alpha: 0.85 });
  body.poly([12, -1, 26, 2, 12, 8], true).fill(0xef7a2f).stroke(OUTLINE);
  body.circle(8, -4, 5.4).fill(0xffffff).stroke(OUTLINE);
  body.circle(9.6, -4, 2.5).fill(INK);
  body.circle(8.8, -5, 1).fill(0xffffff);
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
  retry: Text;
};

function card(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.roundRect(x + 4, y + 6, w, h, 24).fill({ color: INK, alpha: 0.16 });
  g.roundRect(x, y, w, h, 24).fill(0xfff8ea).stroke({ width: 4, color: INK });
}

function drawUi(g: Graphics, state: RenderState, box: Box, labels: Labels): void {
  const { run } = state;
  const cx = WORLD.w / 2;
  const ready = run.phase === 'ready';
  const playing = run.phase === 'play' || run.phase === 'dying';
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
  labels.retry.visible = over;

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
    const cardW = 250;
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
  const cardH = award ? 356 : 252;
  const x = (WORLD.w - cardW) / 2;
  const y = award ? 112 : 168;
  card(g, x, y, cardW, cardH);
  labels.overTitle.position.set(cx, y + 46);
  if (award) {
    g.circle(cx, y + 120, 28).fill(award.rim);
    g.circle(cx, y + 120, 22).fill(award.fill);
    star(g, cx, y + 118, 12, CREAM);
    labels.medalName.visible = true;
    labels.medalName.text = award.name;
    labels.medalName.position.set(cx, y + 160);
  }
  const scoreY = award ? y + 228 : y + 118;
  labels.overScore.text = String(run.score);
  labels.overScore.position.set(cx, scoreY);
  labels.overBest.text = `BEST  ${state.best}`;
  labels.overBest.position.set(cx, scoreY + 52);
  labels.retry.position.set(cx, y + cardH - 32);
}
