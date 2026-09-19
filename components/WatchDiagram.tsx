/**
 * A technical flat-lay of a watch — head, Oyster bracelet, clasp — with the
 * film zones for one line hatched in bronze and everything else left as bare
 * outline. It is the one product visual on the site, and it answers the
 * question a customer actually has: where does the film go?
 *
 * Covered and bare are told apart by hatching as well as colour, so the
 * difference survives colour blindness and greyscale.
 */

export type DiagramLine = "chronoshield" | "chronoguard";

/** Which zones each line covers. Mirrors the covers lists in lib/site.ts. */
const COVERS: Record<DiagramLine, ReadonlySet<Zone>> = {
  chronoshield: new Set(["case", "bezel", "lugs", "links", "clasp"]),
  chronoguard: new Set(["case", "bezel", "lugs", "clasp"]),
};

type Zone = "case" | "bezel" | "lugs" | "links" | "clasp";

const CX = 100;
const CY = 260;
const R_CASE = 72;
const R_BEZEL = 66;
const R_BEZEL_IN = 54;
const R_DIAL = 52;

/** A full circle as a path, so two can share one evenodd path as a ring. */
const circle = (r: number) => `M${CX - r},${CY}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
const ring = (outer: number, inner: number) => `${circle(outer)}${circle(inner)}`;

/** Three-piece Oyster rows, tapering away from the lugs. */
function linkRows(direction: 1 | -1, start: number, rows: number) {
  const out: Array<{ x: number; y: number; w: number; key: string; row: number }> = [];
  for (let i = 0; i < rows; i++) {
    const width = 72 - i * 2.4;
    const top = direction === -1 ? start - (i + 1) * 24 + 4 : start + i * 24;
    const left = CX - width / 2;
    const piece = width * 0.31;
    const gap = (width - piece * 3) / 2;
    [0, 1, 2].forEach((p) =>
      out.push({ x: left + p * (piece + gap), y: top, w: piece, key: `${direction}-${i}-${p}`, row: i })
    );
  }
  return out;
}

const TOP_LINKS = linkRows(-1, 170, 6);
const BOTTOM_LINKS = linkRows(1, 352, 5);

const LUGS = [
  "M58,214 L64,168 L82,168 L86,198 Z",
  "M142,214 L136,168 L118,168 L114,198 Z",
  "M58,306 L64,352 L82,352 L86,322 Z",
  "M142,306 L136,352 L118,352 L114,322 Z",
];

export default function WatchDiagram({
  line,
  id,
  height = 420,
  title,
  reveal = false,
}: {
  line: DiagramLine;
  /**
   * Let a parent apply the film progressively by setting --p (0 to 1) on an
   * ancestor. Without it, or before --p is set, the drawing is complete.
   */
  reveal?: boolean;
  /** Unique per page: it namespaces the hatch pattern. */
  id: string;
  height?: number;
  title?: string;
}) {
  const covered = COVERS[line];
  const hatch = `${id}-hatch`;
  const zone = (z: Zone, order = 0) =>
    covered.has(z)
      ? {
          className: "cp-wd__film",
          fill: `url(#${hatch})`,
          style: { ["--i" as string]: order } as React.CSSProperties,
        }
      : { className: "cp-wd__bare" };

  return (
    <svg
      className={reveal ? "cp-wd cp-wd--reveal" : "cp-wd"}
      viewBox="0 0 200 520"
      height={height}
      width={Math.round((height * 200) / 520)}
      role="img"
      aria-label={
        title ??
        (line === "chronoshield"
          ? "Film covers the case, bezel, lugs, every bracelet link and the clasp."
          : "Film covers the case, bezel, lugs and clasp. The bracelet links are left bare.")
      }
    >
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" className="cp-wd__tint" />
          <line x1="0" y1="0" x2="0" y2="5" className="cp-wd__hatchline" />
        </pattern>
      </defs>

      {/* Bracelet */}
      {[...TOP_LINKS, ...BOTTOM_LINKS].map((l) => (
        <rect key={l.key} x={l.x} y={l.y} width={l.w} height={20} rx={2} {...zone("links", 3 + l.row * 0.7)} />
      ))}

      {/* Clasp, with the coronet engraving as two strokes */}
      <rect x={70} y={476} width={60} height={34} rx={5} {...zone("clasp", 7)} />
      <path d="M92,489 L96,483 L100,488 L104,483 L108,489 M92,493 L108,493" className="cp-wd__detail" />

      {/* Lugs sit behind the case */}
      {LUGS.map((d) => (
        <path key={d} d={d} {...zone("lugs", 2)} />
      ))}

      {/* Case: an opaque disc first so overlapping lug fills don't show through */}
      <path d={circle(R_CASE)} className="cp-wd__ground" />
      <path d={ring(R_CASE, R_BEZEL)} fillRule="evenodd" {...zone("case", 0)} />
      <path d={ring(R_BEZEL, R_BEZEL_IN)} fillRule="evenodd" {...zone("bezel", 1)} />

      {/* Crown — never filmed */}
      <rect x={172} y={251} width={11} height={18} rx={2} className="cp-wd__bare" />
      <path d="M175,254 V266 M178,254 V266 M181,254 V266" className="cp-wd__detail" />

      {/* Bezel graduations */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const r1 = i % 5 === 0 ? 57 : 60;
        return (
          <line
            key={i}
            x1={CX + Math.sin(a) * r1}
            y1={CY - Math.cos(a) * r1}
            x2={CX + Math.sin(a) * 63.5}
            y2={CY - Math.cos(a) * 63.5}
            className="cp-wd__tick"
          />
        );
      })}

      {/* Dial: markers and hands at ten past ten. Crystal is never filmed. */}
      <path d={circle(R_DIAL)} className="cp-wd__dial" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={CX + Math.sin(a) * 42}
            y1={CY - Math.cos(a) * 42}
            x2={CX + Math.sin(a) * 48}
            y2={CY - Math.cos(a) * 48}
            className="cp-wd__marker"
          />
        );
      })}
      <line x1={CX} y1={CY} x2={CX - 22} y2={CY - 12} className="cp-wd__hand" />
      <line x1={CX} y1={CY} x2={CX + 33} y2={CY - 20} className="cp-wd__hand" />
      <circle cx={CX} cy={CY} r={2.2} className="cp-wd__pin" />
    </svg>
  );
}
