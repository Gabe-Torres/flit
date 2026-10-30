import {
  SNATCH_DURATION,
  MODES,
  WORLD,
  createRun,
  flap,
  flightFacts,
  isModeId,
  medalForScore,
  groundY,
  hits,
  pipeOpening,
  pipeSpacing,
  pipesClearTime,
  planSnatch,
  portalY,
  restY,
  shoot,
  snatchPose,
  step,
  WARP_PIPES,
  GUN_SHOTS,
} from './sim.ts';
import { controlHints } from './controls.ts';
import { birdOffered } from './birds.ts';
import { HEAT_TIME, deskX, printerPose, printerSeat } from './printer.ts';
import { RAMP_RISE, rampLip, runnerRideY, runnerSkim } from './runner.ts';
import { holidayForDate } from './holiday.ts';
import { seasonForDate } from './season.ts';
import { THEMES, isThemeId } from './themes.ts';
import { terrainFor } from './weather.ts';

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
  assert(createRun(4).season === seasonForDate(new Date()), 'a run keeps the season');
  assert(createRun(4).holiday === holidayForDate(new Date()), 'a run keeps the holiday');
  assert(createRun(4).mode === 'normal', 'normal is the default course');
  assert(createRun(4, 'hard').mode === 'hard', 'a run keeps the hard course');
  assert(createRun(4, 'normal').mode === 'normal', 'a run keeps the normal course');
  assert(createRun(4, 'test').mode === 'test', 'a run keeps the test course');
  assert(pipeSpacing(0, 'test') === pipeSpacing(0, 'normal'), 'test uses the original distance');
  assert(pipeOpening(3, 'test') === pipeOpening(3, 'normal'), 'test uses the original opening');
  assert(seasonForDate(new Date(2026, 2, 1)) === 'spring', 'March is spring');
  assert(seasonForDate(new Date(2026, 4, 31)) === 'spring', 'May is spring');
  assert(seasonForDate(new Date(2026, 5, 1)) === 'summer', 'June is summer');
  assert(seasonForDate(new Date(2026, 7, 31)) === 'summer', 'August is summer');
  assert(seasonForDate(new Date(2026, 8, 1)) === 'autumn', 'September is autumn');
  assert(seasonForDate(new Date(2026, 10, 30)) === 'autumn', 'November is autumn');
  assert(seasonForDate(new Date(2026, 11, 1)) === 'winter', 'December is winter');
  assert(seasonForDate(new Date(2026, 0, 15)) === 'winter', 'January is winter');
  assert(seasonForDate(new Date(2026, 1, 28)) === 'winter', 'February is winter');
  assert(terrainFor('autumn').grass !== terrainFor('summer').grass, 'autumn grass is its own color');
  assert(terrainFor('spring').tuft !== terrainFor('summer').tuft, 'spring tufts are their own color');
  assert(holidayForDate(new Date(2026, 9, 1)) === 'halloween', 'October 1 is Halloween');
  assert(holidayForDate(new Date(2026, 9, 11)) === 'halloween', 'October 11 is Halloween');
  assert(seasonForDate(new Date(2026, 9, 11)) === 'autumn', 'October 11 is autumn');
  assert(holidayForDate(new Date(2026, 9, 23)) === 'halloween', 'October 23 is Halloween');
  assert(holidayForDate(new Date(2026, 9, 31)) === 'halloween', 'October 31 is Halloween');
  assert(holidayForDate(new Date(2026, 10, 1)) === 'thanksgiving', 'November 1 is Thanksgiving');
  assert(holidayForDate(new Date(2024, 10, 28)) === 'thanksgiving', 'Thanksgiving 2024 is November 28');
  assert(holidayForDate(new Date(2024, 10, 29)) === 'thanksgiving', 'the Friday after Thanksgiving 2024 stays');
  assert(holidayForDate(new Date(2025, 10, 27)) === 'thanksgiving', 'Thanksgiving 2025 is November 27');
  assert(holidayForDate(new Date(2025, 10, 26)) === 'thanksgiving', 'November 26 is Thanksgiving month');
  assert(holidayForDate(new Date(2026, 10, 26)) === 'thanksgiving', 'Thanksgiving 2026 is November 26');
  assert(holidayForDate(new Date(2026, 11, 1)) === 'christmas', 'December 1 is Christmas');
  assert(holidayForDate(new Date(2026, 11, 17)) === 'christmas', 'December 17 is Christmas');
  assert(holidayForDate(new Date(2026, 11, 25)) === 'christmas', 'December 25 is Christmas');
  assert(seasonForDate(new Date(2026, 11, 25)) === 'winter', 'Christmas day is still winter');
  assert(holidayForDate(new Date(2026, 11, 31)) === 'christmas', 'December 31 is Christmas');
  assert(holidayForDate(new Date(2027, 0, 1)) === 'newyear', 'January 1 is New Year');
  assert(holidayForDate(new Date(2027, 0, 15)) === 'newyear', 'January 15 is New Year');
  assert(holidayForDate(new Date(2026, 1, 1)) === 'valentine', 'February 1 is Valentine month');
  assert(holidayForDate(new Date(2026, 1, 14)) === 'valentine', "February 14 is Valentine's");
  assert(holidayForDate(new Date(2026, 1, 28)) === 'valentine', 'February 28 is Valentine month');
  assert(holidayForDate(new Date(2026, 2, 1)) === 'patrick', 'March 1 is St. Patrick month');
  assert(holidayForDate(new Date(2026, 2, 17)) === 'patrick', "March 17 is St. Patrick's");
  assert(holidayForDate(new Date(2024, 2, 16)) === 'patrick', 'March 16 2024 is still St. Patrick');
  assert(holidayForDate(new Date(2024, 2, 30)) === 'easter', 'late March 2024 is Easter month');
  assert(holidayForDate(new Date(2024, 2, 31)) === 'easter', 'Easter 2024 is March 31');
  assert(holidayForDate(new Date(2024, 3, 1)) === null, 'April 2024 stays spring when Easter was in March');
  assert(holidayForDate(new Date(2025, 3, 1)) === 'easter', 'April 2025 is Easter month');
  assert(holidayForDate(new Date(2025, 3, 20)) === 'easter', 'Easter 2025 is April 20');
  assert(holidayForDate(new Date(2026, 3, 1)) === 'easter', 'April 2026 is Easter month');
  assert(holidayForDate(new Date(2026, 3, 5)) === 'easter', 'Easter 2026 is April 5');
  assert(holidayForDate(new Date(2020, 3, 12)) === 'easter', 'Easter 2020 is April 12');
  assert(seasonForDate(new Date(2026, 6, 4)) === 'summer', 'July 4 is summer');
  assert(holidayForDate(new Date(2026, 6, 4)) === null, 'July 4 keeps the summer field');
  assert(birdOffered('bat', 'halloween'), 'the bat is out in October');
  assert(!birdOffered('bat', null), 'the bat stays off a normal field');
  assert(!birdOffered('bat', 'christmas'), 'the bat stays off at Christmas');
  assert(birdOffered('kitten', null), 'the kitten flies in any month');
  assert(birdOffered('finch', 'halloween'), 'the finch stays through Halloween');
  assert(birdOffered('runner', null), 'the neon runner is always in the list');
  const floor = groundY();
  assert(birdOffered('printer', null), 'the printer is always in the list');
  assert(printerSeat(floor) + 4 + WORLD.hitR < groundY(), 'the printer sits above the ground');
  const idle = printerPose(floor, 0, 0, null);
  assert(idle.x === WORLD.birdX && idle.flash === 0 && idle.heat < 0.4, 'the printer waits on the desk');
  assert(Math.abs(idle.y - printerSeat(floor)) < 1, 'the waiting printer rests on the desktop');
  const warming = printerPose(floor, 0, 80, { scroll: 80, age: HEAT_TIME / 2, launched: false });
  assert(warming.x === WORLD.birdX && Math.abs(warming.heat - 0.5) < 1e-6, 'heating keeps the printer on the desk');
  const blown = printerPose(floor, 0, 140, { scroll: 80, age: HEAT_TIME, launched: true });
  assert(blown.x === deskX(140, 80, true) && blown.x < WORLD.birdX && blown.flash === 1, 'the desk is left behind after the blast');
  const waiting = runnerRideY(floor, rampLip(0, null));
  assert(!waiting.launch && waiting.y === runnerSkim(floor), 'the runner waits on the ground before the ramp');
  const launched = runnerRideY(floor, WORLD.birdX);
  assert(launched.launch && launched.y === runnerSkim(floor) - RAMP_RISE, 'the ramp lip throws the runner up');
  assert(terrainFor('autumn', 'halloween').grass !== terrainFor('autumn').grass, 'halloween has its own ground');
  assert(terrainFor('winter', 'christmas').tuft !== terrainFor('winter').tuft, 'christmas tufts are their own color');
}

