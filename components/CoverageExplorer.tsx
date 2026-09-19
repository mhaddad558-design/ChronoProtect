"use client";

import { useState } from "react";
import WatchDiagram, { type DiagramLine } from "./WatchDiagram";

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
  const active = LINES.find((l) => l.value === line)!;

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

      <div className="cp-explorer__stage">
        <WatchDiagram line={line} id="home-coverage" height={440} />
      </div>

      <figcaption className="cp-explorer__caption" aria-live="polite">
        <span className="cp-explorer__key cp-explorer__key--film" aria-hidden="true" />
        {active.says}
      </figcaption>
    </figure>
  );
}
