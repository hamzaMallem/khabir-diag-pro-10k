// Everything about the scroll-controlled hero lives here: which video, how long the scroll is,
// where each caption appears. Desktop and mobile are configured separately.
//
// To replace a video: put the new file in public/media, then update `src`, `poster`, `endFrame`
// and `duration` below (see README, "Replace a video").

export type VariantId = "desktop" | "mobile";

/** The four captions, in story order. Their text lives in messages/*.json (keys b1_*, b2_*, b3_*, b4_*). */
export type CaptionId = "problem" | "scan" | "engine" | "found";

export interface CaptionTiming {
  id: CaptionId;
  /** Scroll progress (0 to 1) where the caption starts and where it has fully left. */
  from: number;
  to: number;
  /** How much scroll the caption takes to build up its entrance animation. */
  ramp: number;
}

export interface HeroVariant {
  id: VariantId;
  src: string;
  /** First frame, shown while the video loads. */
  poster: string;
  /** Last frame, shown if the video cannot load. */
  endFrame: string;
  /** Video length in seconds. Only a fallback: the real value is read from the file. */
  duration: number;
  /** The video reaches its last frame at this scroll progress; the rest of the scroll is the call to action at rest. */
  endAt: number;
  /** Height of the pinned scroll area, in percent of the screen height. */
  scrollDistanceVh: number;
  /** Which part of the frame stays visible when the screen shape differs (CSS object-position). */
  focalPoint: string;
  captions: CaptionTiming[];
}

/**
 * Narrow or portrait screens get the 9:16 mobile video, everything else the 16:9 desktop one.
 * IMPORTANT: the same query is written in components/hero/Hero.module.css. Change both together
 * (tests/hero-config.spec.ts checks that they match).
 */
export const MOBILE_QUERY = "(max-width: 720px), (orientation: portrait)";

/**
 * Hero files are cached by browsers for a year (see next.config.ts). Bump this number whenever you replace
 * any hero video or image in public/media, so returning visitors download the new file.
 */
const MEDIA_VERSION = 2;
const media = (file: string) => `/media/${file}?v=${MEDIA_VERSION}`;

export const hero: Record<VariantId, HeroVariant> = {
  desktop: {
    id: "desktop",
    src: media("hero-desktop.mp4"),
    poster: media("hero-desktop-poster.jpg"),
    endFrame: media("hero-desktop-end.jpg"),
    duration: 15.04,
    endAt: 0.9,
    scrollDistanceVh: 500,
    focalPoint: "50% 50%",
    captions: [
      { id: "problem", from: 0, to: 0.2, ramp: 0.06 },
      { id: "scan", from: 0.24, to: 0.46, ramp: 0.06 },
      { id: "engine", from: 0.5, to: 0.76, ramp: 0.06 },
      { id: "found", from: 0.8, to: 1, ramp: 0.09 },
    ],
  },
  mobile: {
    id: "mobile",
    src: media("hero-mobile.mp4"),
    poster: media("hero-mobile-poster.jpg"),
    endFrame: media("hero-mobile-end.jpg"),
    duration: 15.04,
    endAt: 0.9,
    scrollDistanceVh: 420,
    focalPoint: "50% 45%",
    captions: [
      { id: "problem", from: 0, to: 0.2, ramp: 0.06 },
      { id: "scan", from: 0.24, to: 0.46, ramp: 0.06 },
      { id: "engine", from: 0.5, to: 0.76, ramp: 0.06 },
      { id: "found", from: 0.8, to: 1, ramp: 0.09 },
    ],
  },
};

/** Seconds of no data after which we give up on the video and show the still frames instead. */
export const VIDEO_STALL_TIMEOUT_MS = 20000;
