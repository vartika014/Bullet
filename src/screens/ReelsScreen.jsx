import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Lock } from "lucide-react";
import { ClipSlide } from "@/components/ClipSlide";
import { pickPreviewClips } from "@/lib/data";
import { useSwipe } from "@/lib/useSwipe";

/**
 * Screen 2: vertical swipe feed. Swipe (either direction), scroll, press ↓/space, or tap "Swipe for More".
 * After the last clip a short "unlock" slide scrolls in and hands off to the paywall.
 */
export function ReelsScreen({ genres, onDone }) {
  const clips = useMemo(() => pickPreviewClips(genres), [genres]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState({});
  const lock = useRef(false);

  const advance = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    setTimeout(() => (lock.current = false), 600);
    setPaused(false);
    setIndex((i) => Math.min(i + 1, clips.length));
  }, [clips.length]);

  useEffect(() => {
    if (index !== clips.length) return;
    const t = setTimeout(onDone, 650);
    return () => clearTimeout(t);
  }, [index, clips.length, onDone]);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  const swipe = useSwipe({ onSwipe: advance, onTap: () => setPaused((p) => !p) });

  return (
    <div
      className="relative h-full touch-none overflow-hidden bg-black text-white"
      onWheel={(e) => Math.abs(e.deltaY) > 20 && advance()}
      {...swipe}
    >
      <div className="h-full transition-transform [transition-duration:550ms] [transition-timing-function:cubic-bezier(.22,.8,.3,1)]" style={{ transform: `translateY(-${index * 100}%)` }}>
        {clips.map((d, i) => (
          <div key={d.id} className="h-full">
            <ClipSlide
              drama={d}
              active={index === i}
              paused={paused}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              liked={!!liked[d.id]}
              onToggleLike={() => setLiked((l) => ({ ...l, [d.id]: !l[d.id] }))}
              badge={`Preview ${i + 1} of ${clips.length}`}
              footer={
                <button onClick={advance} className="flex flex-col items-center gap-1 rounded-full px-6 py-2 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <ChevronUp className="h-5 w-5 animate-nudge" />
                  Swipe for More
                </button>
              }
            />
          </div>
        ))}
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-black">
          <div className="rounded-full bg-brand-gradient p-5 shadow-[0_0_60px_-5px_rgba(233,30,140,.7)]">
            <Lock className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold">Unlock every episode</p>
        </div>
      </div>
    </div>
  );
}
