"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfettiBurst from "./ConfettiBurst";
import type { Board, Piece, Point } from "@/lib/gameTypes";
import {
  SIZE,
  canPlace,
  clearFullLines,
  dealPieces,
  hasAnyMove,
  makeEmptyBoard,
  makeRng,
  placePiece,
  scoreDelta,
} from "@/lib/blockBlast";

type DragState =
  | { kind: "none" }
  | {
      kind: "piece";
      index: number;

      // finger position (viewport)
      x: number;
      y: number;

      // finger offset inside the pressed piece button
      offsetX: number;
      offsetY: number;

      // WHICH internal cell (in the piece preview grid) was grabbed
      grabR: number;
      grabC: number;
    };

type Props = {
  targetScore: number; // 10000
};

function pieceBounds(piece: Piece): { w: number; h: number } {
  let maxR = 0;
  let maxC = 0;
  for (const p of piece.cells) {
    if (p.r > maxR) maxR = p.r;
    if (p.c > maxC) maxC = p.c;
  }
  return { w: maxC + 1, h: maxR + 1 };
}

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function pointFromTouch(t: Touch): { x: number; y: number } {
  return { x: t.clientX, y: t.clientY };
}

export default function BlockBlastGame({ targetScore }: Props) {
  const [board, setBoard] = useState<Board>(() => makeEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [pieces, setPieces] = useState<Piece[]>(() =>
    dealPieces(makeRng(Date.now())),
  );
  const [used, setUsed] = useState<boolean[]>([false, false, false]);

  const [drag, setDrag] = useState<DragState>({ kind: "none" });
  const [hoverCell, setHoverCell] = useState<Point | null>(null);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const seedRef = useRef<number>(Date.now());
  const rng = useMemo(() => makeRng(seedRef.current), []);
  const boardRef = useRef<HTMLDivElement | null>(null);

  function reset() {
    seedRef.current = Date.now();
    const r = makeRng(seedRef.current);

    setBoard(makeEmptyBoard());
    setScore(0);
    setPieces(dealPieces(r));
    setUsed([false, false, false]);

    setDrag({ kind: "none" });
    setHoverCell(null);

    setGameOver(false);
    setWon(false);
  }

  function alivePieces(): Piece[] {
    return pieces.filter((_, i) => !used[i]);
  }

  function cellAtViewport(x: number, y: number): Point | null {
    const el = boardRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom)
      return null;

    const cellSize = rect.width / SIZE;
    const c = Math.floor((x - rect.left) / cellSize);
    const r = Math.floor((y - rect.top) / cellSize);

    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null;
    return { r, c };
  }

  /** Convert finger cell -> piece anchor cell, based on grabbed internal cell */
  function anchorFromFingerCell(fingerCell: Point): Point {
    if (drag.kind !== "piece") return fingerCell;
    return { r: fingerCell.r - drag.grabR, c: fingerCell.c - drag.grabC };
  }

  function previewOk(fingerCell: Point): boolean {
    if (drag.kind !== "piece") return false;
    const idx = drag.index;
    if (used[idx]) return false;

    const at = anchorFromFingerCell(fingerCell);
    return canPlace(board, pieces[idx], at);
  }

  function tryDrop(fingerCell: Point) {
    if (drag.kind !== "piece") return;

    const idx = drag.index;
    if (used[idx]) return;

    const piece = pieces[idx];
    const at = anchorFromFingerCell(fingerCell);

    if (!canPlace(board, piece, at)) return;

    const placed = placePiece(board, piece, at);
    const cleared = clearFullLines(placed);
    const delta = scoreDelta(piece.cells.length, cleared.cleared);

    setBoard(cleared.board);
    setScore((s) => s + delta);
    setUsed((prev) => prev.map((v, i) => (i === idx ? true : v)));

    setDrag({ kind: "none" });
    setHoverCell(null);
  }

  // ===== win / deal / game over =====

  useEffect(() => {
    if (!won && score >= targetScore) setWon(true);
  }, [score, targetScore, won]);

  useEffect(() => {
    if (won) return;

    // if all 3 used => deal new 3
    if (used.every(Boolean)) {
      setPieces(dealPieces(rng));
      setUsed([false, false, false]);
      setDrag({ kind: "none" });
      setHoverCell(null);
      return;
    }

    const alive = alivePieces();
    if (alive.length > 0 && !hasAnyMove(board, alive)) setGameOver(true);
  }, [board, used, rng, won]);

  // ===== mobile touch events (global while dragging) =====

  useEffect(() => {
    if (drag.kind !== "piece") return;

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      const p = pointFromTouch(e.touches[0]);

      setDrag((d) => (d.kind === "piece" ? { ...d, x: p.x, y: p.y } : d));
      const cell = cellAtViewport(p.x, p.y);
      setHoverCell(cell);

      // prevent scroll while dragging
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      // if finger ended while on board -> drop
      const cell = hoverCell;
      if (cell) tryDrop(cell);

      setDrag({ kind: "none" });
      setHoverCell(null);

      e.preventDefault();
    }

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, hoverCell, board, pieces, used]);

  // ===== UI =====

  const goalLeft = Math.max(0, targetScore - score);
  const progress = clamp(score / targetScore, 0, 1);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-black">
              Оноо: <span className="text-pink-400 tabular-nums">{score}</span>
              <span className="text-white/50 text-xs font-bold">
                {" "}
                / {targetScore}
              </span>
            </div>
            <div className="text-xs text-white/60 mt-1">
              {won
                ? "Онцгой бэлэг нээгдлээ 💝"
                : `10000 хүрэхэд: ${goalLeft} оноо`}
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="shrink-0 px-4 py-2 rounded-full font-bold bg-white/10 hover:bg-white/15 border border-white/10"
          >
            Дахин
          </button>
        </div>

        <div className="mt-3 h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-pink-500/80"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Board */}
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_0_60px_rgba(255,0,120,0.06)]">
        <div
          ref={boardRef}
          className="grid grid-cols-8 gap-2 touch-none"
          aria-label="board"
        >
          {board.map((row, r) =>
            row.map((v, c) => {
              const isHover = hoverCell?.r === r && hoverCell?.c === c;
              const ok = isHover && previewOk({ r, c });

              const base = "aspect-square rounded-xl border transition";
              const filled =
                v === 1
                  ? "bg-pink-500/80 border-pink-400/40"
                  : "bg-black/40 border-white/10";
              const hover = isHover
                ? ok
                  ? "ring-2 ring-pink-400"
                  : "ring-2 ring-red-400"
                : "";

              return (
                <div
                  key={`${r}-${c}`}
                  className={`${base} ${filled} ${hover}`}
                />
              );
            }),
          )}
        </div>

        {/* <div className="mt-3 text-xs text-white/60 leading-relaxed">
          ✔️ Доорх блок дээр <b>удаан дараад</b> чирж тавина. <br />
          ✔️ Бүтэн мөр/багана бөглөвөл цэвэрлэгдэнэ.
        </div> */}
      </div>

      {/* States */}
      {gameOver && !won && (
        <div className="rounded-[22px] border border-red-400/30 bg-red-500/10 p-4">
          <div className="font-extrabold text-lg">ӨӨӨ шугаааа</div>
          <div className="text-white/70 text-sm mt-1">
           Дахиад эхэл шуга минь
          </div>
        </div>
      )}

      {won && (
        <div className="rounded-[22px] border border-pink-400/30 bg-pink-500/10 p-4">
          <ConfettiBurst fire={true} />
          <div className="font-extrabold text-lg">Yeeeeyy minii haiyyy dadlaaaa</div>
          <div className="text-white/70 text-sm mt-1">
            {targetScore}+ оноо авлаа — онцгой бэлэг нээгдлээ 💝
          </div>
          <Link
            href="/final"
            className="inline-flex mt-3 px-5 py-3 rounded-full font-extrabold bg-pink-500 text-black hover:opacity-90"
          >
            Захиагаа үзэх
          </Link>
        </div>
      )}

      {/* Pieces (mobile) */}
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="font-black text-base">Блокууд</div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {pieces.map((p, idx) => {
            const disabled = used[idx] || won;
            const b = pieceBounds(p);

            return (
              <div
                key={`${p.id}-${idx}`}
                className={[
                  "rounded-2xl border p-3 bg-black/30",
                  disabled ? "opacity-35 border-white/10" : "border-white/15",
                ].join(" ")}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onTouchStart={(e) => {
                    if (disabled) return;
                    if (e.touches.length === 0) return;

                    const touch = e.touches[0];
                    const pt = pointFromTouch(touch);

                    // button rect
                    const rect = e.currentTarget.getBoundingClientRect();

                    // local coords inside button
                    const localX = pt.x - rect.left;
                    const localY = pt.y - rect.top;

                    // since the preview fills the button width/height, estimate internal cell size
                    const cellW = rect.width / b.w;
                    const cellH = rect.height / b.h;

                    // grabbed internal grid cell
                    const grabC = clamp(Math.floor(localX / cellW), 0, b.w - 1);
                    const grabR = clamp(Math.floor(localY / cellH), 0, b.h - 1);

                    setDrag({
                      kind: "piece",
                      index: idx,
                      x: pt.x,
                      y: pt.y,
                      offsetX: pt.x - rect.left,
                      offsetY: pt.y - rect.top,
                      grabR,
                      grabC,
                    });

                    const cell = cellAtViewport(pt.x, pt.y);
                    setHoverCell(cell);

                    e.preventDefault();
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2 active:scale-[0.98] transition touch-none"
                >
                  <div
                    className="grid gap-1 mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${b.w}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: b.w * b.h }, (_, i) => {
                      const rr = Math.floor(i / b.w);
                      const cc = i % b.w;
                      const filled = p.cells.some(
                        (x) => x.r === rr && x.c === cc,
                      );

                      return (
                        <div
                          key={i}
                          className={[
                            "aspect-square rounded-md border",
                            filled
                              ? "bg-pink-500/80 border-pink-400/40"
                              : "bg-white/5 border-white/10",
                          ].join(" ")}
                        />
                      );
                    })}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag ghost (follows finger) */}
      {drag.kind === "piece" && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
          }}
        >
          <div className="rounded-2xl border border-pink-400/30 bg-black/60 backdrop-blur p-3 shadow-[0_0_40px_rgba(255,0,120,0.18)]">
            {(() => {
              const p = pieces[drag.index];
              const b = pieceBounds(p);

              return (
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${b.w}, 22px)`,
                  }}
                >
                  {Array.from({ length: b.w * b.h }, (_, i) => {
                    const rr = Math.floor(i / b.w);
                    const cc = i % b.w;
                    const filled = p.cells.some(
                      (x) => x.r === rr && x.c === cc,
                    );

                    return (
                      <div
                        key={i}
                        className={[
                          "w-[22px] h-[22px] rounded-md border",
                          filled
                            ? "bg-pink-500/80 border-pink-400/40"
                            : "bg-white/5 border-white/10",
                        ].join(" ")}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
