import {
  SNATCH_DURATION,
  WORLD,
  createRun,
  flap,
  flightFacts,
  groundY,
  hits,
  pipeOpening,
  pipeSpacing,
  pipesClearTime,
  planSnatch,
  restY,
  snatchPose,
  step,
} from './sim.ts';
import { controlHints } from './controls.ts';
import { holidayForDate } from './holiday.ts';
import { seasonForDate } from './season.ts';
import { WEATHERS, terrainFor, weatherForSeed } from './weather.ts';

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
  const seen = new Set(Array.from({ length: 40 }, (_, i) => weatherForSeed(i + 1)));
  assert(seen.size === WEATHERS.length, 'seeds cover every weather');
  assert(createRun(4).weather === weatherForSeed(4), 'a run keeps its weather');
  assert(createRun(4).season === seasonForDate(new Date()), 'a run keeps the season');
  assert(createRun(4).holiday === holidayForDate(new Date()), 'a run keeps the holiday');
  assert(createRun(4).mode === 'starter', 'starter is the default course');
  assert(createRun(4, 'hard').mode === 'hard', 'a run keeps the hard course');
  assert(createRun(4, 'normal').mode === 'normal', 'a run keeps the normal course');
  assert(seasonForDate(new Date(2026, 2, 1)) === 'spring', 'March is spring');
  assert(seasonForDate(new Date(2026, 4, 31)) === 'spring', 'May is spring');
  assert(seasonForDate(new Date(2026, 5, 1)) === 'summer', 'June is summer');
  assert(seasonForDate(new Date(2026, 7, 31)) === 'summer', 'August is summer');
  assert(seasonForDate(new Date(2026, 8, 1)) === 'autumn', 'September is autumn');
  assert(seasonForDate(new Date(2026, 10, 30)) === 'autumn', 'November is autumn');
  assert(seasonForDate(new Date(2026, 11, 1)) === 'winter', 'December is winter');
  assert(seasonForDate(new Date(2026, 0, 15)) === 'winter', 'January is winter');
  assert(seasonForDate(new Date(2026, 1, 28)) === 'winter', 'February is winter');
  assert(terrainFor('clear', 'autumn').grass !== terrainFor('clear', 'summer').grass, 'autumn grass is its own color');
  assert(terrainFor('clear', 'spring').tuft !== terrainFor('clear', 'summer').tuft, 'spring tufts are their own color');
  assert(terrainFor('blizzard', 'autumn').grass === terrainFor('blizzard', 'summer').grass, 'a blizzard stays snowy');
  assert(terrainFor('storm', 'autumn').grass !== terrainFor('clear', 'autumn').grass, 'a storm darkens the season');
  assert(holidayForDate(new Date(2026, 9, 11)) === null, 'October 11 is an ordinary autumn day');
  assert(seasonForDate(new Date(2026, 9, 11)) === 'autumn', 'October 11 is autumn');
  assert(holidayForDate(new Date(2026, 9, 23)) === null, 'October 23 is still autumn');
  assert(holidayForDate(new Date(2026, 9, 24)) === 'halloween', 'October 24 starts Halloween');
  assert(holidayForDate(new Date(2026, 9, 31)) === 'halloween', 'October 31 is Halloween');
  assert(holidayForDate(new Date(2026, 10, 1)) === null, 'November 1 is autumn again');
  assert(holidayForDate(new Date(2024, 10, 28)) === 'thanksgiving', 'Thanksgiving 2024 is November 28');
  assert(holidayForDate(new Date(2024, 10, 29)) === 'thanksgiving', 'the Friday after Thanksgiving 2024 stays');
  assert(holidayForDate(new Date(2025, 10, 27)) === 'thanksgiving', 'Thanksgiving 2025 is November 27');
  assert(holidayForDate(new Date(2025, 10, 26)) === null, 'the Wednesday before Thanksgiving stays autumn');
  assert(holidayForDate(new Date(2026, 10, 26)) === 'thanksgiving', 'Thanksgiving 2026 is November 26');
  assert(holidayForDate(new Date(2026, 11, 17)) === null, 'December 17 is winter');
  assert(holidayForDate(new Date(2026, 11, 18)) === 'christmas', 'December 18 starts Christmas');
  assert(holidayForDate(new Date(2026, 11, 25)) === 'christmas', 'December 25 is Christmas');
  assert(seasonForDate(new Date(2026, 11, 25)) === 'winter', 'Christmas day is still winter');
  assert(holidayForDate(new Date(2026, 11, 27)) === null, 'December 27 is winter again');
  assert(holidayForDate(new Date(2026, 11, 31)) === 'newyear', 'New Year starts on the eve');
  assert(holidayForDate(new Date(2027, 0, 1)) === 'newyear', 'January 1 is New Year');
  assert(holidayForDate(new Date(2027, 0, 2)) === null, 'January 2 is winter');
  assert(holidayForDate(new Date(2026, 1, 12)) === null, 'February 12 is winter');
  assert(holidayForDate(new Date(2026, 1, 14)) === 'valentine', "February 14 is Valentine's");
  assert(holidayForDate(new Date(2026, 1, 16)) === null, 'February 16 is winter');
  assert(holidayForDate(new Date(2026, 2, 16)) === null, 'March 16 is spring');
  assert(holidayForDate(new Date(2026, 2, 17)) === 'patrick', "March 17 is St. Patrick's");
  assert(holidayForDate(new Date(2024, 2, 30)) === 'easter', 'the Saturday of Easter 2024 counts');
  assert(holidayForDate(new Date(2024, 2, 31)) === 'easter', 'Easter 2024 is March 31');
  assert(holidayForDate(new Date(2024, 3, 1)) === 'easter', 'Easter Monday 2024 counts');
  assert(holidayForDate(new Date(2024, 2, 29)) === null, 'the Friday before Easter 2024 stays spring');
  assert(holidayForDate(new Date(2025, 3, 20)) === 'easter', 'Easter 2025 is April 20');
  assert(holidayForDate(new Date(2026, 3, 5)) === 'easter', 'Easter 2026 is April 5');
  assert(holidayForDate(new Date(2020, 3, 12)) === 'easter', 'Easter 2020 is April 12');
  assert(seasonForDate(new Date(2026, 6, 4)) === 'summer', 'July 4 is summer');
  assert(holidayForDate(new Date(2026, 6, 4)) === null, 'July 4 keeps the summer field');
  assert(terrainFor('clear', 'autumn', 'halloween').grass !== terrainFor('clear', 'autumn').grass, 'halloween has its own ground');
  assert(terrainFor('clear', 'winter', 'christmas').tuft !== terrainFor('clear', 'winter').tuft, 'christmas tufts are their own color');
  assert(terrainFor('blizzard', 'winter', 'christmas').grass === terrainFor('blizzard', 'summer').grass, 'a blizzard stays snowy on a holiday');
  assert(
    terrainFor('storm', 'autumn', 'halloween').grass !== terrainFor('clear', 'autumn', 'halloween').grass,
    'a storm darkens the holiday',
  );
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
  assert(run.phase === 'dying', 'death starts in the air');
  assert(flap(run) === false, 'no flap while falling');
  for (let i = 0; i < 180; i++) step(run, 1 / 60);
  assert(run.phase === 'over', 'the bird lands, then the run is over');
  assert(run.bird.y === restY(), 'the bird rests on the ground');
  assert(flap(run) === false, 'no flap on the score card');
  assert(run.taps === 0, 'a flap on the score card does not count');
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
  assert(run.score < 5, `the opening is still the wide stretch (${run.score})`);
  assert(run.gates.length >= 2, 'gates keep coming');
  assert(run.gates.every((gate) => gate.open === pipeOpening(0)), 'early openings stay tall');
  for (let i = 1; i < run.gates.length; i++) {
    const gap = run.gates[i].x - run.gates[i - 1].x;
    assert(Math.abs(gap - pipeSpacing(0)) < 0.05, `early gates stay wide (${gap})`);
  }
  for (let i = 1; i < run.gates.length; i++) {
    const jump = Math.abs(run.gates[i].gapY - run.gates[i - 1].gapY);
    assert(jump <= WORLD.gapStep + 0.01, `gaps do not jump more than ${WORLD.gapStep} (${jump})`);
  }
}

