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
  'lander',
  'kiwi',
  'weka',
  'trout',
  'shark',
  'appa',
  'momo',
  'charizard',
  'mew',
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
    id: 'lander',
    name: 'Lunar lander',
    feather: '#c45c38',
    icon: icon(
      `<path d="M11 18 7 26M21 18 25 26" stroke="#6a3d16" stroke-width="1.6" stroke-linecap="round"/>` +
        `<ellipse cx="7" cy="27" rx="2.6" ry="1.2" fill="#8a5a32" stroke="${INK}" stroke-width="0.7"/>` +
        `<ellipse cx="25" cy="27" rx="2.6" ry="1.2" fill="#8a5a32" stroke="${INK}" stroke-width="0.7"/>` +
        `<ellipse cx="7" cy="28.4" rx="3.4" ry="0.7" fill="#e8a888" opacity="0.8"/>` +
        `<ellipse cx="25" cy="28.4" rx="3.4" ry="0.7" fill="#e8a888" opacity="0.8"/>` +
        `<path d="M14.2 22 16 27.5 17.8 22Z" fill="#f08a2a"/>` +
        `<rect x="8" y="14" width="16" height="8" rx="1.4" fill="#c45c38" stroke="${STROKE}" stroke-width="1.2"/>` +
        `<rect x="10" y="16.2" width="12" height="1.8" fill="#e2b340"/>` +
        `<rect x="11" y="6" width="10" height="8" rx="1.4" fill="#f6e6d0" stroke="${STROKE}" stroke-width="1.2"/>` +
        `<rect x="12" y="7.2" width="3.2" height="2.4" rx="0.4" fill="#e2b340"/>` +
        `<rect x="13.2" y="8.2" width="5.6" height="3.2" rx="0.6" fill="#163044"/>` +
        `<path d="M16 6V2.4" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>` +
        `<circle cx="16" cy="2.2" r="1.3" fill="#e23d3d"/>`,
    ),
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    feather: '#c49a6a',
    icon: icon(
      `<path d="M6 16 2 12M7 20 2 22M8 14 4 9" stroke="#5c3a22" stroke-width="1.3" stroke-linecap="round"/>` +
        `<ellipse cx="11" cy="19" rx="6.2" ry="6.6" fill="#6b4226" stroke="${STROKE}" stroke-width="1.3"/>` +
        `<ellipse cx="16" cy="16.2" rx="4" ry="3.8" fill="#8a5a32" stroke="${STROKE}" stroke-width="1.1"/>` +
        `<path d="M19 16.4c5 1 9 3 12 5" stroke="${STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
        `<path d="M19.3 15.7c5 .8 8.6 2.6 11.4 4.4" stroke="#f0d7a0" stroke-width="1" fill="none" stroke-linecap="round"/>` +
        `<circle cx="17.2" cy="14.8" r="1" fill="${INK}"/>` +
        `<path d="M9 25 7 30M13 25 14 30" stroke="#c49a58" stroke-width="1.7" stroke-linecap="round"/>`,
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
  {
    id: 'trout',
    name: 'Flying rainbow trout',
    feather: '#ff6b9a',
    icon: icon(
      `<path d="M10 16 4 12 4 20Z" fill="#2f8f62" stroke="${STROKE}" stroke-width="1" stroke-linejoin="round"/>` +
        `<ellipse cx="13" cy="8.2" rx="6.2" ry="2.2" transform="rotate(-62 13 8.2)" fill="#fffdf6" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="16.4" cy="6.6" rx="5.6" ry="2" transform="rotate(-38 16.4 6.6)" fill="#fffdf6" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="19.2" cy="8.4" rx="4.6" ry="1.8" transform="rotate(-16 19.2 8.4)" fill="#fffdf6" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="10.2" cy="5.2" rx="2.2" ry="1.3" transform="rotate(-62 10.2 5.2)" fill="#ff5a8a"/>` +
        `<ellipse cx="14.6" cy="3.8" rx="2.1" ry="1.2" transform="rotate(-38 14.6 3.8)" fill="#f2c14b"/>` +
        `<ellipse cx="20.6" cy="7.2" rx="1.8" ry="1.1" transform="rotate(-16 20.6 7.2)" fill="#3b82e0"/>` +
        `<ellipse cx="12" cy="24" rx="6" ry="2.1" transform="rotate(58 12 24)" fill="#fff6ea" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="16" cy="26" rx="5.4" ry="1.9" transform="rotate(36 16 26)" fill="#fff6ea" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="19.4" cy="24.2" rx="4.2" ry="1.7" transform="rotate(16 19.4 24.2)" fill="#fff6ea" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<ellipse cx="9.4" cy="26.6" rx="2" ry="1.2" transform="rotate(58 9.4 26.6)" fill="#ff5a8a"/>` +
        `<ellipse cx="14.2" cy="28.4" rx="2" ry="1.1" transform="rotate(36 14.2 28.4)" fill="#f2c14b"/>` +
        `<ellipse cx="21" cy="25.4" rx="1.7" ry="1" transform="rotate(16 21 25.4)" fill="#3b82e0"/>` +
        `<ellipse cx="17" cy="16" rx="7.4" ry="4.2" fill="#6ecf9a" stroke="${STROKE}" stroke-width="1.1"/>` +
        `<path d="M12 14.4h8" stroke="#ff5a8a" stroke-width="1.5" stroke-linecap="round"/>` +
        `<path d="M12 16.2h7.2" stroke="#f2c14b" stroke-width="1.3" stroke-linecap="round"/>` +
        `<path d="M13 18h6.4" stroke="#3b82e0" stroke-width="1.3" stroke-linecap="round"/>` +
        `<circle cx="22.2" cy="14.6" r="1.35" fill="#fff" stroke="${STROKE}" stroke-width="0.7"/>` +
        `<circle cx="22.6" cy="14.6" r="0.5" fill="${INK}"/>`,
    ),
  },
  {
    id: 'shark',
    name: 'Rocket shark',
    feather: '#8aa0b0',
    icon: icon(
      `<path d="M9 17 2 8 6 16.5 3 23Z" fill="#5c6b7a" stroke="${STROKE}" stroke-width="0.9" stroke-linejoin="round"/>` +
        `<path d="M28 16 22 11.5 14 11 9 15 9 19 15 22 22 20 26 18Z" fill="#8aa0b0" stroke="${STROKE}" stroke-width="1.1" stroke-linejoin="round"/>` +
        `<path d="M12 17.5 16 21.2 23 19 22 16.2Z" fill="#f4f7fb"/>` +
        `<path d="M14 11.4 17 4 21 12Z" fill="#5c6b7a" stroke="${STROKE}" stroke-width="0.9" stroke-linejoin="round"/>` +
        `<path d="M15 19 12 26 20 20.4Z" fill="#6e7e8c" stroke="${STROKE}" stroke-width="0.8" stroke-linejoin="round"/>` +
        `<path d="M16 14.8 15.2 17.8M18 14.6 17.2 17.6M20 14.5 19.4 17.2" stroke="#3a4250" stroke-width="0.7" stroke-linecap="round"/>` +
        `<path d="M23.2 18 24.2 20.2 25.2 17.8 26.1 19.8 27 17.2" fill="#fffdf6" stroke="${INK}" stroke-width="0.45" stroke-linejoin="round"/>` +
        `<circle cx="23.2" cy="13.8" r="1.15" fill="#1a1c22"/>` +
        `<circle cx="23.6" cy="13.4" r="0.35" fill="#fff"/>` +
        `<rect x="5.2" y="9.4" width="7.2" height="2.8" rx="0.9" fill="#e23d3d" stroke="${STROKE}" stroke-width="0.6"/>` +
        `<path d="M12.4 9.4 15.6 10.8 12.4 12.2Z" fill="#f6d98a" stroke="${STROKE}" stroke-width="0.5" stroke-linejoin="round"/>` +
        `<path d="M5.2 10 2.4 10.8 5.2 11.6Z" fill="#f08a2a"/>`,
    ),
  },
  {
    id: 'appa',
    name: 'Appa',
    feather: '#f4e6cf',
    icon: icon(
      `<path d="M9.2 13.2.8 10.6.2 16.6.8 23 9.2 20.4Z" fill="#7a4e2c" stroke="${STROKE}" stroke-width="0.9" stroke-linejoin="round"/>` +
        `<path d="M8.4 15 2.2 13.8 2.2 19.6 8.4 18.4Z" fill="#c4a06a"/>` +
        `<ellipse cx="15.2" cy="17.6" rx="7.6" ry="5.8" fill="#f3ddc0" stroke="${STROKE}" stroke-width="1.15"/>` +
        `<path d="M7.2 16.4 12 13.8 12 15.2 16.2 15.4 16.2 17.8 12 18 12 19.6Z" fill="#7a3e1e" stroke="${STROKE}" stroke-width="0.4" stroke-linejoin="round"/>` +
        `<ellipse cx="16.2" cy="20.2" rx="4.4" ry="2.2" fill="#e7cba6"/>` +
        `<ellipse cx="22.6" cy="15" rx="5.4" ry="4.6" fill="#fff6ea" stroke="${STROKE}" stroke-width="1"/>` +
        `<path d="M15.6 13.2C14.2 12.2 13.6 11.4 13.2 10.6M17.4 12.8C16.2 11.6 15.6 10.8 15.2 10" stroke="#5c3a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="26.2" cy="16.6" rx="2.5" ry="1.75" fill="#d7b48a" stroke="${INK}" stroke-width="0.5"/>` +
        `<ellipse cx="27.5" cy="16.5" rx="0.85" ry="0.55" fill="#3d2918"/>` +
        `<circle cx="23.2" cy="16.8" r="1.15" fill="#fff" stroke="${STROKE}" stroke-width="0.5"/>` +
        `<circle cx="23.7" cy="16.8" r="0.48" fill="${INK}"/>` +
        `<path d="M28.6 13.2 20.2 10.6 20.2 12.1 16.6 11.7 16.6 14.2 20.2 13.8 20.2 15.4Z" fill="#6b3418" stroke="${STROKE}" stroke-width="0.45" stroke-linejoin="round"/>` +
        `<path d="M9 22.2 8.4 27.2M11.4 22.6 11 26.4M13.8 22.8 13.4 27.6M16.2 22.6 16 26.2M18.8 22.2 18.4 26.8M21.2 21.6 21 25.4" stroke="#a07850" stroke-width="1.5" stroke-linecap="round"/>`,
    ),
  },
  {
    id: 'momo',
    name: 'Momo',
    feather: '#fffdf8',
    icon: icon(
      `<path d="M14.4 19.4 11.2 17.2" stroke="#5c4638" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M11.2 17.2 8 18.8" stroke="#f4efe6" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M8 18.8 5.2 21.4" stroke="#5c4638" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M5.2 21.4 3.6 24.4" stroke="#f4efe6" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M3.6 24.4 5.2 26.2" stroke="#5c4638" stroke-width="3.3" fill="none" stroke-linecap="round"/>` +
        `<path d="M5.2 26.2 8 26.6" stroke="#f4efe6" stroke-width="3.1" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="10.2" cy="11.2" rx="4.5" ry="8.8" fill="#fffdf8" stroke="${STROKE}" stroke-width="0.9"/>` +
        `<ellipse cx="10.2" cy="11.6" rx="2.5" ry="6.2" fill="#ff9ec4"/>` +
        `<ellipse cx="10.2" cy="11.8" rx="1.05" ry="3.8" fill="#e45a96"/>` +
        `<ellipse cx="18.6" cy="10.4" rx="5.3" ry="9.2" fill="#fffdf8" stroke="${STROKE}" stroke-width="0.9"/>` +
        `<ellipse cx="18.6" cy="10.8" rx="3" ry="6.4" fill="#ffb3d2"/>` +
        `<ellipse cx="18.6" cy="11" rx="1.25" ry="3.8" fill="#f06aa8"/>` +
        `<ellipse cx="16.2" cy="20.6" rx="4.8" ry="3.3" fill="#fffdf8" stroke="${STROKE}" stroke-width="0.9"/>` +
        `<ellipse cx="16.4" cy="21.6" rx="2.6" ry="1.5" fill="#fff4e4"/>` +
        `<ellipse cx="21.4" cy="17.4" rx="4" ry="3.3" fill="#fffdf8" stroke="${STROKE}" stroke-width="0.8"/>` +
        `<circle cx="22.2" cy="16.8" r="2.15" fill="#1c140f"/>` +
        `<circle cx="21.5" cy="16.1" r="0.75" fill="#fff"/>` +
        `<ellipse cx="24.4" cy="18.2" rx="1.35" ry="0.85" fill="#f7f1e4"/>` +
        `<circle cx="24.8" cy="18.2" r="0.32" fill="#3d2918"/>`,
    ),
  },
  {
    id: 'charizard',
    name: 'Charizard',
    feather: '#f08a2a',
    icon: icon(
      `<path d="M16.2 20.2C12.4 22.2 9.2 23.4 8.2 23.6" stroke="#f07828" stroke-width="3.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M16.4 15.2 8.2 0.6 10.6 5.2 1.4 3.6 4.8 9 0.4 12.6 7.2 16.6 16 18.2Z" fill="#149e90" stroke="${STROKE}" stroke-width="0.7" stroke-linejoin="round"/>` +
        `<path d="M15.6 15.6 9.2 3.4 7.2 6.2 3.2 5.2 5.2 9.4 2.4 12.4 8 16 15 17.2Z" fill="#0c6e64"/>` +
        `<path d="M15.8 16 8.2 0.6M15.2 16.4 1.4 3.6M14.6 17 0.4 12.6" stroke="#08332e" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M8.2 0.6 6.8 0 7.6 2.4Z" fill="#f6d7a4"/>` +
        `<path d="M1.4 3.6 0 2.8 1.6 5.2Z" fill="#f6d7a4"/>` +
        `<ellipse cx="18.2" cy="19.2" rx="5.8" ry="4.4" fill="#f07828" stroke="${STROKE}" stroke-width="1"/>` +
        `<ellipse cx="18" cy="21.2" rx="3.2" ry="1.8" fill="#f6d7a4"/>` +
        `<ellipse cx="24.2" cy="15.6" rx="4.3" ry="3.3" fill="#f07828" stroke="${STROKE}" stroke-width="0.85"/>` +
        `<path d="M21.4 13.6C18.6 11.2 17.2 9.6 16.4 8.2" stroke="#b8882a" stroke-width="2.15" fill="none" stroke-linecap="round"/>` +
        `<path d="M21.4 13.6C18.6 11.2 17.2 9.6 16.4 8.2" stroke="#f6d56a" stroke-width="1.15" fill="none" stroke-linecap="round"/>` +
        `<path d="M22.6 14.4C20.2 12.2 19.2 10.8 18.4 9.6" stroke="#b8882a" stroke-width="1.85" fill="none" stroke-linecap="round"/>` +
        `<path d="M22.6 14.4C20.2 12.2 19.2 10.8 18.4 9.6" stroke="#f6d56a" stroke-width="0.95" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="26.8" cy="16.6" rx="2.3" ry="1.55" fill="#f6d7a4" stroke="${INK}" stroke-width="0.4"/>` +
        `<path d="M22.4 14 25.4 14.7" stroke="${STROKE}" stroke-width="0.7" stroke-linecap="round"/>` +
        `<circle cx="24.4" cy="15.2" r="1.15" fill="#fff" stroke="${STROKE}" stroke-width="0.45"/>` +
        `<circle cx="24.8" cy="15.2" r="0.48" fill="${INK}"/>` +
        `<path d="M10.2 23.4 4 17.6 2.2 14.2 6.2 18.8 3.2 21 6.6 22.6 4.2 28.6 10.8 25Z" fill="#ff4e12"/>` +
        `<path d="M9.2 22.8 5.2 17.8 6.6 20 4.6 21.4 7.2 22.4Z" fill="#ffd24a"/>` +
        `<path d="M8.4 22.6 6.2 19.4 7 21.4Z" fill="#fff6c8"/>`,
    ),
  },
  {
    id: 'mew',
    name: 'Mew',
    feather: '#ffb7d5',
    icon: icon(
      `<path d="M15.2 20.6C9.4 23.4 4.2 18.2 5.6 11.2" stroke="#f48cb8" stroke-width="2.7" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="4.2" cy="8.2" rx="3.6" ry="2.7" fill="#ffb7d5" stroke="${STROKE}" stroke-width="0.75"/>` +
        `<ellipse cx="17" cy="21.2" rx="5.2" ry="3.7" fill="#ffb7d5" stroke="${STROKE}" stroke-width="1"/>` +
        `<ellipse cx="17.2" cy="22.4" rx="2.9" ry="1.7" fill="#ffe4f2"/>` +
        `<ellipse cx="23" cy="15.4" rx="6.3" ry="5.5" fill="#ffb7d5" stroke="${STROKE}" stroke-width="1"/>` +
        `<ellipse cx="24.4" cy="15.2" rx="2.7" ry="2.35" fill="#3ec4ef" stroke="${STROKE}" stroke-width="0.55"/>` +
        `<ellipse cx="25" cy="15.2" rx="1.2" ry="1.45" fill="#163044"/>` +
        `<circle cx="23.8" cy="14.4" r="0.55" fill="#fff"/>`,
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

  if (id === 'lander') {
    wing.rotation = 0;
    const strut = { width: 2.2, color: 0x6a3d16, cap: 'round' as const };
    body.moveTo(-8, 2).lineTo(-16, 14).stroke(strut);
    body.moveTo(8, 2).lineTo(16, 14).stroke(strut);
    body.ellipse(-16, 15, 4, 1.5).fill(0x8a5a32).stroke({ ...OUTLINE, width: 1.3 });
    body.ellipse(16, 15, 4, 1.5).fill(0x8a5a32).stroke({ ...OUTLINE, width: 1.3 });
    const burn = 0.65 + 0.35 * Math.sin(wingPhase * 9);
    const puff = 0.45 + 0.55 * Math.abs(Math.sin(wingPhase * 6));
    body.ellipse(-16, 19, 6 * puff, 1.6).fill({ color: 0xe8a888, alpha: 0.7 });
    body.ellipse(16, 19, 5.2 * puff, 1.4).fill({ color: 0xe8a888, alpha: 0.6 });
    body.poly([-3.4, 8, 0, 8 + 12 * burn, 3.4, 8], true).fill({ color: 0xf08a2a, alpha: 0.92 });
    body.poly([-1.6, 8, 0, 8 + 7 * burn, 1.6, 8], true).fill(0xfff6d0);
    body.roundRect(-13, -4, 26, 12, 2).fill(0xc45c38).stroke(OUTLINE);
    body.rect(-10, -2, 7, 3).fill(0xe2b340);
    body.rect(2, 1, 8, 2.4).fill(0xe8a070);
    body.rect(-9, 3.4, 18, 2).fill(0xe2b340);
    body.roundRect(-7, -16, 14, 13, 2).fill(0xf6e6d0).stroke(OUTLINE);
    body.roundRect(-6, -14, 4, 3.2, 0.6).fill(0xe2b340);
    body.roundRect(-4, -11, 8, 5, 1).fill(0x163044);
    body.rect(-2.4, -10, 2.4, 2.2).fill(0x7ec8e3);
    body.moveTo(3, -14).lineTo(9, -20).stroke({ width: 1.6, color: 0x6a3d16, cap: 'round' });
    body.ellipse(11, -21, 4.2, 2).fill(0xf4f7fb).stroke({ ...OUTLINE, width: 1.3 });
    body.circle(11, -21, 1.1).fill(0x163044);
    body.moveTo(-10, 6).lineTo(-18, 16).stroke({ width: 2.4, color: 0x6a3d16, cap: 'round' });
    body.moveTo(10, 6).lineTo(18, 16).stroke({ width: 2.4, color: 0x6a3d16, cap: 'round' });
    body.ellipse(-18, 17, 4.4, 1.7).fill(0x8a5a32).stroke({ ...OUTLINE, width: 1.4 });
    body.ellipse(18, 17, 4.4, 1.7).fill(0x8a5a32).stroke({ ...OUTLINE, width: 1.4 });
    return;
  }

  if (id === 'kiwi') {
    wing.rotation = 0;
    const hair = { width: 1.8, color: 0x5c3a22, cap: 'round' as const };
    body.moveTo(-6, -4).lineTo(-14, -12).stroke(hair);
    body.moveTo(-10, 0).lineTo(-18, -2).stroke(hair);
    body.moveTo(-10, 5).lineTo(-18, 8).stroke(hair);
    body.moveTo(-6, 8).lineTo(-12, 16).stroke(hair);
    body.ellipse(-3, 3, 12, 10.5).fill(0x6b4226).stroke(OUTLINE);
    body.ellipse(-2, 6, 8, 6).fill(0x8a5a32);
    body.ellipse(8, -1, 6.6, 5.8).fill(0x7a4e30).stroke(OUTLINE);
    body.moveTo(13, 0).quadraticCurveTo(26, 2, 36, 9).stroke({ width: 4.2, color: 0x6a3d16, cap: 'round' });
    body.moveTo(14, -0.6).quadraticCurveTo(26, 1.2, 35, 8).stroke({ width: 1.7, color: 0xf0d7a0, cap: 'round' });
    body.circle(34.6, 8.2, 1.1).fill(0x2b2118);
    eye(body, 10, -3, 2.1);
    const leg = { width: 2.8, color: 0xc49a58, cap: 'round' as const };
    body.moveTo(-2, 12).lineTo(-6, 22).stroke(leg);
    body.moveTo(4, 12).lineTo(5, 22).stroke(leg);
    body.moveTo(-6, 22).lineTo(-12, 24).stroke(leg);
    body.moveTo(-6, 22).lineTo(-4, 25).stroke(leg);
    body.moveTo(5, 22).lineTo(11, 24).stroke(leg);
    body.moveTo(5, 22).lineTo(7, 25).stroke(leg);
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

  if (id === 'trout') {
    const wag = flapAngle * 5;
    const lift = flapAngle * 7;
    wing.rotation = 0;
    const feather = (rootX: number, rootY: number, ang: number, len: number, fill: number, tip: number) => {
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      const rx = len * 0.52;
      const ry = 3.1;
      const cx = rootX + c * len * 0.4;
      const cy = rootY + s * len * 0.4;
      const pts: number[] = [];
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const px = Math.cos(a) * rx;
        const py = Math.sin(a) * ry;
        pts.push(cx + px * c - py * s, cy + px * s + py * c);
      }
      body.poly(pts, true).fill(fill).stroke({ ...OUTLINE, width: 1.5 });
      const tx = rootX + c * len * 0.78;
      const ty = rootY + s * len * 0.78;
      const tipPts: number[] = [];
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const px = Math.cos(a) * len * 0.24;
        const py = Math.sin(a) * ry * 0.85;
        tipPts.push(tx + px * c - py * s, ty + px * s + py * c);
      }
      body.poly(tipPts, true).fill(tip);
    };
    const up = -Math.PI / 2;
    const down = Math.PI / 2;
    feather(-3, -3, up - 0.7, 18 + lift, 0xfffdf6, 0xff5a8a);
    feather(-1, -4, up - 0.32, 21 + lift, 0xfffdf6, 0xf2c14b);
    feather(1, -3, up + 0.02, 17 + lift * 0.45, 0xfffdf6, 0x3b82e0);
    feather(-3, 4, down + 0.7, 18 + lift * 0.8, 0xfff6ea, 0xff5a8a);
    feather(-1, 5, down + 0.32, 21 + lift, 0xfff6ea, 0xf2c14b);
    feather(1, 4, down - 0.02, 17 + lift * 0.4, 0xfff6ea, 0x3b82e0);
    body.poly([-12, 1, -24, -8 - wag, -24, 9 + wag], true).fill(0x2f8f62).stroke(OUTLINE);
    body.ellipse(2, 1, 16, 8).fill(0x6ecf9a).stroke(OUTLINE);
    body.ellipse(3, -1.2, 12, 1.7).fill(0xff5a8a);
    body.ellipse(3, 1, 11, 1.3).fill(0xf2c14b);
    body.ellipse(3, 3, 10, 1.2).fill(0x3b82e0);
    body.circle(-2, -2.2, 1.2).fill(0x2b2118);
    body.circle(5, 2.4, 1).fill(0x2b2118);
    body.circle(9, -0.4, 0.9).fill(0x2b2118);
    body.poly([1, -6, 6, -11, 9, -5], true).fill(0x3d8f6e).stroke(OUTLINE);
    eye(body, 11, -2, 3.1);
    return;
  }

  if (id === 'shark') {
    wing.rotation = 0;
    const wag = Math.sin(wingPhase * 2) * 5;
    body.poly([-8, 0, -24, -14 - wag, -13, -1, -20, 8 + wag * 0.55, -8, 4], true).fill(0x5c6b7a).stroke(OUTLINE);
    body.poly([22, 1, 15, -6, 4, -7, -8, -3, -8, 5, 2, 8, 14, 6, 20, 3], true).fill(0x8aa0b0).stroke(OUTLINE);
    body.poly([-2, 2, 4, 7, 16, 5, 18, 2, 8, 1], true).fill(0xf4f7fb);
    body.poly([1, -6, 5, -18, 12, -5], true).fill(0x5c6b7a).stroke(OUTLINE);
    body.poly([3, 5, -3, 15, 10, 6], true).fill(0x6e7e8c).stroke(OUTLINE);
    for (let i = 0; i < 4; i++) {
      body.moveTo(7 + i * 2.4, -1).lineTo(6 + i * 2.4, 3.6).stroke({ width: 1.35, color: 0x3a4250, cap: 'round' });
    }
    body.moveTo(15, 3.2).lineTo(21, 1.2).stroke({ width: 1.5, color: 0x2b2118, cap: 'round' });
    body.poly([14.6, 3.2, 15.8, 6.6, 17.2, 3.2], true).fill(0xfffdf6).stroke({ ...OUTLINE, width: 1.1 });
    body.poly([17, 2.8, 18.2, 6.1, 19.5, 2.6], true).fill(0xfffdf6).stroke({ ...OUTLINE, width: 1.1 });
    body.poly([19.2, 2.2, 20.2, 5.2, 21.2, 1.6], true).fill(0xfffdf6).stroke({ ...OUTLINE, width: 1.1 });
    body.ellipse(13, -3.2, 2.2, 1.6).fill(0x1a1c22);
    body.circle(13.6, -3.6, 0.65).fill(0xffffff);
    body.roundRect(-16, -11, 12, 5, 2).fill(0xd23b2e).stroke(OUTLINE);
    body.poly([-4, -11, 2, -8.5, -4, -6], true).fill(0xf6d98a).stroke(OUTLINE);
    const burn = 0.65 + 0.35 * Math.sin(wingPhase * 9);
    body.poly([-16, -10.2, -16 - 10 * burn, -8.5, -16, -7], true).fill({ color: 0xf08a2a, alpha: 0.95 });
    body.poly([-16, -9.6, -16 - 5.5 * burn, -8.5, -16, -7.6], true).fill(0xfff6d0);
    return;
  }

  if (id === 'appa') {
    wing.rotation = 0;
    const wag = flapAngle * 3.5;
    const tuck = Math.max(0, flapAngle) * 2.2;
    const hoof = (x: number, y: number, far: boolean) => {
      body.moveTo(x, 13).lineTo(x - 0.3, y).stroke({ width: far ? 2.3 : 3.3, color: far ? 0xe7d3b4 : 0xf3e2c8, cap: 'round' });
      body.ellipse(x - 0.3, y + 0.8, far ? 2.1 : 2.6, far ? 1.05 : 1.25).fill(far ? 0xa07848 : 0x5c3a22);
    };
    body.poly([-10, 0, -36, -8 - wag, -38, 4, -36, 16 + wag, -10, 12], true).fill(0x7a4e2c).stroke(OUTLINE);
    body.poly([-16, 3.2, -34, 0.6 - wag * 0.35, -34, 9.4 + wag * 0.35, -16, 8.2], true).fill(0xc4a06a);
    body.ellipse(-1, 3, 17.5, 12).fill(0xfff6ea).stroke(OUTLINE);
    body.ellipse(1.2, 8.4, 11, 5).fill(0xf0d4b0);
    body
      .poly([-17.5, 1.4, -8.2, -3.2, -8.2, -0.2, 2, 0.4, 2, 4.8, -8.2, 5.4, -8.2, 8.2], true)
      .fill(0x7a3e1e)
      .stroke({ ...OUTLINE, width: 1.6 });
    for (const lx of [-12, -2, 9]) hoof(lx + 7, 17.6 - tuck * 0.25, true);
    for (const lx of [-12, -2, 9]) hoof(lx, 21.2 - tuck, false);
    body.ellipse(15, -0.6, 10.2, 8).fill(0xfff6ea).stroke(OUTLINE);
    body.moveTo(6.2, -4.4).quadraticCurveTo(3, -5.8, 1.6, -6.6).stroke({ width: 3.1, color: 0x5c3a22, cap: 'round' });
    body.moveTo(8.6, -5).quadraticCurveTo(5.8, -7.2, 4.4, -8.4).stroke({ width: 2.7, color: 0x5c3a22, cap: 'round' });
    body.ellipse(22.8, 3.2, 5.1, 3.1).fill(0xd7b48a).stroke({ ...OUTLINE, width: 1.5 });
    body.ellipse(25.4, 3, 1.9, 1.25).fill(0x3d2918);
    eye(body, 18.4, 4, 2);
    body.moveTo(16.4, 2.6).quadraticCurveTo(18.4, 1.9, 20.6, 3).stroke({ width: 1.4, color: 0x6a3d16, cap: 'round' });
    body
      .poly([29, -1.4, 16.2, -7.2, 16.2, -4.8, 11.2, -5.2, 11.2, -1.2, 16.2, -0.8, 16.2, 1.6], true)
      .fill(0x5a3016)
      .stroke({ ...OUTLINE, width: 1.5 });
    return;
  }

  if (id === 'momo') {
    wing.rotation = 0;
    const lift = flapAngle * 3.2;
    const wag = flapAngle * 4;
    const p0x = -2;
    const p0y = 6;
    const p1x = -18;
    const p1y = -2 - wag;
    const p2x = -34;
    const p2y = 10 + wag;
    const at = (t: number): [number, number] => {
      const u = 1 - t;
      return [u * u * p0x + 2 * u * t * p1x + t * t * p2x, u * u * p0y + 2 * u * t * p1y + t * t * p2y];
    };
    body.moveTo(p0x, p0y).quadraticCurveTo(p1x, p1y, p2x, p2y).stroke({ width: 6.4, color: 0x5c4638, cap: 'round' });
    for (const t of [0.18, 0.36, 0.54, 0.72]) {
      const [x, y] = at(t);
      const [x2, y2] = at(t + 0.08);
      let tx = x2 - x;
      let ty = y2 - y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      const px = -ty * 4.6;
      const py = tx * 4.6;
      body.moveTo(x - px, y - py).lineTo(x + px, y + py).stroke({ width: 3.5, color: 0xf7f1e4, cap: 'butt' });
    }
    const backY = -7 - lift * 0.45;
    body.ellipse(-1, backY, 8, 14.2).fill(0xfffdf8).stroke(OUTLINE);
    body.ellipse(-1, backY + 0.6, 4.6, 10).fill(0xff9ec4);
    body.ellipse(-1, backY + 0.9, 2, 6).fill(0xe45a96);
    const frontY = -9 - lift;
    body.ellipse(8.5, frontY, 9, 15.6).fill(0xfffdf8).stroke(OUTLINE);
    body.ellipse(8.5, frontY + 0.7, 5.3, 11).fill(0xffb3d2);
    body.ellipse(8.5, frontY + 1, 2.4, 6.6).fill(0xf06aa8);
    body.ellipse(2, 5.5, 8.2, 5.5).fill(0xfffdf8).stroke(OUTLINE);
    body.ellipse(2.4, 7.4, 4.6, 2.7).fill(0xfff4e4);
    body.ellipse(12.2, 1.2, 6.8, 5.2).fill(0xfffdf8).stroke(OUTLINE);
    body.ellipse(16.6, 2.6, 2.5, 1.6).fill(0xfff4e4);
    body.circle(14, 0.4, 3.55).fill(0x1c140f);
    body.circle(13, -0.6, 1.2).fill(0xffffff);
    body.circle(14.8, 1.1, 0.48).fill(0xffffff);
    body.circle(17.6, 2.5, 0.55).fill(0x5c3a22);
    body.moveTo(2.5, 8.5).lineTo(0, 13.5).stroke({ width: 1.9, color: 0x5c4638, cap: 'round' });
    body.moveTo(7, 8.5).lineTo(8.6, 13.5).stroke({ width: 1.9, color: 0x5c4638, cap: 'round' });
    return;
  }

  if (id === 'charizard') {
    wing.rotation = 0;
    const lift = flapAngle * 6;
    const wag = flapAngle * 3.5;
    const burn = 0.7 + 0.3 * Math.sin(wingPhase * 9);
    const flick = Math.sin(wingPhase * 9);
    const f1x = -16 - lift * 0.35;
    const f1y = -46 - lift;
    const f2x = -38 - lift * 0.2;
    const f2y = -24 - lift * 0.45;
    const f3x = -42;
    const f3y = -2 - lift * 0.08;
    body
      .poly(
        [2, -2, f1x, f1y, -12, -30 - lift * 0.7, f2x, f2y, -28, -12 - lift * 0.2, f3x, f3y, -20, 8, 0, 9],
        true,
      )
      .fill(0x149e90)
      .stroke(OUTLINE);
    body.poly([2, 0, -12, -34 - lift * 0.8, -30, -18 - lift * 0.4, -32, -2, 0, 6], true).fill(0x0c6e64);
    const bone = { width: 3.1, color: 0x08332e, cap: 'round' as const };
    body.moveTo(1, -1).lineTo(f1x, f1y).stroke(bone);
    body.moveTo(0, 2).lineTo(f2x, f2y).stroke(bone);
    body.moveTo(0, 5).lineTo(f3x, f3y).stroke(bone);
    body.poly([f1x, f1y, f1x - 2.2, f1y - 4.2, f1x + 2.8, f1y - 0.4], true).fill(0xf6d7a4).stroke({ ...OUTLINE, width: 1.1 });
    body.poly([f2x, f2y, f2x - 4.2, f2y - 1.6, f2x - 0.2, f2y + 2.6], true).fill(0xf6d7a4).stroke({ ...OUTLINE, width: 1.1 });
    body.moveTo(1, 6).quadraticCurveTo(-18, 10 - wag, -36, 16 + wag).stroke({ width: 8, color: 0xf07828, cap: 'round' });
    body.moveTo(-1, 4.2).quadraticCurveTo(-18, 8 - wag, -33, 14 + wag).stroke({ width: 2.5, color: 0xc85a16, cap: 'round' });
    const fx = -36;
    const fy = 16 + wag;
    body
      .poly(
        [
          fx + 4,
          fy - 4,
          fx - 2,
          fy - 16,
          fx - 8 - burn * 4,
          fy - 16 - flick * 2,
          fx - 4,
          fy - 12,
          fx - 20 - burn * 5,
          fy - 8,
          fx - 6,
          fy - 2,
          fx - 14,
          fy + 12 + flick * 2,
          fx + 5,
          fy + 4,
        ],
        true,
      )
      .fill(0xff4e12);
    body
      .poly([fx + 2, fy - 3, fx - 5 - burn * 2, fy - 12, fx - 2, fy - 6, fx - 10, fy - 3, fx + 1, fy + 3], true)
      .fill(0xffd24a);
    body.poly([fx + 1, fy - 1, fx - 4, fy - 12, fx - 1, fy - 4, fx - 3, fy + 1], true).fill(0xfff6c8);
    body.ellipse(2, 5, 12.6, 8.6).fill(0xf07828).stroke(OUTLINE);
    body.ellipse(3, 9.2, 6.2, 3.3).fill(0xf6d7a4);
    body.ellipse(2.2, 7.2, 4, 1.9).fill(0xffe6c2);
    body.ellipse(3.8, 10.6, 3.1, 1.5).fill(0xeec896);
    body.moveTo(-1, 12).lineTo(-3.2, 17.6).stroke({ width: 3.2, color: 0xd85e14, cap: 'round' });
    body.moveTo(-3.2, 17.6).lineTo(-6.6, 18.8).stroke({ width: 1.8, color: 0xf6d7a4, cap: 'round' });
    body.moveTo(5, 12.2).lineTo(4, 18.2).stroke({ width: 3.2, color: 0xe06818, cap: 'round' });
    body.moveTo(4, 18.2).lineTo(7.4, 19.4).stroke({ width: 1.8, color: 0xf6d7a4, cap: 'round' });
    body.moveTo(8, 6.2).quadraticCurveTo(13, 10.2, 15.2, 12.6).stroke({ width: 3, color: 0xe06818, cap: 'round' });
    body.poly([15.2, 12.6, 18.4, 13.2, 15.6, 13.8], true).fill(0xf6d7a4);
    body.poly([14.8, 13.5, 17.6, 15.4, 15, 14.5], true).fill(0xf6d7a4);
    body.ellipse(14.2, 1, 7.8, 5.8).fill(0xf07828).stroke(OUTLINE);
    body.ellipse(15.4, -1.5, 4.2, 1.7).fill(0xd86216);
    body.ellipse(16.6, 3.5, 5, 2.4).fill(0xf6d7a4);
    body.ellipse(21.4, 1.8, 3.6, 2.3).fill(0xf07828).stroke({ ...OUTLINE, width: 1.4 });
    body.ellipse(21.8, 3.3, 2.7, 1.45).fill(0xf6d7a4);
    body.circle(23.4, 1.5, 0.55).fill(0x3d2918);
    body.moveTo(10, -3).quadraticCurveTo(4, -10, 0.6, -16.5).stroke({ width: 4.8, color: 0xb8882a, cap: 'round' });
    body.moveTo(10, -3).quadraticCurveTo(4, -10, 0.6, -16.5).stroke({ width: 2.8, color: 0xf6d56a, cap: 'round' });
    body.moveTo(8.4, -1).quadraticCurveTo(2.2, -6.2, -1.2, -10).stroke({ width: 4.2, color: 0xb8882a, cap: 'round' });
    body.moveTo(8.4, -1).quadraticCurveTo(2.2, -6.2, -1.2, -10).stroke({ width: 2.4, color: 0xf6d56a, cap: 'round' });
    eye(body, 16.4, 0.5, 2);
    body.moveTo(13.8, -1.8).lineTo(18.6, -0.2).stroke({ width: 1.7, color: 0x6a3d16, cap: 'round' });
    return;
  }

  if (id === 'mew') {
    wing.rotation = 0;
    const wag = flapAngle * 5;
    const tipX = -26;
    const tipY = -16 - wag * 0.35;
    body
      .moveTo(1, 5)
      .quadraticCurveTo(-14, 15 + wag, -24, 3)
      .quadraticCurveTo(-32, -8 - wag, tipX, tipY)
      .stroke({ width: 3.3, color: 0xf48cb8, cap: 'round' });
    body.ellipse(tipX, tipY, 6.5, 4.4).fill(0xffb7d5).stroke(OUTLINE);
    body.ellipse(3, 4, 9.2, 6.4).fill(0xffb7d5).stroke(OUTLINE);
    body.ellipse(3.6, 6.2, 5.2, 3.1).fill(0xffe4f2);
    body.ellipse(13.5, -1, 9.4, 7.6).fill(0xffb7d5).stroke(OUTLINE);
    body.moveTo(2, 8).lineTo(0.4, 12.5).stroke({ width: 2.2, color: 0xf48cb8, cap: 'round' });
    body.moveTo(7.5, 8).lineTo(9, 12.5).stroke({ width: 2.2, color: 0xf48cb8, cap: 'round' });
    body.ellipse(15.6, -1.2, 3.8, 3.15).fill(0x3ec4ef).stroke({ ...OUTLINE, width: 1.5 });
    body.ellipse(16.4, -1.2, 1.75, 2.05).fill(0x163044);
    body.circle(14.9, -2.2, 0.9).fill(0xffffff);
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
