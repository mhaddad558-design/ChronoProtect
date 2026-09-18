/**
 * The badge lockup: the crest with "Chrono" over the line word inside the
 * shield. One per product line — PROTECT+, SHIELD+, GUARD+.
 *
 * Composed rather than shipped as three flat images: the crest is already
 * fetched and cached as /crest.svg, and the type is live text, so each extra
 * lockup costs almost nothing and stays sharp at any size. The coordinate space
 * matches the crest's own viewBox so the artwork and the type stay registered.
 */

/** The crest's viewBox, from scripts/extract-crest.mjs. */
const VB = { x: 142, y: 121, w: 526, h: 662 };

/** Horizontal centre of the shield in that space. */
const CX = 405;

export default function Lockup({
  word,
  label,
  height = 260,
}: {
  /** The word under "Chrono", uppercase and carrying the plus. */
  word: string;
  /** Accessible name for the whole mark, e.g. "ChronoShield+". */
  label: string;
  height?: number;
}) {
  return (
    <svg
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      height={height}
      width={Math.round((height * VB.w) / VB.h)}
      role="img"
      aria-label={label}
      style={{ display: "block", overflow: "visible" }}
    >
      {/*
        The halftone texture inside the shield. The master artwork draws this as
        ~1,100 individually placed dots; a tiled pattern behind a radial fade
        gets the same depth for a few hundred bytes.
      */}
      <defs>
        <pattern
          id={`cp-halftone-${word}`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="8" r="2.2" fill="#ffffff" />
        </pattern>
        {/*
          The fade has to reach zero inside the patch, or the patch's own edge
          shows as a hard rim against the shield.
        */}
        <radialGradient id={`cp-fade-${word}`} cx="50%" cy="47%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="78%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id={`cp-mask-${word}`}>
          <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill={`url(#cp-fade-${word})`} />
        </mask>
      </defs>

      <g mask={`url(#cp-mask-${word})`}>
        <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill={`url(#cp-halftone-${word})`} />
      </g>

      {/* The crest itself, already extracted from the master artwork. */}
      <image href="/crest.svg" x={VB.x} y={VB.y} width={VB.w} height={VB.h} />

      <text
        x={CX}
        y={455}
        textAnchor="middle"
        fill="var(--cp-ink)"
        fontFamily="var(--cp-logo)"
        fontSize="96"
        fontWeight="400"
      >
        Chrono
      </text>
      <text
        x={CX}
        y={545}
        textAnchor="middle"
        fill="var(--cp-sage)"
        fontFamily="var(--cp-logo)"
        fontSize="60"
        fontWeight="300"
        letterSpacing="5"
      >
        {word}
      </text>
    </svg>
  );
}