{
  const run = createRun(1);
  const y0 = run.bird.y;
  for (let i = 0; i < 120; i++) step(run, 1 / 60);
  assert(run.phase === 'ready', 'title stays ready');
  assert(run.gates.length === 0, 'title has no gates');
  assert(Math.abs(run.bird.y - y0) < 8, `title bob stays put (${run.bird.y})`);
  assert(run.taps === 0 && run.playTime === 0, 'the title keeps flight stats at zero');
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
  run.gates = [{ x: WORLD.birdX - 20, gapY: 320, open: WORLD.gap, scored: false }];
  assert(!hits(run), 'the gap is safe');
  step(run, 0);
  assert(run.phase === 'play', 'passing the gap does not crash');
}

{
  const run = playable();
  run.bird.y = 320;
  run.gates = [{ x: WORLD.birdX - 20, gapY: 320 + 150, open: WORLD.gap, scored: false }];
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
  const run = createRun(3, 'easy');
  assert(run.lives === 1, 'easy starts with one life');
  run.phase = 'play';
  run.snatchAt = null;
  const y = 280;
  run.bird.y = y;
  run.bird.vy = 40;
  run.gates = [{ x: WORLD.birdX - 20, gapY: y + 160, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.phase === 'play', 'the extra life keeps the flight going');
  assert(run.lives === 0, 'the life is spent');
  assert(run.bird.y === y, 'the bird comes back at the crash');
  assert(run.mercy > 1, 'the return stays safe for a moment');
  step(run, 0);
  assert(run.phase === 'play', 'the pipe is safe during the return');
  run.mercy = 0;
  step(run, 0);
  const ended: string = run.phase;
  assert(ended === 'dying', 'the next hit ends the run');

  const dirt = createRun(3, 'easy');
  dirt.phase = 'play';
  dirt.snatchAt = null;
  dirt.bird.y = groundY();
  dirt.gates = [];
  step(dirt, 0);
  assert(dirt.phase === 'play' && dirt.lives === 0, 'the ground spends the life');
  assert(dirt.bird.y < groundY() - WORLD.hitR && dirt.bird.y > groundY() - 40, 'the bird comes back just above the ground');
  dirt.gates = [];
  const scrolled = dirt.scroll;
  let deepest = dirt.bird.y;
  let bounced = false;
  for (let i = 0; i < 60; i++) {
    const before = dirt.bird.vy;
    step(dirt, 1 / 60);
    if (dirt.bird.y > deepest) deepest = dirt.bird.y;
    if (before > 0 && dirt.bird.vy < 0) bounced = true;
  }
  assert(deepest <= groundY() - WORLD.hitR, 'the spare life does not fall through the ground');
  assert(bounced, 'the spare life bounces off the grass');
  assert(dirt.phase === 'play', 'the flight keeps going after the bounce');
  assert(dirt.scroll - scrolled > WORLD.scroll * 0.9, 'the course keeps moving without a stall');
}

{
  const run = playable();
  run.bird.y = 320;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 320, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.score === 1, 'clearing a gate scores');
  assert(run.phase === 'play', 'a score stays in play');
  step(run, 0);
  assert(run.score === 1, 'a gate scores once');
  assert(flightFacts(run).pipes === '1 pipe', 'one cleared gate is one pipe');
}

