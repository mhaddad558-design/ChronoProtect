"use client";

import type { DatejustLook, Look } from "@/lib/looks";
import type { WatchModel } from "./WatchDiagram";

export const ERA_ORDER = ["2020 onward", "2000s and 2010s", "1990s and 2000s"];

/** Metals, in the order an owner scans a tray: steel first, then gold. */
export const METAL_ORDER = [
  "steel",
  "white-rolesor",
  "two-tone",
  "yellow-rolesor",
  "everose-steel",
  "everose-rolesor",
  "yellow",
  "everose",
  "white",
  "platinum",
];

export const METAL_WORDS: Record<string, string> = {
  steel: "Steel",
  "two-tone": "Steel and gold",
  "everose-steel": "Steel and rose gold",
  // Rolesor: a steel case with a precious-metal bezel. The white one reads as
  // steel at a glance, so it is named for what an owner would call it.
  "white-rolesor": "Steel, white gold bezel",
  "yellow-rolesor": "Steel and gold",
  "everose-rolesor": "Steel and rose gold",
  yellow: "Yellow gold",
  everose: "Rose gold",
  white: "White gold",
  platinum: "Platinum",
};

export const BEZEL_WORDS: Record<string, string> = {
  black: "black bezel",
  green: "green bezel",
  blue: "blue bezel",
  brown: "brown bezel",
  "blue-red": "blue and red bezel",
  "blue-black": "blue and black bezel",
  "grey-black": "grey and black bezel",
  "brown-black": "brown and black bezel",
  "green-black": "green and black bezel",
  engraved: "metal bezel with numbers",
  diamond: "diamond-set bezel",
  fluted: "fluted bezel",
  smooth: "smooth bezel",
};

export const DIAL_WORDS: Record<string, string> = {
  black: "black dial",
  blue: "blue dial",
  green: "green dial",
  silver: "silver dial",
  white: "white dial",
  slate: "slate dial",
  mint: "mint green dial",
  champagne: "champagne dial",
  chocolate: "chocolate dial",
  sundust: "sundust dial",
  ice: "ice blue dial",
  meteorite: "meteorite dial",
  mop: "white mother-of-pearl dial",
};

/** The colours are the watches' own, not the brand's. */
const METAL_INK: Record<string, string> = {
  steel: "#C7CCCF",
  "two-tone": "#C7CCCF",
  "everose-steel": "#C7CCCF",
  "white-rolesor": "#C7CCCF",
  "yellow-rolesor": "#C7CCCF",
  "everose-rolesor": "#C7CCCF",
  yellow: "#D4AC58",
  everose: "#D09A84",
  white: "#CFD4D7",
  platinum: "#DCE0E3",
};

const GOLD = "#D4AC58";
const ROSE = "#D09A84";
const WHITE_GOLD = "#E2E6E8";

/**
 * The precious metal on a two-tone watch: where it goes depends on the model.
 * A sports two-tone splits the case; a Rolesor Datejust keeps a steel case and
 * puts the gold on the bezel, the crown and the bracelet's centre links.
 */
function accentFor(metal: string): string | null {
  if (metal === "two-tone" || metal === "yellow-rolesor") return GOLD;
  if (metal === "everose-steel" || metal === "everose-rolesor") return ROSE;
  if (metal === "white-rolesor") return WHITE_GOLD;
  return null;
}

/**
 * A bezel's colours as [upper half, lower half]. A two-colour GMT bezel splits
 * at 3 and 9, with the night hours (18 to 6) across the top in the darker
 * colour: black over green on the Sprite, blue over red on the Pepsi.
 */
const BEZEL_INK: Record<string, [string, string]> = {
  black: ["#1C211F", "#1C211F"],
  green: ["#1C5237", "#1C5237"],
  blue: ["#1B3A68", "#1B3A68"],
  brown: ["#4A3227", "#4A3227"],
  "blue-red": ["#1B3A68", "#8E2230"],
  "blue-black": ["#1C211F", "#1B3A68"],
  "grey-black": ["#1C211F", "#5A6165"],
  "brown-black": ["#1C211F", "#4A3227"],
  "green-black": ["#1C211F", "#1C5237"],
};

