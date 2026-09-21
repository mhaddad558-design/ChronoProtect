"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createKitCheckout,
  type Bracelet,
  type Coverage,
  type Finish,
  type KitSelection,
} from "@/lib/shopify/cart";
import {
  braceletsFor,
  braceletWords,
  coverageFor,
  findFitment,
  describeFamily,
  isBespoke,
  suggestReferences,
  type BraceletName,
} from "@/lib/fitment";
import { DATEJUST_LOOKS, DATEJUST_SIZES, isLefty } from "@/lib/looks";
import { datejustNote } from "./LookChip";
import { BRACELETS, STUDIO_EMAIL } from "@/lib/site";
import BraceletLinks from "./BraceletLinks";
import FinishSwatch from "./FinishSwatch";
import BandTexture from "./BandTexture";
import WatchDiagram, { modelForFamily } from "./WatchDiagram";
import WatchPicker from "./WatchPicker";

/**
 * Step 5 asks which bracelet, and only ChronoShield+ needs it — ChronoGuard+
 * stops at the clasp and is priced the same whatever the bracelet. So the flow
 * is six questions for ChronoShield+ and five for ChronoGuard+, and step 5 is
 * skipped in both directions.
 */
type Step = 1 | 2 | 3 | 4 | 5;
const RESULT: Step = 5;
type Application = "self" | "professional";

const COVERAGE_LABELS: Record<Coverage, string> = {
  chronoshield: "ChronoShield+",
  chronoguard: "ChronoGuard+",
};

/**
 * The bracelets that exist as a Shopify variant. The catalog also names straps
 * we do not cut for, such as Oysterflex, and those must never reach a variant
 * lookup — a family on one is ChronoGuard+ only, which has no Bracelet option
 * at all.
 */
const CUTTABLE: Bracelet[] = ["Oyster", "Jubilee", "President"];

function isCuttable(name: BraceletName): name is Bracelet {
  return (CUTTABLE as string[]).includes(name);
}

const COVERAGE_CHOICES: Array<{ value: Coverage; title: string; detail: string }> = [
  {
    value: "chronoshield",
    title: "ChronoShield+",
    detail: "Case, bezel, full bracelet, and clasp. Total coverage for daily wear.",
  },
  {
    value: "chronoguard",
    title: "ChronoGuard+",
    detail: "The two points of contact that take the brunt of wear. No bracelet coverage.",
  },
];

/**
 * Where an unfinished configuration is kept. Someone who leaves halfway —
 * to go and look at the watch, or because the phone rang — comes back to the
 * answers they already gave rather than to question one. Kept for a month,
 * cleared when they start over or reach checkout.
 */
const SAVED_KEY = "chronoprotect.kit.v1";
const SAVED_FOR = 30 * 24 * 60 * 60 * 1000;

type Saved = {
  at: number;
  step: Step;
  reference: string;
  lookNote?: string | null;
  finish: Finish | null;
  coverage: Coverage | null;
  bracelet: Bracelet | null;
  application: Application;
};

function readSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Saved;
    // Nothing worth resuming, or old enough that the watch may have changed.
    if (!saved?.reference || saved.step < 2) return null;
    if (Date.now() - saved.at > SAVED_FOR) return null;
    return saved;
  } catch {
    // Private browsing, blocked storage, or something else wrote the key.
    return null;
  }
}

function clearSaved() {
  try {
    window.localStorage.removeItem(SAVED_KEY);
  } catch {
    // Nothing to do: it was never written.
  }
}

