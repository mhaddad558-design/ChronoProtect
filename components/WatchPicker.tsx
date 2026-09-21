"use client";

import { useEffect, useMemo, useState } from "react";
import { LOOKS as ALL_LOOKS, type Look } from "@/lib/looks";
import { findFitment } from "@/lib/fitment";
import LookChip, { ERA_ORDER, METAL_ORDER, describeLook, era, lookDetail } from "./LookChip";
import SpecialRequest from "./SpecialRequest";
import WatchDiagram, { MODEL_NAMES, modelForFamily, type WatchModel } from "./WatchDiagram";

const LOOKS = ALL_LOOKS.filter((l) => findFitment(l.ref));

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
              lefty={look.lefty}
              id={`chip-${look.ref}`}
            />
            <span className="cp-pick__look-name">{describeLook(look)}</span>
            <span className="cp-pick__look-detail">{lookDetail(look)}</span>
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
