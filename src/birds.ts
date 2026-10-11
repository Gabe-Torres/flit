import type { Graphics } from 'pixi.js';

export const BIRD_IDS = [
  'finch',
  'flamingo',
  'penguin',
  'cardinal',
  'bluejay',
  'pelican',
  'dodo',
  'pterodactyl',
  'drone',
  'kiwi',
  'weka',
] as const;

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
  {
    id: 'pelican',
    name: 'Pelican',
    feather: '#fff4e0',
    icon: icon(
      `<ellipse cx="12" cy="17" rx="8" ry="6" fill="#fffdf6" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<path d="M16 15.5 30 16.5 17 19Z" fill="#f2c14b" stroke="${STROKE}" stroke-width="1.1" stroke-linejoin="round"/>` +
        `<ellipse cx="23" cy="21.5" rx="6" ry="3.4" fill="#ef8a2a" stroke="${STROKE}" stroke-width="1.1"/>` +
        `<circle cx="14" cy="15" r="1.3" fill="${INK}"/>`,
    ),
  },
  {
    id: 'dodo',
    name: 'Dodo',
    feather: '#e7d3b0',
    icon: icon(
      `<ellipse cx="14" cy="19" rx="9" ry="8" fill="#c4a882" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<path d="M10 13c1-6 7-7 9-2" stroke="#a08060" stroke-width="2" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="9" cy="20" rx="3.2" ry="2" fill="#a89070" stroke="${STROKE}" stroke-width="1"/>` +
        `<path d="M20 17c5 0 8 2 9 4" stroke="${STROKE}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M20 17c5 0 8 2 9 4" stroke="#f0d9a0" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M27 21 25 26" stroke="#e7c98a" stroke-width="1.8" stroke-linecap="round"/>` +
        `<circle cx="17" cy="16.5" r="1.2" fill="${INK}"/>`,
    ),
  },
  {
    id: 'pterodactyl',
    name: 'Pterodactyl',
    feather: '#e7b07a',
    icon: icon(
      `<path d="M16 17 3 8 8 19Z" fill="#b56538" stroke="${STROKE}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<ellipse cx="16" cy="18" rx="7" ry="4.2" fill="#d4843f" stroke="${STROKE}" stroke-width="1.3"/>` +
        `<path d="M13 13 8 5 16 15Z" fill="#e15a42" stroke="${STROKE}" stroke-width="1" stroke-linejoin="round"/>` +
        `<path d="M20 16.5 31 15.5 20 19.5Z" fill="#f2c14b" stroke="${STROKE}" stroke-width="1.1" stroke-linejoin="round"/>` +
        `<circle cx="18" cy="16.2" r="1.15" fill="${INK}"/>`,
    ),
  },
  {
    id: 'drone',
    name: 'Drone',
    feather: '#9aa4b2',
    icon: icon(
      `<path d="M12 15 4 8M20 15 28 8M12 20 5 26M20 20 27 26" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>` +
        `<ellipse cx="4" cy="8" rx="3.6" ry="1.3" fill="#c5ced8"/>` +
        `<ellipse cx="28" cy="8" rx="3.6" ry="1.3" fill="#c5ced8"/>` +
        `<ellipse cx="5" cy="26" rx="3.6" ry="1.3" fill="#c5ced8"/>` +
        `<ellipse cx="27" cy="26" rx="3.6" ry="1.3" fill="#c5ced8"/>` +
        `<rect x="10" y="13" width="12" height="9" rx="3" fill="#3a4250" stroke="${STROKE}" stroke-width="1.3"/>` +
        `<circle cx="18" cy="17.5" r="2.3" fill="#7ec8e3" stroke="${INK}" stroke-width="0.8"/>`,
    ),
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    feather: '#c49a6a',
    icon: icon(
      `<path d="M8 14 5 8M12 12 11 6M15 12 17 6" stroke="#5c3a22" stroke-width="1.3" stroke-linecap="round"/>` +
        `<ellipse cx="13" cy="19" rx="8" ry="7" fill="#8a5a32" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<path d="M19 18 31 20" stroke="#e7c27a" stroke-width="1.8" stroke-linecap="round"/>` +
        `<circle cx="16" cy="17" r="1.2" fill="${INK}"/>`,
    ),
  },
  {
    id: 'weka',
    name: 'Weka',
    feather: '#c4a882',
    icon: icon(
      `<ellipse cx="14" cy="17" rx="9" ry="5.5" fill="#6b4226" stroke="${STROKE}" stroke-width="1.4"/>` +
        `<ellipse cx="15" cy="19" rx="5" ry="2.6" fill="#a87848"/>` +
        `<path d="M20 16.2 29 17.6 21 19.4Z" fill="#f0c56e" stroke="${STROKE}" stroke-width="1" stroke-linejoin="round"/>` +
        `<circle cx="17.5" cy="15.6" r="1.7" fill="#e23d3d"/>` +
        `<circle cx="18" cy="15.6" r="0.7" fill="${INK}"/>` +
        `<path d="M10 22 8 28M16 22 18 28" stroke="#c49a58" stroke-width="1.6" stroke-linecap="round"/>`,
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

  if (id === 'pelican') {
    tail(body, flapAngle, 0xe7e0d4);
    wingOval(wing, 0xd9d3c7, 13, 6.2);
    body.ellipse(0, 1, 17, 12).fill(0xfffdf6).stroke(OUTLINE);
    body.ellipse(2, 5, 10, 6.5).fill(0xf3efe6);
    body.poly([10, -1, 34, 1, 12, 5], true).fill(0xf2c14b).stroke(OUTLINE);
    body.ellipse(22, 10, 11, 6.5).fill(0xef8a2a).stroke(OUTLINE);
    body.ellipse(22, 8, 6, 2.6).fill({ color: 0xffd27a, alpha: 0.8 });
    eye(body, 8, -4, 3.2);
    return;
  }

  if (id === 'dodo') {
    wing.position.set(-6, 4);
    wing.rotation = flapAngle * 0.22;
    wing.ellipse(0, 5, 6, 3.2).fill(0xa89070).stroke(OUTLINE);
    body.poly([-14, 4, -22, 8, -12, 12], true).fill(0xb8956a).stroke(OUTLINE);
    body.ellipse(0, 3, 18, 15.5).fill(0xc4a882).stroke(OUTLINE);
    body.ellipse(2, 8, 11, 8).fill(0xe7d3b0);
    body.poly([-2, -10, 3, -22, 9, -8], true).fill(0xb8956a).stroke(OUTLINE);
    body.poly([3, -8, 9, -18, 11, -6], true).fill(0xd4b483).stroke(OUTLINE);
    body.poly([12, 0, 26, 2, 14, 6], true).fill(0xf0d9a0).stroke(OUTLINE);
    body.poly([20, 4, 25, 2, 22, 11], true).fill(0xe7c98a).stroke(OUTLINE);
    eye(body, 10, -2, 3);
    return;
  }

  if (id === 'pterodactyl') {
    wing.position.set(-2, 0);
    wing.rotation = flapAngle * 0.85 - 0.35;
    wing.poly([2, 0, -32, -16, -24, 2, -4, 10], true).fill(0xb56538).stroke(OUTLINE);
    wing.moveTo(0, 0).lineTo(-28, -10).stroke({ width: 2.2, color: 0x6b3a22, cap: 'round' });
    body.ellipse(-2, 2, 13, 8).fill(0xd4843f).stroke(OUTLINE);
    body.ellipse(0, 6, 7, 3.6).fill(0xf6d7a2);
    body.ellipse(12, -1, 6.5, 5.2).fill(0xd4843f).stroke(OUTLINE);
    body.poly([8, -5, 2, -18, 14, -3], true).fill(0xe15a42).stroke(OUTLINE);
    body.poly([16, -2, 36, 0, 16, 4], true).fill(0xf2c14b).stroke(OUTLINE);
    body.poly([16, 1, 28, 3, 16, 5], true).fill(0xe7a23a);
    eye(body, 13, -2, 2.1);
    body.moveTo(-2, 8).lineTo(-5, 16).stroke({ width: 2.2, color: 0x6b3a22, cap: 'round' });
    body.moveTo(4, 8).lineTo(6, 16).stroke({ width: 2.2, color: 0x6b3a22, cap: 'round' });
    return;
  }

  if (id === 'drone') {
    wing.rotation = 0;
    const arm = { width: 2.4, color: 0x2b2118, cap: 'round' as const };
    body.moveTo(-8, -2).lineTo(-22, -12).stroke(arm);
    body.moveTo(8, -2).lineTo(22, -12).stroke(arm);
    body.moveTo(-6, 4).lineTo(-18, 14).stroke(arm);
    body.moveTo(6, 4).lineTo(18, 14).stroke(arm);
    body.roundRect(-14, -6, 28, 14, 6).fill(0x3a4250).stroke(OUTLINE);
    body.roundRect(-8, -2, 10, 6, 3).fill(0x2c333d);
    body.circle(6, 1, 4.2).fill(0x163044).stroke({ ...OUTLINE, width: 1.6 });
    body.circle(6, 1, 2.4).fill(0x7ec8e3);
    body.circle(7.1, 0.2, 0.9).fill(0xffffff);
    body.moveTo(0, -6).lineTo(2, -13).stroke(arm);
    body.circle(2, -14, 1.7).fill(0xe23d3d);
    const rotor = (x: number, y: number, spin: number) => {
      const a = wingPhase * 9 + spin;
      body.ellipse(x, y, 8, 2.2).fill({ color: 0xc5ced8, alpha: 0.45 });
      body
        .moveTo(x + Math.cos(a) * 8, y + Math.sin(a) * 2.4)
        .lineTo(x - Math.cos(a) * 8, y - Math.sin(a) * 2.4)
        .stroke({ width: 2, color: 0xe8eef4, cap: 'round' });
      body
        .moveTo(x + Math.cos(a + Math.PI / 2) * 8, y + Math.sin(a + Math.PI / 2) * 2.4)
        .lineTo(x - Math.cos(a + Math.PI / 2) * 8, y - Math.sin(a + Math.PI / 2) * 2.4)
        .stroke({ width: 2, color: 0xe8eef4, cap: 'round' });
      body.circle(x, y, 1.5).fill(0x2b2118);
    };
    rotor(-22, -12, 0);
    rotor(22, -12, 1.1);
    rotor(-18, 14, 2.2);
    rotor(18, 14, 3.4);
    return;
  }

  if (id === 'kiwi') {
    wing.position.set(-8, 4);
    wing.rotation = flapAngle * 0.12;
    wing.ellipse(0, 3, 3.4, 2).fill(0x6b4226).stroke(OUTLINE);
    body.ellipse(-1, 2, 15, 13.5).fill(0x8a5a32).stroke(OUTLINE);
    body.moveTo(-8, -6).lineTo(-12, -16).stroke({ width: 1.6, color: 0x5c3a22, cap: 'round' });
    body.moveTo(-2, -10).lineTo(-3, -20).stroke({ width: 1.6, color: 0x5c3a22, cap: 'round' });
    body.moveTo(4, -8).lineTo(7, -18).stroke({ width: 1.6, color: 0x5c3a22, cap: 'round' });
    body.moveTo(10, 1).lineTo(34, 4).stroke({ width: 3.4, color: 0x6a3d16, cap: 'round' });
    body.moveTo(11, 0.2).lineTo(33, 3.2).stroke({ width: 1.5, color: 0xe7c27a, cap: 'round' });
    eye(body, 7, -2, 2.5);
    body.moveTo(-2, 14).lineTo(-4, 20).stroke({ width: 2.2, color: 0xc49a58, cap: 'round' });
    body.moveTo(4, 14).lineTo(6, 20).stroke({ width: 2.2, color: 0xc49a58, cap: 'round' });
    return;
  }

  if (id === 'weka') {
    tail(body, flapAngle, 0x5c3a22);
    wingOval(wing, 0x5a3820, 10, 5.2);
    body.ellipse(0, 2, 17, 11.5).fill(0x6b4226).stroke(OUTLINE);
    body.ellipse(2, 6, 10, 5.5).fill(0xa87848);
    body.ellipse(-5, 0, 3.2, 1.3).fill(0x4a2c18);
    body.ellipse(2, -1, 3.2, 1.3).fill(0x4a2c18);
    body.poly([12, 0, 26, 2, 12, 5], true).fill(0xf0c56e).stroke(OUTLINE);
    body.circle(9, -2, 3.3).fill(0xfffdf6).stroke({ ...OUTLINE, width: 1.6 });
    body.circle(10, -2, 1.7).fill(0xe23d3d);
    body.circle(10.5, -2.3, 0.6).fill(0xffffff);
    body.moveTo(-1, 12).lineTo(-6, 22).stroke({ width: 2.8, color: 0xc49a58, cap: 'round' });
    body.moveTo(5, 12).lineTo(8, 22).stroke({ width: 2.8, color: 0xc49a58, cap: 'round' });
    body.moveTo(-6, 22).lineTo(-11, 23).stroke({ width: 2.2, color: 0xc49a58, cap: 'round' });
    body.moveTo(8, 22).lineTo(13, 23).stroke({ width: 2.2, color: 0xc49a58, cap: 'round' });
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
