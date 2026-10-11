import type { Graphics } from 'pixi.js';

export const BIRD_IDS = ['finch', 'eagle', 'flamingo', 'penguin', 'cardinal', 'bluejay'] as const;

export type BirdId = (typeof BIRD_IDS)[number];

export type BirdKind = {
  id: BirdId;
  name: string;
  feather: string;
  icon: string;
};

const INK = '#2b2118';
const STROKE = '#6a3d16';

function icon(inner: string): string {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${inner}</svg>`;
}

export const BIRDS: readonly BirdKind[] = [
  {
    id: 'finch',
    name: 'Finch',
    feather: '#ffe08a',
    icon: icon(
      `<ellipse cx="13" cy="18" rx="9" ry="7" fill="#ffd34d" stroke="${STROKE}" stroke-width="1.6"/>` +
        `<ellipse cx="14" cy="20" rx="5" ry="3.6" fill="#fff3c4"/>` +
        `<path d="M19 16.5 28 18.5 19 21.5Z" fill="#ef7a2f" stroke="${STROKE}" stroke-width="1.3" stroke-linejoin="round"/>` +
        `<circle cx="17" cy="15.5" r="2.5" fill="#fff" stroke="${STROKE}" stroke-width="1.2"/>` +
        `<circle cx="18" cy="15.5" r="1.1" fill="${INK}"/>`,
    ),
  },
  {
    id: 'eagle',
    name: 'Eagle',
    feather: '#e7d3b0',
    icon: icon(
      `<ellipse cx="13" cy="19" rx="9" ry="6.5" fill="#8d5a32" stroke="${STROKE}" stroke-width="1.6"/>` +
        `<circle cx="20" cy="14" r="5" fill="#fffdf6" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<path d="M23 13.2 30 15.4 24 17.2Z" fill="#f2c14b" stroke="${STROKE}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<circle cx="21.5" cy="13.2" r="1.3" fill="${INK}"/>`,
    ),
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    feather: '#ffc2d4',
    icon: icon(
      `<path d="M8 24 4 28M12 24 9 29" stroke="#f4b183" stroke-width="1.6" stroke-linecap="round"/>` +
        `<ellipse cx="12" cy="21" rx="8" ry="5" fill="#ff8fb8" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<path d="M16 18c2-8 6-10 10-8" stroke="${STROKE}" stroke-width="4.2" stroke-linecap="round" fill="none"/>` +
        `<path d="M16 18c2-8 6-10 10-8" stroke="#ff8fb8" stroke-width="2.6" stroke-linecap="round" fill="none"/>` +
        `<circle cx="26" cy="9.5" r="3" fill="#ffb7cf" stroke="${STROKE}" stroke-width="1.2"/>` +
        `<path d="M28 9.2 32 12.2 28 11.2Z" fill="#fffdf6" stroke="${INK}" stroke-width="0.8"/>`,
    ),
  },
  {
    id: 'penguin',
    name: 'Penguin',
    feather: '#f4f1ea',
    icon: icon(
      `<ellipse cx="16" cy="18" rx="8" ry="10" fill="#241c16" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<ellipse cx="12" cy="14" rx="2.1" ry="1.5" fill="#f2c14b"/>` +
        `<ellipse cx="20" cy="14" rx="2.1" ry="1.5" fill="#f2c14b"/>` +
        `<ellipse cx="16" cy="20" rx="5" ry="6.5" fill="#fffdf6"/>` +
        `<path d="M19 16.5 26 18.4 19 20.2Z" fill="#ef7a2f" stroke="${STROKE}" stroke-width="1" stroke-linejoin="round"/>` +
        `<circle cx="19" cy="15.2" r="1.3" fill="#fff"/>` +
        `<circle cx="19.5" cy="15.2" r="0.6" fill="${INK}"/>`,
    ),
  },
  {
    id: 'cardinal',
    name: 'Cardinal',
    feather: '#ffb4b4',
    icon: icon(
      `<path d="M13 13 16 4 19 13Z" fill="#d43232" stroke="${STROKE}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<ellipse cx="15" cy="19" rx="8" ry="6.5" fill="#e23d3d" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<ellipse cx="20" cy="18" rx="3.4" ry="2.5" fill="${INK}"/>` +
        `<path d="M21 17 29 19 21 21Z" fill="#f08a2a" stroke="${STROKE}" stroke-width="1.1" stroke-linejoin="round"/>` +
        `<circle cx="18.5" cy="16.2" r="1.3" fill="#fff"/>` +
        `<circle cx="19" cy="16.2" r="0.6" fill="${INK}"/>`,
    ),
  },
  {
    id: 'bluejay',
    name: 'Blue jay',
    feather: '#c5e4ff',
    icon: icon(
      `<path d="M12 13 16 4 20 13Z" fill="#2f6bc4" stroke="${STROKE}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<ellipse cx="15" cy="19" rx="8" ry="6.5" fill="#3b82e0" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<ellipse cx="16" cy="21.5" rx="4.5" ry="3" fill="#fffdf6"/>` +
        `<circle cx="20" cy="16" r="3.2" fill="#fffdf6" stroke="${STROKE}" stroke-width="1.1"/>` +
        `<path d="M22 16 29 17.6 22 19Z" fill="${INK}"/>` +
        `<circle cx="21" cy="15.4" r="1" fill="${INK}"/>`,
    ),
  },
];

