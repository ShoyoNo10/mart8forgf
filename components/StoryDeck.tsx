"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MemoryItem } from "@/lib/memories";
import Link from "next/link";

type Props = {
  items: MemoryItem[];
};

export default function StoryDeck({ items }: Props) {
  const [i, setI] = useState<number>(0);
  const cur = useMemo<MemoryItem | null>(() => (items[i] ? items[i] : null), [items, i]);

  if (!cur) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl font-black">Дууслаа 💖</div>
        <div className="text-white/70">Одоо жижиг тоглоом тоглоё 🎮</div>
        <Link
          href="/game"
          className="inline-flex px-6 py-3 rounded-full font-extrabold bg-pink-500 text-black hover:opacity-90"
        >
          Тоглоом эхлүүлэх
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm text-white/70">
        <div>
          {i + 1} / {items.length}
        </div>
        <button
          type="button"
          onClick={() => setI(0)}
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15"
        >
          дахин
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur.id}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-white/10 bg-white/5 overflow-hidden shadow-[0_0_50px_rgba(255,0,120,0.08)]"
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={cur.src}
              alt="memory"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 540px"
              priority={i < 2}
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="text-lg font-extrabold">{cur.caption}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          className="flex-1 px-5 py-3 rounded-full font-bold bg-white/10 hover:bg-white/15 border border-white/10"
          disabled={i === 0}
        >
          ⟵ Өмнөх
        </button>
        <button
          type="button"
          onClick={() => setI((v) => v + 1)}
          className="flex-1 px-5 py-3 rounded-full font-extrabold bg-pink-500 text-black hover:opacity-90"
        >
          Дараагийн ⟶
        </button>
      </div>
    </div>
  );
}