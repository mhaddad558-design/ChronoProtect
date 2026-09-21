"use client";

import { useEffect, useMemo, useState } from "react";
import looksData from "@/data/looks.json";
import { findFitment } from "@/lib/fitment";
import SpecialRequest from "./SpecialRequest";
import WatchDiagram, { MODEL_NAMES, modelForFamily, type WatchModel } from "./WatchDiagram";

type Look = {
  ref: string;
  metal: string;
  bezel: string;
  dial?: string;
  nickname?: string;
  detail?: string;
};

const LOOKS = (looksData.looks as Look[]).filter((l) => findFitment(l.ref));

const ERA_ORDER = ["2020 onward", "2000s and 2010s", "1990s and 2000s"];

/** Metals, in the order an owner scans a tray: steel first, then gold. */
const METAL_ORDER = ["steel", "two-tone", "everose-steel", "yellow", "everose", "white", "platinum"];

const METAL_WORDS: Record<string, string> = {
  steel: "Steel",
  "two-tone": "Steel and gold",
  "everose-steel": "Steel and rose gold",
  yellow: "Yellow gold",
  everose: "Rose gold",
  white: "White gold",
  platinum: "Platinum",
};

const BEZEL_WORDS: Record<string, string> = {
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
function LookChip({
  metal,
  bezel,
  dial = "black",
  model,
  strap = false,
  id,
}: {
  metal: string;
  bezel: string;
  dial?: string;
  model: WatchModel;
  /** Rubber rather than metal, so the stubs are drawn dark. */
  strap?: boolean;
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
  const point = (r: number, deg: number) => [
    24 + Math.sin((deg * Math.PI) / 180) * r,
    24 - Math.cos((deg * Math.PI) / 180) * r,
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
      {/* The crown, on the right unless this is the left-handed one */}
      <rect x="43" y="21" width="4" height="6" rx="1" fill={twoToneCase ? gold : caseInk} />

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
function era(ref: string): string {
  const n = ref.replace(/[^0-9]/g, "");
  if (n.startsWith("124") || n.startsWith("126")) return "2020 onward";
  if (n.startsWith("114") || n.startsWith("116")) return "2000s and 2010s";
  return "1990s and 2000s";
}

const MODELS: WatchModel[] = ["submariner", "gmt", "daytona", "datejust"];

function isModel(value: string | null): value is WatchModel {
  return value !== null && (MODELS as string[]).includes(value);
}

function sortLooks(a: Look, b: Look) {
  const m = METAL_ORDER.indexOf(a.metal) - METAL_ORDER.indexOf(b.metal);
  if (m !== 0) return m;
  const e = ERA_ORDER.indexOf(era(a.ref)) - ERA_ORDER.indexOf(era(b.ref));
  return e !== 0 ? e : a.ref.localeCompare(b.ref);
}

/**
 * Picking the watch by sight instead of by number. Two taps: which watch, then
 * which one looks like yours. The reference is still what the studio cuts to,
 * so it travels with the choice — the owner just never has to go and find it.
 */
export default function WatchPicker({
  onPick,
  onTypeInstead,
  initialModel = null,
}: {
  onPick: (reference: string) => void;
  onTypeInstead: () => void;
  /** A model already chosen elsewhere, e.g. on the home page. */
  initialModel?: string | null;
}) {
  const [model, setModel] = useState<WatchModel | null>(
    isModel(initialModel) ? initialModel : null
  );
  /** The way out for anything the catalog does not list. */
  const [asking, setAsking] = useState(false);

  // The model can arrive after mount, when the page reads it from the URL.
  useEffect(() => {
    if (isModel(initialModel)) setModel(initialModel);
  }, [initialModel]);

  const byModel = useMemo(() => {
    const map = new Map<WatchModel, Look[]>();
    for (const look of LOOKS) {
      const fit = findFitment(look.ref);
      if (!fit) continue;
      const m = modelForFamily(fit.family.model);
      const list = map.get(m) ?? [];
      list.push(look);
      map.set(m, list);
    }
    for (const list of map.values()) list.sort(sortLooks);
    return map;
  }, []);

  const models = MODELS.filter((m) => m === "datejust" || byModel.has(m));

  if (asking) {
    return (
      <SpecialRequest
        model={model ? MODEL_NAMES[model] : undefined}
        onBack={() => setAsking(false)}
      />
    );
  }

  if (!model) {
    return (
      <section>
        <h1>Which watch are you protecting?</h1>
        <p>Tap the one you own. No numbers needed.</p>

        <div className="cp-pick__models">
          {models.map((m) => (
            <button key={m} type="button" className="cp-pick__model" onClick={() => setModel(m)}>
              <WatchDiagram line="chronoshield" model={m} id={`pick-${m}`} height={150} />
              <span>{MODEL_NAMES[m]}</span>
            </button>
          ))}
        </div>

        <p className="cp-kit__aside">
          Know the reference number?{" "}
          <button type="button" className="cp-pick__link" onClick={onTypeInstead}>
            Type it instead
          </button>
          . Something else entirely?{" "}
          <button type="button" className="cp-pick__link" onClick={() => setAsking(true)}>
            Ask the studio
          </button>
          .
        </p>
      </section>
    );
  }

  // The Datejust is catalogued by prefix rather than by individual reference,
  // so it asks for the case size instead of showing a wall of look-alikes.
  if (model === "datejust") {
    return (
      <section>
        <h1>Which size is it?</h1>
        <p>
          Measure across the dial, crown not included, or go by feel — the 41 wears noticeably
          larger.
        </p>

        <div className="cp-pick__grid">
          {[
            { ref: "126300", label: "Datejust 41", detail: "41mm, 2016 onward" },
            { ref: "126200", label: "Datejust 36", detail: "36mm, every year" },
          ].map((o) => (
            <button key={o.ref} type="button" className="cp-pick__look" onClick={() => onPick(o.ref)}>
              <LookChip metal="two-tone" bezel="engraved" model="datejust" id={`dj-${o.ref}`} />
              <span className="cp-pick__look-name">{o.label}</span>
              <span className="cp-pick__look-detail">{o.detail}</span>
            </button>
          ))}
        </div>

        <BackLink onClick={() => setModel(null)} />
      </section>
    );
  }

  const looks = byModel.get(model) ?? [];

  return (
    <section>
      <h1>Which one looks like yours?</h1>
      <p>Go by the metal and the colour of the bezel. The exact year does not change the kit.</p>

      <div className="cp-pick__grid">
        {looks.map((look) => (
          <button
            key={look.ref}
            type="button"
            className="cp-pick__look"
            onClick={() => onPick(look.ref)}
          >
            <LookChip
              metal={look.metal}
              bezel={look.bezel}
              dial={look.dial}
              model={model}
              strap={/rubber|strap/i.test(look.detail ?? "")}
              id={`chip-${look.ref}`}
            />
            <span className="cp-pick__look-name">
              {METAL_WORDS[look.metal] ?? "Steel"}, {BEZEL_WORDS[look.bezel] ?? "black bezel"}
            </span>
            <span className="cp-pick__look-detail">
              {[era(look.ref), look.nickname, look.detail].filter(Boolean).join(" · ")}
            </span>
            <span className="cp-pick__look-ref">{look.ref}</span>
          </button>
        ))}

        <button
          type="button"
          className="cp-pick__look cp-pick__look--ask"
          onClick={() => setAsking(true)}
        >
          <span className="cp-pick__ask-mark" aria-hidden="true">
            ?
          </span>
          <span className="cp-pick__look-name">Mine is not here</span>
          <span className="cp-pick__look-detail">
            An unusual metal, a rare reference, something modified
          </span>
        </button>
      </div>

      <BackLink onClick={() => setModel(null)} />
    </section>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <p className="cp-kit__aside">
      <button type="button" className="cp-pick__link" onClick={onClick}>
        Choose a different watch
      </button>
    </p>
  );
}
