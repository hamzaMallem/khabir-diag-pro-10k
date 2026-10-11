"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { hero, MOBILE_QUERY } from "@/config/hero";
import { useHeroScrub } from "@/hooks/useHeroScrub";
import styles from "./Hero.module.css";

interface ScrollHeroProps {
  /** The four caption blocks (rendered on the server, see HeroSection.tsx). */
  children: ReactNode;
  /** The still version shown when the visitor prefers reduced motion. */
  staticHero: ReactNode;
  /** Text of the small "scroll" hint. */
  cueLabel: string;
}

/**
 * The only client-side part of the hero: it provides the pinned stage, the video and the loading ring,
 * and starts the scrub engine (hooks/useHeroScrub.ts). It carries no business content itself,
 * so the same engine could be reused with other captions.
 */
export function ScrollHero({ children, staticHero, cueLabel }: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const status = useHeroScrub(sectionRef);

  // Settings from config/hero.ts, handed to the CSS.
  const cssVars = {
    "--scroll-desktop": hero.desktop.scrollDistanceVh,
    "--scroll-mobile": hero.mobile.scrollDistanceVh,
    "--focal-desktop": hero.desktop.focalPoint,
    "--focal-mobile": hero.mobile.focalPoint,
  } as CSSProperties;

  return (
    <section ref={sectionRef} id="top" className={styles.hero} data-status={status} style={cssVars} aria-labelledby="hero-heading">
      <div data-hero-stage className={styles.stage}>
        {/* Only the poster matching the screen is downloaded (the browser picks one <source>). */}
        <picture className={styles.poster}>
          <source media={MOBILE_QUERY} srcSet={hero.mobile.poster} />
          <img src={hero.desktop.poster} alt="" fetchPriority="high" decoding="async" />
        </picture>
        <div data-hero-end className={styles.end} aria-hidden="true" />
        {/* No src here: the engine sets it so that only one of the two videos is ever downloaded. */}
        <video data-hero-video className={styles.video} muted playsInline preload="auto" tabIndex={-1} />
        <div className={styles.scrim} aria-hidden="true" />

        {children}

        <div className={styles.loader} aria-hidden="true">
          <svg className={styles.ring} viewBox="0 0 48 48">
            <circle className={styles.ringBg} cx="24" cy="24" r="20" fill="none" strokeWidth="3" />
            <circle className={styles.ringFg} cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className={styles.cue}>
            <span>{cueLabel}</span>
            <i />
          </span>
        </div>
      </div>
      {staticHero}
    </section>
  );
}
