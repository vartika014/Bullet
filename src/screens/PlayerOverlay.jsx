import { useState } from "react";
import { SkipForward, X } from "lucide-react";
import { ClipSlide } from "@/components/ClipSlide";
import { FREE_EPISODES } from "@/lib/data";
import { useSwipe } from "@/lib/useSwipe";

/** Full-screen episode player. Tap to pause, swipe or press "Next episode" to continue. */
export function PlayerOverlay({ drama, ep, trial, onEpisode, onClose, onLocked }) {
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  const next = () => {
    const n = ep + 1;
    if (n > drama.eps) return onClose();
    if (!trial && n > FREE_EPISODES) return onLocked();
    setPaused(false);
    onEpisode(n);
  };
  const swipe = useSwipe({ onSwipe: next, onTap: () => setPaused((p) => !p) });

  return (
    <div className="absolute inset-0 z-40 animate-in touch-none fade-in slide-in-from-bottom-6 duration-300" {...swipe} role="dialog" aria-label={`Playing ${drama.title}, episode ${ep}`}>
      <ClipSlide
        drama={drama}
        episode={ep}
        active
        paused={paused}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        liked={liked}
        onToggleLike={() => setLiked((l) => !l)}
        badge={`Episode ${ep} of ${drama.eps}`}
        footer={
          <button onClick={next} className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-[15px] font-semibold backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <SkipForward className="h-4 w-4" /> Next episode
          </button>
        }
      />
      <button onClick={onClose} aria-label="Close player" className="absolute right-3 top-7 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