{
  assert(pipeSpacing(0) === pipeSpacing(4), 'the first five pipes share a distance');
  assert(pipeSpacing(0) > pipeSpacing(5), 'pipe five pulls the next gate closer');
  const tighten = pipeSpacing(0) - pipeSpacing(5);
  assert(tighten === 30, 'each five pipes closes the gap by 30');
  assert(tighten === pipeSpacing(5) - pipeSpacing(10), 'the second step matches');
  assert(tighten === pipeSpacing(10) - pipeSpacing(15), 'the third step matches');
  assert(pipeSpacing(19) === WORLD.spacing + tighten, 'pipe 19 is one step easier than the floor');
  assert(pipeSpacing(20) === WORLD.spacing, 'pipe 20 is the closest the gates get');
  assert(pipeSpacing(40) === WORLD.spacing, 'later pipes stay at the closest distance');
  assert(pipeOpening(0) === WORLD.gap + (pipeSpacing(0) - WORLD.spacing), 'the opening eases by the same amount');
  assert(pipeOpening(0) === pipeOpening(4), 'the first five pipes share an opening');
  assert(pipeOpening(0) - pipeOpening(5) === pipeSpacing(0) - pipeSpacing(5), 'each five pipes shortens the opening like the distance');
  assert(pipeOpening(20) === WORLD.gap, 'pipe 20 is the narrowest opening');
  assert(pipeOpening(40) === WORLD.gap, 'later openings stay narrow');
  assert(pipeSpacing(0, 'normal') === WORLD.spacing && pipeSpacing(40, 'normal') === WORLD.spacing, 'normal keeps the original distance');
  assert(pipeOpening(0, 'normal') === WORLD.gap && pipeOpening(40, 'normal') === WORLD.gap, 'normal keeps the original opening');
  assert(pipeSpacing(0, 'starter') > pipeSpacing(0, 'normal'), 'starter begins wider than the original');
  const runWide = playable();
  runWide.bird.y = 320 + 100;
  runWide.gates = [{ x: WORLD.birdX - 20, gapY: 320, open: pipeOpening(0), scored: false }];
  assert(!hits(runWide), 'the early opening clears a bird 100px off center');
  runWide.gates[0].open = pipeOpening(40);
  assert(hits(runWide), 'the final opening hits that same bird');

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
  assert(run.score >= 45, `the run reaches the tight gates (${run.score})`);
  assert(gaps.length >= 45, `enough gates were measured (${gaps.length})`);
  for (let i = 0; i < gaps.length; i++) {
    assert(Math.abs(gaps[i] - pipeSpacing(i)) < 0.05, `gate ${i + 1} uses spacing ${pipeSpacing(i)} (${gaps[i]})`);
  }
}

