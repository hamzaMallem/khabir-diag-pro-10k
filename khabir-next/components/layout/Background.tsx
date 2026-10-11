import styles from "./Background.module.css";

/** Fixed, very faint circuit-trace pattern and film grain behind the whole page. Purely decorative. */
export function Background() {
  return (
    <>
      <div className={styles.env} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
          <defs>
            <pattern id="traces" width="240" height="240" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="#2B3D45" strokeWidth="1">
                <path d="M0 40h70l20 20h60M240 40h-50M150 60v70l25 25h65M20 240v-60l30-30h40l20-20v-30M120 0v30M0 200h40" />
              </g>
              <g fill="#33474F">
                <circle cx="70" cy="40" r="2.5" />
                <circle cx="150" cy="130" r="2.5" />
                <circle cx="90" cy="150" r="2.5" />
                <circle cx="120" cy="30" r="2" />
              </g>
            </pattern>
            <radialGradient id="vignette" cx="50%" cy="40%" r="75%">
              <stop offset="0" stopColor="#fff" stopOpacity=".9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="vignetteMask">
              <rect width="1200" height="800" fill="url(#vignette)" />
            </mask>
          </defs>
          <rect width="1200" height="800" fill="url(#traces)" mask="url(#vignetteMask)" />
        </svg>
      </div>
      <div className={styles.grain} aria-hidden="true" />
    </>
  );
}
