import { useEffect, useMemo, useState } from "react";
import { Heart, Play, Volume2, VolumeX } from "lucide-react";
import { FONT_CLASS, FONT_WIDTH, GENRE_ICON } from "@/components/Poster";
import { cn } from "@/lib/utils";

const CLIP_SECONDS = 7.8;

function splitTitle(title) {
  const words = title.split(" ");
  const lines = [];
  words.forEach((w) => {
    const last = lines[lines.length - 1];
    if (last && (last + " " + w).length <= 9) lines[lines.length - 1] = last + " " + w;
    else lines.push(w);
  });
  return lines;
}

/**
 * Stand-in for a vertical video: animated key art, drifting particles and timed subtitles.
 * Swap the background layer for a <video> element when real clips are available.
 */
export function ClipSlide({ drama, active, paused, muted, onToggleMute, liked, onToggleLike, badge, footer, episode }) {
  const [c0, c1, accent] = drama.colors;
  const Icon = GENRE_ICON[drama.genres[0]];
  const [cap, setCap] = useState(0);
  const running = active && !paused;

  useEffect(() => {
    if (!active) setCap(0);
  }, [active]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setCap((c) => (c + 1) % drama.captions.length), (CLIP_SECONDS / drama.captions.length) * 1000);
    return () => clearInterval(t);
  }, [running, drama]);

  const lines = useMemo(() => splitTitle(drama.title), [drama.title]);
  const maxLen = Math.max(...lines.map((l) => l.length));
  const upper = drama.font === "display" || drama.font === "marker";
  const fontSize = Math.min(upper ? 84 : 66, 310 / (maxLen * FONT_WIDTH[drama.font]));
  const playState = { animationPlayState: running ? "running" : "paused" };

  const particles = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ left: (i * 37 + 11) % 96, bottom: (i * 23) % 40, delay: (i * 0.9) % 7, size: 2 + (i % 3) })),
    []
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      {/* moving key art */}
      <div className="absolute inset-0 animate-kenburns" style={{ ...playState, background: `linear-gradient(180deg, ${c0} 0%, ${c1} 100%)` }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(75% 45% at 68% 38%, ${accent}55 0%, transparent 70%)` }} />
        <Icon className="absolute -right-[14%] top-[16%] opacity-[.22]" style={{ width: "88%", height: "auto", color: accent }} strokeWidth={0.5} aria-hidden />
      </div>
      <div className="absolute -top-10 right-[12%] h-[120%] w-24 rotate-[14deg] animate-flicker bg-gradient-to-b from-white/30 to-transparent blur-2xl" style={playState} />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{ left: `${p.left}%`, bottom: `${p.bottom + 8}%`, width: p.size, height: p.size, animation: `drift 7s ease-in ${p.delay}s infinite`, ...playState }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/90" />

      {/* progress */}
      <div className="absolute inset-x-3 top-3 z-10 h-[3px] overflow-hidden rounded-full bg-white/20">
        {active && (
          <div key={episode} className="h-full origin-left rounded-full bg-white" style={{ animation: `progress ${CLIP_SECONDS}s linear infinite`, ...playState }} />
        )}
      </div>
      {badge && (
        <div className="absolute left-4 top-7 z-10 rounded-full bg-black/45 px-3 py-1 text-xs font-medium backdrop-blur">{badge}</div>
      )}

      {/* title block */}
      <div className="absolute inset-x-0 top-[13%] z-10 px-7">
        <p className="font-serif text-[15px] tracking-[.4em] text-white/80 uppercase">{drama.hook}</p>
        <h2 className={cn("mt-4 leading-[.92] drop-shadow-[0_4px_16px_rgba(0,0,0,.6)]", FONT_CLASS[drama.font], upper && "uppercase")} style={{ fontSize }}>
          {lines.map((l, i) => (
            <span key={i} className="block" style={{ color: i === 0 && lines.length > 1 ? "#fff" : accent, transform: `rotate(${i === 0 ? -3 : 0}deg)`, transformOrigin: "left" }}>
              {l}
            </span>
          ))}
        </h2>
        <p className="mt-5 text-[13px] tracking-[.3em] text-white/85 uppercase">{drama.tagline}</p>
        <div className="mt-2 h-[2px] w-16" style={{ background: accent }} />
      </div>

      {/* subtitle */}
      <div className="absolute inset-x-0 bottom-[19%] z-10 flex justify-center px-8">
        <p key={`${drama.id}-${cap}-${episode}`} className="max-w-full animate-in fade-in slide-in-from-bottom-2 rounded-lg bg-black/55 px-4 py-2 text-center text-[15px] font-medium leading-snug backdrop-blur-sm duration-500">
          {drama.captions[cap]}
        </p>
      </div>

      {/* paused indicator */}
      {paused && active && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-pop rounded-full bg-black/50 p-5 backdrop-blur">
            <Play className="h-9 w-9 fill-white" />
          </div>
        </div>
      )}

      {/* action rail */}
      <div className="absolute bottom-[12%] right-3 z-20 flex flex-col items-center gap-3">
        <button
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-transform active:scale-90 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Heart className={cn("h-5 w-5 transition-colors", liked && "fill-rose-500 text-rose-500")} />
        </button>
        <button
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-transform active:scale-90 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* footer (Swipe for More / Next episode) */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-6 safe-bottom">{footer}</div>
    </div>
  );
}
