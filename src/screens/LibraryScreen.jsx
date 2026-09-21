import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Crown, Info, Play, Search, SearchX, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Poster } from "@/components/Poster";
import { ThemeToggle } from "@/components/theme";
import { DRAMAS, GENRES, PLAN_PRICE, TRIAL_PRICE, money } from "@/lib/data";
import { cn } from "@/lib/utils";

const CHIPS = [{ id: "all", label: "All" }, { id: "list", label: "My List" }, ...GENRES];

function Card({ drama, saved, onOpen, onToggleSave }) {
  return (
    <div className="group relative">
      <button onClick={() => onOpen(drama)} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg" aria-label={`Open ${drama.title}`}>
        <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          <Poster drama={drama} className="w-full" />
          {drama.tag && <Badge variant="brand" className="absolute left-2 top-2 px-2 py-0.5 text-[10px]">{drama.tag}</Badge>}
        </div>
        <p className="mt-2 line-clamp-1 text-sm font-semibold">{drama.title}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-brand-gold text-brand-gold" /> {drama.rating} · {drama.eps} eps · {drama.genres[0][0].toUpperCase() + drama.genres[0].slice(1)}
        </p>
      </button>
      <button
        onClick={() => onToggleSave(drama)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${drama.title} from My List` : `Add ${drama.title} to My List`}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-all hover:bg-black/75 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {saved ? <BookmarkCheck className="h-4 w-4 text-brand-lilac" /> : <Bookmark className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function LibraryScreen({ genres, trial, myList, onOpen, onToggleSave, onGoPremium, onPlay }) {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("all");

  const featured = useMemo(() => {
    const match = DRAMAS.filter((d) => d.genres.some((g) => genres.includes(g)));
    return [...(match.length ? match : DRAMAS)].sort((a, b) => b.rating - a.rating)[0];
  }, [genres]);
  const trending = useMemo(() => [...DRAMAS].sort((a, b) => b.rating - a.rating).slice(0, 8), []);

  const filtering = query.trim() !== "" || chip !== "all";
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DRAMAS.filter((d) => {
      if (chip === "list" && !myList.has(d.id)) return false;
      if (chip !== "all" && chip !== "list" && !d.genres.includes(chip)) return false;
      return !q || d.title.toLowerCase().includes(q);
    });
  }, [query, chip, myList]);

  return (
    <div className="relative flex h-full animate-screen-in flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        {/* sticky header */}
        <div className="sticky top-0 z-20 space-y-3 bg-background/90 px-4 pb-3 pt-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="bg-brand-gradient bg-clip-text text-[26px] font-extrabold tracking-tight text-transparent">DramaBreak</h1>
            <div className="flex items-center gap-2">
              {trial ? (
                <Badge variant="brand" className="gap-1 px-3 py-1.5 text-xs"><Crown className="h-3.5 w-3.5" /> Trial active</Badge>
              ) : (
                <Button variant="brand" size="sm" onClick={onGoPremium} className="h-9 px-4 text-[13px]">Try for {money(TRIAL_PRICE)}</Button>
              )}
              <ThemeToggle />
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search microdramas" aria-label="Search microdramas" className="pl-10 pr-10" />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none" role="tablist" aria-label="Filter by genre">
            {CHIPS.map((c) => {
              const on = chip === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setChip(c.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
                    on ? "border-transparent bg-brand-gradient text-white shadow-md" : "border-border hover:bg-accent"
                  )}
                >
                  {c.label}
                  {c.id === "list" && myList.size > 0 && <span className="ml-1.5 opacity-80">{myList.size}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-7 px-4 pb-10 pt-2">
          {/* trial banner */}
          {!filtering && (
            <button
              onClick={trial ? undefined : onGoPremium}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                trial ? "cursor-default border-emerald-500/30 bg-emerald-500/10" : "border-brand-pink/30 bg-brand-pink/10 hover:bg-brand-pink/15"
              )}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", trial ? "bg-emerald-500 text-white" : "bg-brand-gradient text-white")}>
                {trial ? <Crown className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </span>
              <span className="text-sm leading-snug">
                {trial ? (
                  <><b className="block">Your trial is active</b><span className="text-muted-foreground">Every episode is unlocked. {money(PLAN_PRICE)}/quarter after the trial.</span></>
                ) : (
                  <><b className="block">Unlock every episode for {money(TRIAL_PRICE)}</b><span className="text-muted-foreground">Episode 1 of each show is free. Start a trial for the rest.</span></>
                )}
              </span>
            </button>
          )}

          {/* featured */}
          {!filtering && (
            <section aria-label="Featured">
              <div className="relative overflow-hidden rounded-3xl" style={{ background: `linear-gradient(150deg, ${featured.colors[0]}, ${featured.colors[1]})` }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(80% 70% at 85% 20%, ${featured.colors[2]}55, transparent 70%)` }} />
                <div className="relative flex gap-4 p-4">
                  <Poster drama={featured} className="w-[112px] shrink-0 shadow-2xl ring-1 ring-white/20" />
                  <div className="flex min-w-0 flex-1 flex-col text-white">
                    <p className="text-xs font-medium text-white/70">Picked for you</p>
                    <h2 className="mt-1 text-xl font-bold leading-tight">{featured.title}</h2>
                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-snug text-white/80">{featured.blurb}</p>
                    <div className="mt-auto flex gap-2 pt-3">
                      <Button variant="brand" size="sm" onClick={() => onPlay(featured, 1)} className="h-9 flex-1 px-3 text-[13px]"><Play className="h-4 w-4 fill-white" /> Play</Button>
                      <Button variant="secondary" size="icon" onClick={() => onOpen(featured)} aria-label={`Details for ${featured.title}`} className="h-9 w-9 shrink-0 rounded-full bg-white/15 text-white hover:bg-white/25"><Info className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* trending */}
          {!filtering && (
            <section aria-labelledby="trending-h">
              <h2 id="trending-h" className="mb-3 text-lg font-bold">Trending this week</h2>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none">
                {trending.map((d, i) => (
                  <button key={d.id} onClick={() => onOpen(d)} className="w-[112px] shrink-0 rounded-lg text-left transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`#${i + 1} ${d.title}`}>
                    <Poster drama={d} rank={i + 1} className="w-full" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* grid */}
          <section aria-labelledby="all-h">
            <h2 id="all-h" className="mb-3 text-lg font-bold">
              {filtering ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "All microdramas"}
            </h2>
            {results.length ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                {results.map((d) => (
                  <Card key={d.id} drama={d} saved={myList.has(d.id)} onOpen={onOpen} onToggleSave={onToggleSave} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
                <SearchX className="h-9 w-9 text-muted-foreground" />
                <p className="font-semibold">{chip === "list" && !query ? "Your list is empty" : `Nothing matches${query ? ` “${query}”` : ""}`}</p>
                <p className="text-sm text-muted-foreground">
                  {chip === "list" && !query ? "Tap the bookmark on any drama to save it here." : "Try a different title or pick another genre."}
                </p>
                <Button variant="outline" size="sm" onClick={() => { setQuery(""); setChip("all"); }}>Show all dramas</Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
