import { WORLD } from './sim.ts';

// How long the printer rattles on the desk before it blows.
export const HEAT_TIME = 0.9;
export const BLAST_VY = -780;
// The drawn body ends 10px below its center. One pixel sinks into the desktop.
const SIT = 9;

export type PrinterHeat = {
  scroll: number;
  age: number;
  launched: boolean;
};

export function deskTop(floor: number): number {
  return floor - 40;
}

export function printerSeat(floor: number): number {
  return deskTop(floor) - SIT;
}

export function deskX(scroll: number, startScroll: number | null, launched: boolean): number {
  if (!launched || startScroll == null) return WORLD.birdX;
  return WORLD.birdX - (scroll - startScroll);
}

export function printerPose(
  floor: number,
  time: number,
  scroll: number,
  heat: PrinterHeat | null,
): { x: number; y: number; rot: number; heat: number; flash: number } {
  const launched = heat?.launched === true;
  const age = heat?.age ?? null;
  const level = launched ? 1 : age == null ? 0.18 + 0.07 * Math.sin(time * 2.6) : Math.min(1, age / HEAT_TIME);
  let y = 0;
  let rot = 0;
  if (!launched) {
    const buzz = age == null ? Math.sin(time * 14) : Math.sin(age * 48);
    const amp = age == null ? 0.35 : 1.2 + level * 4.2;
    y = buzz * amp;
    rot = buzz * amp * 0.055;
  }
  const since = launched && age != null ? Math.max(0, age - HEAT_TIME) : 0;
  return {
    x: deskX(scroll, heat?.scroll ?? null, launched),
    y: printerSeat(floor) + y,
    rot,
    heat: level,
    flash: launched ? Math.max(0, 1 - since / 0.26) : 0,
  };
}
