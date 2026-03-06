"use client";

import confetti from "canvas-confetti";

type Props = { fire: boolean };

export default function ConfettiBurst({ fire }: Props) {
  if (fire) {
    const end = Date.now() + 900;
    const tick = () => {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
      });
      if (Date.now() < end) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  return null;
}