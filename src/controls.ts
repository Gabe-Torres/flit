export type ControlHints = {
  touch: boolean;
  fly: string;
  resume: string;
  retry: string;
  speak: string;
  resumeSpeak: string;
  againSpeak: string;
};

const PHONE: ControlHints = {
  touch: true,
  fly: 'tap to fly',
  resume: 'tap to resume',
  retry: 'tap to try again',
  speak: 'Tap to fly.',
  resumeSpeak: 'Tap to resume.',
  againSpeak: 'Tap to fly again.',
};

const COMPUTER: ControlHints = {
  touch: false,
  fly: 'click or space to fly',
  resume: 'click or space to resume',
  retry: 'click or space to try again',
  speak: 'Click, or press Space, Up, or W, to fly.',
  resumeSpeak: 'Click, or press Space, Up, or W, to resume.',
  againSpeak: 'Click, or press Space, Up, or W, to fly again.',
};

export function controlHints(touch: boolean): ControlHints {
  return touch ? PHONE : COMPUTER;
}
