"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** The HTML tag to render, for example "div" (default), "ol" or "p". */
  as?: ElementType;
  className?: string;
  /** Position in a group: later items appear slightly after earlier ones. */
  index?: number;
}

/**
 * Fades its content in when it scrolls into view.
 * Content that is already on screen is never hidden, and nothing is hidden when the visitor
 * prefers reduced motion. The page works even if this script never runs.
 */
export function Reveal({ children, as: Tag = "div", className, index = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return; // already visible

    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "in";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} style={{ "--i": index } as CSSProperties}>
      {children}
    </Tag>
  );
}