{
  const run = playable();
  run.bird.y = 200;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 420, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.phase === 'dying', 'overlapping the lip crashes');
  assert(run.score === 0, 'crashing on the score line does not score');
}

{
  const run = playable();
  run.bird.y = groundY() - WORLD.hitR + 3;
  step(run, 0);
  const crashed: string = run.phase;
  assert(crashed === 'dying', 'a ground crash waits before the score card');
  assert(run.bird.y === restY(), 'a ground crash is already down');
  assert(flap(run) === false, 'no flap while falling');
  for (let i = 0; i < 40; i++) step(run, 1 / 60);
  const shown: string = run.phase;
  assert(shown === 'over', 'the score card follows the crash');
  assert(flap(run) === false, 'no flap on the score card');
  assert(run.taps === 0, 'a flap on the score card does not count');
}

{
  const run = playable();
  run.bird.y = 40;
  run.bird.vy = 0;
  run.gates = [{ x: WORLD.birdX - 20, gapY: 400, open: WORLD.gap, scored: false }];
  step(run, 0);
  const early: string = run.phase;
  assert(early === 'dying', 'a high crash stays in the air before the card');
  for (let i = 0; i < 26; i++) step(run, 1 / 60);
  const waiting: string = run.phase;
  assert(waiting === 'dying', 'taps during the tumble do not reach the score card');
  assert(flap(run) === false, 'a tumble is not a flap');
  for (let i = 0; i < 12; i++) step(run, 1 / 60);
  const card: string = run.phase;
  assert(card === 'over', 'the score card comes after the crash taps');
  assert(run.bird.y < restY() - 80, 'the card appears while the bird is still in the air');
  const high = run.bird.y;
  for (let i = 0; i < 180; i++) step(run, 1 / 60);
  const later: string = run.phase;
  assert(later === 'over', 'the card stays up while the bird falls');
  assert(run.bird.y === restY(), 'the bird still reaches the ground behind the card');
  assert(run.bird.y > high, 'the bird falls after the card is up');
}

