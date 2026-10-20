import { useCallback, useEffect, useRef, useState } from "react";

/** Gaps longer than this between ticks are treated as the device sleeping, not as elapsed play time. */
export const MAX_TICK_GAP_MS = 1500;
export const TICK_MS = 100;

type Options = {
  /** Total seconds for each run. */
  duration: number;
  /** Counting only happens while true. Flip to false to stop instantly. */
  running: boolean;
  /** Changing the key starts a fresh countdown (one per question). */
  resetKey: string | number;
  onExpire: () => void;
};

/**
 * A pause-aware countdown. One interval per active run, cleared on stop,
 * key change, or unmount. Time does not pass while the tab is hidden.
 */
export function useTimer({ duration, running, resetKey, onExpire }: Options) {
  const [remaining, setRemaining] = useState(duration);
  const remainingRef = useRef(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Fresh countdown for every key.
  useEffect(() => {
    remainingRef.current = duration;
    setRemaining(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (!running || remainingRef.current <= 0) return;
    let last = performance.now();
    let expired = false;

    const tick = () => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      if (document.hidden || delta > MAX_TICK_GAP_MS) return;
      remainingRef.current = Math.max(0, remainingRef.current - delta / 1000);
      setRemaining(remainingRef.current);
      if (remainingRef.current <= 0 && !expired) {
        expired = true;
        window.clearInterval(id);
        onExpireRef.current();
      }
    };

    const onVisibility = () => {
      // Restart the clock on return so hidden time is never charged.
      last = performance.now();
    };

    const id = window.setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running, resetKey]);

  /** Seconds left right now (not waiting for the next render). */
  const read = useCallback(() => remainingRef.current, []);

  return { remaining, read };
}