const DIAL_INK: Record<string, string> = {
  black: "#14180F",
  blue: "#16305A",
  green: "#12341F",
  ice: "#9FB6BE",
  silver: "#C9CED1",
  white: "#EEF0EE",
  slate: "#4A5157",
  mint: "#9CC5A7",
  champagne: "#CDB88A",
  chocolate: "#4A3025",
  sundust: "#D7B7A6",
  meteorite: "#8A8E90",
  mop: "#ECE8EE",
};

/**
 * A metal lit from the upper left: mixed toward white for the highlight and
 * toward black for the shadow. Everything reflective is built from this, so a
 * steel case and a gold one catch the light the same way.
 */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (v: number) =>
    Math.round(amount >= 0 ? v + (255 - v) * amount : v * (1 + amount));
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/**
 * The face, in the 48-unit drawing. The bezel is a slim ring and the dial
 * takes the room inside it, as on the watch: a wide bezel crowds the dial and
 * hides the detail an owner recognises.
 */
const BEZEL_MID = 17.2;
const BEZEL_W = 4.2;
const DIAL_R = 14.4;

/** The coin-edge grip ring round a rotating bezel, inner and outer radius. */
const GRIP_INNER = 18.5;
const GRIP_OUTER = 20.1;

/** Lume on markers and hands: a warm off-white, never pure white. */
const LUME = "#F1EEE2";

/**
 * A Daytona's tachymeter, as [value, angle]. The scale reads speed from
 * elapsed seconds, so each value sits at 3600 / value seconds round the
 * bezel: 60 at 12, 120 at 6, 400 just past 1. The numerals' tops face
 * outward, so the lower half reads upside down, as on the watch.
 */
const TACHYMETER: Array<[number, number]> = [
  [400, 54],
  [300, 72],
  [240, 90],
  [200, 108],
  [160, 135],
  [120, 180],
  [100, 216],
  [90, 240],
  [80, 270],
  [70, 309],
  [60, 360],
];

/** A Submariner's dive scale: 10 to 50, the triangle standing for 60. */
const DIVE_SCALE: Array<[number, number]> = [10, 20, 30, 40, 50].map((m) => [m, m * 6]);

/**
 * A GMT-Master II's 24-hour scale: the even hours, 2 to 22, the triangle
 * standing for 24. Each hour is 15 degrees, so 6 sits at 3 o'clock.
 */
const GMT_SCALE: Array<[number, number]> = Array.from({ length: 11 }, (_, i) => {
  const hour = (i + 1) * 2;
  return [hour, hour * 15];
});

/** Dials pale enough that white hands would vanish on them. */
const LIGHT_DIALS = new Set(["silver", "white", "mint", "champagne", "sundust", "ice", "mop", "meteorite"]);

/** Gold cases carry gold hands and surrounds; steel carries white. */
const goldish = (metal: string) =>
  metal === "yellow" ||
  metal === "everose" ||
  metal === "two-tone" ||
  metal === "everose-steel" ||
  metal === "yellow-rolesor" ||
  metal === "everose-rolesor";

/**
 * A thumbnail of the watch as it reads at arm's length: the case and bracelet
 * in the metal they are made of, the bezel and its markings, the colour of the
 * dial, and hands and markers in the metal of the watch. Sports two-tones split
 * the case at 12 and 6; a two-tone Datejust keeps a steel case and wears its
 * gold on the bezel, crown and centre links, as the real one does.
 */
