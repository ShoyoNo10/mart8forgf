import { Board, Cell, Piece, Point } from "./gameTypes";

export const SIZE = 8;

export function makeEmptyBoard(): Board {
  const row: Cell[] = Array.from({ length: SIZE }, () => 0);
  return Array.from({ length: SIZE }, () => [...row]);
}

export function cloneBoard(b: Board): Board {
  return b.map((row) => [...row]) as Board;
}

export function inBounds(p: Point): boolean {
  return p.r >= 0 && p.r < SIZE && p.c >= 0 && p.c < SIZE;
}

export function canPlace(board: Board, piece: Piece, at: Point): boolean {
  for (const cell of piece.cells) {
    const p = { r: at.r + cell.r, c: at.c + cell.c };
    if (!inBounds(p)) return false;
    if (board[p.r][p.c] === 1) return false;
  }
  return true;
}

export function placePiece(board: Board, piece: Piece, at: Point): Board {
  const next = cloneBoard(board);
  for (const cell of piece.cells) {
    const p = { r: at.r + cell.r, c: at.c + cell.c };
    next[p.r][p.c] = 1;
  }
  return next;
}

export function clearFullLines(board: Board): { board: Board; cleared: number } {
  const next = cloneBoard(board);

  const fullRows: boolean[] = Array.from({ length: SIZE }, (_, r) =>
    next[r].every((v) => v === 1)
  );

  const fullCols: boolean[] = Array.from({ length: SIZE }, (_, c) => {
    for (let r = 0; r < SIZE; r++) if (next[r][c] === 0) return false;
    return true;
  });

  let clearedLines = 0;

  for (let r = 0; r < SIZE; r++) {
    if (fullRows[r]) {
      clearedLines++;
      for (let c = 0; c < SIZE; c++) next[r][c] = 0;
    }
  }

  for (let c = 0; c < SIZE; c++) {
    if (fullCols[c]) {
      clearedLines++;
      for (let r = 0; r < SIZE; r++) next[r][c] = 0;
    }
  }

  return { board: next, cleared: clearedLines };
}

/** Score rule: placed blocks + cleared lines bonus */
export function scoreDelta(placedCells: number, clearedLines: number): number {
  const placeScore = placedCells * 25;
  const lineBonus = clearedLines === 0 ? 0 : 200 * clearedLines * clearedLines;
  return placeScore + lineBonus;
}

/** Deterministic-ish random helper */
export function pick<T>(arr: readonly T[], rng: () => number): T {
  const i = Math.floor(rng() * arr.length);
  return arr[i];
}

export function makeRng(seed: number): () => number {
  // simple LCG, no any
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const PIECES: readonly Piece[] = [
  { id: "p1", name: "Single", cells: [{ r: 0, c: 0 }] },
  { id: "p2", name: "2-line", cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }] },
  { id: "p3", name: "3-line", cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }] },
  { id: "p4", name: "4-line", cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }] },
  { id: "p5", name: "2-vert", cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }] },
  { id: "p6", name: "3-vert", cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }] },
  { id: "p7", name: "L3", cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }] },
  { id: "p8", name: "L4", cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 2, c: 1 }] },
  { id: "p9", name: "Square2", cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }] },
  { id: "p10", name: "T", cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 1 }] },
];

export function dealPieces(rng: () => number): Piece[] {
  // 3 piece
  const a = pick(PIECES, rng);
  const b = pick(PIECES, rng);
  const c = pick(PIECES, rng);
  // avoid same ids if possible
  const uniq: Piece[] = [];
  for (const p of [a, b, c]) {
    if (!uniq.some((u) => u.id === p.id)) uniq.push(p);
  }
  while (uniq.length < 3) uniq.push(pick(PIECES, rng));
  return uniq.slice(0, 3);
}

export function hasAnyMove(board: Board, pieces: Piece[]): boolean {
  for (const piece of pieces) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (canPlace(board, piece, { r, c })) return true;
      }
    }
  }
  return false;
}