export const SEASONS = [
  { id: 'spring', name: 'Spring' },
  { id: 'summer', name: 'Summer' },
  { id: 'autumn', name: 'Autumn' },
  { id: 'winter', name: 'Winter' },
] as const;

export type SeasonId = (typeof SEASONS)[number]['id'];

const BY_ID = new Map(SEASONS.map((season) => [season.id, season]));

export function seasonForDate(date: Date): SeasonId {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function seasonById(id: SeasonId): (typeof SEASONS)[number] {
  return BY_ID.get(id) ?? SEASONS[1];
}
