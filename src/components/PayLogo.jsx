import { Apple, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stylised stand-ins for the payment marks. Swap for official brand assets before shipping. */
export function PayLogo({ method, size = 48, className }) {
  const base = "flex shrink-0 items-center justify-center rounded-full select-none";
  const style = { width: size, height: size };

  if (method === "card")
    return (
      <span className={cn(base, "bg-gradient-to-br from-zinc-700 to-zinc-900 text-white", className)} style={style} aria-hidden>
        <CreditCard style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.8} />
      </span>
    );

  if (method === "applepay")
    return (
      <span className={cn(base, "bg-white text-black", className)} style={style} aria-hidden>
        <Apple style={{ width: size * 0.5, height: size * 0.5 }} fill="currentColor" strokeWidth={0} />
      </span>
    );

  return (
    <span className={cn(base, "bg-white", className)} style={style} aria-hidden>
      <span
        style={{
          fontSize: size * 0.58,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          background: "conic-gradient(from -45deg, #ea4335 110deg, #4285f4 110deg 200deg, #34a853 200deg 290deg, #fbbc05 290deg)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          lineHeight: 1,
        }}
      >
        G
      </span>
    </span>
  );
}
