import StoryDeck from "@/components/StoryDeck";
import { MEMORIES } from "@/lib/memories";

export default function StoryPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="text-3xl font-black">Чамтай холбоотой дурсамжууд 📸</div>
        <div className="text-white/60 text-sm">Нэг нэгээр нь үзээд дараагийнх руу шилжинэ</div>
      </div>

      <StoryDeck items={MEMORIES} />
    </div>
  );
}