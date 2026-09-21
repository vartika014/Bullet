import { Poster } from "@/components/Poster";
import { DRAMAS } from "@/lib/data";

/**
 * Static poster collage for the paywall: a big featured card over two staggered rows
 * that use every drama in the catalogue. No motion, no scroll behaviour.
 */
const FEATURED = "billionaires-mistake";
const ROW_1 = [-4, 3, -2, 5, -5, 2, -3]; // rotation (deg) per tile
const ROW_2 = [3, -5, 2, -3, 4, -2, 5];
const STEP = 14.3; // % of card width between tile origins; tiles are wider so neighbours overlap

export function PosterCollage() {
  const featured = DRAMAS.find((d) => d.id === FEATURED);
  const rest = DRAMAS.filter((d) => d.id !== FEATURED); // 14 dramas -> 2 rows of 7

  const tile = (d, left, top, rot, extra = {}) => (
    <div key={d.id} data-testid="collage-tile" aria-hidden className="absolute w-[19%]" style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${rot}deg)`, ...extra }}>
      <Poster drama={d} className="w-full shadow-lg ring-1 ring-white/25" />
    </div>
  );

  return (
    <div
      role="img"
      aria-label="Preview of popular microdramas"
      data-testid="poster-collage"
      className="relative aspect-video w-full overflow-hidden rounded-2xl"
      style={{ background: "linear-gradient(120deg,#26402e 0%,#5b7a45 38%,#d9a679 100%)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_45%,rgba(255,255,255,.38),transparent)]" />
      {rest.slice(0, 7).map((d, i) => tile(d, -2 + i * STEP, -10, ROW_1[i]))}
      {rest.slice(7).map((d, i) => tile(d, 3 + i * STEP, 46, ROW_2[i]))}
      <div data-testid="collage-tile" aria-hidden className="absolute z-10 w-[25%]" style={{ left: "37.5%", top: "14%" }}>
        <Poster drama={featured} className="w-full shadow-[0_18px_40px_-8px_rgba(0,0,0,.7)] ring-2 ring-white/50" />
      </div>
    </div>
  );
}