{
  const run = createRun(2);
  assert(flap(run), 'a tap counts');
  flap(run);
  assert(run.taps === 2, 'two flaps are two taps');
  assert(flightFacts(run).taps === '2 taps', 'tap wording is plural');
  step(run, 0.02);
  step(run, 0.02);
  assert(Math.abs(run.playTime - 0.04) < 1e-6, `flight time tracks the air (${run.playTime})`);
  run.bird.y = groundY() - WORLD.hitR + 3;
  run.bird.vy = 0;
  step(run, 0);
  assert(run.phase === 'dying', 'the ground ends this counted flight');
  const taps = run.taps;
  const air = run.playTime;
  assert(flap(run) === false, 'a fall is not a tap');
  for (let i = 0; i < 40; i++) step(run, 1 / 60);
  assert(run.taps === taps, 'taps freeze after the crash');
  assert(run.playTime === air, 'flight time freezes after the crash');
  assert(flightFacts({ ...run, taps: 1, score: 0, playTime: 1.04 }).seconds === '1.0s', 'time shows one decimal');
  assert(flightFacts({ ...run, taps: 1, score: 0, playTime: 1.04 }).taps === '1 tap', 'one tap stays singular');
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
  assert(run.score < 5, `the opening stretch is still the original (${run.score})`);
  assert(run.gates.length >= 2, 'gates keep coming');
  assert(run.gates.every((gate) => gate.open === pipeOpening(0)), 'openings stay the original');
  for (let i = 1; i < run.gates.length; i++) {
    const gap = run.gates[i].x - run.gates[i - 1].x;
    assert(Math.abs(gap - pipeSpacing(0)) < 0.05, `gates keep the original distance (${gap})`);
  }
  for (let i = 1; i < run.gates.length; i++) {
    const jump = Math.abs(run.gates[i].gapY - run.gates[i - 1].gapY);
    assert(jump <= WORLD.gapStep + 0.01, `gaps do not jump more than ${WORLD.gapStep} (${jump})`);
  }
}

{
  assert(pipeSpacing(0) === WORLD.spacing && pipeSpacing(40) === WORLD.spacing, 'the course keeps the original distance');
  assert(pipeOpening(0) === WORLD.gap && pipeOpening(40) === WORLD.gap, 'the course keeps the original opening');
  assert(pipeSpacing(0, 'easy') === WORLD.spacing + 48 && pipeSpacing(40, 'easy') === WORLD.spacing + 48, 'easy stays a little wider');
  assert(pipeOpening(0, 'easy') === WORLD.gap + 36 && pipeOpening(40, 'easy') === WORLD.gap + 36, 'easy stays a little taller');
  assert(pipeSpacing(0, 'easy') < WORLD.spacing + 120, 'easy is tighter than the old course');

  const run = createRun(9);
  run.phase = 'play';
  run.snatchAt = null;
  const gaps: number[] = [];
  for (let guard = 0; run.score < 45 && guard < 8000; guard++) {
    const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
    run.bird.y = ahead ? ahead.gapY : WORLD.readyY;
    run.bird.vy = 0;
    const count = run.gates.length;
    const cleared = run.score;
    step(run, 1 / 60);
    if (run.gates.length > count) {
      const born = run.gates[run.gates.length - 1];
      assert(born.open === pipeOpening(cleared), `a new gate keeps the opening for ${cleared} pipes (${born.open})`);
    }
    if (run.gates.length > count && run.gates.length >= 2) {
      const next = run.gates[run.gates.length - 1];
      const prev = run.gates[run.gates.length - 2];
      gaps.push(next.x - prev.x);
    }
  }
  assert(run.phase === 'play', 'the spacing run survives');
  assert(run.score >= 45, `the run clears the original course (${run.score})`);
  assert(gaps.length >= 45, `enough gates were measured (${gaps.length})`);
  for (let i = 0; i < gaps.length; i++) {
    assert(Math.abs(gaps[i] - pipeSpacing(i)) < 0.05, `gate ${i + 1} uses spacing ${pipeSpacing(i)} (${gaps[i]})`);
  }
}

{
  assert(planSnatch(1) === null, 'an ordinary seed stays safe');
  const modes = ['easy', 'normal', 'hard'] as const;
  for (const mode of modes) {
    let invites = 0;
    for (let seed = 1; seed <= 1000000; seed++) {
      const at = planSnatch(seed, mode);
      if (at == null) continue;
      invites += 1;
      const first = pipesClearTime(1, mode, seed);
      const last = pipesClearTime(25, mode, seed);
      assert(at >= first && at < last, `${mode} seed ${seed} is after pipe 1 and before pipe 25 (${at})`);
    }
    assert(invites === 9965, `${mode}: the first million seeds invite the pterodactyl 9965 times (${invites})`);
  }
}

