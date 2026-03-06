"use client";

import { useRouter } from "next/navigation";
import NoButton from "@/components/NoButton";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [noCount, setNoCount] = useState<number>(0);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl text-center space-y-7">
        <div className="text-4xl sm:text-5xl font-black leading-tight">
          Хайрийхаа бэлгийг хүлээж авах уу? 💘
        </div>

        <div className="text-white/70">
          (Сонголтоо зөв хийнэ шүү 😄)
        </div>

        <div className="relative flex items-center justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/story")}
            className="px-7 py-3 rounded-full font-extrabold bg-pink-500 text-black hover:opacity-90"
          >
            Тэгье ✅
          </button>

          <NoButton onNo={() => setNoCount((v) => v + 1)} />
        </div>

        {noCount > 0 && (
          <div className="text-sm text-white/60">
            “Үгүй” дарсан оролдлого: <span className="tabular-nums">{noCount}</span> 😭 Жи муухай
          </div>
        )}
      </div>
    </div>
  );
}