export default function LookChip({
  metal,
  bezel,
  dial = "black",
  model,
  strap = false,
  lefty = false,
  seconds,
  id,
}: {
  metal: string;
  bezel: string;
  dial?: string;
  model: WatchModel;
  /** Rubber rather than metal, so the stubs are drawn dark. */
  strap?: boolean;
  /** Destro: the crown sits on the left. */
  lefty?: boolean;
  /** A coloured seconds hand, drawn only where the real watch has one. */
  seconds?: string;
  id: string;
}) {
  const rolesor = metal.endsWith("-rolesor");
  const splitCase = metal === "two-tone" || metal === "everose-steel";
  const accent = accentFor(metal);
  const caseInk = METAL_INK[metal] ?? METAL_INK.steel;
  const metalBezel = bezel === "engraved" || bezel === "diamond" || bezel === "fluted" || bezel === "smooth";
  // A metal bezel is the case metal, or the precious metal on a Rolesor.
  const bezelMetalInk = rolesor && accent ? accent : caseInk;
  const [upper, lower] = BEZEL_INK[bezel] ?? BEZEL_INK.black;
  const dialInk = DIAL_INK[dial] ?? DIAL_INK.black;
  const lightDial = LIGHT_DIALS.has(dial);
  const goldHands = goldish(metal);
  const handInk = goldHands
    ? metal.startsWith("everose")
      ? ROSE
      : GOLD
    : lightDial
      ? "#2A2F31"
      : "#EEF2F4";
  // Gold on a pale dial still needs an edge to read, so it darkens a touch.
  const markerInk = goldHands && lightDial ? (metal.startsWith("everose") ? "#A86F5A" : "#9C7A30") : handInk;

  // Rounded, because the server and the browser disagree in the last digit of
  // a sine, and a mismatched attribute breaks hydration on the catalog page.
  const round = (n: number) => Math.round(n * 100) / 100;
  const point = (r: number, deg: number) => [
    round(24 + Math.sin((deg * Math.PI) / 180) * r),
    round(24 - Math.cos((deg * Math.PI) / 180) * r),
  ];

  const centreLinks = rolesor || splitCase ? accent : null;
  const tick = (r1: number, r2: number, deg: number) => {
    const [x1, y1] = point(r1, deg);
    const [x2, y2] = point(r2, deg);
    return { x1, y1, x2, y2 };
  };

  // The minute track and printing on the dial: white on a dark dial, dark on
  // a pale one.
  const trackInk = lightDial ? "#1E2325" : "#FFFFFF";
  // Applied markers carry lume on a dark dial; on a pale one the metal alone reads.
  const markerFill = lightDial ? markerInk : LUME;
  // Bezel numerals: platinum-white, or gold on a gold or two-tone watch; dark
  // when engraved in a metal bezel.
  const numeralInk = metalBezel ? "#0B110D" : goldHands ? (metal.startsWith("everose") ? ROSE : GOLD) : "#E9ECEE";
  const sports = model === "submariner" || model === "gmt";
  // A rotating bezel (Submariner, GMT) sits in a metal ring with a coin-edge
  // grip, so its coloured insert is narrower; fixed bezels run to the edge.
  const insertInner = BEZEL_MID - BEZEL_W / 2;
  const insertOuter = sports ? GRIP_INNER : BEZEL_MID + BEZEL_W / 2;
  const insertMid = (insertInner + insertOuter) / 2;
  const insertW = insertOuter - insertInner;
  // The numbers round the bezel, as [value, angle], tops facing outward.
  const numerals: Array<[number, number]> =
    model === "daytona" ? TACHYMETER : model === "submariner" ? DIVE_SCALE : model === "gmt" ? GMT_SCALE : [];
  const numeralSize = model === "gmt" ? 2.55 : model === "submariner" ? 2.95 : 2.35;
  // The grip is the bezel's own metal: gold on a two-tone, as on the watch.
  const gripFill = accent && (splitCase || rolesor) ? `url(#${id}-a)` : `url(#${id}-m)`;
  // The 3 and 9 markers swap on a destro, where the date sits at 9.
  const batons = sports ? [180, lefty ? 90 : 270] : [];

  return (
    <svg viewBox="0 0 48 48" width={48} height={48} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-r`}>
          <rect x="24" y="0" width="24" height="48" />
        </clipPath>
        <clipPath id={`${id}-t`}>
          <rect x="0" y="0" width="48" height="24" />
        </clipPath>
        <clipPath id={`${id}-b`}>
          <rect x="0" y="24" width="48" height="24" />
        </clipPath>
        {/* Polished metal: a bright highlight upper left, shadow lower right,
            and a second catch of light at the far edge. */}
        <Polish id={`${id}-m`} ink={caseInk} />
        {accent ? <Polish id={`${id}-a`} ink={accent} /> : null}
        <Polish id={`${id}-bm`} ink={bezelMetalInk} />
        {/* Ceramic: glossier and darker than metal, one bright band only. */}
        <Gloss id={`${id}-bt`} ink={upper} />
        <Gloss id={`${id}-bb`} ink={lower} />
        {/* A sunburst dial: bright at the centre, falling away to the edge. */}
        <radialGradient id={`${id}-d`} cx="0.42" cy="0.4" r="0.72">
          <stop offset="0" stopColor={shade(dialInk, lightDial ? 0.3 : 0.24)} />
          <stop offset="0.55" stopColor={dialInk} />
          <stop offset="1" stopColor={shade(dialInk, -0.42)} />
        </radialGradient>
        {/* The bow-tie of light a sunburst throws across its centre. */}
        <radialGradient id={`${id}-sb`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={lightDial ? 0.38 : 0.3} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {/* Rubber is matte: a soft sheen and nothing more. */}
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1E2220" />
          <stop offset="0.5" stopColor="#343936" />
          <stop offset="1" stopColor="#1E2220" />
        </linearGradient>
        {/* The glare off the sapphire crystal. */}
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Bracelet stubs above and below: steel outers with precious centre
          links on a two-tone, dark on a rubber strap. */}
      {[0, 38].map((y) => (
        <g key={y}>
          <rect
            x="16"
            y={y}
            width="16"
            height="10"
            rx="2"
            fill={strap ? `url(#${id}-s)` : `url(#${id}-m)`}
          />
          {centreLinks && !strap ? <rect x="21" y={y} width="6" height="10" fill={`url(#${id}-a)`} /> : null}
          {/* The seams between links, or between the strap and its keeper */}
          {[3.3, 6.6].map((o) => (
            <line
              key={o}
              x1="16.5"
              y1={y + o}
              x2="31.5"
              y2={y + o}
              stroke="#0B110D"
              strokeOpacity={strap ? 0.35 : 0.22}
              strokeWidth="0.45"
            />
          ))}
          {/* The outer links' edges, where the brushing meets the polish */}
          {!strap ? (
            <>
              <line x1="20.8" y1={y + 0.5} x2="20.8" y2={y + 9.5} stroke="#0B110D" strokeOpacity="0.18" strokeWidth="0.4" />
              <line x1="27.2" y1={y + 0.5} x2="27.2" y2={y + 9.5} stroke="#0B110D" strokeOpacity="0.18" strokeWidth="0.4" />
            </>
          ) : null}
        </g>
      ))}

      {/* Case */}
      <circle cx="24" cy="24" r="20" fill={`url(#${id}-m)`} />
      {splitCase && accent ? (
        <circle cx="24" cy="24" r="20" fill={`url(#${id}-a)`} clipPath={`url(#${id}-r)`} />
      ) : null}
      <circle cx="24" cy="24" r="19.7" fill="none" stroke={shade(caseInk, -0.45)} strokeOpacity="0.55" strokeWidth="0.6" />
      {/* The crown, in the precious metal on a two-tone, on the left on a destro */}
      <rect
        x={lefty ? 1 : 43}
        y="21"
        width="4"
        height="6"
        rx="1"
        fill={(splitCase || rolesor) && accent && !lefty ? `url(#${id}-a)` : `url(#${id}-m)`}
      />

      {/* Rotating bezel: the metal ring around the insert, its outer edge
          cut into a coin-edge grip and its inner edge bevelled down to the
          insert. */}
      {sports ? (
        <>
          <circle cx="24" cy="24" r={(GRIP_INNER + GRIP_OUTER) / 2} fill="none" stroke={gripFill} strokeWidth={GRIP_OUTER - GRIP_INNER} />
          {Array.from({ length: 72 }, (_, i) => (
            <g key={i}>
              {/* The grooves, and the polished ridge between each pair */}
              <line {...tick(GRIP_INNER + 0.55, GRIP_OUTER, i * 5)} stroke="#0B110D" strokeOpacity="0.5" strokeWidth="0.42" />
              <line {...tick(GRIP_INNER + 0.75, GRIP_OUTER - 0.15, i * 5 + 2.5)} stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="0.3" />
            </g>
          ))}
          {/* The scalloped rim: the grip stands slightly proud of the case */}
          <circle cx="24" cy="24" r={GRIP_OUTER} fill="none" stroke="#0B110D" strokeOpacity="0.35" strokeWidth="0.3" strokeDasharray="0.55 0.5" />
          {/* The bevel: lit along its upper left, in shadow lower right */}
          <circle cx="24" cy="24" r={GRIP_INNER + 0.3} fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="0.45" clipPath={`url(#${id}-t)`} />
          <circle cx="24" cy="24" r={GRIP_INNER + 0.3} fill="none" stroke="#0B110D" strokeOpacity="0.35" strokeWidth="0.45" clipPath={`url(#${id}-b)`} />
        </>
      ) : null}

      {/* Bezel: a slim ring, so the dial has the room. */}
      {metalBezel ? (
        <circle cx="24" cy="24" r={insertMid} fill="none" stroke={`url(#${id}-bm)`} strokeWidth={insertW} />
      ) : (
        <>
          <circle cx="24" cy="24" r={insertMid} fill="none" stroke={`url(#${id}-bt)`} strokeWidth={insertW} clipPath={`url(#${id}-t)`} />
          <circle cx="24" cy="24" r={insertMid} fill="none" stroke={`url(#${id}-bb)`} strokeWidth={insertW} clipPath={`url(#${id}-b)`} />
        </>
      )}
      {/* Its edges, where it steps down to the case and to the crystal */}
      <circle cx="24" cy="24" r={insertOuter} fill="none" stroke="#0B110D" strokeOpacity="0.3" strokeWidth="0.35" />
      <circle cx="24" cy="24" r={insertInner} fill="none" stroke="#0B110D" strokeOpacity="0.4" strokeWidth="0.35" />

      {/* Bezel markings: the tachymeter on a Daytona, the scale and the
          triangle on a dive or travel bezel, ridges on a fluted one, stones on
          a set one. */}
      {bezel !== "diamond"
        ? numerals.map(([value, deg]) => (
            <text
              key={value}
              x="24"
              y={24 - insertMid}
              transform={`rotate(${deg} 24 24)`}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Red Hat Text', system-ui, sans-serif"
              fontSize={numeralSize}
              fontWeight="600"
              letterSpacing="-0.08"
              fill={numeralInk}
              fillOpacity={metalBezel ? 0.62 : 0.92}
            >
              {value}
            </text>
          ))
        : null}
      {model === "submariner" ? (
        <>
          {/* Bars at the five-minute marks that carry no numeral */}
          {[30, 90, 150, 210, 270, 330].map((deg) => (
            <line key={deg} {...tick(insertInner + 0.7, insertOuter - 0.5, deg)} stroke={numeralInk} strokeOpacity="0.9" strokeWidth="0.7" />
          ))}
          {/* Single minutes across the first fifteen, for timing a dive;
              9 and 11 are left out so the 10 has room at this size */}
          {Array.from({ length: 14 }, (_, i) => i + 1)
            .filter((m) => m % 5 !== 0 && m !== 9 && m !== 11)
            .map((m) => (
              <line key={m} {...tick(insertOuter - 1.15, insertOuter - 0.45, m * 6)} stroke={numeralInk} strokeOpacity="0.85" strokeWidth="0.3" />
            ))}
        </>
      ) : null}
      {model === "gmt"
        ? // A dot at each odd hour between the numerals
          Array.from({ length: 12 }, (_, i) => {
            const [x, y] = point(insertMid, (i * 2 + 1) * 15);
            return <circle key={i} cx={x} cy={y} r="0.42" fill={numeralInk} fillOpacity="0.9" />;
          })
        : null}
      {sports ? (
        // The triangle at zero, which every dive and travel bezel has
        <path
          d={`M22.45,${24 - insertOuter + 0.4} L25.55,${24 - insertOuter + 0.4} L24,${24 - insertInner - 0.4} Z`}
          fill="#FFFFFF"
          fillOpacity="0.92"
        />
      ) : null}
      {model === "submariner" ? (
        // The Submariner's lume pip, in its metal cup inside the triangle
        <circle cx="24" cy={round(24 - insertMid - 0.35)} r="0.62" fill={LUME} stroke="#7C8285" strokeWidth="0.22" />
      ) : null}
      {bezel === "fluted"
        ? Array.from({ length: 48 }, (_, i) => (
            <line
              key={i}
              {...tick(15.4, 19.0, i * 7.5)}
              stroke={i % 2 ? "#FFFFFF" : "#0B110D"}
              strokeOpacity={i % 2 ? 0.22 : 0.34}
              strokeWidth="0.55"
            />
          ))
        : null}
      {bezel === "diamond"
        ? Array.from({ length: 24 }, (_, i) => {
            const [x, y] = point(BEZEL_MID, i * 15);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="1.15" fill="#F4F7FA" />
                <circle cx={x - 0.35} cy={y - 0.35} r="0.4" fill="#FFFFFF" />
              </g>
            );
          })
        : null}

      {/* The flange between bezel and dial */}
      <circle cx="24" cy="24" r={DIAL_R + 0.35} fill="none" stroke={shade(dialInk, -0.55)} strokeWidth="0.7" />

      {/* Dial */}
      <circle cx="24" cy="24" r={DIAL_R} fill={`url(#${id}-d)`} />
      {dial !== "mop" && dial !== "meteorite" ? (
        <>
          {/* Sunburst rays, alternately catching and losing the light */}
          {Array.from({ length: 48 }, (_, i) => (
            <line
              key={i}
              {...tick(1.8, DIAL_R - 0.3, i * 7.5)}
              stroke="#FFFFFF"
              strokeOpacity={(lightDial ? 0.1 : 0.07) * (i % 2 ? 0.5 : 1)}
              strokeWidth="0.3"
            />
          ))}
          {/* The bow-tie of reflected light, upper left to lower right */}
          {[315, 135].map((deg) => {
            const [ax, ay] = point(DIAL_R, deg - 16);
            const [bx, by] = point(DIAL_R, deg + 16);
            return (
              <path
                key={deg}
                d={`M24,24 L${ax},${ay} A${DIAL_R},${DIAL_R} 0 0 1 ${bx},${by} Z`}
                fill={`url(#${id}-sb)`}
                fillOpacity={deg === 315 ? 1 : 0.55}
              />
            );
          })}
        </>
      ) : null}
      {dial === "meteorite" ? (
        // Meteorite has a crystalline cross-hatch rather than a sunburst
        <path
          d="M13,19 L34,27 M14,28 L33,18 M18,12 L28,36 M12,24 L36,23 M21,11 L25,37 M15,15 L31,33"
          stroke="#FFFFFF"
          strokeOpacity="0.16"
          strokeWidth="0.35"
        />
      ) : null}
      {dial === "mop" ? (
        <>
          <circle cx="20.5" cy="20.5" r="7" fill="#D9E6F2" fillOpacity="0.6" />
          <circle cx="27.5" cy="27.5" r="6" fill="#F2DCE6" fillOpacity="0.5" />
        </>
      ) : null}

      {/* Minute track: sixty marks, every fifth one longer */}
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          {...tick(i % 5 ? DIAL_R - 0.9 : DIAL_R - 1.5, DIAL_R - 0.25, i * 6)}
          stroke={trackInk}
          strokeOpacity={i % 5 ? 0.4 : 0.6}
          strokeWidth={i % 5 ? 0.18 : 0.3}
        />
      ))}

      {/* Markers: sub-dials and batons on a Daytona, batons and a date on a
          Datejust; dots, a triangle and batons on the sports models. All are
          applied metal, filled with lume on a dark dial. */}
      {model === "daytona" ? (
        <>
          {[90, 180, 270].map((deg) => {
            const [x, y] = point(6.4, deg);
            const [hx, hy] = [x + Math.sin(((deg + 140) * Math.PI) / 180) * 2.4, y - Math.cos(((deg + 140) * Math.PI) / 180) * 2.4];
            return (
              <g key={deg}>
                <circle cx={x} cy={y} r="3.6" fill={shade(dialInk, lightDial ? -0.62 : 0.14)} />
                <circle cx={x} cy={y} r="3.6" fill="none" stroke={markerInk} strokeOpacity="0.85" strokeWidth="0.4" />
                <circle cx={x} cy={y} r="2.9" fill="none" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="0.25" />
                <circle cx={x} cy={y} r="2.3" fill="none" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="0.25" />
                <line x1={x} y1={y} x2={round(hx)} y2={round(hy)} stroke={handInk} strokeWidth="0.4" strokeLinecap="round" />
              </g>
            );
          })}
          {Array.from({ length: 12 }, (_, i) =>
            i % 3 === 0 && i !== 0 ? null : (
              <line key={i} {...tick(10.8, 12.9, i * 30)} stroke={markerFill} strokeWidth="1.15" strokeLinecap="round" />
            )
          )}
        </>
      ) : model === "datejust" ? (
        Array.from({ length: 12 }, (_, i) => {
          if (i === (lefty ? 9 : 3)) return null; // the date window takes 3 o'clock
          if (i === 0) {
            // Doubled at 12
            return (
              <g key={i}>
                <line x1="23.1" y1={24 - 12.9} x2="23.1" y2={24 - 9.8} stroke={markerInk} strokeWidth="1.2" strokeLinecap="round" />
                <line x1="24.9" y1={24 - 12.9} x2="24.9" y2={24 - 9.8} stroke={markerInk} strokeWidth="1.2" strokeLinecap="round" />
              </g>
            );
          }
          return (
            <g key={i}>
              <line {...tick(9.8, 12.9, i * 30)} stroke={markerInk} strokeWidth="1.3" strokeLinecap="round" />
              {/* The polished facet catching the light */}
              <line {...tick(10.1, 12.6, i * 30)} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="0.35" strokeLinecap="round" />
            </g>
          );
        })
      ) : (
        Array.from({ length: 12 }, (_, i) => {
          const deg = i * 30;
          if (i === 0) {
            // The inverted triangle at 12
            return (
              <path
                key={i}
                d={`M22,${24 - 13} L26,${24 - 13} L24,${24 - 9.6} Z`}
                fill={markerFill}
                stroke={markerInk}
                strokeWidth="0.4"
                strokeLinejoin="round"
              />
            );
          }
          if (batons.includes(deg)) {
            return <line key={i} {...tick(9.9, 12.9, deg)} stroke={markerInk} strokeWidth="1.9" strokeLinecap="round" />;
          }
          const [x, y] = point(11.4, deg);
          return <circle key={i} cx={x} cy={y} r="1.35" fill={markerFill} stroke={markerInk} strokeWidth="0.4" />;
        })
      )}
      {model === "datejust" ? (
        <>
          <rect x={lefty ? 11.6 : 32.2} y="22.2" width="4.2" height="3.6" rx="0.4" fill="#F4F4F0" stroke={markerInk} strokeOpacity="0.7" strokeWidth="0.35" />
          {/* The cyclops lens over the date */}
          <circle cx={lefty ? 13.7 : 34.3} cy="24" r="3.1" fill="#FFFFFF" fillOpacity="0.07" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="0.3" />
        </>
      ) : null}

      {/* Hands, in the metal they are made of, lume down the centre */}
      <line x1="24" y1="24" {...{ x2: point(8, 300)[0], y2: point(8, 300)[1] }} stroke={handInk} strokeWidth="2.1" strokeLinecap="round" />
      <line x1="24" y1="24" {...{ x2: point(12.4, 60)[0], y2: point(12.4, 60)[1] }} stroke={handInk} strokeWidth="1.5" strokeLinecap="round" />
      {!lightDial ? (
        <>
          <line {...tick(2.4, 7.2, 300)} stroke={LUME} strokeWidth="0.9" strokeLinecap="round" />
          <line {...tick(2.6, 11.6, 60)} stroke={LUME} strokeWidth="0.6" strokeLinecap="round" />
        </>
      ) : null}
      {sports ? (
        // The ring near the tip of the Mercedes hour hand
        <circle cx={point(5.4, 300)[0]} cy={point(5.4, 300)[1]} r="1.25" fill={lightDial ? dialInk : LUME} stroke={handInk} strokeWidth="0.5" />
      ) : null}
      <line
        x1={point(3, 20)[0]}
        y1={point(3, 20)[1]}
        x2={point(13.2, 200)[0]}
        y2={point(13.2, 200)[1]}
        stroke={seconds ? (seconds === "red" ? "#C8332D" : seconds) : handInk}
        strokeWidth="0.45"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="1.3" fill={handInk} />

      {/* The crystal, catching the light across its upper left, with one
          bright point of glare */}
      <path
        d={`M${point(13.6, 250).join(",")} A13.6,13.6 0 0 1 ${point(13.6, 342).join(",")} L${point(11.2, 336).join(",")} A11.2,11.2 0 0 0 ${point(11.2, 256).join(",")} Z`}
        fill={`url(#${id}-g)`}
      />
      <ellipse cx="17.6" cy="16.2" rx="1.5" ry="0.7" transform="rotate(-42 17.6 16.2)" fill="#FFFFFF" fillOpacity="0.55" />
    </svg>
  );
}

