/**
 * Technical flat-lays of the four watch families the kits are cut for, with
 * the film zones for one line hatched in bronze and everything else left as
 * bare outline. They answer the question a customer actually has: where does
 * the film go on my watch?
 *
 * Drawn from the watches' real geometry — crown guards, pushers, bezel
 * scales, dial layout, hands — with no logos, names, dial printing or bezel
 * numerals. Covered and bare differ by hatching as well as colour, so the
 * difference survives colour blindness and greyscale.
 *
 * Coordinates: a 200 x 520 frame, case centred at (100, 260). Angles are in
 * degrees clockwise from 12 o'clock, as on a dial.
 */

export type DiagramLine = "chronoshield" | "chronoguard";
export type WatchModel = "submariner" | "gmt" | "daytona" | "datejust";
export type DiagramBracelet = "Oyster" | "Jubilee" | "President";

type Zone = "case" | "bezel" | "lugs" | "links" | "clasp";

/** Which zones each line covers. Mirrors the covers lists in lib/site.ts. */
const COVERS: Record<DiagramLine, ReadonlySet<Zone>> = {
  chronoshield: new Set(["case", "bezel", "lugs", "links", "clasp"]),
  chronoguard: new Set(["case", "bezel", "lugs", "clasp"]),
};

/** The bracelet each family most often ships on, used when none is given. */
export const DEFAULT_BRACELET: Record<WatchModel, DiagramBracelet> = {
  submariner: "Oyster",
  gmt: "Jubilee",
  daytona: "Oyster",
  datejust: "Jubilee",
};

export const MODEL_NAMES: Record<WatchModel, string> = {
  submariner: "Submariner",
  gmt: "GMT-Master II",
  daytona: "Daytona",
  datejust: "Datejust",
};

/** Maps a fitment family's model name onto a drawing. */
export function modelForFamily(model: string): WatchModel {
  if (model.startsWith("Submariner")) return "submariner";
  if (model.startsWith("GMT")) return "gmt";
  if (model.startsWith("Daytona")) return "daytona";
  return "datejust";
}

const CX = 100;
const CY = 260;
const R_CASE = 72;

type Rings = { bezelOut: number; bezelIn: number; dial: number };

/** Bezel and dial proportions differ: the Daytona's tachymeter ring is narrow. */
const RINGS: Record<WatchModel, Rings> = {
  // Dive and travel bezels are broad: the insert plus its knurled edge runs
  // close to a quarter of the case radius.
  submariner: { bezelOut: 66, bezelIn: 48.5, dial: 46.5 },
  gmt: { bezelOut: 66, bezelIn: 48.5, dial: 46.5 },
  // The tachymeter bezel is the widest of the four, so the dial opening is
  // correspondingly smaller.
  daytona: { bezelOut: 66, bezelIn: 50, dial: 48 },
  datejust: { bezelOut: 66, bezelIn: 55, dial: 53 },
};

const rad = (deg: number) => (deg * Math.PI) / 180;
/** A point on a circle, angle clockwise from 12. Defaults to the case centre. */
const at = (r: number, deg: number, cx = CX, cy = CY): [number, number] => [
  cx + Math.sin(rad(deg)) * r,
  cy - Math.cos(rad(deg)) * r,
];
const f = (n: number) => Math.round(n * 100) / 100;

