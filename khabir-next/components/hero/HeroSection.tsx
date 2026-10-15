import type { Dictionary } from "@/i18n/dictionaries";
import { hero, MOBILE_QUERY } from "@/config/hero";
import { heroPreloadScript } from "@/lib/heroVideo";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { ScrollHero } from "./ScrollHero";
import styles from "./Hero.module.css";

/**
 * Hero section (server component): holds the text of the four captions.
 * The scroll/video behaviour is in ScrollHero + hooks/useHeroScrub.ts.
 *
 * Story: 1 the problem, 2 we scan, 3 every system is tested (engine bay), 4 the real fault found + call to action.
 * Caption timings per video are in config/hero.ts.
 */
export function HeroSection({ dict }: { dict: Dictionary }) {
  const ctaHref = getWhatsAppHref(dict.wa_msg);

  return (
    <>
      {/* Starts downloading the right video while the page is still loading, before React runs (lib/heroVideo.ts). */}
      <script dangerouslySetInnerHTML={{ __html: heroPreloadScript() }} />
      <ScrollHero cueLabel={dict.cue} staticHero={<StaticHero dict={dict} ctaHref={ctaHref} />}>
      <div className={`${styles.band} ${styles.first}`} data-caption="problem">
        <div className={styles.cap}>
          <p className={`kicker ${styles.kicker}`}>{dict.b1_kicker}</p>
          <h1 id="hero-heading" className={styles.headline}>
            {dict.b1_h}
          </h1>
          <p className={styles.sub}>{dict.b1_sub}</p>
        </div>
      </div>

      <div className={styles.band} data-caption="scan">
        <div className={styles.cap}>
          <h2 className={styles.headline}>{dict.b2_h}</h2>
          <p className={styles.sub}>{dict.b2_sub}</p>
        </div>
      </div>

      <div className={styles.band} data-caption="engine">
        <div className={styles.cap}>
          <h2 className={styles.headline}>{dict.b3_h}</h2>
          <p className={styles.sub}>{dict.b3_sub}</p>
        </div>
      </div>

      <div className={styles.band} data-caption="found">
        <div className={styles.cap}>
          <h2 className={styles.headline}>
            {dict.b4_h1} <em className={styles.accent}>{dict.b4_h2}</em>
          </h2>
          <p className={styles.sub}>{dict.b4_sub}</p>
          <div className={styles.cta}>
            <Button href={ctaHref} whatsapp>
              {dict.cta}
            </Button>
          </div>
        </div>
      </div>
      </ScrollHero>
    </>
  );
}

/** Reduced-motion version: one still image and the same message. */
function StaticHero({ dict, ctaHref }: { dict: Dictionary; ctaHref: string }) {
  return (
    <div className={styles.staticHero}>
      <p className="kicker">{dict.b1_kicker}</p>
      <h1>
        {dict.b4_h1} <em className={styles.accent}>{dict.b4_h2}</em>
      </h1>
      <p className={styles.sub}>{dict.static_sub}</p>
      <picture className={styles.staticFigure}>
        <source media={MOBILE_QUERY} srcSet={hero.mobile.endFrame} />
        <img src={hero.desktop.endFrame} alt="" loading="lazy" decoding="async" />
      </picture>
      <div className={styles.staticActions}>
        <Button href={ctaHref} whatsapp>
          {dict.cta}
        </Button>
      </div>
    </div>
  );
}
