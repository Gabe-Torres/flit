import { WORLD } from './sim.ts';

export const RAMP_AHEAD = 170;
export const RAMP_RUN = 86;
export const RAMP_RISE = 50;
export const RAMP_LAUNCH = -700;

export type RunnerRide = {
  scroll: number;
  launched: boolean;
};

export function runnerSkim(floor: number): number {
  return floor - 24;
}

export function rampLip(scroll: number, startScroll: number | null): number {
  const traveled = startScroll == null ? 0 : scroll - startScroll;
  return WORLD.birdX + RAMP_AHEAD - traveled;
}

export function runnerRideY(floor: number, lipX: number): { y: number; rot: number; launch: boolean } {
  const skim = runnerSkim(floor);
  const toe = lipX - RAMP_RUN;
  if (WORLD.birdX < toe) return { y: skim, rot: 0, launch: false };
  const t = Math.min(1, (WORLD.birdX - toe) / RAMP_RUN);
  const rot = -Math.atan2(RAMP_RISE, RAMP_RUN) * t;
  return { y: skim - RAMP_RISE * t, rot, launch: t >= 1 };
}
