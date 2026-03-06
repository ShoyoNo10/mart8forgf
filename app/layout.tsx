import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valentine 💘",
  description: "A tiny surprise",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className="min-h-screen bg-black text-white">
        <div className="pointer-events-none fixed inset-0 opacity-40">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl bg-pink-500/25" />
          <div className="absolute bottom-[-200px] right-[-160px] h-[520px] w-[520px] rounded-full blur-3xl bg-purple-500/20" />
        </div>

        <main className="relative z-10 px-4 py-10">{children}</main>
      </body>
    </html>
  );
}