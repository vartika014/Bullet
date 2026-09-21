import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = { success: "text-emerald-400", error: "text-red-400", info: "text-brand-lilac" };

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setItems((s) => [...s.slice(-2), { id, message, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className="flex max-w-full animate-toast-in items-center gap-2 rounded-full border border-white/10 bg-zinc-900/95 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur"
            >
              <Icon className={cn("h-4 w-4 shrink-0", TONES[t.type])} />
              <span className="truncate">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
