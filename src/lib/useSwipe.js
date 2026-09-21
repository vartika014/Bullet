import { useRef } from "react";

/** Pointer-based vertical swipe + tap detection (works with touch, mouse and pen). */
export function useSwipe({ onSwipe, onTap, threshold = 50 } = {}) {
  const start = useRef(null);
  return {
    onPointerDown: (e) => {
      start.current = e.clientY;
    },
    onPointerUp: (e) => {
      if (start.current == null) return;
      const dy = e.clientY - start.current;
      start.current = null;
      if (Math.abs(dy) > threshold) onSwipe?.(dy);
      else if (Math.abs(dy) < 10 && !e.target.closest("button, a, input")) onTap?.();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
