import { useState } from "react";
import { PortalContainerContext } from "@/components/ui/dialog";
import { ToastProvider } from "@/components/toast";

/** Full-screen on phones; a centred device frame on larger screens. */
export function PhoneFrame({ children }) {
  const [el, setEl] = useState(null);
  return (
    <div className="flex h-full w-full items-center justify-center sm:p-5">
      <div
        ref={setEl}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        className="relative isolate h-full w-full overflow-hidden bg-background text-foreground sm:h-[min(880px,100%)] sm:max-w-[410px] sm:rounded-[2.75rem] sm:border sm:border-border sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)] sm:ring-[10px] sm:ring-black/50"
      >
        <PortalContainerContext.Provider value={el}>
          <ToastProvider>{children}</ToastProvider>
        </PortalContainerContext.Provider>
      </div>
    </div>
  );
}
