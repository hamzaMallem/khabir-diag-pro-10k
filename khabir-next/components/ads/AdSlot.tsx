"use client";

import { useEffect, useRef } from "react";
import styles from "./AdSlot.module.css";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One responsive AdSense display unit. Renders nothing unless both IDs are configured (see lib/adsense.ts), so the
 * site stays ad-free until AdSense approves it. The box reserves its height to avoid layout shift.
 */
export function AdSlot({ client, slot, label }: { client: string; slot: string; label: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // An ad blocker or a failed script must never break the page.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className={styles.slot} aria-label={label}>
      <span className={styles.label}>{label}</span>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
