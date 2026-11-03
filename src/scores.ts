// The three best runs on one difficulty, highest first.

export const TOP_COUNT = 3;

export function readTop(raw: string | null, best: number): number[] {
  let saved: unknown = [];
  try {
    saved = raw ? JSON.parse(raw) : [];
  } catch {
    saved = [];
  }
  const list = Array.isArray(saved)
    ? saved.filter((n): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0).map(Math.floor)
    : [];
  list.sort((a, b) => b - a);
  // A best from before the list existed still leads it.
  if (best > 0 && (list[0] ?? 0) < best) list.unshift(best);
  return list.slice(0, TOP_COUNT);
}

// A new score goes below any equal score already on the list.
export function addTopScore(top: number[], score: number): { top: number[]; at: number } {
  if (score <= 0) return { top, at: -1 };
  const at = top.filter((n) => n >= score).length;
  if (at >= TOP_COUNT) return { top, at: -1 };
  const next = [...top.slice(0, at), score, ...top.slice(at)].slice(0, TOP_COUNT);
  return { top: next, at };
}
