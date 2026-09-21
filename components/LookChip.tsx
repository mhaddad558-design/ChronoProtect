"use client";

import type { Look } from "@/lib/looks";
import type { WatchModel } from "./WatchDiagram";

export const ERA_ORDER = ["2020 onward", "2000s and 2010s", "1990s and 2000s"];

/** Metals, in the order an owner scans a tray: steel first, then gold. */
export const METAL_ORDER = ["steel", "two-tone", "everose-steel", "yellow", "everose", "white", "platinum"];

export const METAL_WORDS: Record<string, string> = {
  steel: "Steel",
  "two-tone": "Steel and gold",
  "everose-steel": "Steel and rose gold",
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
};

/** The colours are the watches' own, not the brand's. */
const METAL_INK: Record<string, string> = {
  steel: "#C7CCCF",
  "two-tone": "#C7CCCF",
  "everose-steel": "#C7CCCF",
  yellow: "#D4AC58",
  everose: "#D09A84",
  white: "#CFD4D7",
  platinum: "#DCE0E3",
};

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
  engraved: ["", ""],
  diamond: ["", ""],
};

const DIAL_INK: Record<string, string> = {
  black: "#14180F",
  blue: "#16305A",
  green: "#12341F",
  ice: "#9FB6BE",
};

/** Gold cases carry gold hands and gold surrounds; steel carries white. */
const goldish = (metal: string) => metal === "yellow" || metal === "everose" || metal === "two-tone" || metal === "everose-steel";

/**
 * A thumbnail of the watch as it reads at arm's length: the metal of the case,
 * the bezel and its markings, the colour of the dial, and hands and markers in
 * the metal they are made of. Two-colour bezels split at 12 and 6 the way the
 * real inserts do, and a two-tone case splits the same way.
 */
export default function LookChip({
  metal,
  bezel,
  dial = "black",
  model,
  strap = false,
  lefty = false,
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
  id: string;
}) {
  const twoToneCase = metal === "two-tone" || metal === "everose-steel";
  const gold = metal === "everose-steel" ? METAL_INK.everose : METAL_INK.yellow;
  const [left, right] = BEZEL_INK[bezel] ?? BEZEL_INK.black;
  const plain = bezel === "engraved" || bezel === "diamond";
  const caseInk = METAL_INK[metal] ?? METAL_INK.steel;
  const handInk = goldish(metal) ? (metal === "everose" || metal === "everose-steel" ? METAL_INK.everose : METAL_INK.yellow) : "#EEF2F4";
  const markerInk = handInk;
  const dialInk = DIAL_INK[dial] ?? DIAL_INK.black;
  // Rounded, because the server and the browser disagree in the last digit of
  // a sine, and a mismatched attribute breaks hydration on the catalog page.
  const round = (n: number) => Math.round(n * 100) / 100;
  const point = (r: number, deg: number) => [
    round(24 + Math.sin((deg * Math.PI) / 180) * r),
    round(24 - Math.cos((deg * Math.PI) / 180) * r),
  ];

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

      {/* Bracelet stubs above and below, so the metal is unmistakable: steel
          outers with gold centre links on a two-tone, dark on a rubber strap. */}
      {[0, 38].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="16" height="10" rx="2" fill={strap ? "#2A2E2B" : caseInk} />
          {twoToneCase && !strap ? <rect x="21" y={y} width="6" height="10" fill={gold} /> : null}
        </g>
      ))}

      {/* Case */}
      <circle cx="24" cy="24" r="20" fill={caseInk} />
      {twoToneCase ? <circle cx="24" cy="24" r="20" fill={gold} clipPath={`url(#${id}-r)`} /> : null}
      {/* The crown, on the left when the watch is a destro */}
      <rect
        x={lefty ? 1 : 43}
        y="21"
        width="4"
        height="6"
        rx="1"
        fill={twoToneCase && !lefty ? gold : caseInk}
      />

      {/* Bezel */}
      {plain ? (
        <circle cx="24" cy="24" r="16" fill="none" stroke={caseInk} strokeWidth="8" />
      ) : (
        <>
          <circle cx="24" cy="24" r="16" fill="none" stroke={left} strokeWidth="8" clipPath={`url(#${id}-l)`} />
          <circle cx="24" cy="24" r="16" fill="none" stroke={right} strokeWidth="8" clipPath={`url(#${id}-r)`} />
        </>
      )}

      {/* Bezel markings: the scale on a rotating bezel, numbers on a Daytona's,
          stones on a set one. */}
      {!plain
        ? Array.from({ length: 12 }, (_, i) => {
            const [x1, y1] = point(13.5, i * 30);
            const [x2, y2] = point(19, i * 30);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeOpacity={i === 0 ? 0 : 0.55} strokeWidth="1" />
            );
          })
        : null}
      {!plain ? (
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
      {bezel === "diamond"
        ? Array.from({ length: 12 }, (_, i) => {
            const [x, y] = point(16, i * 30);
            return <circle key={i} cx={x} cy={y} r="2.1" fill="#FFFFFF" />;
          })
        : null}

      {/* Dial */}
      <circle cx="24" cy="24" r="12" fill={dialInk} />

      {/* Markers: plots on a diver, batons on a Datejust, subdials on a Daytona */}
      {model === "daytona"
        ? [90, 210, 330].map((deg) => {
            const [x, y] = point(6, deg);
            return <circle key={deg} cx={x} cy={y} r="2.9" fill="none" stroke={markerInk} strokeOpacity="0.5" strokeWidth="0.8" />;
          })
        : Array.from({ length: 12 }, (_, i) => {
            const [x, y] = point(9.5, i * 30);
            return <circle key={i} cx={x} cy={y} r={i === 0 ? 1.3 : 1} fill={markerInk} fillOpacity="0.85" />;
          })}

      {/* Hands, in the metal they are made of */}
      <line x1="24" y1="24" x2={point(6.5, 300)[0]} y2={point(6.5, 300)[1]} stroke={handInk} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="24" x2={point(9.5, 60)[0]} y2={point(9.5, 60)[1]} stroke={handInk} strokeWidth="1.6" strokeLinecap="round" />
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
