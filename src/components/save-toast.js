"use client";

import { useEffect, useState } from "react";

const HOLD_MS = 3200;
const SLIDE_MS = 280;

/*
  Confirmations only. Errors stay put next to whatever caused them — the name
  field, or the strip you pressed save in — because they need dealing with
  rather than noticing.

  The lifetime is a timeout, never the animation. The stylesheet collapses
  every animation and transition to ~0ms under prefers-reduced-motion, so a
  toast timed by keyframes would flash and vanish for exactly the people least
  able to catch it. Here reduced motion only removes the travel.

  The resting state is the visible one and `toast-in` supplies the entrance,
  rather than mounting hidden and flipping a flag on the next frame: that made
  the toast's appearance depend on a requestAnimationFrame callback, and if
  the frame never came the message never showed at all.
*/
export default function SaveToast({ toast, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) {
      return;
    }

    setLeaving(false);

    const leave = window.setTimeout(() => setLeaving(true), HOLD_MS);
    const drop = window.setTimeout(() => onDone(), HOLD_MS + SLIDE_MS);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(drop);
    };
  }, [toast, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      {toast ? (
        // keyed so a second save remounts and replays the entrance instead of
        // leaving the previous toast sitting there with new words in it
        <p
          key={toast.id}
          style={{ animation: `toast-in ${SLIDE_MS}ms cubic-bezier(0.2, 0.7, 0.3, 1)` }}
          className={`max-w-[26rem] rounded-md border border-ink bg-ink px-4 py-3 text-center font-mono text-xs leading-snug text-paper shadow-card transition-[opacity,translate] duration-[280ms] ease-out ${
            leaving ? "translate-y-[-150%] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}
