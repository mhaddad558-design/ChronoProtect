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
  coverageFor,
  findFitment,
  describeFamily,
  isBespoke,
  suggestReferences,
  type BraceletName,
} from "@/lib/fitment";
import { BRACELETS, STUDIO_EMAIL } from "@/lib/site";

/**
 * Step 5 asks which bracelet, and only ChronoShield+ needs it — ChronoGuard+
 * stops at the clasp and is priced the same whatever the bracelet. So the flow
 * is six questions for ChronoShield+ and five for ChronoGuard+, and step 5 is
 * skipped in both directions.
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const RESULT: Step = 7;
type Usage = "daily" | "occasion" | "rotation";
type Application = "self" | "professional";

const USAGE_LABELS: Record<Usage, string> = {
  daily: "Everyday wear",
  occasion: "Special occasions",
  rotation: "Rotation piece",
};

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

export default function FindYourKit() {
  const [step, setStep] = useState<Step>(1);
  const [reference, setReference] = useState("");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [bracelet, setBracelet] = useState<Bracelet | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!ref) return;
    setReference(ref);
    if (!isBespoke(ref)) setStep(2);
  }, []);

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
      ? `This reference is on ${braceletOptions.join(" or ")}, which ChronoShield+ does not cover. ChronoGuard+ protects the case and clasp and leaves the strap alone.`
      : undefined;

  /**
   * Step 5 only appears when it has something to decide: ChronoGuard+ never
   * needs it, and neither does a reference that came on a single bracelet.
   */
  const needsBracelet = coverage === "chronoshield";
  const asksBracelet = needsBracelet && selectableBracelets.length > 1;
  const totalSteps = asksBracelet ? 6 : 5;

  /** Where a given step sits once the skipped one is removed. */
  function stepNumber(s: Step): number {
    return !asksBracelet && s > 5 ? s - 1 : s;
  }

  function back() {
    setError(null);
    setStep((s) => {
      const previous = s - 1;
      if (previous === 5 && !asksBracelet) return 4;
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
    if (!finish || !coverage || !application) return;
    // ChronoShield+ is cut and priced per bracelet, so it cannot go to checkout
    // without one — whether the customer chose it or the catalog filled it in.
    if (needsBracelet && !bracelet) return;

    setSubmitting(true);
    setError(null);
    try {
      const selection: KitSelection = {
        reference: reference.trim(),
        model: fitment ? `${fitment.family.model}${fitment.family.series ? ` (${fitment.family.series})` : ""}` : undefined,
        usage: usage ? USAGE_LABELS[usage] : undefined,
        finish,
        coverage,
        bracelet: needsBracelet && bracelet ? bracelet : undefined,
        application,
      };
      const checkoutUrl = await createKitCheckout(selection);
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
        <div className="cp-kit__bar" aria-hidden="true">
          <div style={{ width: `${(stepNumber(step) / (totalSteps + 1)) * 100}%` }} />
        </div>
      </header>

      {step === 1 && (
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
          heading="How do you wear it day to day?"
          options={[
            { value: "daily", title: "Everyday wear", detail: "On the wrist for work, travel, and everything in between." },
            { value: "occasion", title: "Special occasions", detail: "Dinners, events, and the moments that call for it." },
            { value: "rotation", title: "Rotation piece", detail: "Worn regularly, but shares wrist time with the collection." },
          ]}
          selected={usage}
          onSelect={(v) => {
            setUsage(v as Usage);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <Choice
          heading="Which finish do you prefer?"
          options={[
            { value: "Gloss", title: "Gloss", detail: "Optically invisible. Reflects light like the polished metal beneath." },
            { value: "Stealth", title: "Stealth", detail: "A deep satin finish that quiets the whole watch." },
          ]}
          selected={finish}
          onSelect={(v) => {
            setFinish(v as Finish);
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <Choice
          heading="How much of the watch do you want protected?"
          note={coverageNote}
          options={COVERAGE_CHOICES.filter((c) => coverageOptions.includes(c.value))}
          selected={coverage}
          onSelect={(v) => {
            const next = v as Coverage;
            setCoverage(next);

            if (next !== "chronoshield") {
              // ChronoGuard+ stops at the clasp. Clear any bracelet picked on an
              // earlier pass so it cannot leak into the order.
              setBracelet(null);
              setStep(6);
              return;
            }
            if (selectableBracelets.length === 1) {
              // The catalog knows this reference came on one bracelet, so fill
              // it in rather than asking a question with a single answer.
              setBracelet(selectableBracelets[0]);
              setStep(6);
              return;
            }
            setStep(5);
          }}
        />
      )}

      {step === 5 && (
        <Choice
          heading="Which bracelet is it on?"
          // Only the bracelets this family was sold on, so a GMT-Master II is
          // never offered a President.
          options={BRACELETS.filter((b) =>
            selectableBracelets.some((name) => name === b.name)
          ).map((b) => ({ value: b.name, title: b.name, detail: b.detail }))}
          selected={bracelet}
          onSelect={(v) => {
            setBracelet(v as Bracelet);
            setStep(6);
          }}
        />
      )}

      {step === 6 && (
        <Choice
          heading="How would you like it applied?"
          options={[
            { value: "self", title: "I'll apply it myself", detail: "Your kit arrives pre-cut and ready to apply at home." },
            { value: "professional", title: "Studio installation", detail: "A ChronoProtect+ studio partner fits it for you. Added as a separate line." },
          ]}
          selected={application}
          onSelect={(v) => {
            setApplication(v as Application);
            setStep(RESULT);
          }}
        />
      )}

      {step === RESULT && coverage && finish && application && (
        <section className="cp-kit__result">
          <h1>{COVERAGE_LABELS[coverage]}</h1>
          <p>
            {coverage === "chronoshield" ? "Whole-watch protection" : "Case and clasp protection"}
          </p>

          <dl>
            <Row label="Reference" value={reference.toUpperCase()} mono />
            {fitment && <Row label="Model" value={fitment.family.model} />}
            {usage && <Row label="Wear pattern" value={USAGE_LABELS[usage]} />}
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
            <Row
              label="Application"
              value={application === "professional" ? "Studio installation" : "Self-applied"}
            />
          </dl>

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
              setStep(1);
              setReference("");
              setUsage(null);
              setFinish(null);
              setCoverage(null);
              setBracelet(null);
              setApplication(null);
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
  options: Array<{ value: string; title: string; detail: string }>;
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
          className="cp-kit__option"
        >
          <span className="cp-kit__option-title">{o.title}</span>
          <span className="cp-kit__option-detail">{o.detail}</span>
        </button>
      ))}
    </section>
  );
}