{
  const run = createRun(192);
  flap(run);
  assert(run.snatchAt != null, 'the marked run keeps its plan');
  for (let guard = 0; run.phase === 'play' && guard < 4000; guard++) {
    const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
    run.bird.y = ahead ? ahead.gapY : 280;
    run.bird.vy = 0;
    step(run, 1 / 60);
  }
  assert(run.phase === 'snatched', 'the planned grab happens in flight');
  assert(run.score >= 1 && run.score < 25, `the grab is after pipe 1 and before pipe 25 (${run.score})`);
  const air = run.playTime;
  const score = run.score;
  assert(flap(run) === false, 'no flap in the talons');
  for (let i = 0; i < 180; i++) step(run, 1 / 60);
  assert(run.phase === 'over', 'the carry ends the run');
  assert(run.score === score, 'a snatch adds no pipes');
  assert(run.playTime === air, 'flight time stops when the talons close');
  assert(run.bird.y < 0, 'the bird leaves with the pterodactyl');
}

{
  for (const mode of ['easy', 'normal', 'hard'] as const) {
    for (const dt of [1 / 60, 0.05]) {
      const run = createRun(192, mode);
      flap(run);
      for (let guard = 0; run.phase === 'play' && guard < 8000; guard++) {
        const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
        run.bird.y = ahead ? ahead.gapY : 280;
        run.bird.vy = 0;
        step(run, dt);
      }
      assert(run.phase === 'snatched', `${mode} at ${dt}s is snatched`);
      assert(run.score >= 1 && run.score < 25, `${mode} at ${dt}s is after pipe 1 (${run.score})`);
    }
  }
}

{
  const run = playable();
  const clear = pipesClearTime(1);
  run.playTime = clear - 0.01;
  run.snatchAt = clear + 0.02;
  run.bird.y = 300;
  run.bird.vy = 0;
  run.gates = [{ x: WORLD.firstX - WORLD.scroll * run.playTime, gapY: 300, open: WORLD.gap, scored: false }];
  step(run, 0.05);
  assert(run.score === 1, 'the frame that clears pipe 1 counts it');
  assert(run.phase === 'play', 'that same frame does not snatch');
  step(run, 0.05);
  assert(run.phase === 'snatched', 'the grab lands on the next frame');
  assert(run.score === 1, 'the grab keeps the first pipe');
}

{
  const run = playable();
  run.bird.y = 300;
  run.snatchAt = 0;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 300, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.phase === 'play', 'pipe 1 scores before a grab');
  assert(run.score === 1, 'the first pipe counts');
  step(run, 0.05);
  assert(run.phase === 'snatched', 'the grab follows the first pipe');
  assert(run.score === 1, 'the grab adds no further pipe');
  const pose = snatchPose(0, run.caughtY, 700);
  assert(pose.dinoX === 700 && !pose.grabbed, 'the pterodactyl starts off to the side');
  const gone = snatchPose(SNATCH_DURATION, run.caughtY, 700);
  assert(gone.grabbed && gone.birdX < -40, 'the pair flies off the screen');
}

{
  const run = playable();
  run.bird.y = 280;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 280, open: WORLD.gap, scored: false }];
  run.snatchAt = 0;
  run.score = 16;
  step(run, 0);
  assert(run.phase === 'snatched', 'sixteen pipes is still inside the window');
  assert(run.score === 16, 'the grab happens before that pipe scores');
}

{
  const run = playable();
  run.bird.y = 280;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 280, open: WORLD.gap, scored: false }];
  run.snatchAt = 10;
  run.score = 24;
  step(run, 0);
  assert(run.score === 25, 'the twenty-fifth pipe still scores');
  assert(run.phase === 'play', 'twenty-five pipes is past the pterodactyl');
  assert(run.snatchAt === null, 'the chance is over after twenty-five pipes');
  run.snatchAt = 0;
  step(run, 0.05);
  assert(run.phase === 'play', 'a later roll cannot bring it back');
}

function clearedLayout(seed: number, mode: 'normal' | 'hard' | 'test', pipes: number): { gaps: number[]; opens: number[]; jumps: number[] } {
  const run = createRun(seed, mode);
  run.phase = 'play';
  run.snatchAt = null;
  const gaps: number[] = [];
  const opens: number[] = [];
  const jumps: number[] = [];
  for (let guard = 0; run.score < pipes && guard < 12000; guard++) {
    const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
    run.bird.y = ahead ? ahead.gapY : WORLD.readyY;
    run.bird.vy = 0;
    const count = run.gates.length;
    step(run, 1 / 60);
    if (run.gates.length > count && run.gates.length >= 2) {
      const next = run.gates[run.gates.length - 1];
      const prev = run.gates[run.gates.length - 2];
      gaps.push(next.x - prev.x);
      opens.push(next.open);
      jumps.push(Math.abs(next.gapY - prev.gapY));
    }
  }
  return { gaps, opens, jumps };
}

