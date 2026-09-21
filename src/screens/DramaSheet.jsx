import { Bookmark, BookmarkCheck, Lock, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Poster } from "@/components/Poster";
import { FREE_EPISODES, episodeList } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DramaSheet({ drama, trial, saved, onClose, onToggleSave, onPlay, onLocked }) {
  if (!drama) return null;
  const eps = episodeList(drama);
  const locked = (n) => !trial && n > FREE_EPISODES;
  const more = drama.eps - eps.length;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent variant="sheet" className="gap-5 pb-8">
        <div className="flex gap-4 pr-8">
          <Poster drama={drama} className="w-[96px] shrink-0 shadow-lg" />
          <div className="min-w-0 space-y-2">
            <DialogTitle className="text-xl">{drama.title}</DialogTitle>
            <div className="flex flex-wrap gap-1.5">
              {drama.genres.map((g) => <Badge key={g} variant="outline" className="capitalize">{g}</Badge>)}
              {drama.tag && <Badge variant="brand">{drama.tag}</Badge>}
            </div>
            <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />{drama.rating}</span>
              <span>{drama.eps} episodes</span>
              <span>~{drama.mins} min each</span>
              <span>{drama.views} views</span>
            </p>
          </div>
        </div>

        <DialogDescription className="text-[15px] leading-relaxed text-foreground/80">{drama.blurb}</DialogDescription>

        <div className="flex gap-3">
          <Button variant="brand" className="h-12 flex-1 text-base" onClick={() => onPlay(drama, 1)}>
            <Play className="h-5 w-5 fill-white" /> Play episode 1
          </Button>
          <Button
            variant="outline"
            className={cn("h-12 rounded-full px-5", saved && "border-brand-lilac text-brand-lilac")}
            onClick={() => onToggleSave(drama)}
            aria-pressed={saved}
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            {saved ? "Saved" : "My List"}
          </Button>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Episodes</h3>
          <ul className="divide-y divide-border rounded-2xl border border-border">
            {eps.map((e) => (
              <li key={e.n}>
                <button
                  onClick={() => (locked(e.n) ? onLocked() : onPlay(drama, e.n))}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="w-6 text-center text-sm font-semibold text-muted-foreground">{e.n}</span>
                  <span className="flex-1 text-sm font-medium">{e.title}</span>
                  <span className="text-xs text-muted-foreground">{e.mins} min</span>
                  {locked(e.n) ? <Lock className="h-4 w-4 text-brand-gold" aria-label="Locked" /> : <Play className="h-4 w-4" aria-label="Play" />}
                </button>
              </li>
            ))}
            {more > 0 && (
              <li>
                <button onClick={() => (trial ? onPlay(drama, eps.length + 1) : onLocked())} className="w-full px-3.5 py-3 text-center text-sm font-medium text-brand-orange hover:bg-accent">
                  + {more} more episodes
                </button>
              </li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