const circle = (r: number, cx = CX, cy = CY) =>
  `M${f(cx - r)},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
const ring = (outer: number, inner: number) => `${circle(outer)}${circle(inner)}`;
/** A radial tick from r1 to r2 at an angle, around (cx, cy). */
const tick = (r1: number, r2: number, deg: number, cx = CX, cy = CY) => {
  const [x1, y1] = at(r1, deg, cx, cy);
  const [x2, y2] = at(r2, deg, cx, cy);
  return `M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}`;
};
/** Part of a ring between two angles, for the GMT's two-tone bezel. */
const ringArc = (outer: number, inner: number, from: number, to: number) => {
  const [ox1, oy1] = at(outer, from);
  const [ox2, oy2] = at(outer, to);
  const [ix2, iy2] = at(inner, to);
  const [ix1, iy1] = at(inner, from);
  return `M${f(ox1)},${f(oy1)}A${outer},${outer} 0 0,1 ${f(ox2)},${f(oy2)}L${f(ix2)},${f(iy2)}A${inner},${inner} 0 0,0 ${f(ix1)},${f(iy1)}Z`;
};
/**
 * The knurled rim of a rotating bezel: teeth cut all the way round, each one
 * slightly narrower at its tip, so the edge reads as something a wet hand can
 * grip. Only the dive and travel bezels have it; the Daytona's is smooth and
 * the Datejust's is fluted.
 */
const coinEdge = (r: number, teeth = 60, depth = 2.6) => {
  const span = 360 / teeth;
  return Array.from({ length: teeth }, (_, i) => {
    const a0 = i * span + span * 0.16;
    const a1 = i * span + span * 0.84;
    const [x0, y0] = at(r - 1.2, a0);
    const [x1, y1] = at(r - 1.2, a1);
    const [x2, y2] = at(r + depth, a1 - span * 0.16);
    const [x3, y3] = at(r + depth, a0 + span * 0.16);
    return `M${f(x0)},${f(y0)}L${f(x3)},${f(y3)}L${f(x2)},${f(y2)}L${f(x1)},${f(y1)}Z`;
  }).join("");
};

/* ---------------------------------------------------------------- bracelets */

type Link = { x: number; y: number; w: number; h: number; rx: number; key: string; row: number };

/**
 * Rows of links running away from the lugs. Oyster: three flat pieces.
 * Jubilee: five, the small centre links staggered row to row. President:
 * three rounded pieces. Rows taper slightly toward the clasp.
 */
function bracelet(kind: DiagramBracelet, direction: 1 | -1, start: number): Link[] {
  const spec = {
    Oyster: { rows: direction === -1 ? 6 : 5, h: 20, step: 24, rx: 2, pieces: [0.31, 0.32, 0.31] },
    Jubilee: { rows: direction === -1 ? 8 : 7, h: 14, step: 17, rx: 3, pieces: [0.25, 0.14, 0.16, 0.14, 0.25] },
    President: { rows: direction === -1 ? 7 : 6, h: 16, step: 20, rx: 7, pieces: [0.31, 0.32, 0.31] },
  }[kind];

  const out: Link[] = [];
  for (let i = 0; i < spec.rows; i++) {
    const width = 72 - i * (14 / spec.rows);
    const top =
      direction === -1 ? start - (i + 1) * spec.step + (spec.step - spec.h) : start + i * spec.step;
    const used = spec.pieces.reduce((a, b) => a + b, 0) * width;
    const gap = (width - used) / (spec.pieces.length - 1);
    const shift = kind === "Jubilee" && i % 2 === 1 ? 1.2 : 0;
    let x = CX - width / 2;
    spec.pieces.forEach((fraction, p) => {
      const w = fraction * width;
      const inner = p > 0 && p < spec.pieces.length - 1;
      out.push({ x: x + (inner ? shift : 0), y: top, w, h: spec.h, rx: spec.rx, key: `${direction}-${i}-${p}`, row: i });
      x += w + gap;
    });
  }
  return out;
}

/* -------------------------------------------------------------- case parts */

/**
 * The Oyster case, seen from above, scaled from the real watches (about 3.2
 * units to the millimetre). The lugs are slim at the tips, just wider than the
 * end link, and flare outward to the case middle; the bezel overhangs the case
 * at 3 and 9. Lug-to-lug is about 48 mm on all four, so the tips sit 78 units
 * from the centre.
 *
 * tip:   half-width across the lug tips
 * width: half-width of the case middle, just inside the bezel
 */
const CASE_SHAPE: Record<WatchModel, { tip: number; width: number }> = {
  // 41 mm, 21 mm lugs: the broadest of the four
  submariner: { tip: 45, width: 64 },
  gmt: { tip: 45, width: 64 },
  // 40 mm with a proportionally larger bezel and finer lugs
  daytona: { tip: 43, width: 62.5 },
  // Slimmer, more polished lugs and no crown guards
  datejust: { tip: 43, width: 63 },
};

const LUG_TOP = CY - 78;
const LUG_BOTTOM = CY + 78;
/** Inner lug edge; the end link fits between. */
const LUG_IN = 35;

function caseBody(model: WatchModel) {
  const { tip, width } = CASE_SHAPE[model];
  const L = CX - tip;
  const R = CX + tip;
  const Lw = CX - width;
  const Rw = CX + width;
  const iL = CX - LUG_IN;
  const iR = CX + LUG_IN;
  const t = LUG_TOP;
  const b = LUG_BOTTOM;
  return [
    // Top-left lug tip, then the notch the end link sits in, then top-right
    `M${L},${t + 4} Q${L},${t} ${L + 4},${t} H${iL - 4} Q${iL},${t} ${iL},${t + 4} V${TOP_END}`,
    `Q${CX},${TOP_END - 8} ${iR},${TOP_END}`,
    `V${t + 4} Q${iR},${t} ${iR + 4},${t} H${R - 4} Q${R},${t} ${R},${t + 4}`,
    // Right lug flares out to the case middle, which runs down behind the bezel
    `C${R + 1},${t + 18} ${Rw - 4},${t + 28} ${Rw},${CY - 28}`,
    `Q${Rw + 2.5},${CY} ${Rw},${CY + 28}`,
    `C${Rw - 4},${b - 28} ${R + 1},${b - 18} ${R},${b - 4}`,
    // Bottom-right tip, bottom notch, bottom-left tip
    `Q${R},${b} ${R - 4},${b} H${iR + 4} Q${iR},${b} ${iR},${b - 4} V${BOTTOM_END}`,
    `Q${CX},${BOTTOM_END + 8} ${iL},${BOTTOM_END}`,
    `V${b - 4} Q${iL},${b} ${iL - 4},${b} H${L + 4} Q${L},${b} ${L},${b - 4}`,
    // Left side, mirrored
    `C${L - 1},${b - 18} ${Lw + 4},${b - 28} ${Lw},${CY + 28}`,
    `Q${Lw - 2.5},${CY} ${Lw},${CY - 28}`,
    `C${Lw + 4},${t + 28} ${L - 1},${t + 18} ${L},${t + 4} Z`,
  ].join(" ");
}

/** The polished bevel along each lug's outer edge; the bezel hides its far end. */
function lugBevels(model: WatchModel) {
  const { tip, width } = CASE_SHAPE[model];
  const one = (sx: number, sy: number) => {
    const x = (d: number) => f(CX + sx * d);
    const y = (d: number) => f(CY + sy * d);
    return `M${x(tip - 3)},${y(74)} C${x(tip - 2.2)},${y(60)} ${x(width - 7)},${y(50)} ${x(width - 3.5)},${y(26)}`;
  };
  return [one(-1, -1), one(1, -1), one(-1, 1), one(1, 1)].join(" ");
}

/** Where the bracelet meets the case, top and bottom. */
const TOP_END = 196;
const BOTTOM_END = 324;

/** The shoulders either side of the crown on the sports models. */
/**
 * Crown guards: two separate shoulders forged either side of the crown, not
 * one collar around it. Each rises out of the case flank, swells to its widest
 * where the crown sits, and falls back to the flank — the shape that protects
 * the tube on a Submariner, GMT-Master II or Daytona.
 */
function crownGuards(model: WatchModel) {
  const w = CX + CASE_SHAPE[model].width - 1;
  const tip = w + 14;
  // One shoulder, mirrored: sign -1 is the guard above the crown.
  const guard = (sign: -1 | 1) => {
    const base = sign === -1 ? 222 : 298;
    const edge = sign === -1 ? CROWN_TOP : CROWN_BOTTOM;
    const near = base + sign * -4;
    return [
      `M${w - 2},${base}`,
      `C${w + 4},${base + sign * 2} ${tip},${near + sign * 4} ${tip},${edge - sign * 2}`,
      `Q${tip},${edge} ${tip - 3},${edge}`,
      `L${w - 2},${edge} Z`,
    ].join(" ");
  };
  return [guard(-1), guard(1)];
}

/** The gap between the guards, where the crown seats. */
const CROWN_TOP = 248;
const CROWN_BOTTOM = 272;

/**
 * The crown sits flush against the case flank and screws out past the guards,
 * so its inner edge is the flank itself rather than floating beyond it.
 */
const crownX = (model: WatchModel) =>
  CX + CASE_SHAPE[model].width + (model === "datejust" ? -2 : 2);

/* ----------------------------------------------------------------- bezels */

function Triangle({ r }: { r: Rings }) {
  const [tx, ty] = at(r.bezelOut - 2.5, 0);
  return (
    <path
      d={`M${f(tx - 5)},${f(ty)}L${f(tx + 5)},${f(ty)}L${f(tx)},${f(ty + 8.5)}Z`}
      className="cp-wd__scale-shape"
    />
  );
}

function SubmarinerBezel({ r }: { r: Rings }) {
  const mid = (r.bezelOut + r.bezelIn) / 2;
  const marks: string[] = [];
  for (let m = 1; m < 60; m++) {
    if (m % 10 === 0) continue; // the numerals take these positions
    if (m % 5 === 0) {
      marks.push(tick(mid - 3, mid + 3, m * 6));
    } else if (m < 15) {
      marks.push(tick(r.bezelOut - 5, r.bezelOut - 2, m * 6));
    }
  }
  const [, ty] = at(r.bezelOut - 2.5, 0);
  return (
    <>
      <path d={marks.join("")} className="cp-wd__scale" />
      {/* 10 to 50, tops toward the rim like the engraved insert */}
      {[10, 20, 30, 40, 50].map((m) => (
        <text
          key={m}
          x={CX}
          y={CY - mid}
          transform={`rotate(${m * 6} ${CX} ${CY})`}
          className="cp-wd__numeral"
        >
          {m}
        </text>
      ))}
      <Triangle r={r} />
      {/* The lume pip in the zero triangle */}
      <circle cx={CX} cy={f(ty + 3.4)} r={1.5} className="cp-wd__lume" />
      <path d={coinEdge(r.bezelOut)} className="cp-wd__knurl" />
    </>
  );
}

function GmtBezel({ r }: { r: Rings }) {
  const mid = (r.bezelOut + r.bezelIn) / 2;
  // 24-hour scale: numerals at the even hours, dots at the odd ones, and the
  // triangle at 24. Each numeral is turned so its top faces the rim, as on
  // the real insert, which leaves 10 to 14 reading upside down.
  const odd = Array.from({ length: 12 }, (_, i) => at(mid, (i * 2 + 1) * 15));
  const even = Array.from({ length: 11 }, (_, i) => (i + 1) * 2);
  return (
    <>
      {/* Two-tone insert: day and night halves meet at the 6 and 18 positions */}
      <path d={ringArc(r.bezelOut, r.bezelIn, -90, 90)} className="cp-wd__tone" />
      {odd.map(([x, y], i) => (
        <circle key={i} cx={f(x)} cy={f(y)} r="1.3" className="cp-wd__scale-dot" />
      ))}
      {even.map((h) => (
        <text
          key={h}
          x={CX}
          y={CY - mid}
          transform={`rotate(${h * 15} ${CX} ${CY})`}
          className="cp-wd__numeral"
        >
          {h}
        </text>
      ))}
      <Triangle r={r} />
      <path d={coinEdge(r.bezelOut)} className="cp-wd__knurl" />
    </>
  );
}

/**
 * Tachymeter: each graduation sits where the chronograph seconds hand would
 * point after 3600 / value seconds, so the spacing opens up toward 12 exactly
 * as on the real scale.
 */
const TACHY = [
  400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200, 190, 180, 170, 160, 150, 140, 130, 120,
  110, 100, 95, 90, 85, 80, 75, 70, 65, 60,
];

/** The values engraved on the insert; the rest of TACHY are graduations only. */
const TACHY_NUMERALS = [400, 300, 240, 200, 180, 160, 140, 120, 110, 100, 90, 80, 75, 70, 65, 60];
const tachyDeg = (v: number) => (3600 / v / 60) * 360;

function DaytonaBezel({ r }: { r: Rings }) {
  // Graduations hug the inner edge; the numerals ride the outer band, turned
  // so their tops face the rim, as on the engraved insert.
  const marks = TACHY.map((v, i) => {
    const major = i % 2 === 0 || v <= 100;
    return tick(r.bezelIn + 0.8, r.bezelIn + (major ? 3.6 : 2.4), tachyDeg(v));
  });
  const band = r.bezelIn + 8.6;
  return (
    <>
      <path d={marks.join("")} className="cp-wd__scale" />
      {TACHY_NUMERALS.map((v) => (
        <text
          key={v}
          x={CX}
          y={CY - band}
          transform={`rotate(${f(tachyDeg(v) % 360)} ${CX} ${CY})`}
          className="cp-wd__numeral cp-wd__numeral--tachy"
        >
          {v}
        </text>
      ))}
    </>
  );
}

function DatejustBezel({ r }: { r: Rings }) {
  // Fluted: forty-eight flutes, each drawn as its two edges.
  const flutes = Array.from({ length: 96 }, (_, i) => tick(r.bezelIn + 0.8, r.bezelOut - 0.8, i * 3.75));
  return <path d={flutes.join("")} className="cp-wd__flute" />;
}

/* ------------------------------------------------------------------ dials */

const minuteTrack = (dial: number) =>
  Array.from({ length: 60 }, (_, i) => tick(dial - 3, dial - 0.8, i * 6)).join("");

function DateWindow({ dial }: { dial: number }) {
  const x = CX + dial - 21;
  return (
    <>
      <rect x={x} y={CY - 5} width={11} height={10} rx={1} className="cp-wd__date" />
      {/* The magnifier over the date */}
      <rect x={x - 3} y={CY - 8} width={17} height={16} rx={4} className="cp-wd__cyclops" />
    </>
  );
}

/** Hour markers as the sports models have them: round plots, a triangle at 12, bars at 6 and 9. */
function SportsDial({ dial }: { dial: number }) {
  const r = dial - 12;
  const bar = (deg: number) => (
    <path key={deg} d={tick(r - 5, r + 4, deg)} className="cp-wd__bar" />
  );
  const [tx, ty] = at(r + 2, 0);
  return (
    <>
      <path d={minuteTrack(dial)} className="cp-wd__track" />
      {[1, 2, 4, 5, 7, 8, 10, 11].map((h) => {
        const [x, y] = at(r, h * 30);
        return <circle key={h} cx={f(x)} cy={f(y)} r={3.4} className="cp-wd__plot" />;
      })}
      <path
        d={`M${f(tx - 5.5)},${f(ty - 4)}L${f(tx + 5.5)},${f(ty - 4)}L${f(tx)},${f(ty + 6)}Z`}
        className="cp-wd__plot"
      />
      {bar(180)}
      {bar(270)}
      <DateWindow dial={dial} />
    </>
  );
}

function DaytonaDial({ dial }: { dial: number }) {
  const sub = (cx: number, cy: number, key: string, handDeg: number) => {
    const [hx, hy] = at(8, handDeg, cx, cy);
    return (
      <g key={key}>
        <circle cx={cx} cy={cy} r={11} className="cp-wd__subdial" />
        <path
          d={Array.from({ length: 12 }, (_, i) => tick(8.5, 11, i * 30, cx, cy)).join("")}
          className="cp-wd__track"
        />
        <line x1={cx} y1={cy} x2={f(hx)} y2={f(hy)} className="cp-wd__subhand" />
      </g>
    );
  };
  return (
    <>
      {/* Fine seconds track round the edge, a quarter-second apart */}
      <path
        d={Array.from({ length: 240 }, (_, i) => tick(dial - (i % 4 === 0 ? 3.2 : 2), dial - 0.8, i * 1.5)).join("")}
        className="cp-wd__track"
      />
      {[0, 1, 2, 4, 5, 7, 8, 10, 11].map((h) => (
        <path key={h} d={tick(dial - 15, dial - 7, h * 30)} className="cp-wd__bar" />
      ))}
      {sub(CX + 22, CY, "s3", 120)}
      {sub(CX, CY + 23, "s6", 200)}
      {sub(CX - 22, CY, "s9", 60)}
    </>
  );
}

function DatejustDial({ dial }: { dial: number }) {
  const baton = (deg: number) => <path key={deg} d={tick(dial - 15, dial - 5, deg)} className="cp-wd__bar" />;
  return (
    <>
      <path d={minuteTrack(dial)} className="cp-wd__track" />
      {[1, 2, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => baton(h * 30))}
      {/* Double baton at 12 */}
      {baton(-2.6)}
      {baton(2.6)}
      <DateWindow dial={dial} />
    </>
  );
}

/* ------------------------------------------------------------------ hands */

// Ten past ten, seconds at thirty-five: the pose every watch is photographed in.
const HOUR = 305;
const MINUTE = 60;
const SECOND = 210;

const turn = (deg: number) => `rotate(${deg} ${CX} ${CY})`;

function MercedesHands({ gmt }: { gmt: boolean }) {
  // Drawn pointing at 12, then rotated into place.
  const mercedes = [0, 120, 240]
    .map((d) => {
      const [x, y] = at(5.2, d, CX, CY - 20);
      return `M${CX},${CY - 20}L${f(x)},${f(y)}`;
    })
    .join("");
  return (
    <>
      {gmt ? (
        <g transform={turn(150)}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - 42} className="cp-wd__hand-thin" />
          <path d={`M${CX - 4},${CY - 41}L${CX + 4},${CY - 41}L${CX},${CY - 50}Z`} className="cp-wd__hand-tip" />
        </g>
      ) : null}
      <g transform={turn(HOUR)}>
        <path d={`M${CX - 1.6},${CY}L${CX - 1.6},${CY - 14.8}M${CX + 1.6},${CY}L${CX + 1.6},${CY - 14.8}`} className="cp-wd__hand" />
        <circle cx={CX} cy={CY - 20} r={5.2} className="cp-wd__hand-ring" />
        <path d={mercedes} className="cp-wd__hand-thin" />
        <path d={`M${CX - 2.4},${CY - 24.8}L${CX},${CY - 30}L${CX + 2.4},${CY - 24.8}`} className="cp-wd__hand" />
      </g>
      <g transform={turn(MINUTE)}>
        <path
          d={`M${CX - 2},${CY}L${CX - 2},${CY - 8}L${CX - 3},${CY - 11}L${CX},${CY - 46}L${CX + 3},${CY - 11}L${CX + 2},${CY - 8}L${CX + 2},${CY}Z`}
          className="cp-wd__hand-shape"
        />
      </g>
      <g transform={turn(SECOND)}>
        <line x1={CX} y1={CY + 10} x2={CX} y2={CY - 47} className="cp-wd__hand-thin" />
        <circle cx={CX} cy={CY - 34} r={2.3} className="cp-wd__hand-ring" />
      </g>
    </>
  );
}

function BatonHands({ chrono }: { chrono: boolean }) {
  const baton = (length: number, width: number) =>
    `M${CX - width / 2},${CY + 4}L${CX - width / 2},${CY - length + 4}L${CX},${CY - length}L${CX + width / 2},${CY - length + 4}L${CX + width / 2},${CY + 4}Z`;
  return (
    <>
      <g transform={turn(HOUR)}>
        <path d={baton(30, 4)} className="cp-wd__hand-shape" />
      </g>
      <g transform={turn(MINUTE)}>
        <path d={baton(45, 3.2)} className="cp-wd__hand-shape" />
      </g>
      {/* On the chronograph the long central hand is the stopwatch hand, at rest at 12 */}
      <g transform={turn(chrono ? 0 : SECOND)}>
        <line x1={CX} y1={CY + 12} x2={CX} y2={CY - (chrono ? 52 : 47)} className="cp-wd__hand-thin" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------- main */

export default function WatchDiagram({
  line,
  id,
  model = "submariner",
  bracelet: braceletKind,
  height = 420,
  title,
  reveal = false,
}: {
  line: DiagramLine;
  /** Unique per page: it namespaces the hatch pattern. */
  id: string;
  model?: WatchModel;
  /** Defaults to the bracelet the model most often ships on. */
  bracelet?: DiagramBracelet;
  height?: number;
  title?: string;
  /**
   * Let a parent apply the film progressively by setting --p (0 to 1) on an
   * ancestor. Without it, or before --p is set, the drawing is complete.
   */
  reveal?: boolean;
}) {
  const covered = COVERS[line];
  const kind = braceletKind ?? DEFAULT_BRACELET[model];
  const r = RINGS[model];
  const hatch = `${id}-hatch`;
  const sports = model !== "datejust";

  const zone = (z: Zone, order = 0) =>
    covered.has(z)
      ? {
          className: "cp-wd__film",
          fill: `url(#${hatch})`,
          style: { ["--i" as string]: order } as React.CSSProperties,
        }
      : { className: "cp-wd__bare" };

  const top = bracelet(kind, -1, TOP_END);
  const bottom = bracelet(kind, 1, BOTTOM_END);
  const lastRow = Math.max(...top.map((l) => l.row));
  const claspTop = Math.max(...bottom.map((l) => l.y + l.h)) + 4;

  const described =
    title ??
    `${MODEL_NAMES[model]} on ${kind}. ${
      line === "chronoshield"
        ? "Film covers the case, bezel, lugs, every bracelet link and the clasp."
        : "Film covers the case, bezel, lugs and clasp. The bracelet links are left bare."
    }`;

  return (
    <svg
      className={reveal ? "cp-wd cp-wd--reveal" : "cp-wd"}
      viewBox="0 0 200 520"
      height={height}
      width={Math.round((height * 200) / 520)}
      role="img"
      aria-label={described}
    >
      <defs>
        <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" className="cp-wd__tint" />
          <line x1="0" y1="0" x2="0" y2="5" className="cp-wd__hatchline" />
        </pattern>
      </defs>

      {/* Bracelet; the film spreads outward from the lugs */}
      {[...top, ...bottom].map((l) => (
        <rect
          key={l.key}
          x={f(l.x)}
          y={f(l.y)}
          width={f(l.w)}
          height={l.h}
          rx={l.rx}
          {...zone("links", 3 + (l.row / lastRow) * 3.5)}
        />
      ))}

      {/* Clasp. The President's is concealed, so its end reads as one more link. */}
      <rect x={70} y={claspTop} width={60} height={30} rx={kind === "President" ? 9 : 5} {...zone("clasp", 7)} />
      {kind !== "President" ? (
        <path d={`M86,${claspTop + 10}H114M86,${claspTop + 20}H114`} className="cp-wd__detail" />
      ) : null}

      {/* Case and lugs: covered by both lines, so one zone serves both */}
      <path d={caseBody(model)} {...zone("lugs", 0)} />
      <path d={lugBevels(model)} className="cp-wd__detail" />
      {sports
        ? crownGuards(model).map((d, i) => (
            <path key={i} d={d} {...zone("case", 0)} />
          ))
        : null}

      {/* Daytona pushers at 2 and 4 o'clock — never filmed */}
      {model === "daytona"
        ? [60, 120].map((deg) => {
            const [x, y] = at(R_CASE + 4, deg);
            return (
              <g key={deg} transform={`rotate(${deg - 90} ${f(x)} ${f(y)})`}>
                <rect x={f(x - 4)} y={f(y - 5.5)} width={12} height={11} rx={2} className="cp-wd__bare" />
                <path d={`M${f(x + 2)},${f(y - 5.5)}V${f(y + 5.5)}M${f(x + 5)},${f(y - 5.5)}V${f(y + 5.5)}`} className="cp-wd__detail" />
              </g>
            );
          })
        : null}

      {/* Bezel: an opaque disc first so the case hatching doesn't show through it */}
      <path d={circle(r.bezelOut)} className="cp-wd__ground" />
      <path d={ring(r.bezelOut, r.bezelIn)} fillRule="evenodd" {...zone("bezel", 1)} />

      {model === "submariner" ? <SubmarinerBezel r={r} /> : null}
      {model === "gmt" ? <GmtBezel r={r} /> : null}
      {model === "daytona" ? <DaytonaBezel r={r} /> : null}
      {model === "datejust" ? <DatejustBezel r={r} /> : null}

      {/* Crown — never filmed */}
      <rect
        x={crownX(model)}
        y={CROWN_TOP + 1}
        width={20}
        height={CROWN_BOTTOM - CROWN_TOP - 2}
        rx={2}
        className="cp-wd__bare"
      />
      {/* Fluting on the crown, and the shoulder where it meets the case */}
      <path
        d={[5, 9, 13, 17].map((o) => `M${crownX(model) + o},${CROWN_TOP + 4} V${CROWN_BOTTOM - 4}`).join(" ")}
        className="cp-wd__detail"
      />

      {/* Dial. The crystal is never filmed. */}
      <path d={circle(r.dial)} className="cp-wd__dial" />
      {model === "submariner" || model === "gmt" ? <SportsDial dial={r.dial} /> : null}
      {model === "daytona" ? <DaytonaDial dial={r.dial} /> : null}
      {model === "datejust" ? <DatejustDial dial={r.dial} /> : null}

      {model === "submariner" || model === "gmt" ? (
        <MercedesHands gmt={model === "gmt"} />
      ) : (
        <BatonHands chrono={model === "daytona"} />
      )}
      <circle cx={CX} cy={CY} r={2.4} className="cp-wd__pin" />
    </svg>
  );
}
