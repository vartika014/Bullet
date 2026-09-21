import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { GENRES, MAX_GENRES } from "@/lib/data";
import { WALL_BOTTOM, WALL_TOP } from "@/lib/posters";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

function MarqueeRow({ items, reverse, className }) {
  const loop = [...items, ...items];
  return (
    <div className={cn("flex w-max gap-1", reverse ? "animate-marquee-slow-rev" : "animate-marquee-slow", className)}>
      {loop.map((p, i) => (
        <img
          key={`${p.title}-${i}`}
          src={p.src}
          alt=""
          width={86}
          height={143}
          draggable={false}
          className="aspect-[3/5] w-[86px] shrink-0 select-none rounded-md object-cover"
        />
      ))}
    </div>
  );
}

export function GenreScreen({ selected, setSelected, onProceed }) {
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const full = selected.length >= MAX_GENRES;

  const fail = (msg) => {
    setError(msg);
    setShakeKey((k) => k + 1);
  };

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((g) => g !== id));
      setError("");
    } else if (full) {
      fail(`You can pick up to ${MAX_GENRES} genres. Untick one to swap.`);
    } else {
      setSelected([...selected, id]);
      setError("");
    }
  };

  const proceed = () => {
    if (selected.length === 0) return fail("Pick at least one genre to continue.");
    onProceed();
  };

  return (
    <div className="relative flex h-full animate-screen-in flex-col">
      <div className="absolute right-3 top-3 z-20">
        <ThemeToggle />
      </div>

      {/* poster wall */}
      <div className="relative h-[31%] min-h-[220px] shrink-0 overflow-hidden" aria-hidden>
        <div className="space-y-1">
          <MarqueeRow items={WALL_TOP} />
          <MarqueeRow items={WALL_BOTTOM} reverse className="opacity-70" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-background via-background/85 to-transparent" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-9 pt-6 scrollbar-none">
        <h1 id="genre-heading" className="text-[23px] font-bold leading-[1.2] tracking-tight">
          Select Your Favourite Genres (maximum {MAX_GENRES}):
        </h1>

        <div key={shakeKey} role="group" aria-labelledby="genre-heading" className={cn("mt-9 space-y-[22px]", shakeKey > 0 && error && "animate-shake")}>
          {GENRES.map((g) => {
            const checked = selected.includes(g.id);
            const dimmed = full && !checked;
            return (
              <label
                key={g.id}
                htmlFor={`genre-${g.id}`}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg text-[19px] transition-opacity hover:opacity-80",
                  dimmed && "opacity-40"
                )}
              >
                {g.label}
                <Checkbox id={`genre-${g.id}`} checked={checked} onCheckedChange={() => toggle(g.id)} aria-invalid={!!error && selected.length === 0} className={cn(error && selected.length === 0 && "border-destructive")} />
              </label>
            );
          })}
        </div>

        <div className="mt-6 min-h-[44px] text-sm" aria-live="polite">
          {error ? (
            <p className="flex items-start gap-2 text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : (
            <p className="text-muted-foreground">
              {selected.length} of {MAX_GENRES} selected
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 justify-center pb-10 pt-3 safe-bottom">
        <Button variant="brand" onClick={proceed} className="h-[54px] px-10 text-[17px]">
          Proceed to Trial
        </Button>
      </div>
    </div>
  );
}