{
  assert(planSnatch(1) === null, 'an ordinary seed stays safe');
  const at = planSnatch(192);
  assert(at != null && at >= 0.55 && at < pipesClearTime(), `the grab is before twenty-five pipes (${at})`);
  let invites = 0;
  for (let seed = 1; seed <= 1000000; seed++) if (planSnatch(seed) != null) invites += 1;
  assert(invites === 9965, `the first million seeds invite the pterodactyl 9965 times (${invites})`);
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
  assert(run.score < 25, `the grab is before twenty-five pipes (${run.score})`);
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
  const run = playable();
  run.bird.y = 300;
  run.snatchAt = 0;
  run.gates = [{ x: WORLD.birdX - WORLD.pipeW - 1, gapY: 300, open: WORLD.gap, scored: false }];
  step(run, 0);
  assert(run.phase === 'snatched', 'a due grab happens before scoring');
  assert(run.score === 0, 'the grab skips the pipe');
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

function clearedLayout(seed: number, mode: 'starter' | 'normal' | 'hard', pipes: number): { gaps: number[]; opens: number[]; jumps: number[] } {
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
  const wide = pipeSpacing(0, 'starter');
  const tall = pipeOpening(0, 'starter');
  const layout = clearedLayout(11, 'hard', 36);
  assert(layout.gaps.length >= 36, `hard lays out the gates (${layout.gaps.length})`);
  const span = wide - WORLD.spacing;
  assert(layout.gaps.every((gap) => gap >= WORLD.spacing - 0.01 && gap <= wide + 0.01), 'hard distances stay between large and small');
  assert(layout.opens.every((open) => open >= WORLD.gap - 0.01 && open <= tall + 0.01), 'hard openings stay between large and small');
  assert(Math.min(...layout.gaps) < WORLD.spacing + span * 0.35, 'a hard run includes a small distance');
  assert(Math.max(...layout.gaps) > WORLD.spacing + span * 0.65, 'a hard run includes a large distance');
  assert(Math.min(...layout.opens) < WORLD.gap + span * 0.35, 'a hard run includes a small opening');
  assert(Math.max(...layout.opens) > WORLD.gap + span * 0.65, 'a hard run includes a large opening');
  assert(layout.jumps.every((jump) => jump <= WORLD.gapStep + 0.01), 'hard holes still move by a step');
  for (let i = 0; i < layout.gaps.length; i++) {
    assert(Math.abs(layout.gaps[i] - pipeSpacing(i, 'hard', 11)) < 0.05, `hard gate ${i + 1} keeps its rolled distance`);
    assert(Math.abs(layout.opens[i] - pipeOpening(i, 'hard', 11)) < 0.05, `hard gate ${i + 1} keeps its rolled opening`);
  }
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

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}

console.log('ok');
