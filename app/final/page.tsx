"use client";

import ConfettiBurst from "@/components/ConfettiBurst";
import { useEffect, useMemo, useState } from "react";

type HeartItem = {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
};

export default function FinalPage() {
  const [fire, setFire] = useState<boolean>(false);

  useEffect(() => {
    setFire(true);
    const t = setTimeout(() => setFire(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const hearts = useMemo<HeartItem[]>(
    () => [
      { id: 1, left: "6%", size: "text-lg", duration: "7s", delay: "0s" },
      { id: 2, left: "16%", size: "text-2xl", duration: "9s", delay: "1.2s" },
      { id: 3, left: "28%", size: "text-xl", duration: "8s", delay: "2s" },
      { id: 4, left: "42%", size: "text-3xl", duration: "10s", delay: "0.6s" },
      { id: 5, left: "57%", size: "text-lg", duration: "7.5s", delay: "1.8s" },
      { id: 6, left: "70%", size: "text-2xl", duration: "8.8s", delay: "2.4s" },
      { id: 7, left: "83%", size: "text-xl", duration: "9.5s", delay: "0.9s" },
      { id: 8, left: "92%", size: "text-2xl", duration: "8.2s", delay: "1.4s" },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#120014] via-[#1b0822] to-[#2a0d2f] flex items-center justify-center px-4 py-10">
      {/* background glow */}
      <div className="absolute top-[-120px] left-[-80px] h-72 w-72 rounded-full bg-pink-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
      <div className="absolute top-[20%] left-[50%] h-72 w-72 -translate-x-1/2 rounded-full bg-rose-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />

      {/* floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className={`absolute bottom-[-40px] ${heart.size} opacity-70 animate-[floatUp_linear_infinite]`}
            style={{
              left: heart.left,
              animationDuration: heart.duration,
              animationDelay: heart.delay,
            }}
          >
            💖
          </span>
        ))}
      </div>

      {/* tiny sparkles */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute top-[15%] left-[20%] text-white/60 animate-ping">✦</span>
        <span className="absolute top-[28%] right-[18%] text-pink-200/70 animate-pulse">✧</span>
        <span className="absolute bottom-[22%] left-[14%] text-white/50 animate-pulse">✦</span>
        <span className="absolute bottom-[18%] right-[20%] text-rose-200/60 animate-ping">✧</span>
      </div>

      <ConfettiBurst fire={fire} />

      <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_0_100px_rgba(255,0,140,0.18)] p-6 sm:p-10 md:p-12">
        {/* top shine */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />

        <div className="text-center animate-[fadeUp_.7s_ease-out]">
          <div className="inline-block rounded-full border border-pink-300/30 bg-pink-400/10 px-4 py-1 text-sm font-semibold text-pink-200 mb-4 shadow-[0_0_20px_rgba(255,120,180,0.15)]">
            🌷 Эмэгтэйчүүдийн баярын мэнд 🌷
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6 drop-shadow-[0_0_24px_rgba(255,120,180,0.25)]">
            Хөөрхөн хайрдаа 💖
          </h1>
        </div>

        <div className="space-y-4 text-[15px] sm:text-lg leading-8 text-white/85">
          <p className="animate-[fadeUp_.9s_ease-out]">
            Юуны түрүүнд бяжхан үрдээ{" "}
            <span className="font-bold text-pink-200">
              Эмэгтэйчүүдийн баярын мэнд хүргэе
            </span>
            .
          </p>

          <p className="animate-[fadeUp_1.1s_ease-out]">
            Миний сайхан хайр өнөөдөр, цаашдаа ч дандаа цэцэг шиг
            инээмсэглэж, нар мэт гялалзаж, дүрэлзэж, сар мэт бүгдийг
            гийгүүлж, хүсэл шивнэх од болж, үргэлж дэлгэрч мандаж,
            тэнгэрт түгж яваарай.
          </p>

          <p className="animate-[fadeUp_1.3s_ease-out]">
            Өнөөдөр энхрийхэн чиний минь ямар ч сүүдэр тусахгүй
            эрхийн өдөр юм шүү.
          </p>

          <p className="pt-2 text-lg sm:text-xl font-extrabold text-white animate-[fadeUp_1.5s_ease-out] drop-shadow-[0_0_18px_rgba(255,120,180,0.28)]">
            Чамдаа хязгааргүй хайртай шүү. 💝
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center animate-[fadeUp_1.7s_ease-out]">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm sm:text-base text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_24px_rgba(255,120,180,0.08)]">
            Чи бол миний хамгийн нандин, хамгийн үзэсгэлэнтэй хүн ✨
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.9) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-45vh) scale(1.05) rotate(8deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-95vh) scale(1.2) rotate(-8deg);
            opacity: 0;
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}