export default function FindYourKit({
  from,
}: {
  /** What each line starts at, so the price is visible from the first screen. */
  from?: { chronoshield: string | null; chronoguard: string | null };
}) {
  const [step, setStep] = useState<Step>(1);
  const [reference, setReference] = useState("");
  /** Step 1 opens on pictures; typing a number is the alternative, not the default. */
  const [entry, setEntry] = useState<"pick" | "type">("pick");
  /** Set when the home page already asked which watch it is. */
  const [pickedModel, setPickedModel] = useState<string | null>(null);
  /** For a watch picked by look rather than number: what it looks like. */
  const [lookNote, setLookNote] = useState<string | null>(null);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [bracelet, setBracelet] = useState<Bracelet | null>(null);
  /** An add-on rather than a question: it is offered on the result screen. */
  const [application, setApplication] = useState<Application>("self");

  /** True when this session was restored, so the header can say so. */
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReference(ref);
      // Arriving with a gem-set reference: land on the quote, not the picker.
      if (isBespoke(ref)) setEntry("type");
      // A Datejust chosen from the catalog arrives with its look.
      const look = DATEJUST_LOOKS.find((l) => l.id === params.get("look"));
      const size = DATEJUST_SIZES.find((s) => s.token === ref);
      if (look && size) setLookNote(datejustNote(look, size.label));
      if (!isBespoke(ref)) setStep(2);
      return;
    }
    // Arriving from the home page's picker: open step one on that watch's
    // look-alikes rather than on the four models again.
    const model = params.get("model");
    if (model) {
      setPickedModel(model);
      return;
    }

    // Otherwise pick up an unfinished configuration, if there is one.
    const saved = readSaved();
    if (!saved) return;
    // A reference that has since moved to studio quotes is not resumed into
    // the kit questions; it opens on the quote instead.
    if (isBespoke(saved.reference)) {
      clearSaved();
      setReference(saved.reference);
      setEntry("type");
      return;
    }
    setReference(saved.reference);
    setLookNote(saved.lookNote ?? null);
    setFinish(saved.finish);
    setCoverage(saved.coverage);
    setBracelet(saved.bracelet);
    setApplication(saved.application ?? "self");
    setStep(saved.step);
    setResumed(true);
  }, []);

  // Keep the answers as they are given, so a tab closed mid-flow loses nothing.
  useEffect(() => {
    if (step < 2 || !reference) return;
    try {
      const saved: Saved = { at: Date.now(), step, reference, lookNote, finish, coverage, bracelet, application };
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch {
      // Storage is unavailable; the flow still works, it just will not resume.
    }
  }, [step, reference, lookNote, finish, coverage, bracelet, application]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fitment = useMemo(() => findFitment(reference), [reference]);
  const suggestions = useMemo(
    () => (fitment ? [] : suggestReferences(reference)),
    [reference, fitment]
  );

  /**
   * Which bracelets this reference could be on. Most families were sold on one,
   * so the catalog settles it and the customer is never asked.
   */
  const braceletOptions = useMemo(() => braceletsFor(reference), [reference]);

  /** Of those, the ones a ChronoShield+ variant actually exists for. */
  const selectableBracelets = useMemo(
    () => braceletOptions.filter(isCuttable),
    [braceletOptions]
  );

  /**
   * Which lines this reference can have. A Daytona on Oysterflex is ChronoGuard+
   * only — no film is cut for that strap, and ChronoShield+ would promise
   * bracelet coverage that cannot be delivered.
   */
  const coverageOptions = useMemo(() => coverageFor(reference), [reference]);

  /** Diamond-paved references are quoted per watch, not sold from here. */
  const bespoke = useMemo(() => isBespoke(reference), [reference]);
  const coverageNote =
    coverageOptions.length === 1 && coverageOptions[0] === "chronoguard"
      ? `This reference is on ${braceletWords(braceletOptions)}, which ChronoShield+ does not cover. ChronoGuard+ protects the case and clasp and leaves the strap alone.`
      : undefined;


  /**
   * A Datejust is catalogued by prefix, so picking one by sight identifies the
   * family rather than a single reference. The studio confirms the exact number
   * from the photographs before cutting, and the order says so.
   */
  const identifiedOnly = reference.trim().endsWith("-");
  const orderReference =
    identifiedOnly && fitment
      ? `${fitment.family.model} — reference to confirm${lookNote ? ` (${lookNote})` : ""}`
      : reference.trim();

  /**
   * Step 5 only appears when it has something to decide: ChronoGuard+ never
   * needs it, and neither does a reference that came on a single bracelet.
   */
  const needsBracelet = coverage === "chronoshield";
  const asksBracelet = needsBracelet && selectableBracelets.length > 1;
  const totalSteps = asksBracelet ? 4 : 3;

  /** Where a given step sits once the skipped one is removed. */
  function stepNumber(s: Step): number {
    return s;
  }

  function back() {
    setError(null);
    setStep((s) => {
      const previous = s - 1;
      if (previous === 4 && !asksBracelet) return 3;
      return Math.max(1, previous) as Step;
    });
  }

  function submitReference(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim()) return;
    // Belt and braces: the submit button is replaced by the enquiry link for a
    // bespoke reference, so this should be unreachable.
    if (bespoke) return;
    setStep(2);
  }

  async function goToCheckout() {
    if (!finish || !coverage) return;
    // A gem-set reference is quoted per watch; it must never reach a cart,
    // however it got this far (an old resumed session, a hand-edited URL).
    if (isBespoke(reference)) return;
    // ChronoShield+ is cut and priced per bracelet, so it cannot go to checkout
    // without one — whether the customer chose it or the catalog filled it in.
    if (needsBracelet && !bracelet) return;

    setSubmitting(true);
    setError(null);
    try {
      const selection: KitSelection = {
        reference: orderReference,
        model: fitment ? `${fitment.family.model}${fitment.family.series ? ` (${fitment.family.series})` : ""}` : undefined,
        finish,
        coverage,
        bracelet: needsBracelet && bracelet ? bracelet : undefined,
        application,
      };
      const checkoutUrl = await createKitCheckout(selection);
      // The configuration is now a cart: there is nothing left to resume.
      clearSaved();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Checkout could not be started. Try again, or contact the studio."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="cp-kit">
      {/* Engraved line work behind the questions. No crest here: the header
          already carries one, and two of them read as a mistake. */}
      <BandTexture kind="engine" id="kit-bg" />
      <header className="cp-kit__progress">
        <span className="cp-kit__step">
          {step < RESULT
            ? `Step ${stepNumber(step)} of ${totalSteps}`
            : "Your recommendation"}
        </span>
        {step > 1 && step < RESULT && (
          <button type="button" onClick={back} className="cp-kit__back">
            Back
          </button>
        )}
        {step < RESULT && (
          <PriceLine from={from} coverage={coverage} />
        )}
        {resumed && step < RESULT && (
          <p className="cp-kit__resumed">
            Picked up where you left off.{" "}
            <button
              type="button"
              onClick={() => {
                clearSaved();
                setResumed(false);
                setStep(1);
                setLookNote(null);
                setReference("");
                setFinish(null);
                setCoverage(null);
                setBracelet(null);
                setApplication("self");
              }}
            >
              Start fresh
            </button>
          </p>
        )}
        <div className="cp-kit__bar" aria-hidden="true">
          <div style={{ width: `${(stepNumber(step) / (totalSteps + 1)) * 100}%` }} />
        </div>
      </header>

      {step === 1 && entry === "pick" && (
        <WatchPicker
          initialModel={pickedModel}
          onPick={(ref, note) => {
            setReference(ref);
            setLookNote(note ?? null);
            // A gem-set watch is quoted by the studio, not sold as a kit: show
            // the quote rather than walking into questions that end at a cart.
            if (isBespoke(ref)) {
              setEntry("type");
              return;
            }
            setStep(2);
          }}
          onTypeInstead={() => setEntry("type")}
        />
      )}

      {step === 1 && entry === "type" && (
        <section>
          <h1>Which watch are you protecting?</h1>
          <p>Enter the reference number so we can check it against the fitment catalog.</p>
          <form onSubmit={submitReference}>
            <label htmlFor="reference">Reference number</label>
            <input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="126610LN"
              autoComplete="off"
              required
            />

            {suggestions.length > 0 && (
              <ul className="cp-kit__suggestions">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => setReference(s)}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {fitment && (
              <p className="cp-kit__confirm">
                {describeFamily(fitment.family)}.
                {/* A bespoke reference gets the fuller note below instead. */}
                {bespoke ? null : " Templates are cut for this reference."}
              </p>
            )}

            {/*
              Diamond-paved pieces are quoted per watch — the stone setting
              changes the template — so the flow stops here and hands over to the
              studio rather than walking the customer through five questions that
              cannot end in a checkout.
            */}
            {bespoke ? (
              <>
                <p className="cp-kit__note" style={{ marginTop: "1.5rem" }}>
                  The setting on this reference changes the cut, so the studio
                  measures and quotes it individually rather than shipping a stock kit.
                </p>
                <a
                  className="cp-kit__cta"
                  href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
                    `ChronoProtect+ bespoke enquiry — ${reference.trim().toUpperCase()}`
                  )}`}
                >
                  Request a bespoke quote
                </a>
              </>
            ) : (
              <button type="submit">Continue</button>
            )}
          </form>
          <p className="cp-kit__aside">
            <button type="button" className="cp-pick__link" onClick={() => setEntry("pick")}>
              Pick it from pictures instead
            </button>
          </p>
          <p className="cp-kit__aside">
            Reference not listed? <a href="/catalog">Search the fitment catalog</a> or{" "}
            <a href="mailto:chronoshield@polsia.app?subject=ChronoShield%2B%20fit%20guide">
              request a fit guide
            </a>
            .
          </p>
        </section>
      )}

      {step === 2 && (
        <Choice
          heading="How much of the watch do you want protected?"
          note={coverageNote}
          options={COVERAGE_CHOICES.filter((c) => coverageOptions.includes(c.value)).map((c) => ({
            ...c,
            visual: (
              <WatchDiagram
                line={c.value}
                model={fitment ? modelForFamily(fitment.family.model) : undefined}
                bracelet={selectableBracelets.length === 1 ? selectableBracelets[0] : undefined}
                lefty={isLefty(reference)}
                id={`kit-step-${c.value}`}
                height={112}
              />
            ),
          }))}
          selected={coverage}
          onSelect={(v) => {
            const next = v as Coverage;
            setCoverage(next);

            if (next !== "chronoshield") {
              // ChronoGuard+ stops at the clasp. Clear any bracelet picked on an
              // earlier pass so it cannot leak into the order.
              setBracelet(null);
            } else if (selectableBracelets.length === 1) {
              // The catalog knows this reference came on one bracelet, so fill
              // it in rather than asking a question with a single answer.
              setBracelet(selectableBracelets[0]);
            }
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <Choice
          heading="Which finish do you prefer?"
          options={[
            { value: "Gloss", title: "Gloss", detail: "Optically invisible. Reflects light like the polished metal beneath.", visual: <FinishSwatch finish="Gloss" id="kit-step-gloss" size={60} /> },
            { value: "Stealth", title: "Stealth", detail: "A deep satin finish that quiets the whole watch.", visual: <FinishSwatch finish="Stealth" id="kit-step-stealth" size={60} /> },
          ]}
          selected={finish}
          onSelect={(v) => {
            setFinish(v as Finish);
            // The bracelet only gets asked when it actually decides something.
            setStep(coverage === "chronoshield" && selectableBracelets.length > 1 ? 4 : RESULT);
          }}
        />
      )}

      {step === 4 && (
        <Choice
          heading="Which bracelet is it on?"
          // Only the bracelets this family was sold on, so a GMT-Master II is
          // never offered a President.
          options={BRACELETS.filter((b) =>
            selectableBracelets.some((name) => name === b.name)
          ).map((b) => ({
            value: b.name,
            title: b.name,
            detail: b.detail,
            visual: <BraceletLinks kind={b.name} height={42} />,
          }))}
          selected={bracelet}
          onSelect={(v) => {
            setBracelet(v as Bracelet);
            setStep(RESULT);
          }}
        />
      )}

      {step === RESULT && coverage && finish && (
        <section className="cp-kit__result">
          <h1>{COVERAGE_LABELS[coverage]}</h1>
          <p>
            {coverage === "chronoshield" ? "Whole-watch protection" : "Case and clasp protection"}
          </p>

          <dl>
            {identifiedOnly ? (
              <Row label="Watch" value={lookNote ?? (fitment ? fitment.family.model : "Identified from pictures")} />
            ) : (
              <Row label="Reference" value={reference.toUpperCase()} mono />
            )}
            {fitment && <Row label="Model" value={fitment.family.model} />}
            <Row label="Finish" value={finish} />
            <Row label="Coverage" value={COVERAGE_LABELS[coverage]} />
            {/*
              Shown even when the catalog filled it in, so a customer on a
              swapped bracelet can see the assumption and correct us.
            */}
            {needsBracelet && bracelet && (
              <Row
                label="Bracelet"
                value={asksBracelet ? bracelet : `${bracelet}, from your reference`}
              />
            )}
          </dl>

          {/* An add-on, offered rather than asked: the kit is the same either
              way, and the studio line is added at checkout. */}
          <fieldset className="cp-kit__addon">
            <legend>How would you like it applied?</legend>
            {[
              { value: "self", title: "I'll apply it myself", detail: "Arrives pre-cut and ready for a careful hour at home." },
              { value: "professional", title: "Studio installation", detail: "A studio partner fits it. Added as a separate line." },
            ].map((o) => (
              <label key={o.value} className="cp-kit__addon-option">
                <input
                  type="radio"
                  name="application"
                  value={o.value}
                  checked={application === o.value}
                  onChange={() => setApplication(o.value as Application)}
                />
                <span>
                  <strong>{o.title}</strong>
                  <em>{o.detail}</em>
                </span>
              </label>
            ))}
          </fieldset>

          {error && (
            <p role="alert" className="cp-kit__error">
              {error}
            </p>
          )}

          <button type="button" onClick={goToCheckout} disabled={submitting}>
            {submitting ? "Preparing checkout…" : "Add to cart and check out"}
          </button>

          <button
            type="button"
            className="cp-kit__restart"
            onClick={() => {
              clearSaved();
              setResumed(false);
              setStep(1);
              setLookNote(null);
              setReference("");
              setFinish(null);
              setCoverage(null);
              setBracelet(null);
              setApplication("self");
              setError(null);
            }}
          >
            Start over
          </button>
        </section>
      )}
    </div>
  );
}

/**
 * What it costs, from the first screen on. Always "from": ChronoShield+ is cut
 * and priced per bracelet, so a single figure would be read as the final one.
 */
function PriceLine({
  from,
  coverage,
}: {
  from?: { chronoshield: string | null; chronoguard: string | null };
  coverage: Coverage | null;
}) {
  if (!from) return null;

  if (coverage === "chronoguard") {
    return from.chronoguard ? (
      <p className="cp-kit__price">ChronoGuard+, {from.chronoguard}. One price, whatever it is on.</p>
    ) : null;
  }
  if (coverage === "chronoshield") {
    return from.chronoshield ? (
      <p className="cp-kit__price">
        ChronoShield+, from {from.chronoshield}. The bracelet decides the rest.
      </p>
    ) : null;
  }

  const both = [from.chronoguard, from.chronoshield].filter(Boolean) as string[];
  if (both.length === 0) return null;
  return (
    <p className="cp-kit__price">
      Kits from {both[0]}. What you pay depends on coverage and bracelet.
    </p>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="cp-kit__row">
      <dt>{label}</dt>
      <dd className={mono ? "cp-kit__ref" : undefined}>{value}</dd>
    </div>
  );
}

function Choice({
  heading,
  note,
  options,
  selected,
  onSelect,
}: {
  heading: string;
  /** Shown above the options when the catalog has narrowed them. */
  note?: string;
  /** An optional picture shown beside the words: a finish, coverage or bracelet. */
  options: Array<{ value: string; title: string; detail: string; visual?: React.ReactNode }>;
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <section>
      <h1>{heading}</h1>
      {note ? <p className="cp-kit__note">{note}</p> : null}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          aria-pressed={selected === o.value}
          className={o.visual ? "cp-kit__option cp-kit__option--visual" : "cp-kit__option"}
        >
          {o.visual ? (
            <>
              <span className="cp-kit__option-visual" aria-hidden="true">
                {o.visual}
              </span>
              <span>
                <span className="cp-kit__option-title">{o.title}</span>
                <span className="cp-kit__option-detail">{o.detail}</span>
              </span>
            </>
          ) : (
            <>
              <span className="cp-kit__option-title">{o.title}</span>
              <span className="cp-kit__option-detail">{o.detail}</span>
            </>
          )}
        </button>
      ))}
    </section>
  );
}
