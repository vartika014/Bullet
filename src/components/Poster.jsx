import { Heart, Skull, Laugh, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const GENRE_ICON = { romance: Heart, horror: Skull, comedy: Laugh, thriller: Eye };
export const FONT_CLASS = { script: "font-script", serif: "font-serif", marker: "font-marker", display: "font-display" };
// rough average glyph width (em) per face, used to size titles so they never overflow
export const FONT_WIDTH = { script: 0.42, serif: 0.62, marker: 0.62, display: 0.42 };

/** A generated "key art" poster: gradient + genre motif + title in the drama's own typeface. */
export function Poster({ drama, className, rank }) {
  const [c0, c1, accent] = drama.colors;
  const Icon = GENRE_ICON[drama.genres[0]];
  const len = drama.title.length;
  const size = (len > 20 ? 11 : len > 13 ? 14 : 18) * (drama.font === "script" ? 1.25 : drama.font === "display" ? 1.2 : 1);
  const upper = drama.font === "display" || drama.font === "marker";

  return (
    <div
      className={cn("relative aspect-[2/3] select-none overflow-hidden rounded-lg [container-type:inline-size]", className)}
      style={{ background: `linear-gradient(165deg, ${c0} 0%, ${c1} 92%)` }}
    >
      <div className="absolute inset-0" style={{ background: `radial-gradient(90% 55% at 70% 30%, ${accent}40 0%, transparent 70%)` }} />
      <Icon
        className="absolute -right-[12%] top-[8%] opacity-25"
        style={{ width: "72%", height: "auto", color: accent }}
        strokeWidth={0.8}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 px-[7cqw] pb-[9cqw] text-center">
        <p
          className={cn("leading-[.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.6)]", FONT_CLASS[drama.font], upper && "uppercase tracking-wide")}
          style={{ fontSize: `${size}cqw` }}
        >
          {drama.title}
        </p>
        <div className="mx-auto mt-[4cqw] h-[0.6cqw] w-[18cqw] rounded-full" style={{ background: accent }} />
      </div>
      {rank != null && (
        <span className="absolute left-[6cqw] top-[3cqw] font-display text-[22cqw] leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">
          {rank}
        </span>
      )}
    </div>
  );
}