/** Polished metal in any colour, lit from the upper left. */
function Polish({ id, ink }: { id: string; ink: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={shade(ink, 0.55)} />
      <stop offset="0.3" stopColor={shade(ink, 0.12)} />
      <stop offset="0.55" stopColor={shade(ink, -0.18)} />
      <stop offset="0.78" stopColor={ink} />
      <stop offset="1" stopColor={shade(ink, 0.3)} />
    </linearGradient>
  );
}

/** Glossy ceramic: darker than metal, with a single bright band. */
function Gloss({ id, ink }: { id: string; ink: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={shade(ink, 0.35)} />
      <stop offset="0.45" stopColor={ink} />
      <stop offset="1" stopColor={shade(ink, -0.35)} />
    </linearGradient>
  );
}

/**
 * Roughly when a reference was sold, read off the number itself: five digits
 * are the old guard, 114/116 the middle generation, 124/126 the current one.
 * Coarse on purpose — an owner knows the decade they bought it, not the year,
 * and within a family that is all we need to tell two look-alikes apart.
 */
export function era(ref: string): string {
  const n = ref.replace(/[^0-9]/g, "");
  if (n.startsWith("124") || n.startsWith("126")) return "2020 onward";
  if (n.startsWith("114") || n.startsWith("116")) return "2000s and 2010s";
  return "1990s and 2000s";
}

