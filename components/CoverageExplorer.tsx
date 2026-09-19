"use client";

import { useEffect, useRef, useState } from "react";
import WatchDiagram, { MODEL_NAMES, type DiagramLine, type WatchModel } from "./WatchDiagram";

const MODELS: WatchModel[] = ["submariner", "gmt", "daytona", "datejust"];

const LINES: Array<{ value: DiagramLine; label: string; says: string }> = [
  {
    value: "chronoshield",
    label: "ChronoShield+",
    says: "Case, bezel, lugs, every bracelet link and the clasp.",
  },
  {
    value: "chronoguard",
    label: "ChronoGuard+",
    says: "Case, bezel, lugs and the clasp. The bracelet is left bare.",
  },
];

/**
 * The watch drawing with a switch between the two lines. The change is the
 * motion on this page: it answers the customer's own action, and the text
 * underneath says the same thing the hatching shows.
 */
export default function CoverageExplorer() {
  const [line, setLine] = useState<DiagramLine>("chronoshield");
  const [model, setModel] = useState<WatchModel>("submariner");
  const active = LINES.find((l) => l.value === line)!;
  const stage = useRef<HTMLDivElement>(null);

  // Scroll applies the film: --p runs 0 to 1 as the drawing rises into view,
  // and runs back if the visitor scrolls up. Under reduced motion it stays at
  // 1, the finished drawing.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.95 - box.top) / (vh * 0.55);
      el.style.setProperty("--p", Math.max(0, Math.min(1, progress)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <figure className="cp-explorer">
      <div className="cp-explorer__switch" role="group" aria-label="Show coverage for">
        {LINES.map((l) => (
          <button
            key={l.value}
            type="button"
            aria-pressed={line === l.value}
            className="cp-explorer__option"
            onClick={() => setLine(l.value)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="cp-explorer__stage" ref={stage}>
        <WatchDiagram line={line} model={model} id="home-coverage" height={440} reveal />
      </div>

      <div className="cp-explorer__models" role="group" aria-label="Show it on">
        {MODELS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={model === m}
            className="cp-explorer__model"
            onClick={() => setModel(m)}
          >
            {MODEL_NAMES[m]}
          </button>
        ))}
      </div>

      <figcaption className="cp-explorer__caption" aria-live="polite">
        <span className="cp-explorer__key cp-explorer__key--film" aria-hidden="true" />
        {active.says}
      </figcaption>
    </figure>
  );
}
