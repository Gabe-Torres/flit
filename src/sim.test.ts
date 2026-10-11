import { WORLD, createRun, flap, groundY, hits, restY, step } from './sim.ts';

declare const process: { exit: (code: number) => never };

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (cond) return;
  failed += 1;
  console.error(`FAIL ${msg}`);
}

function playable(): ReturnType<typeof createRun> {
  const run = createRun(1);
  run.phase = 'play';
  run.gates = [];
  return run;
}

{
  const run = createRun(1);
  const y0 = run.bird.y;
  for (let i = 0; i < 120; i++) step(run, 1 / 60);
  assert(run.phase === 'ready', 'title stays ready');
  assert(run.gates.length === 0, 'title has no gates');
  assert(Math.abs(run.bird.y - y0) < 8, `title bob stays put (${run.bird.y})`);
}

{
  const run = createRun(1);
  const did = flap(run);
  const y = run.bird.y;
  step(run, 1 / 60);
  assert(did, 'first flap is accepted');
  assert(run.phase === 'play', 'first flap starts the run');
  assert(run.bird.y < y, 'flap lifts the bird');
}

{
  const run = createRun(3);
  flap(run);
  const y0 = run.bird.y;
  let peak = y0;
  for (let i = 0; i < 45; i++) {
    step(run, 1 / 60);
    if (run.bird.y < peak) peak = run.bird.y;
  }
  const rise = y0 - peak;
  assert(rise > 80 && rise < 140, `hop is about one beat (${rise.toFixed(1)}px)`);
}

{
  const run = playable();
  run.bird.y = 180;
  const y0 = run.bird.y;
  for (let i = 0; i < 24; i++) step(run, 1 / 60);
  assert(run.phase === 'play', 'a short fall stays in play');
  assert(run.bird.y > y0 + 80, `gravity drops the bird (${run.bird.y - y0})`);
}

{
  const run = playable();
  for (let i = 0; i < 30; i++) {
    flap(run);
    step(run, 1 / 60);
  }
  assert(run.bird.y > -40, `bird stays below the ceiling (${run.bird.y})`);
}

{
  const run = playable();
  run.bird.y = 320;
  run.gates = [{ x: WORLD.birdX - 20, gapY: 320, scored: false }];
  assert(!hits(run), 'the gap is safe');
  step(run, 0);
  assert(run.phase === 'play', 'passing the gap does not crash');
}

{
  const run = playable();
  run.bird.y = 320;
  run.gates = [{ x: WORLD.birdX - 20, gapY: 320 + 150, scored: false }];
  assert(hits(run), 'the gate body is solid');
  step(run, 0);
  assert(run.phase === 'dying', 'hitting a gate ends the flight');
  assert(run.score === 0, 'a crash does not score');
}

{
  const run = playable();
  run.bird.y = groundY() - WORLD.hitR + 3;
  step(run, 0);
  assert(run.phase === 'dying', 'the ground ends the flight');
}

{
  const run = playable();
  run.bird.y = 320;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 320, scored: false }];
  step(run, 0);
  assert(run.score === 1, 'clearing a gate scores');
  assert(run.phase === 'play', 'a score stays in play');
  step(run, 0);
  assert(run.score === 1, 'a gate scores once');
}

{
  const run = playable();
  run.bird.y = 200;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 420, scored: false }];
  step(run, 0);
  assert(run.phase === 'dying', 'overlapping the lip crashes');
  assert(run.score === 0, 'crashing on the score line does not score');
}

{
  const run = playable();
  run.bird.y = groundY() - WORLD.hitR + 3;
  step(run, 0);
  assert(run.phase === 'dying', 'death starts in the air');
  assert(flap(run) === false, 'no flap while falling');
  for (let i = 0; i < 180; i++) step(run, 1 / 60);
  assert(run.phase === 'over', 'the bird lands, then the run is over');
  assert(run.bird.y === restY(), 'the bird rests on the ground');
  assert(flap(run) === false, 'no flap on the score card');
}

{
  const run = createRun(9);
  run.phase = 'play';
  for (let i = 0; i < 420; i++) {
    const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
    run.bird.y = ahead ? ahead.gapY : WORLD.readyY;
    run.bird.vy = 0;
    step(run, 1 / 60);
  }
  assert(run.phase === 'play', 'a centered bird keeps flying');
  assert(run.gates.length >= 2, 'gates keep coming');
  for (let i = 1; i < run.gates.length; i++) {
    const gap = run.gates[i].x - run.gates[i - 1].x;
    assert(Math.abs(gap - WORLD.spacing) < 0.05, `gate spacing stays ${WORLD.spacing} (${gap})`);
  }
  for (let i = 1; i < run.gates.length; i++) {
    const jump = Math.abs(run.gates[i].gapY - run.gates[i - 1].gapY);
    assert(jump <= WORLD.gapStep + 0.01, `gaps do not jump more than ${WORLD.gapStep} (${jump})`);
  }
}

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}

console.log('ok');
