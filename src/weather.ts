import type { SeasonId } from './season.ts';

export const WEATHERS = [
  { id: 'clear', name: 'Clear' },
  { id: 'rain', name: 'Rain' },
  { id: 'storm', name: 'Storm' },
  { id: 'blizzard', name: 'Blizzard' },
  { id: 'heat', name: 'Heat wave' },
  { id: 'fog', name: 'Fog' },
  { id: 'wind', name: 'Wind' },
] as const;

export type WeatherId = (typeof WEATHERS)[number]['id'];

const BY_ID = new Map(WEATHERS.map((weather) => [weather.id, weather]));

export function weatherForSeed(seed: number): WeatherId {
  const n = seed >>> 0 || 1;
  return WEATHERS[n % WEATHERS.length].id;
}

export function weatherById(id: WeatherId): (typeof WEATHERS)[number] {
  return BY_ID.get(id) ?? WEATHERS[0];
}

export type Terrain = {
  hillFar: number;
  hillNear: number;
  grass: number;
  grassDark: number;
  dirt: number;
  tuft: number;
  lean: number;
};

const SEASON_LAND: Record<SeasonId, Terrain> = {
  spring: { hillFar: 0xb7d98a, hillNear: 0x7dbe62, grass: 0x5aaa48, grassDark: 0x438838, dirt: 0xd7b07a, tuft: 0xf2a0c0, lean: 1 },
  summer: { hillFar: 0xc5e39a, hillNear: 0x8bc56a, grass: 0x63b44a, grassDark: 0x4b9a38, dirt: 0xe3b45c, tuft: 0x7dcc55, lean: 0 },
  autumn: { hillFar: 0xe0a05a, hillNear: 0xc47a3a, grass: 0xb56830, grassDark: 0x8d4e24, dirt: 0xc49058, tuft: 0xe07030, lean: 2 },
  winter: { hillFar: 0xd5e2ea, hillNear: 0xc5d4de, grass: 0xe8f2f4, grassDark: 0xd0e0e6, dirt: 0xcbb892, tuft: 0xffffff, lean: 0 },
};

function shade(color: number, amount: number): number {
  const r = Math.round(((color >> 16) & 255) * amount);
  const g = Math.round(((color >> 8) & 255) * amount);
  const b = Math.round((color & 255) * amount);
  return (r << 16) | (g << 8) | b;
}

function tint(land: Terrain, amount: number): Terrain {
  return {
    hillFar: shade(land.hillFar, amount),
    hillNear: shade(land.hillNear, amount),
    grass: shade(land.grass, amount),
    grassDark: shade(land.grassDark, amount),
    dirt: shade(land.dirt, amount),
    tuft: shade(land.tuft, amount),
    lean: land.lean,
  };
}

export function terrainFor(id: WeatherId, season: SeasonId): Terrain {
  if (id === 'blizzard') {
    return { hillFar: 0xd7e7ee, hillNear: 0xc5ddd6, grass: 0xeef6f8, grassDark: 0xd5e4ea, dirt: 0xd8c4a4, tuft: 0xffffff, lean: 3 };
  }
  if (id === 'heat') {
    return { hillFar: 0xd6c36a, hillNear: 0xc4a24a, grass: 0xc6a24e, grassDark: 0xa8843a, dirt: 0xe08a3c, tuft: 0xd2b15a, lean: 0 };
  }
  const land = SEASON_LAND[season];
  if (id === 'storm') return tint(land, 0.58);
  if (id === 'rain') return tint(land, 0.84);
  if (id === 'fog') return tint(land, 0.9);
  if (id === 'wind') return { ...land, lean: land.lean + 8 };
  return land;
}
