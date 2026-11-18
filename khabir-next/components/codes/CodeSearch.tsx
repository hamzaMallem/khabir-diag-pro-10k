"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import styles from "./Codes.module.css";

export interface CodeCard {
  code: string;
  href: string;
  title: string;
  system: string;
  severity: "stop" | "soon" | "ok";
  /** Lower-case text the search looks in: code, title, system, brands, official definition. */
  haystack: string;
}

interface Props {
  cards: CodeCard[];
  /** system id -> translated name, in display order. */
  systems: { id: string; label: string }[];
  severityLabels: Record<CodeCard["severity"], string>;
  labels: { search: string; searchLabel: string; none: string; all: string; count: string };
}

/** Search box, system filter and the list of code cards. Works on the full static list, no server calls. */
export function CodeSearch({ cards, systems, severityLabels, labels }: Props) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const listId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => (system === "all" || c.system === system) && (q === "" || c.haystack.includes(q)));
  }, [cards, query, system]);

  return (
    <div>
      <div className={styles.tools}>
        <input
          className={styles.search}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.search}
          aria-label={labels.searchLabel}
          aria-controls={listId}
          autoComplete="off"
          spellCheck={false}
          dir="auto"
        />
        <div className={styles.chips} role="group" aria-label={labels.searchLabel}>
          {[{ id: "all", label: labels.all }, ...systems].map((s) => (
            <button key={s.id} type="button" className={styles.chip} aria-pressed={system === s.id} onClick={() => setSystem(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          {visible.length} {labels.count}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className={styles.none}>{labels.none}</p>
      ) : (
        <ul id={listId} className={styles.grid}>
          {visible.map((c) => (
            <li key={c.code}>
              <Link className={styles.card} href={c.href}>
                <span className={styles.code} dir="ltr">
                  {c.code}
                </span>
                <span className={styles.cardTitle}>{c.title}</span>
                <span className={`${styles.sev} ${styles[`sev_${c.severity}`]}`}>{severityLabels[c.severity]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
