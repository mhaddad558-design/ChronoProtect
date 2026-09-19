/**
 * Three rows of a bracelet, drawn to show how its links are built: the reason
 * each one is cut — and priced — differently. Oyster is three flat pieces,
 * Jubilee five with small centre links, President three rounded pieces.
 */
export type BraceletKind = "Oyster" | "Jubilee" | "President";

const W = 72;
const ROW = 16;
const GAP = 4;

/** Piece widths per row, as fractions of the bracelet width. */
const PIECES: Record<BraceletKind, number[]> = {
  Oyster: [0.31, 0.32, 0.31],
  Jubilee: [0.26, 0.13, 0.16, 0.13, 0.26],
  President: [0.31, 0.32, 0.31],
};

export default function BraceletLinks({
  kind,
  height = 64,
}: {
  kind: BraceletKind;
  height?: number;
}) {
  const pieces = PIECES[kind];
  const used = pieces.reduce((a, b) => a + b, 0) * W;
  const gap = (W - used) / (pieces.length - 1);
  // President links are semi-circular in section, so their ends read round.
  const rx = kind === "President" ? 7 : kind === "Jubilee" ? 2.5 : 1.5;
  const rows = 3;
  const total = rows * ROW + (rows - 1) * GAP;

  return (
    <svg
      className="cp-links"
      viewBox={`-2 -2 ${W + 4} ${total + 4}`}
      height={height}
      width={Math.round((height * (W + 4)) / (total + 4))}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: rows }, (_, r) => {
        // Jubilee rows are offset, which is what gives it its brick pattern.
        const shift = kind === "Jubilee" && r % 2 === 1 ? 1 : 0;
        let x = 0;
        return pieces.map((fraction, i) => {
          const w = fraction * W;
          const el = (
            <rect
              key={`${r}-${i}`}
              x={x + (i > 0 && i < pieces.length - 1 ? shift : 0)}
              y={r * (ROW + GAP)}
              width={w}
              height={ROW}
              rx={rx}
              className={i === Math.floor(pieces.length / 2) || (kind === "Jubilee" && i % 2 === 1)
                ? "cp-links__centre"
                : "cp-links__outer"}
            />
          );
          x += w + gap;
          return el;
        });
      })}
    </svg>
  );
}
