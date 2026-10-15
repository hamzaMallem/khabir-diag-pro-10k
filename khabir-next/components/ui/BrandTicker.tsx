import { CAR_BRANDS } from "./BrandLogos";
import styles from "./BrandTicker.module.css";

interface BrandTickerProps {
  label: string;
  className?: string;
}

export function BrandTicker({ label, className }: BrandTickerProps) {
  // Four copies of the list in a row = two identical halves. The track slides from 0 to -50%, so the second half
  // lands exactly where the first one started: a seamless loop. Each half repeats the brands twice so it is always
  // wider than the viewport. Only the first copy is exposed to screen readers; the rest are decoration.
  const copies = [0, 1, 2, 3];

  return (
    <div className={`${styles.tickerWrapper} ${className ?? ""}`} role="group" aria-label={label}>
      <div className={styles.labelGroup}>
        <span className={styles.pulseDot} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track}>
          {copies.map((copy) =>
            CAR_BRANDS.map((brand) => (
              <div key={`${copy}-${brand.id}`} className={styles.brandCard} aria-hidden={copy > 0 ? true : undefined}>
                <span className={styles.brandIcon} aria-hidden="true">
                  {brand.logo}
                </span>
                <span className={styles.brandName}>{brand.name}</span>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
