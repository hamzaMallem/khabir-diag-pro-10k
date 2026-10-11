import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ServicesSection.module.css";

interface Service {
  /** Stable id: used as the React key. */
  id: string;
  title: string;
  text: string;
  /** Card shape in the grid. */
  layout: "big" | "wide" | "normal";
  tag?: string;
  icon: ReactNode;
}

const iconProps = { viewBox: "0 0 48 48", "aria-hidden": true } as const;
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** "What we diagnose": a grid of six service cards and the brand list. */
export function ServicesSection({ dict }: { dict: Dictionary }) {
  // To add a card: add an entry here and its two texts (title, description) in messages/*.json.
  const services: Service[] = [
    {
      id: "engine",
      title: dict.sv1_t,
      text: dict.sv1_p,
      layout: "big",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <rect x="12" y="12" width="24" height="24" rx="3" />
            <rect x="18" y="18" width="12" height="12" rx="1.5" />
            <path d="M18 12V6M24 12V6M30 12V6M18 42v-6M24 42v-6M30 42v-6M12 18H6M12 24H6M12 30H6M42 18h-6M42 24h-6M42 30h-6" />
          </g>
        </svg>
      ),
    },
    {
      id: "adblue",
      title: dict.sv2_t,
      text: dict.sv2_p,
      layout: "wide",
      tag: "SCR · NOx",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <path d="M4 28h8M36 28h8" />
            <rect x="12" y="20" width="24" height="16" rx="5" />
            <path d="M20 20v-6h8v6M24 8v6" />
          </g>
        </svg>
      ),
    },
    {
      id: "gearbox",
      title: dict.sv3_t,
      text: dict.sv3_p,
      layout: "normal",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <circle cx="12" cy="12" r="4" />
            <circle cx="24" cy="12" r="4" />
            <circle cx="36" cy="12" r="4" />
            <circle cx="12" cy="36" r="4" />
            <circle cx="24" cy="36" r="4" />
            <path d="M12 16v16M24 16v16M36 16v8H12" />
          </g>
        </svg>
      ),
    },
    {
      id: "safety",
      title: dict.sv4_t,
      text: dict.sv4_p,
      layout: "normal",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <path d="M24 5l16 6v11c0 10-7 17-16 21C15 39 8 32 8 22V11z" />
            <path d="M17 24l5 5 9-10" />
          </g>
        </svg>
      ),
    },
    {
      id: "electrics",
      title: dict.sv5_t,
      text: dict.sv5_p,
      layout: "normal",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <circle cx="10" cy="24" r="4" />
            <circle cx="38" cy="12" r="4" />
            <circle cx="38" cy="36" r="4" />
            <circle cx="24" cy="24" r="3" />
            <path d="M14 24h7M27 22l8-8M27 26l8 8" />
          </g>
        </svg>
      ),
    },
    {
      id: "coding",
      title: dict.sv6_t,
      text: dict.sv6_p,
      layout: "wide",
      icon: (
        <svg {...iconProps}>
          <g {...stroke}>
            <path d="M16 16L6 24l10 8M32 16l10 8-10 8M27 10l-6 28" />
          </g>
        </svg>
      ),
    },
  ];

  const brands = ["MERCEDES-BENZ", "BMW", "AUDI", "VOLKSWAGEN", "PORSCHE", "MINI", "SKODA", "SEAT"];

  return (
    <section className={`section ${styles.services}`} aria-labelledby="services-heading">
      <div className="wrap">
        <Reveal>
          <svg className="wave" viewBox="0 0 1240 40" preserveAspectRatio="none" aria-hidden="true">
            <path className="draw" pathLength="1" d="M0 20h760l12-14 14 28 12-20 10 6h120l8-6 8 6h296" />
          </svg>
        </Reveal>
        <Reveal className={styles.head}>
          <p className="kicker">{dict.sv_kicker}</p>
          <h2 id="services-heading">{dict.sv_h}</h2>
        </Reveal>
        <div className={styles.grid}>
          {services.map((service, i) => (
            <Reveal key={service.id} as="article" className={`${styles.card} ${styles[service.layout]}`} index={i}>
              {service.tag && <span className={styles.tag}>{service.tag}</span>}
              {service.icon}
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className={styles.brands}>
          <span className={styles.brandsLabel}>{dict.brands_l}</span>
          {brands.map((brand) => (
            <span key={brand} className={styles.brand}>
              {brand}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
