import { clamp, smoothstep } from "@/lib/math";
import type { CaptionTiming } from "@/config/hero";

interface CaptionState {
  el: HTMLElement;
  timing: CaptionTiming;
  opacity: number;
  ramp: number;
  visible: boolean | null;
}

/**
 * Applies scroll progress to the caption blocks (elements with data-caption="problem" etc.).
 * It writes two things per caption: opacity, and a CSS variable --k (0 to 1) that the CSS uses for the
 * entrance animation. It only touches the DOM when a value really changed.
 */
export function createCaptionController(root: HTMLElement) {
  let states: CaptionState[] = [];

  function setTimings(timings: CaptionTiming[]) {
    states = timings.flatMap((timing) => {
      const el = root.querySelector<HTMLElement>(`[data-caption="${timing.id}"]`);
      return el ? [{ el, timing, opacity: -1, ramp: -1, visible: null }] : [];
    });
  }

  function update(progress: number, firstCaptionFloor = 0) {
    states.forEach((state, index) => {
      const { from, to, ramp } = state.timing;
      const isFirst = index === 0;
      const isLast = index === states.length - 1;
      const fade = Math.min(0.045, (to - from) / 4);
      const opacity =
        Math.round(
          (isFirst ? 1 : smoothstep(progress, from, from + fade)) *
            (isLast ? 1 : 1 - smoothstep(progress, to - fade, to)) *
            1000,
        ) / 1000;
      const k = Math.max(clamp((progress - from) / ramp, 0, 1), isFirst ? firstCaptionFloor : 0);

      if (opacity !== state.opacity) {
        state.opacity = opacity;
        state.el.style.opacity = String(opacity);
        const visible = opacity > 0.001;
        if (visible !== state.visible) {
          state.visible = visible;
          state.el.dataset.on = visible ? "true" : "false";
        }
      }
      if (Math.abs(k - state.ramp) > 0.008 || (k !== state.ramp && (k === 0 || k === 1))) {
        state.ramp = k;
        state.el.style.setProperty("--k", k.toFixed(3));
      }
    });
  }

  /** Forget cached values so the next update rewrites everything (used after switching video). */
  function reset() {
    states.forEach((s) => {
      s.opacity = -1;
      s.ramp = -1;
      s.visible = null;
    });
  }

  return { setTimings, update, reset };
}