{
  const layout = clearedLayout(9, 'normal', 24);
  assert(layout.gaps.length >= 24, `normal lays out the gates (${layout.gaps.length})`);
  assert(layout.gaps.every((gap) => Math.abs(gap - WORLD.spacing) < 0.05), 'normal distances stay at the original');
  assert(layout.opens.every((open) => open === WORLD.gap), 'normal openings stay at the original');
  assert(layout.jumps.every((jump) => jump <= WORLD.gapStep + 0.01), 'normal holes still move by a step');
}

{
  const spaces = Array.from({ length: 80 }, (_, i) => pipeSpacing(i, 'hard', 11));
  const opens = Array.from({ length: 80 }, (_, i) => pipeOpening(i, 'hard', 11));
  assert(spaces.every((gap) => gap >= WORLD.spacing - 64 - 0.01 && gap <= WORLD.spacing + 0.01), 'hard distances stay at or inside the original');
  assert(opens.every((open) => open >= WORLD.gap - 48 - 0.01 && open <= WORLD.gap + 0.01), 'hard openings stay at or inside the original');
  assert(Math.min(...spaces) < WORLD.spacing - 64 * 0.65, 'a hard run includes a close distance');
  assert(Math.max(...spaces) > WORLD.spacing - 64 * 0.35, 'a hard run still includes a wider distance');
  assert(Math.min(...opens) < WORLD.gap - 48 * 0.65, 'a hard run includes a short opening');
  assert(Math.max(...opens) > WORLD.gap - 48 * 0.35, 'a hard run still includes a taller opening');
  const run = createRun(11, 'hard');
  run.phase = 'play';
  run.snatchAt = null;
  const known = new Set<object>();
  let count = 0;
  const jumps: number[] = [];
  for (let guard = 0; count < 24 && guard < 12000; guard++) {
    const ahead = run.gates.find((gate) => gate.x + WORLD.pipeW >= WORLD.birdX - 40);
    run.bird.y = ahead ? ahead.gapY : WORLD.readyY;
    run.bird.vy = 0;
    step(run, 1 / 60);
    for (const gate of run.gates) {
      if (known.has(gate)) continue;
      known.add(gate);
      if (count > 0) {
        const prev = run.gates[run.gates.indexOf(gate) - 1];
        const gap = gate.x - prev.x;
        jumps.push(Math.abs(gate.gapY - prev.gapY));
        assert(Math.abs(gap - pipeSpacing(count - 1, 'hard', 11)) < 0.05, `hard gate ${count} keeps its rolled distance (${gap})`);
        assert(Math.abs(gate.open - pipeOpening(count - 1, 'hard', 11)) < 0.05, `hard gate ${count} keeps its rolled opening (${gate.open})`);
      }
      count += 1;
    }
  }
  assert(count >= 24, `hard lays out the gates (${count})`);
  assert(Math.max(...jumps) > WORLD.gapStep, 'a hard hole can jump farther than the original step');
}

{
  const phone = controlHints(true);
  const computer = controlHints(false);
  assert(phone.touch && phone.fly === 'tap to fly', 'a phone says tap');
  assert(phone.resume === 'tap to resume' && phone.retry === 'tap to try again', 'a phone stays on tap');
  assert(!phone.speak.includes('Space') && !phone.againSpeak.includes('Space'), 'a phone leaves the keyboard out');
  assert(!computer.touch && computer.fly === 'click or space to fly', 'a computer says click or space');
  assert(computer.resume === 'click or space to resume', 'a computer resumes with click or space');
  assert(computer.retry === 'click or space to try again', 'a computer retries with click or space');
  assert(
    computer.speak.includes('Space') && computer.speak.includes('Up') && computer.speak.includes('W'),
    'a computer names the flap keys',
  );
  assert(computer.resumeSpeak.includes('Space') && computer.againSpeak.includes('Space'), 'pause and retry name the keys');
}

{
  assert(THEMES.map((theme) => theme.id).join() === 'classic,roman,candy', 'maps stay in menu order');
  assert(THEMES.map((theme) => theme.name).join() === 'Classic,Roman,Candy', 'map names stay with their gates');
  assert(THEMES.every((theme) => isThemeId(theme.id)), 'every map id is a map');
  assert(!isThemeId('mars') && !isThemeId('reef') && !isThemeId('colony') && !isThemeId('pipes'), 'unknown maps fall through');
  assert(MODES.map((mode) => mode.id).join() === 'easy,normal,hard,test', 'difficulties stay in menu order');
  assert(MODES.find((mode) => mode.id === 'test')?.name === 'Game', 'the powers course is called Game');
  assert(isModeId('easy') && !isModeId('random') && !isModeId('starter'), 'removed difficulties fall through');
}

