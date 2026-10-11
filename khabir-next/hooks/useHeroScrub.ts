"use client";

import { useEffect, useState, type RefObject } from "react";
import { hero, MOBILE_QUERY, VIDEO_STALL_TIMEOUT_MS, type HeroVariant } from "@/config/hero";
import { createCaptionController } from "@/lib/captions";
import { clamp, smoothstep } from "@/lib/math";

/**
 * loading : the video file is downloading (a ring is shown, the poster is visible)
 * ready   : the video can be seeked, scrolling drives it
 * failed  : the video could not load; captions still work over still frames
 * static  : reduced motion is on, the hero is a still image and the engine is off
 */
export type HeroStatus = "loading" | "ready" | "failed" | "static";

/**
 * Scroll-controlled video.
 *
 * The page scrolls natively (we never block wheel or touch). On every scroll we compute how far through the
 * hero we are (0 to 1) and move the video playhead to the matching time. Nothing here uses React state per
 * frame: values are written straight to the DOM through refs. Only `status` is state, and it changes rarely.
 */
export function useHeroScrub(sectionRef: RefObject<HTMLElement | null>): HeroStatus {
  const [status, setStatus] = useState<HeroStatus>("loading");

  useEffect(() => {
    const section = sectionRef.current;
    const video = section?.querySelector<HTMLVideoElement>("[data-hero-video]");
    const stage = section?.querySelector<HTMLElement>("[data-hero-stage]");
    const endLayer = section?.querySelector<HTMLElement>("[data-hero-end]");
    if (!section || !video || !stage || !endLayer) return;

    const captions = createCaptionController(section);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(MOBILE_QUERY);

    let active = false;
    let variant: HeroVariant = hero.desktop;
    let currentStatus: HeroStatus = "loading";
    let shown = 0; // progress currently displayed (smoothed)
    let target = 0; // progress the scroll position asks for
    let loadRamp = 1; // entrance animation of the first caption, 0 to 1
    let loadStart = 0;
    let frame: number | null = null;
    let lastTick = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;
    let ready = false;
    let seeking = false;
    let pendingTime: number | null = null;
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    let lastRing = -1;
    let lastEnd = -1;
    let lastCue = -1;

    const changeStatus = (next: HeroStatus) => {
      currentStatus = next;
      setStatus(next);
    };

    // 0 to 1: how far the hero has been scrolled through.
    function scrollProgress() {
      const range = section!.offsetHeight - stage!.clientHeight;
      if (range <= 0) return 0;
      return clamp(-section!.getBoundingClientRect().top / range, 0, 1);
    }

    function videoTimeFor(progress: number) {
      const duration = Number.isFinite(video!.duration) && video!.duration > 0 ? video!.duration : variant.duration;
      return clamp(progress / variant.endAt, 0, 1) * duration;
    }

    // One seek at a time; if scrolling asks for another time meanwhile, remember only the latest.
    function requestSeek(time: number) {
      if (!ready) return;
      if (seeking) {
        pendingTime = time;
        return;
      }
      if (Math.abs(video!.currentTime - time) < 0.001) return;
      seeking = true;
      video!.currentTime = time;
    }

    const onSeeked = () => {
      seeking = false;
      if (pendingTime !== null) {
        const next = pendingTime;
        pendingTime = null;
        requestSeek(next);
      }
    };

    function render(progress: number) {
      captions.update(progress, loadRamp);

      // Scroll cue fades out after the first bit of scrolling.
      const cue = Math.round((1 - smoothstep(progress, 0.02, 0.07)) * 100) / 100;
      if (cue !== lastCue) {
        lastCue = cue;
        section!.style.setProperty("--cue-opacity", String(cue));
      }
      // If the video failed, the still end frame fades in near the end of the scroll.
      const end = currentStatus === "failed" ? Math.round(smoothstep(progress, 0.7, 0.86) * 100) / 100 : 0;
      if (end !== lastEnd) {
        lastEnd = end;
        section!.style.setProperty("--end-opacity", String(end));
      }
    }

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      if (loadRamp < 1) {
        const t = clamp((now - loadStart) / 1300, 0, 1);
        loadRamp = 1 - Math.pow(1 - t, 3);
      }
      // Frame-rate independent smoothing: the playhead eases toward the scroll position.
      shown += (target - shown) * (1 - Math.pow(0.84, dt / 16.667));
      const settled = Math.abs(target - shown) < 0.0005;
      if (settled) shown = target;

      requestSeek(videoTimeFor(shown));
      render(shown);

      if (settled && loadRamp >= 1) {
        frame = null; // nothing left to animate: stop the loop until the next scroll
        lastTick = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    }

    function kick() {
      if (frame === null && active && onScreen && pageVisible) frame = requestAnimationFrame(tick);
    }

    function onScroll() {
      target = scrollProgress();
      kick();
    }

    // ----- video loading -----
    function armStallTimer() {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(fail, VIDEO_STALL_TIMEOUT_MS);
    }

    function fail() {
      if (ready || !active || currentStatus === "failed") return;
      clearTimeout(stallTimer);
      video!.removeAttribute("src");
      video!.load(); // aborts any download still running
      endLayer!.style.backgroundImage = `url('${variant.endFrame}')`;
      changeStatus("failed");
      lastEnd = -1;
      render(shown);
    }

    const onLoadedData = () => {
      if (ready || !active) return;
      ready = true;
      clearTimeout(stallTimer);
      changeStatus("ready");
      requestSeek(videoTimeFor(shown));
      render(shown);
    };

    const onProgress = () => {
      if (ready) return;
      armStallTimer(); // data is still arriving
      const duration = video!.duration;
      if (video!.buffered.length && Number.isFinite(duration) && duration > 0) {
        const fraction = Math.round((video!.buffered.end(video!.buffered.length - 1) / duration) * 50) / 50;
        if (fraction !== lastRing) {
          lastRing = fraction;
          section!.style.setProperty("--load", String(fraction));
        }
      }
    };

    function loadVariant(next: HeroVariant) {
      variant = next;
      ready = false;
      seeking = false;
      pendingTime = null;
      lastRing = -1;
      section!.dataset.variant = next.id;
      captions.setTimings(next.captions);
      captions.reset();
      changeStatus("loading");
      video!.muted = true; // React does not reliably set the muted property; iOS needs it for seeking without a tap
      video!.src = next.src;
      video!.load();
      armStallTimer();
    }

    function chooseVariant() {
      return mobile.matches ? hero.mobile : hero.desktop;
    }

    // Switch source only when the chosen variant really changes (rotation, window resize across the breakpoint).
    const onVariantChange = () => {
      if (!active) return;
      const next = chooseVariant();
      if (next.id === variant.id) return;
      loadVariant(next);
      target = scrollProgress();
      render(shown);
      kick();
    };

    // ----- on / off (reduced motion) -----
    function activate() {
      if (active) return;
      active = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      target = shown = scrollProgress();
      if (shown < 0.02) {
        loadRamp = 0;
        loadStart = performance.now();
      } else {
        loadRamp = 1;
      }
      lastEnd = lastCue = -1;
      loadVariant(chooseVariant());
      render(shown);
      kick();
    }

    function deactivate() {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      clearTimeout(stallTimer);
      video!.removeAttribute("src");
      video!.load();
      changeStatus("static");
    }

    const onMotionPreference = () => {
      if (!reducedMotion.matches) return activate();
      deactivate();
      changeStatus("static"); // also covers the very first run, when the engine was never active
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) kick();
    });
    observer.observe(section);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) kick();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("progress", onProgress);
    video.addEventListener("error", fail);
    mobile.addEventListener("change", onVariantChange);
    reducedMotion.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", onVisibility);

    onMotionPreference();

    return () => {
      deactivate();
      observer.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("error", fail);
      mobile.removeEventListener("change", onVariantChange);
      reducedMotion.removeEventListener("change", onMotionPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sectionRef]);

  return status;
}
