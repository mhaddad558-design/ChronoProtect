/**
 * A close-up of a bezel under each finish, so the choice is seen rather than
 * described. Gloss carries a hard-edged reflection; Stealth a fine satin grain
 * and no reflection at all. Both are drawn with crisp shapes, not gradients,
 * in keeping with the no-gradient-wash rule.
 */
export default function FinishSwatch({
  finish,
  id,
  size = 112,
}: {
  finish: "Gloss" | "Stealth";
  /** Unique per page: it namespaces the grain pattern. */
  id: string;
  size?: number;
}) {
  const grain = `${id}-grain`;
  const gloss = finish === "Gloss";

  return (
    <svg
      className={`cp-swatch cp-swatch--${finish.toLowerCase()}`}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={grain} width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.55" className="cp-swatch__grain" />
        </pattern>
      </defs>

      <circle cx="60" cy="60" r="56" className="cp-swatch__case" />
      <circle cx="60" cy="60" r="48" className="cp-swatch__bezel" />
      {!gloss ? <circle cx="60" cy="60" r="48" fill={`url(#${grain})`} /> : null}

      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const inner = i % 5 === 0 ? 38 : 42;
        return (
          <line
            key={i}
            x1={60 + Math.sin(a) * inner}
            y1={60 - Math.cos(a) * inner}
            x2={60 + Math.sin(a) * 46}
            y2={60 - Math.cos(a) * 46}
            className="cp-swatch__tick"
          />
        );
      })}
      <circle cx="60" cy="60" r="34" className="cp-swatch__crystal" />

      {gloss ? (
        <>
          {/* Crisp specular band across the upper left of the bezel */}
          <path d="M16,50 A46,46 0 0,1 52,14 L53,22 A38,38 0 0,0 24,52 Z" className="cp-swatch__shine" />
          <path d="M84,96 A44,44 0 0,0 98,78 L94,76 A40,40 0 0,1 81,92 Z" className="cp-swatch__shine cp-swatch__shine--soft" />
        </>
      ) : null}
    </svg>
  );
}