{
  assert(medalForScore(0) === null && medalForScore(29) === null, 'a short best has no medal');
  assert(medalForScore(30) === 'bronze' && medalForScore(69) === 'bronze', '30 earns bronze');
  assert(medalForScore(70) === 'silver' && medalForScore(99) === 'silver', '70 earns silver');
  assert(medalForScore(100) === 'ruby', '100 earns a ruby');
}

{
  const slow = createRun(1, 'test');
  flap(slow);
  slow.power = { kind: 'slow', age: 0, shots: 0 };
  step(slow, 0.05);
  assert(Math.abs(slow.scroll - WORLD.scroll * 0.5 * 0.05) < 1e-6, 'slow motion halves the scroll');
}

{
  const run = playable();
  run.power = { kind: 'phase', age: 4.47, shots: 0 };
  run.bird.y = 280;
  run.gates = [];
  step(run, 0.02);
  assert(run.power?.kind === 'phase', 'pass-through still has a moment left');
  step(run, 0.02);
  assert(run.power === null, 'pass-through wears off');
}

{
  const run = playable();
  run.power = { kind: 'phase', age: 0, shots: 0 };
  run.bird.y = 300;
  run.gates = [{ x: WORLD.birdX - 20, gapY: 40, open: 40, scored: false }];
  assert(!hits(run), 'pass-through ignores pipes');
  run.power = null;
  assert(hits(run), 'without pass-through the pipe is solid');
  run.power = { kind: 'phase', age: 0, shots: 0 };
  run.bird.y = groundY();
  assert(hits(run), 'pass-through still hits the ground');
}

{
  const run = playable();
  run.bird.y = WORLD.readyY;
  run.bird.vy = 0;
  run.power = { kind: 'slow', age: 1, shots: 0 };
  run.bolts = [{ x: 180, y: 200 }];
  run.pickups = [{ x: WORLD.birdX, y: run.bird.y, kind: 'gun' }];
  step(run, 0);
  assert(run.power?.kind === 'gun' && run.power.shots === GUN_SHOTS, 'a new power replaces the old one');
  assert(run.bolts.length === 0, 'replacing the blaster drops a shot in the air');
  assert(run.pickups.length === 0, 'the pickup is taken');
}

{
  const run = playable();
  run.power = { kind: 'gun', age: 0, shots: GUN_SHOTS };
  run.bird.y = 300;
  run.gates = [{ x: 240, gapY: 80, open: 80, scored: false }];
  assert(shoot(run) && run.power?.shots === 2, 'the blaster spends one charge');
  assert(shoot(run) && run.power?.shots === 1, 'the second shot spends another');
  let guard = 0;
  while (run.gates.some((gate) => gate.x < 400) && guard < 40) {
    step(run, 0.05);
    guard += 1;
  }
  assert(run.gates.every((gate) => gate.x >= 400), 'one shot removes the pipe it hits');
  assert(shoot(run), 'the last charge still fires');
  assert(run.power === null, 'the last shot puts the blaster away');
  assert(!shoot(run), 'there is no fourth shot');
}

{
  const armed = playable();
  armed.power = { kind: 'gun', age: 0, shots: GUN_SHOTS };
  assert(flap(armed), 'a flap still flies');
  assert(armed.power?.shots === GUN_SHOTS - 1 && armed.bolts.length === 1, 'a flap fires the blaster');
  const quiet = playable();
  quiet.power = { kind: 'slow', age: 0, shots: 0 };
  flap(quiet);
  assert(quiet.bolts.length === 0, 'a flap without the blaster does not fire');
  const title = createRun(1, 'test');
  title.power = { kind: 'gun', age: 0, shots: GUN_SHOTS };
  flap(title);
  assert(title.power?.shots === GUN_SHOTS && title.bolts.length === 0, 'the opening flap does not fire');
}

{
  const run = playable();
  run.power = { kind: 'gun', age: 0, shots: 2 };
  run.gates = [{ x: 900, gapY: 300, open: WORLD.gap, scored: false }];
  for (let i = 0; i < 30; i++) step(run, 0.05);
  assert(run.power?.kind === 'gun' && run.power.shots === 2, 'the blaster stays until its shots are gone');
}

