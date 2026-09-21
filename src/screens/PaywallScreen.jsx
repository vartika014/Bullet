import { useState } from "react";
import { ArrowLeft, Ban, BellRing, ChevronRight, Clapperboard, Film, Lock, PictureInPicture2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PosterCollage } from "@/components/PosterCollage";
import { PayLogo } from "@/components/PayLogo";
import { ThemeToggle } from "@/components/theme";
import { PAY_METHODS, PLAN_PRICE, TRIAL_PRICE, money } from "@/lib/data";

const HDBadge = () => (
  <span className="rounded-[5px] border-2 border-current px-1 py-px text-[13px] font-extrabold leading-none">HD</span>
);

const BENEFITS = [
  { icon: <Clapperboard className="h-8 w-8" strokeWidth={1.6} />, label: "Unlimited Shows" },
  { icon: <HDBadge />, label: "Full HD" },
  { icon: <Ban className="h-8 w-8" strokeWidth={1.8} />, label: "No Ad" },
  { icon: <PictureInPicture2 className="h-8 w-8" strokeWidth={1.6} />, label: "Watch In Background" },
];

const STEPS = [
  { icon: Lock, title: "Start your Trial Plan.", text: `Pay ${money(TRIAL_PRICE)} and unlock all premium content.` },
  { icon: Film, title: "Watch unlimited content.", text: "Romance, revenge and original series." },
  { icon: BellRing, title: "Get notified before Autopay.", text: `Pay ${money(PLAN_PRICE)}/quarter after your trial ends.` },
];

const HEADER_H = 64; // px, height of the sticky back-arrow row

export function PaywallScreen({ method, onMethodChange, onBack, onStart }) {
  const [sheet, setSheet] = useState(false);
  const current = PAY_METHODS.find((m) => m.id === method);

  return (
    <div className="relative h-full animate-screen-in">
      <div className="h-full overflow-y-auto pb-44 scrollbar-none" data-testid="paywall-scroll">
        <div className="sticky top-0 z-30 flex items-center justify-between bg-background px-4" style={{ height: HEADER_H }}>
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to browse" className="-ml-2 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <ThemeToggle />
        </div>

        {/* scrolls away */}
        <div className="px-4 pb-1 pt-2 text-center">
          <h1 className="text-[31px] font-bold leading-tight tracking-tight">Start your trial now</h1>
          <div className="mx-auto mt-3 h-px w-[61%] bg-foreground/20" />
          <p className="mt-6 flex items-end justify-center gap-2 leading-none">
            <span className="pb-2 text-[26px] font-bold text-muted-foreground">at</span>
            <span className="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-[68px] font-extrabold tracking-tight text-transparent">
              {money(TRIAL_PRICE)}
            </span>
          </p>
          <p className="mx-auto mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-900/40 bg-secondary/60 px-5 py-3 text-[15px] font-medium dark:bg-[#0d100a]">
            <Users className="h-5 w-5 text-brand-gold" strokeWidth={1.6} />
            5 million+ people joined the trial!
          </p>
        </div>

        <div className="px-4 pt-6">
          <PosterCollage />
        </div>
        <p className="mt-4 px-4 text-center text-[15px] text-muted-foreground">Cancel anytime • No commitment</p>

        <div className="px-4">
        <section className="mt-5 rounded-[28px] border border-foreground/25 px-4 pb-5 pt-5" aria-labelledby="benefits-h">
          <h2 id="benefits-h" className="text-center text-[26px] font-medium">Benefits</h2>
          <ul className="mt-5 grid grid-cols-4 gap-2">
            {BENEFITS.map((b) => (
              <li key={b.label} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl border border-foreground/10 bg-gradient-to-b from-secondary to-card text-brand-gold shadow-inner">
                  {b.icon}
                </span>
                <span className="text-[13px] font-medium leading-tight">{b.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <ol className="relative mt-7 space-y-5 pl-8 pr-1">
          <span aria-hidden className="absolute bottom-8 left-[6px] top-8 w-[2px] bg-gradient-to-b from-rose-500 via-orange-500 to-rose-500" />
          {STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="relative flex items-center gap-4">
              <span aria-hidden className="absolute -left-8 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-rose-500" />
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-6 w-6 text-orange-500" strokeWidth={1.8} />
              </span>
              <p className="text-[16px] leading-snug">
                <span className="block font-medium">{title}</span>
                <span className="block text-muted-foreground">{text}</span>
              </p>
            </li>
          ))}
        </ol>
        </div>
      </div>

      {/* sticky checkout bar */}
      <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] border-t border-foreground/10 bg-background/95 px-5 pb-5 pt-5 backdrop-blur safe-bottom">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSheet(true)}
            className="flex min-w-0 items-center gap-3 rounded-full py-1 pr-2 text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Payment method: ${current.name}. Change`}
          >
            <PayLogo method={method} size={48} />
            <span className="truncate text-[22px] font-medium">{current.name}</span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
          <Button variant="brand" onClick={onStart} className="h-[58px] w-[170px] shrink-0 text-[19px]">
            Start Trial
          </Button>
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground">{current.secure}</p>
      </div>

      <Dialog open={sheet} onOpenChange={setSheet}>
        <DialogContent variant="sheet" className="gap-5 pb-8">
          <DialogHeader>
            <DialogTitle>Pay {money(TRIAL_PRICE)} with</DialogTitle>
            <DialogDescription>You'll confirm the payment on the next screen.</DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={method}
            onValueChange={(v) => {
              onMethodChange(v);
              setTimeout(() => setSheet(false), 180);
            }}
            aria-label="Payment method"
          >
            {PAY_METHODS.map((m) => (
              <label
                key={m.id}
                htmlFor={`pm-${m.id}`}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border p-3.5 transition-colors hover:bg-accent has-[[data-state=checked]]:border-brand-pink has-[[data-state=checked]]:bg-brand-pink/5"
              >
                <PayLogo method={m.id} size={44} className="ring-1 ring-border" />
                <span className="flex-1">
                  <span className="block text-base font-semibold">{m.name}</span>
                  <span className="block text-sm text-muted-foreground">{m.sub}</span>
                </span>
                <RadioGroupItem value={m.id} id={`pm-${m.id}`} />
              </label>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}
