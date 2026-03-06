export type Cell = 0 | 1;

export type Board = Cell[][]; // 8x8

export type Point = { r: number; c: number };

export type Piece = {
  id: string;
  name: string;
  cells: Point[]; // relative coords from (0,0)
};