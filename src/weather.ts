import type { HolidayId } from './holiday.ts';
import type { SeasonId } from './season.ts';

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

const HOLIDAY_LAND: Record<HolidayId, Terrain> = {
  newyear: { hillFar: 0xd5e2ea, hillNear: 0xc5d4de, grass: 0xeef6f8, grassDark: 0xd5e4ea, dirt: 0xcbb892, tuft: 0xffe08a, lean: 0 },
  valentine: { hillFar: 0xf2b6c8, hillNear: 0xe08aa4, grass: 0xd46a8c, grassDark: 0xb55274, dirt: 0xe3b8a0, tuft: 0xfffdf6, lean: 0 },
  patrick: { hillFar: 0x8fd18a, hillNear: 0x3aaa44, grass: 0x2f8a38, grassDark: 0x1f6a28, dirt: 0xc6a15a, tuft: 0x7dcc55, lean: 0 },
  easter: { hillFar: 0xf7d0e4, hillNear: 0xc5e6a0, grass: 0x8ed07a, grassDark: 0x6bb45e, dirt: 0xe8c898, tuft: 0xfff3b0, lean: 0 },
  halloween: { hillFar: 0x6a4a78, hillNear: 0x4e3560, grass: 0x3d5a32, grassDark: 0x2c4224, dirt: 0xc49058, tuft: 0xe07030, lean: 1 },
  thanksgiving: { hillFar: 0xe08a3c, hillNear: 0xc46a28, grass: 0xa85a22, grassDark: 0x8a4418, dirt: 0xc49058, tuft: 0xf0c14b, lean: 1 },
  christmas: { hillFar: 0xd5e2ea, hillNear: 0xc5d4de, grass: 0xf4f8fa, grassDark: 0xd5e6ee, dirt: 0xcbb892, tuft: 0xe23d3d, lean: 0 },
};

export function terrainFor(season: SeasonId, holiday: HolidayId | null = null): Terrain {
  return holiday ? HOLIDAY_LAND[holiday] : SEASON_LAND[season];
}
