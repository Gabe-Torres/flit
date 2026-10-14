function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode can reject storage. Sound still toggles for this visit.
  }
}

export type Audio = {
  muted: () => boolean;
  unlock: () => void;
  toggle: () => boolean;
  flap: () => void;
  score: () => void;
  hit: () => void;
  snatch: () => void;
  pickup: () => void;
  warp: () => void;
  shot: () => void;
  blast: () => void;
};

export function createAudio(): Audio {
  let ctx: AudioContext | null = null;
  let muted = storageGet('flit-muted') === '1';

  function ac(): AudioContext | null {
    if (muted) return null;
    try {
      if (!ctx) ctx = new AudioContext();
      if (ctx.state === 'suspended') void ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  }

  function tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    slide = 0,
    delay = 0,
  ): void {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(Math.max(1, freq + slide), t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp);
    amp.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function noise(dur: number, gain: number, freq: number): void {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    const buffer = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    const amp = c.createGain();
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(c.destination);
    src.start(t);
    src.stop(t + dur);
  }

  return {
    muted: () => muted,
    unlock() {
      ac();
    },
    toggle() {
      muted = !muted;
      storageSet('flit-muted', muted ? '1' : '0');
      if (!muted) ac();
      return muted;
    },
    flap() {
      noise(0.07, 0.035, 1400);
      tone(680, 0.09, 'sine', 0.06, -360);
    },
    score() {
      tone(784, 0.08, 'sine', 0.055);
      tone(1175, 0.12, 'sine', 0.05, 0, 0.07);
    },
    hit() {
      noise(0.18, 0.07, 220);
      tone(196, 0.22, 'triangle', 0.07, -140);
    },
    snatch() {
      noise(0.16, 0.04, 1700);
      tone(420, 0.18, 'sawtooth', 0.03, 560);
      tone(860, 0.24, 'triangle', 0.035, -280, 0.07);
    },
    pickup() {
      tone(523, 0.07, 'sine', 0.05, 80);
      tone(784, 0.12, 'sine', 0.045, 0, 0.06);
    },
    warp() {
      tone(311, 0.1, 'sine', 0.05, 420);
      tone(622, 0.18, 'triangle', 0.04, 180, 0.08);
    },
    shot() {
      noise(0.05, 0.045, 1900);
      tone(880, 0.06, 'square', 0.028, -460);
    },
    blast() {
      noise(0.12, 0.06, 380);
      tone(196, 0.14, 'triangle', 0.05, -90);
    },
  };
}
