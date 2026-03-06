import BlockBlastGame from "@/components/BlockBlastGame";

export default function GamePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="text-3xl font-black">Даа алив бажаан минь</div>
        <div className="text-white/60 text-sm">
          10000 оноо авбал онцгой бэлэг нээгдэнэ 💝
        </div>
      </div>

      <BlockBlastGame targetScore={10000} />
    </div>
  );
}