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

function onEasterWeekend(date: Date): boolean {
  const easter = easterSunday(date.getFullYear());
  const sunday = new Date(date.getFullYear(), easter.month, easter.day);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const from = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() - 1);
  const to = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 1);
  const time = day.getTime();
  return time >= from.getTime() && time <= to.getTime();
}

// Fourth Thursday of November, plus the Friday after.
function onThanksgiving(date: Date): boolean {
  if (date.getMonth() !== 10) return false;
  const first = new Date(date.getFullYear(), 10, 1).getDay();
  const thursday = 1 + ((4 - first + 7) % 7) + 21;
  const day = date.getDate();
  return day === thursday || day === thursday + 1;
}

// Local calendar. A holiday covers its own day, and a short stretch around
// the ones people keep up for more than a morning.
export function holidayForDate(date: Date): HolidayId | null {
  const month = date.getMonth();
  const day = date.getDate();
  if ((month === 11 && day === 31) || (month === 0 && day === 1)) return 'newyear';
  if (month === 1 && day >= 13 && day <= 15) return 'valentine';
  if (month === 2 && day === 17) return 'patrick';
  if (onEasterWeekend(date)) return 'easter';
  if (month === 9 && day >= 24 && day <= 31) return 'halloween';
  if (onThanksgiving(date)) return 'thanksgiving';
  if (month === 11 && day >= 18 && day <= 26) return 'christmas';
  return null;
}
