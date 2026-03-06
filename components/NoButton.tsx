"use client";

import { useMemo, useState } from "react";

type Props = {
  onNo: () => void;
};

export default function NoButton({ onNo }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const bounds = useMemo(() => {
    // safe area inside viewport
    const pad = 24;
    const w = typeof window !== "undefined" ? window.innerWidth : 800;
    const h = typeof window !== "undefined" ? window.innerHeight : 600;
    return { minX: -w / 2 + pad, maxX: w / 2 - pad, minY: -h / 3, maxY: h / 3 };
  }, []);

  function jump() {
    const rx = Math.floor(Math.random() * (bounds.maxX - bounds.minX + 1)) + bounds.minX;
    const ry = Math.floor(Math.random() * (bounds.maxY - bounds.minY + 1)) + bounds.minY;
    setPos({ x: rx, y: ry });
    onNo();
  }

  return (
    <button
      type="button"
      onMouseEnter={jump}
      onClick={jump}
      className="relative px-6 py-3 rounded-full font-extrabold
        bg-white/10 border border-white/15 text-white
        hover:bg-white/15 transition"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      Үгүй 🙅‍♀️
    </button>
  );
}