const BY_ID = new Map(BIRDS.map((bird) => [bird.id, bird]));

export function isBirdId(value: string): value is BirdId {
  return BY_ID.has(value as BirdId);
}

export function birdById(id: BirdId): BirdKind {
  return BY_ID.get(id) ?? BIRDS[0];
}

const OUTLINE = { width: 2.5, color: 0x6a3d16, join: 'round' as const, cap: 'round' as const };

function tail(body: Graphics, flapAngle: number, color: number): void {
  body.poly([-6, 0, -22, -8 - flapAngle * 3, -16, 7], true).fill(color).stroke(OUTLINE);
}

function eye(body: Graphics, x: number, y: number, r = 5.4): void {
  body.circle(x, y, r).fill(0xffffff).stroke({ ...OUTLINE, width: Math.max(1.6, r * 0.35) });
  body.circle(x + r * 0.3, y, r * 0.46).fill(0x2b2118);
  body.circle(x + r * 0.12, y - r * 0.18, r * 0.18).fill(0xffffff);
}

function wingOval(wing: Graphics, color: number, rx = 13, ry = 7.5): void {
  wing.ellipse(0, 11, rx, ry).fill(color).stroke(OUTLINE);
}

export function drawSpecies(body: Graphics, wing: Graphics, wingPhase: number, id: BirdId): void {
  const flapAngle = Math.sin(wingPhase);
  body.clear();
  wing.position.set(-2, 0);
  wing.rotation = flapAngle * 1.05 - 0.15;
  wing.clear();

  if (id === 'eagle') {
    body.poly([-6, 3, -24, 2 - flapAngle * 3, -14, 12], true).fill(0xfffdf6).stroke(OUTLINE);
    wingOval(wing, 0x6b4423, 15, 8);
    body.ellipse(0, 2, 17, 12).fill(0x8d5a32).stroke(OUTLINE);
    body.circle(12, -8, 8.4).fill(0xfffdf6).stroke(OUTLINE);
    body.poly([14, -12, 34, -6, 14, 0], true).fill(0xf2c14b).stroke(OUTLINE);
    body.poly([26, -5, 34, 3, 22, 1], true).fill(0xd9922a).stroke(OUTLINE);
    eye(body, 15, -9, 2.8);
    return;
  }

  if (id === 'flamingo') {
    body.moveTo(-2, 11).lineTo(-16, 18).stroke({ width: 2.4, color: 0xf4b183, cap: 'round' });
    body.moveTo(3, 12).lineTo(-8, 20).stroke({ width: 2.4, color: 0xf4b183, cap: 'round' });
    wingOval(wing, 0xff6f98, 14, 6.2);
    body.ellipse(-1, 3, 16, 9.5).fill(0xff8fb8).stroke(OUTLINE);
    body.moveTo(6, 0).quadraticCurveTo(10, -22, 22, -15).stroke({ width: 8, color: 0x6a3d16, cap: 'round' });
    body.moveTo(6, 0).quadraticCurveTo(10, -22, 22, -15).stroke({ width: 5, color: 0xff8fb8, cap: 'round' });
    body.circle(22, -15, 4.6).fill(0xffb7cf).stroke(OUTLINE);
    body.poly([25, -15, 35, -10, 25, -12.4], true).fill(0xfffdf6).stroke(OUTLINE);
    body.poly([31, -12, 35, -10, 31, -11], true).fill(0x2b2118);
    eye(body, 23.2, -16.2, 1.5);
    return;
  }

  if (id === 'penguin') {
    wing.position.set(-8, 8);
    wing.rotation = flapAngle * 0.45 + 0.35;
    wing.poly([0, 0, -2, 14, 7, 15, 8, 3], true).fill(0x241c16).stroke(OUTLINE);
    body.ellipse(0, 2, 15, 16.5).fill(0x241c16).stroke(OUTLINE);
    body.circle(-6, -6, 3.3).fill(0xf2c14b);
    body.circle(8, -8, 3.3).fill(0xf2c14b);
    body.ellipse(2, 6, 9, 11).fill(0xfffdf6);
    body.ellipse(7, -2, 6.2, 5.2).fill(0xfffdf6);
    body.poly([11, -2, 23, 2, 11, 5], true).fill(0xef7a2f).stroke(OUTLINE);
    eye(body, 10, -3, 2.4);
    return;
  }

  if (id === 'cardinal') {
    tail(body, flapAngle, 0xc42b2b);
    wingOval(wing, 0xb42323, 12, 7);
    body.ellipse(0, 1, 16, 13).fill(0xe23d3d).stroke(OUTLINE);
    body.poly([1, -11, 8, -24, 13, -8], true).fill(0xd43232).stroke(OUTLINE);
    body.ellipse(9, 1, 6.2, 4.4).fill(0x2b2118);
    body.poly([12, -1, 26, 2, 12, 6], true).fill(0xf08a2a).stroke(OUTLINE);
    eye(body, 8, -3, 2.5);
    return;
  }

  if (id === 'bluejay') {
    tail(body, flapAngle, 0x2f6bc4);
    wingOval(wing, 0x2457a8, 13, 7);
    wing.ellipse(1, 12, 7, 2.1).fill(0xffffff);
    body.ellipse(0, 1, 17, 13).fill(0x3b82e0).stroke(OUTLINE);
    body.ellipse(2, 6, 10, 7).fill(0xfffdf6);
    body.poly([-1, -10, 6, -23, 12, -8], true).fill(0x2f6bc4).stroke(OUTLINE);
    body.ellipse(4, 2, 7.5, 2.5).fill(0x2b2118);
    body.circle(10, -4, 5.3).fill(0xfffdf6).stroke(OUTLINE);
    body.poly([13, -4, 25, -1, 13, 2.5], true).fill(0x2b2118).stroke(OUTLINE);
    eye(body, 11, -5, 2.3);
    return;
  }

  tail(body, flapAngle, 0xf0b429);
  wingOval(wing, 0xe7a322);
  body.ellipse(0, 0, 18, 14.5).fill(0xffd34d).stroke(OUTLINE);
  body.ellipse(3, 4, 10, 8).fill(0xfff3c4);
  body.ellipse(8, 5, 3.2, 2.2).fill({ color: 0xf4a0a0, alpha: 0.85 });
  body.poly([12, -1, 26, 2, 12, 8], true).fill(0xef7a2f).stroke(OUTLINE);
  eye(body, 8, -4, 5.4);
}