/** "Steel, black bezel": what the watch is, in words an owner would use. */
export function describeLook(look: Look): string {
  return `${METAL_WORDS[look.metal] ?? "Steel"}, ${BEZEL_WORDS[look.bezel] ?? "black bezel"}`;
}

/** The small print under a look: era, nickname, anything unusual. */
export function lookDetail(look: Look): string {
  return [era(look.ref), look.nickname, look.detail].filter(Boolean).join(" · ");
}

/** "Steel and gold, fluted bezel": a Datejust in an owner's words. */
export function describeDatejust(look: DatejustLook): string {
  // The white gold is the bezel itself, so it is said once, with the bezel.
  if (look.metal === "white-rolesor") return `Steel, ${look.bezel} white gold bezel`;
  return `${METAL_WORDS[look.metal] ?? "Steel"}, ${BEZEL_WORDS[look.bezel]}`;
}

/** "Champagne dial · 36mm": the rest of what tells two apart. */
export function datejustDetail(look: DatejustLook): string {
  const dial = DIAL_WORDS[look.dial] ?? `${look.dial} dial`;
  const sized = look.sizes && look.sizes.length === 1 ? `${look.sizes[0]}mm` : null;
  return [dial.charAt(0).toUpperCase() + dial.slice(1), look.nickname, sized].filter(Boolean).join(" · ");
}

/** What the studio reads on the order: "Datejust 41, steel and gold, fluted bezel, champagne dial". */
export function datejustNote(look: DatejustLook, label: string): string {
  const dial = DIAL_WORDS[look.dial] ?? `${look.dial} dial`;
  return `${label}, ${describeDatejust(look).toLowerCase()}, ${dial}`;
}