{
  const normal = playable();
  normal.mode = 'normal';
  normal.bird.y = 300;
  normal.gates = [{ x: 100, gapY: 300, open: WORLD.gap, scored: false }];
  normal.placed = 2;
  step(normal, 0.05);
  assert(normal.pickups.length === 0 && normal.portals.length === 0, 'normal has no powers');

  const powered = playable();
  powered.mode = 'test';
  powered.bird.y = 300;
  powered.gates = [{ x: 100, gapY: 300, open: WORLD.gap, scored: false }];
  powered.placed = 1;
  powered.portalAt = 1;
  step(powered, 0.05);
  assert(powered.pickups.length === 1, 'test plants a power between pipes');
  const prev = powered.gates[powered.gates.length - 2];
  const born = powered.gates[powered.gates.length - 1];
  const top = Math.max(prev.gapY - prev.open / 2, born.gapY - born.open / 2);
  const bot = Math.min(prev.gapY + prev.open / 2, born.gapY + born.open / 2);
  const y = bot > top ? (top + bot) / 2 : (prev.gapY + born.gapY) / 2;
  assert(Math.abs(powered.pickups[0].y - y) < 0.01, 'the power sits in the shared opening');
  assert(Math.abs(powered.pickups[0].x - (prev.x + WORLD.pipeW + born.x) / 2) < 0.01, 'the power sits between the pipes');

}

function portalMarks(seed: number, pipes: number): number[] {
  const run = createRun(seed, 'test');
  run.phase = 'play';
  run.snatchAt = null;
  run.bird.y = 12;
  const marks: number[] = [];
  let guard = 0;
  while (run.placed < pipes && guard < pipes + 5) {
    guard += 1;
    if (run.gates.length > 0) {
      const last = run.gates[run.gates.length - 1];
      run.gates = [last];
      last.x = 0;
    }
    const before = run.portals.length;
    step(run, 0);
    if (run.portals.length > before) marks.push(run.placed);
  }
  return marks;
}

{
  const firsts = new Set<number>();
  let doubles = 0;
  let early = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const marks = portalMarks(seed, 400);
    assert(marks.length > 0, `seed ${seed} eventually rolls a stargate`);
    firsts.add(marks[0]);
    if (marks[0] <= 20) early += 1;
    if (marks.length > 1) doubles += 1;
    for (let i = 1; i < marks.length; i++) {
      assert(marks[i] - marks[i - 1] > 20, `seed ${seed} waits 20 pipes (${marks[i - 1]} then ${marks[i]})`);
    }
  }
  assert(firsts.size > 1, 'the first stargate is not on a fixed pipe');
  assert(early > 0, 'a stargate can show up before pipe 20');
  assert(doubles > 0, 'after the quiet pipes the roll starts again');
}

{
  const run = playable();
  run.time = 0;
  run.bird.vy = 0;
  run.bird.y = portalY({ x: WORLD.birdX, phase: 0 }, 0);
  run.portals = [{ x: WORLD.birdX, phase: 0 }];
  run.gates = [{ x: 360, gapY: 300, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.score === WARP_PIPES, 'the stargate skips ten pipes');
  assert(run.portals.length === 0, 'the stargate is spent');
  assert(run.gates.length === 1 && run.gates[0].x > WORLD.birdX + 200, 'the next pipe is ahead');
}

{
  const run = playable();
  run.bird.y = 12;
  run.portals = [{ x: 320, phase: 0 }];
  const before = portalY(run.portals[0], run.time);
  step(run, 0.05);
  assert(portalY(run.portals[0], run.time) !== before, 'the stargate races up and down');
  assert(run.portals[0].x < 320, 'the stargate scrolls with the pipes');
  assert(run.score === 0, 'missing the stargate does not skip ahead');
}

{
  const phone = playable();
  phone.gates = [];
  step(phone, 0);
  assert(phone.gates.length === 1, 'the phone still starts with one pipe');
  const wide = playable();
  wide.viewRight = 980;
  wide.gates = [];
  step(wide, 0);
  assert(wide.gates.length > 1, 'a wide view shows more than one pipe');
  assert(wide.gates[wide.gates.length - 1].x > WORLD.w, 'the last pipe sits past the phone width');
  wide.viewLeft = -520;
  wide.gates.push({ x: -240, gapY: 300, open: WORLD.gap, scored: true });
  step(wide, 0);
  assert(wide.gates.some((gate) => gate.x < -80), 'a pipe stays until it leaves a wide screen');
  const huge = playable();
  huge.viewRight = 4000;
  huge.gates = [];
  step(huge, 0);
  assert(huge.gates.length <= 4, 'a huge screen still keeps only a few pipes');
  const last = huge.gates[huge.gates.length - 1];
  assert(last.x > WORLD.w, 'the extra pipes still sit past the phone');
  assert(last.x <= WORLD.w + pipeSpacing(0) * 2 + WORLD.pipeW, 'pipes stop a couple of columns past the phone');
}

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}

console.log('ok');
