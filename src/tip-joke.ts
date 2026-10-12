// The first game over of a browser session pretends to ask for a tip, then
// gets out of the way. To remove it, set TIP_JOKE_ENABLED to false, or delete
// this file and the tipJoke calls in main.ts (and the tipBeat field in draw.ts).

export const TIP_JOKE_ENABLED = true;

const SESSION_KEY = 'flit-tip-seen';
const ASK_MS = 2400;
const KIDDING_MS = 1400;

export type TipBeat = 'ask' | 'kidding' | null;

export type TipJoke = {
  onGameOver: () => void;
  tick: () => void;
  beat: () => TipBeat;
  line: () => string | null;
  consumeFly: () => boolean;
  clear: () => void;
};

export function createTipJoke(): TipJoke {
  if (!TIP_JOKE_ENABLED) {
    return {
      onGameOver() {},
      tick() {},
      beat: () => null,
      line: () => null,
      consumeFly: () => false,
      clear() {},
    };
  }

  const style = document.createElement('style');
  style.textContent = `
    #tip-joke {
      position: fixed;
      z-index: 3;
      margin: 0;
      padding: 0.85em 0.7em 0.7em;
      background: #ffffff;
      color: #1a1a1a;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
    }
    #tip-joke[hidden] { display: none !important; }
    #tip-joke .tip-title {
      margin: 0 0 0.65em;
      font-size: 1.45em;
    }
    #tip-joke .tip-row {
      display: flex;
      gap: 0.4em;
    }
    #tip-joke button {
      appearance: none;
      display: grid;
      place-items: center;
      width: auto;
      height: auto;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      background: #0066ff;
      color: #ffffff;
      font-family: inherit;
      font-size: 1.25em;
      font-weight: 500;
      cursor: pointer;
      transform: none;
    }
    #tip-joke button:active {
      transform: none;
      box-shadow: none;
    }
    #tip-joke .tip-row button {
      flex: 1 1 0;
      min-width: 0;
      aspect-ratio: 1;
    }
    #tip-joke .tip-custom {
      width: 100%;
      height: 2.7em;
      margin-top: 0.4em;
    }
    #tip-joke .tip-kidding {
      margin: 0.35em 0;
      font-size: 1.7em;
    }
  `;
  document.head.append(style);

  const root = document.createElement('div');
  root.id = 'tip-joke';
  root.hidden = true;
  root.setAttribute('aria-hidden', 'true');
  const ask = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'tip-title';
  title.textContent = 'Leave a tip?';
  const row = document.createElement('div');
  row.className = 'tip-row';
  for (const label of ['30%', '34%', '38%']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    row.append(button);
  }
  const custom = document.createElement('button');
  custom.type = 'button';
  custom.className = 'tip-custom';
  custom.textContent = 'Custom';
  ask.append(title, row, custom);
  const kidding = document.createElement('p');
  kidding.className = 'tip-kidding';
  kidding.textContent = 'just kidding';
  kidding.hidden = true;
  root.append(ask, kidding);
  document.body.append(root);

  let beat: 'off' | 'ask' | 'kidding' | 'done' = 'off';
  let started = 0;
  let memorySeen = false;

  function seen(): boolean {
    if (memorySeen) return true;
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  }

  function mark(): void {
    memorySeen = true;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode keeps the in-memory flag */
    }
  }

  function place(): void {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const worldAspect = 390 / 680;
    const screenAspect = cssW / Math.max(1, cssH);
    let scale: number;
    let ox: number;
    let oy: number;
    if (screenAspect < worldAspect) {
      scale = cssW / 390;
      ox = 0;
      oy = cssH - 680 * scale;
    } else {
      scale = cssH / 680;
      ox = (cssW - 390 * scale) / 2;
      oy = 0;
    }
    const width = 304 * scale;
    root.style.width = `${width}px`;
    root.style.fontSize = `${Math.max(13, 15 * scale)}px`;
    root.style.left = `${ox + (390 * scale - width) / 2}px`;
    const center = oy + 250 * scale;
    root.style.top = `${center - root.offsetHeight / 2}px`;
  }

  function show(next: 'ask' | 'kidding'): void {
    beat = next;
    started = performance.now();
    ask.hidden = next !== 'ask';
    kidding.hidden = next !== 'kidding';
    root.hidden = false;
    place();
  }

  function finish(): void {
    beat = 'done';
    root.hidden = true;
  }

  root.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (beat === 'ask') show('kidding');
    else if (beat === 'kidding') finish();
  });

  return {
    onGameOver() {
      if (beat !== 'off' || seen()) return;
      mark();
      show('ask');
    },
    tick() {
      if (beat !== 'ask' && beat !== 'kidding') return;
      const elapsed = performance.now() - started;
      if (beat === 'ask' && elapsed >= ASK_MS) show('kidding');
      else if (beat === 'kidding' && elapsed >= KIDDING_MS) finish();
      else place();
    },
    beat: () => (beat === 'ask' || beat === 'kidding' ? beat : null),
    line: () => (beat === 'ask' ? 'Leave a tip?' : beat === 'kidding' ? 'just kidding' : null),
    consumeFly() {
      if (beat === 'ask') {
        show('kidding');
        return true;
      }
      if (beat === 'kidding') {
        finish();
        return true;
      }
      return false;
    },
    clear() {
      if (beat === 'ask' || beat === 'kidding') finish();
    },
  };
}
