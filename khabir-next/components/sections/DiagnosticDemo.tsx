"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./DiagnosticDemo.module.css";

/** Texts the demo needs (picked from messages/*.json in page.tsx). */
export interface DemoLabels {
  kicker: string;
  heading: string;
  intro: string;
  note: string;
  panelTitle: string;
  holdButton: string;
  runAgain: string;
  runScan: string;
  statusIdle: string;
  statusRunning: string;
  statusDone: string;
  result: string;
  ok: string;
  fault: string;
  rows: Record<RowId, string>;
}

type RowId = "engine" | "trans" | "abs" | "airbag" | "clim" | "steer" | "scr" | "dose" | "noxup" | "noxdown";
type RowState = "" | "run" | "ok" | "bad";

// Rows in display order. "sub" rows only appear once the AdBlue / SCR system is being isolated.
const ROWS: { id: RowId; sub?: boolean }[] = [
  { id: "engine" },
  { id: "trans" },
  { id: "abs" },
  { id: "airbag" },
  { id: "clim" },
  { id: "steer" },
  { id: "scr" },
  { id: "dose", sub: true },
  { id: "noxup", sub: true },
  { id: "noxdown", sub: true },
];

const HOLD_MS = 3400; // how long you must hold to finish the scan
const BACK_MS = 1500; // how long it takes to ease back when you let go

/** Status of one row for a scan progress `v` (0 to 1). */
function rowState(id: RowId, v: number): RowState {
  const order = ["engine", "trans", "abs", "airbag", "clim", "steer"];
  const i = order.indexOf(id);
  if (i >= 0) {
    const t = (i + 1) * 0.085;
    return v >= t ? "ok" : v >= t - 0.085 && v > 0 ? "run" : "";
  }
  if (id === "scr") return v >= 1 ? "bad" : v >= 0.51 ? "run" : "";
  const t = { dose: 0.66, noxup: 0.8, noxdown: 0.97 }[id as "dose" | "noxup" | "noxdown"];
  return v >= t ? (id === "noxdown" ? "bad" : "ok") : v >= t - 0.12 && v >= 0.55 ? "run" : "";
}

/**
 * Press-and-hold diagnosis simulation.
 * It is an illustration only: nothing here is connected to a real vehicle.
 * Hold the button (mouse, finger, or Space / Enter) and the scan advances; release and it eases back.
 */
export function DiagnosticDemo({ labels }: { labels: DemoLabels }) {
  const [progress, setProgress] = useState(0); // 0 to 1, rounded to 0.5% steps
  const [done, setDone] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [running, setRunning] = useState(false); // true while the animation loop below is active
  const holding = useRef(false);
  const exact = useRef(0); // unrounded progress

  // Animation loop: runs only while the scan is moving.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      let h = exact.current;
      h = holding.current ? Math.min(1, h + dt / HOLD_MS) : Math.max(0, h - (dt / BACK_MS) * (0.35 + h)); // eases back, never snaps
      exact.current = h;
      const rounded = Math.round(h * 200) / 200;
      setProgress((previous) => (previous === rounded ? previous : rounded));

      if (holding.current && h >= 1) {
        holding.current = false;
        setPressing(false);
        setDone(true);
        setRunning(false);
        return;
      }
      if (!holding.current && h <= 0) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function start() {
    if (done) {
      // "Run it again"
      exact.current = 0;
      setProgress(0);
      setDone(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No animation: show the finished result immediately.
      exact.current = 1;
      setProgress(1);
      setDone(true);
      return;
    }
    holding.current = true;
    setPressing(true);
    setRunning(true);
  }

  function stop() {
    if (!holding.current) return;
    holding.current = false;
    setPressing(false);
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* some browsers refuse capture; holding still works */
    }
    event.currentTarget.focus({ preventScroll: true });
    start();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      start();
    }
  };
  const onKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      stop();
    }
  };

  const value = done ? 1 : progress;
  const buttonText = done ? labels.runAgain : labels.holdButton;
  const status = done ? labels.statusDone : progress > 0 ? labels.statusRunning : labels.statusIdle;
  const cssVars = { "--hp": value, "--hd": done ? 1 : 0 } as CSSProperties;

  return (
    <section className={`section ${styles.lab}`} aria-labelledby="demo-heading">
      <div className={`wrap ${styles.box} ${done ? styles.done : ""}`} style={cssVars}>
        <div className={styles.grid}>
          <div>
            <p className="kicker">{labels.kicker}</p>
            <h2 id="demo-heading">{labels.heading}</h2>
            <p className={`lede ${styles.intro}`}>{labels.intro}</p>
            <div className={styles.figure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/hero-desktop-end.jpg" alt="" width={1280} height={720} loading="lazy" decoding="async" />
              <div className={styles.sweep} aria-hidden="true" />
              <div className={styles.fault} aria-hidden="true">
                <span className={styles.ring} />
                <span className={styles.pulse} />
                <span className={`${styles.pulse} ${styles.pulse2}`} />
              </div>
            </div>
            <p className={styles.note}>{labels.note}</p>
          </div>

          <div className={styles.panel} role="group" aria-labelledby="demo-heading">
            <div className={styles.panelTitle}>
              <span>{labels.panelTitle}</span>
              <span>{String(Math.round(value * 100)).padStart(3, "0")}%</span>
            </div>
            <ul className={`${styles.rows} ${value >= 0.51 ? styles.open : ""}`}>
              {ROWS.map((row) => {
                const state = rowState(row.id, value);
                const stateText = state === "ok" ? labels.ok : state === "bad" ? labels.fault : "";
                return (
                  <li key={row.id} className={[row.sub ? styles.sub : "", state ? styles[state] : ""].join(" ")}>
                    <span>{labels.rows[row.id]}</span>
                    <span className={styles.state}>{stateText}</span>
                  </li>
                );
              })}
            </ul>

            <div className={styles.hold}>
              <button
                type="button"
                className={`${styles.holdButton} ${pressing ? styles.pressing : ""}`}
                aria-describedby="demo-status"
                onPointerDown={onPointerDown}
                onPointerUp={stop}
                onPointerCancel={stop}
                onLostPointerCapture={stop}
                onContextMenu={(event) => event.preventDefault()}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
              >
                <svg className={styles.progressRing} viewBox="0 0 100 100" aria-hidden="true">
                  <circle className={styles.track} cx="50" cy="50" r="45" />
                  <circle className={styles.fill} cx="50" cy="50" r="45" />
                </svg>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12h4l2-5 3 10 2.5-7 1.5 2H21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="vh">{buttonText}</span>
              </button>
              <div className={styles.holdText}>
                <b aria-hidden="true">{buttonText}</b>
                <span id="demo-status" aria-live="polite">
                  {status}
                </span>
              </div>
            </div>

            <div className={styles.result}>
              <div className={styles.code}>P20EE</div>
              <p>{labels.result}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
