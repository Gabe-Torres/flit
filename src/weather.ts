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

export function terrainFor(id: WeatherId): Terrain {
  if (id === 'rain') {
    return { hillFar: 0xa8c48a, hillNear: 0x6fa35a, grass: 0x4f9a44, grassDark: 0x3d7c36, dirt: 0xc49a58, tuft: 0x6bb84e, lean: 2 };
  }
  if (id === 'storm') {
    return { hillFar: 0x6d8a5c, hillNear: 0x4f7a40, grass: 0x3e6e34, grassDark: 0x2f5528, dirt: 0x8d7348, tuft: 0x5a9a40, lean: 5 };
  }
  if (id === 'blizzard') {
    return { hillFar: 0xd7e7ee, hillNear: 0xc5ddd6, grass: 0xeef6f8, grassDark: 0xd5e4ea, dirt: 0xd8c4a4, tuft: 0xffffff, lean: 3 };
  }
  if (id === 'heat') {
    return { hillFar: 0xd6c36a, hillNear: 0xc4a24a, grass: 0xc6a24e, grassDark: 0xa8843a, dirt: 0xe08a3c, tuft: 0xd2b15a, lean: 0 };
  }
  if (id === 'fog') {
    return { hillFar: 0xc5d2b4, hillNear: 0x9bb48a, grass: 0x7eae72, grassDark: 0x6a9660, dirt: 0xd2c09a, tuft: 0xa8cc88, lean: 0 };
  }
  if (id === 'wind') {
    return { hillFar: 0xc5e39a, hillNear: 0x8bc56a, grass: 0x63b44a, grassDark: 0x4b9a38, dirt: 0xe3b45c, tuft: 0x7dcc55, lean: 8 };
  }
  return { hillFar: 0xc5e39a, hillNear: 0x8bc56a, grass: 0x63b44a, grassDark: 0x4b9a38, dirt: 0xe3b45c, tuft: 0x7dcc55, lean: 0 };
}
