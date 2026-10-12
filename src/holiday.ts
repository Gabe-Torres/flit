import { seasonById, type SeasonId } from './season.ts';

export const HOLIDAYS = [
  { id: 'newyear', name: 'New Year' },
  { id: 'valentine', name: "Valentine's" },
  { id: 'patrick', name: "St. Patrick's" },
  { id: 'easter', name: 'Easter' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'thanksgiving', name: 'Thanksgiving' },
  { id: 'christmas', name: 'Christmas' },
] as const;

export type HolidayId = (typeof HOLIDAYS)[number]['id'];

const BY_ID = new Map(HOLIDAYS.map((holiday) => [holiday.id, holiday]));

export function holidayById(id: HolidayId): (typeof HOLIDAYS)[number] {
  return BY_ID.get(id) ?? HOLIDAYS[0];
}

export function fieldName(season: SeasonId, holiday: HolidayId | null): string {
  return holiday ? holidayById(holiday).name : seasonById(season).name;
}

// Anonymous Gregorian computus. Month is 0-based, matching Date.
function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month: month - 1, day };
}

// A holiday dresses the whole month it belongs to. Easter keeps the month of
// Easter Sunday. When that Sunday is in March, St. Patrick's keeps the days
// before the midpoint between March 17 and Easter.
export function holidayForDate(date: Date): HolidayId | null {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 0) return 'newyear';
  if (month === 1) return 'valentine';
  if (month === 9) return 'halloween';
  if (month === 10) return 'thanksgiving';
  if (month === 11) return 'christmas';
  const easter = easterSunday(date.getFullYear());
  if (month === 2 && easter.month === 2) {
    const mid = Math.floor((17 + easter.day) / 2);
    return day < mid ? 'patrick' : 'easter';
  }
  if (month === easter.month) return 'easter';
  if (month === 2) return 'patrick';
  return null;
}
