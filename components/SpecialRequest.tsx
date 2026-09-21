"use client";

import { useState } from "react";
import { STUDIO_EMAIL } from "@/lib/site";

const METALS = ["Steel", "Steel and gold", "Yellow gold", "Rose gold", "White gold", "Platinum"];
const BEZELS = [
  "Black",
  "Blue",
  "Green",
  "Blue and red",
  "Blue and black",
  "Grey and black",
  "Brown and black",
  "Green and black",
  "Metal, with numbers",
  "Fluted",
  "Diamond-set",
];
const BANDS = ["Oyster", "Jubilee", "President", "Oysterflex or rubber", "Leather", "Something else"];

/**
 * The way out of the catalog. Whatever an owner has — a white gold Sprite, a
 * discontinued reference, something modified — they describe it in their own
 * words and the studio answers. No number required, and nothing here pretends
 * to know whether a kit exists: that is what the studio confirms.
 *
 * It composes an email rather than posting to a server: the studio replies from
 * the same thread, and there is no inbox to build or maintain. If the request
 * volume ever justifies it, the same fields can post to an endpoint instead.
 */
export default function SpecialRequest({
  model,
  onBack,
}: {
  /** What they were looking at when they gave up, if anything. */
  model?: string;
  onBack: () => void;
}) {
  const [watch, setWatch] = useState(model ?? "");
  const [reference, setReference] = useState("");
  const [metal, setMetal] = useState("");
  const [bezel, setBezel] = useState("");
  const [band, setBand] = useState("");
  const [notes, setNotes] = useState("");

  const lines = [
    `Watch: ${watch || "not stated"}`,
    `Reference: ${reference.trim() || "not known"}`,
    `Metal: ${metal || "not stated"}`,
    `Bezel: ${bezel || "not stated"}`,
    `Bracelet or strap: ${band || "not stated"}`,
    "",
    notes.trim() || "(no other details)",
    "",
    "Sent from the ChronoProtect+ special request form.",
  ];

  const subject = `Special request — ${[metal, watch].filter(Boolean).join(" ") || "a watch not in the catalog"}`;
  const href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n")
  )}`;

  return (
    <section>
      <h1>Tell us what you have.</h1>
      <p>
        If your watch is not in the list — an unusual metal, a discontinued reference, something
        modified — describe it here. The studio checks whether a template exists, draws one if it
        does not, and quotes before anything is cut.
      </p>

      <label htmlFor="sr-watch">Which watch is it?</label>
      <input
        id="sr-watch"
        value={watch}
        onChange={(e) => setWatch(e.target.value)}
        placeholder="GMT-Master II"
        autoComplete="off"
      />

      <label htmlFor="sr-metal">What is it made of?</label>
      <select id="sr-metal" value={metal} onChange={(e) => setMetal(e.target.value)}>
        <option value="">Choose</option>
        {METALS.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <label htmlFor="sr-bezel">What does the bezel look like?</label>
      <select id="sr-bezel" value={bezel} onChange={(e) => setBezel(e.target.value)}>
        <option value="">Choose</option>
        {BEZELS.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <label htmlFor="sr-band">What is it on?</label>
      <select id="sr-band" value={band} onChange={(e) => setBand(e.target.value)}>
        <option value="">Choose</option>
        {BANDS.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <label htmlFor="sr-ref">Reference number, if you know it</label>
      <input
        id="sr-ref"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="Optional"
        autoComplete="off"
      />

      <label htmlFor="sr-notes">Anything else we should know?</label>
      <textarea
        id="sr-notes"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Dial colour, condition, whether it has been serviced or modified, how you want it covered."
      />

      <a className="cp-kit__cta" href={href}>
        Send this to the studio
      </a>

      <p className="cp-kit__aside">
        This opens your email with the details filled in, so you can add photographs before sending.
        Photographs help: they settle the reference faster than a number does. Or write to{" "}
        <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a> directly.
      </p>

      <p className="cp-kit__aside">
        <button type="button" className="cp-pick__link" onClick={onBack}>
          Back to the list
        </button>
      </p>
    </section>
  );
}
