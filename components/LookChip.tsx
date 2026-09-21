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

const BEZEL_INK: Record<string, [string, string]> = {
  black: ["#1C211F", "#1C211F"],
  green: ["#1C5237", "#1C5237"],
  blue: ["#1B3A68", "#1B3A68"],
  brown: ["#4A3227", "#4A3227"],
  "blue-red": ["#1B3A68", "#8E2230"],
  "blue-black": ["#1B3A68", "#1C211F"],
  "grey-black": ["#5A6165", "#1C211F"],
  "brown-black": ["#4A3227", "#1C211F"],
  "green-black": ["#1C5237", "#1C211F"],
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
  const [left, right] = BEZEL_INK[bezel] ?? BEZEL_INK.black;
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

  return (
    <svg viewBox="0 0 48 48" width={48} height={48} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-l`}>
          <rect x="0" y="0" width="24" height="48" />
        </clipPath>
        <clipPath id={`${id}-r`}>
          <rect x="24" y="0" width="24" height="48" />
        </clipPath>
      </defs>

      {/* Bracelet stubs above and below: steel outers with precious centre
          links on a two-tone, dark on a rubber strap. */}
      {[0, 38].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="16" height="10" rx="2" fill={strap ? "#2A2E2B" : caseInk} />
          {centreLinks && !strap ? <rect x="21" y={y} width="6" height="10" fill={centreLinks} /> : null}
        </g>
      ))}

      {/* Case */}
      <circle cx="24" cy="24" r="20" fill={caseInk} />
      {splitCase && accent ? (
        <circle cx="24" cy="24" r="20" fill={accent} clipPath={`url(#${id}-r)`} />
      ) : null}
      {/* The crown, in the precious metal on a two-tone, on the left on a destro */}
      <rect
        x={lefty ? 1 : 43}
        y="21"
        width="4"
        height="6"
        rx="1"
        fill={(splitCase || rolesor) && accent && !lefty ? accent : caseInk}
      />

      {/* Bezel */}
      {metalBezel ? (
        <circle cx="24" cy="24" r="16" fill="none" stroke={bezelMetalInk} strokeWidth="8" />
      ) : (
        <>
          <circle cx="24" cy="24" r="16" fill="none" stroke={left} strokeWidth="8" clipPath={`url(#${id}-l)`} />
          <circle cx="24" cy="24" r="16" fill="none" stroke={right} strokeWidth="8" clipPath={`url(#${id}-r)`} />
        </>
      )}

      {/* Bezel markings: the scale on a rotating bezel, numbers on a Daytona's,
          stones on a set one, ridges on a fluted one. */}
      {!metalBezel
        ? Array.from({ length: 12 }, (_, i) => {
            const [x1, y1] = point(13.5, i * 30);
            const [x2, y2] = point(19, i * 30);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeOpacity={i === 0 ? 0 : 0.55} strokeWidth="1" />
            );
          })
        : null}
      {!metalBezel ? (
        // The pip or triangle at zero, which every dive and travel bezel has
        <circle cx={24} cy={8.5} r="1.7" fill="#FFFFFF" fillOpacity="0.9" />
      ) : null}
      {bezel === "engraved"
        ? Array.from({ length: 20 }, (_, i) => {
            const [x1, y1] = point(13, i * 18);
            const [x2, y2] = point(19.5, i * 18);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0B110D" strokeOpacity="0.5" strokeWidth={i % 5 === 0 ? 1.6 : 0.9} />;
          })
        : null}
      {bezel === "fluted"
        ? Array.from({ length: 36 }, (_, i) => {
            const [x1, y1] = point(12.5, i * 10);
            const [x2, y2] = point(19.8, i * 10);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0B110D" strokeOpacity="0.32" strokeWidth="0.7" />;
          })
        : null}
      {bezel === "diamond"
        ? Array.from({ length: 12 }, (_, i) => {
            const [x, y] = point(16, i * 30);
            return <circle key={i} cx={x} cy={y} r="2.1" fill="#FFFFFF" />;
          })
        : null}

      {/* Dial */}
      <circle cx="24" cy="24" r="12" fill={dialInk} />
      {dial === "mop" ? (
        <>
          <circle cx="21" cy="21" r="6" fill="#D9E6F2" fillOpacity="0.6" />
          <circle cx="27" cy="27" r="5" fill="#F2DCE6" fillOpacity="0.5" />
        </>
      ) : null}

      {/* Markers: subdials on a Daytona, batons and a date on a Datejust, plots
          on the sports models */}
      {model === "daytona"
        ? [90, 210, 330].map((deg) => {
            const [x, y] = point(6, deg);
            return <circle key={deg} cx={x} cy={y} r="2.9" fill="none" stroke={markerInk} strokeOpacity="0.5" strokeWidth="0.8" />;
          })
        : model === "datejust"
          ? Array.from({ length: 12 }, (_, i) => {
              if (i === 3) return null; // the date window takes 3 o'clock
              const [x1, y1] = point(7.8, i * 30);
              const [x2, y2] = point(10.6, i * 30);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={markerInk} strokeWidth={i === 0 ? 1.6 : 1.1} strokeLinecap="round" />;
            })
          : Array.from({ length: 12 }, (_, i) => {
              const [x, y] = point(9.5, i * 30);
              return <circle key={i} cx={x} cy={y} r={i === 0 ? 1.3 : 1} fill={markerInk} fillOpacity="0.85" />;
            })}
      {model === "datejust" ? (
        <rect x={lefty ? 13.2 : 31.2} y="22.4" width="3.6" height="3.2" rx="0.4" fill="#F4F4F0" stroke="#0B110D" strokeOpacity="0.25" strokeWidth="0.3" />
      ) : null}

      {/* Hands, in the metal they are made of */}
      <line x1="24" y1="24" x2={point(6.5, 300)[0]} y2={point(6.5, 300)[1]} stroke={handInk} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="24" x2={point(9.5, 60)[0]} y2={point(9.5, 60)[1]} stroke={handInk} strokeWidth="1.6" strokeLinecap="round" />
      {seconds ? (
        <line
          x1="24"
          y1="24"
          x2={point(11, 200)[0]}
          y2={point(11, 200)[1]}
          stroke={seconds === "red" ? "#C8332D" : seconds}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      ) : null}
      <circle cx="24" cy="24" r="1.2" fill={handInk} />
    </svg>
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
