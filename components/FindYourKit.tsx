"use client";

import { useMemo, useState } from "react";
import { createKitCheckout, type Coverage, type Finish, type KitSelection } from "@/lib/shopify/cart";
import { findFitment, suggestReferences } from "@/lib/fitment";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
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

export default function FindYourKit() {
  const [step, setStep] = useState<Step>(1);
  const [reference, setReference] = useState("");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fitment = useMemo(() => findFitment(reference), [reference]);
  const suggestions = useMemo(
    () => (fitment ? [] : suggestReferences(reference)),
    [reference, fitment]
  );

  function back() {
    setError(null);
    setStep((s) => (Math.max(1, s - 1) as Step));
  }

  function submitReference(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim()) return;
    setStep(2);
  }

  async function goToCheckout() {
    if (!finish || !coverage || !application) return;

    setSubmitting(true);
    setError(null);
    try {
      const selection: KitSelection = {
        reference: reference.trim(),
        model: fitment ? `${fitment.family.model}${fitment.family.series ? ` (${fitment.family.series})` : ""}` : undefined,
        usage: usage ? USAGE_LABELS[usage] : undefined,
        finish,
        coverage,
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
          {step <= 5 ? `Step ${step} of 5` : "Your recommendation"}
        </span>
        {step > 1 && step < 6 && (
          <button type="button" onClick={back} className="cp-kit__back">
            Back
          </button>
        )}
        <div className="cp-kit__bar" aria-hidden="true">
          <div style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }} />
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
                {fitment.family.model}
                {fitment.family.series ? ` — ${fitment.family.series}` : ""}. Templates are cut for
                this reference.
              </p>
            )}

            <button type="submit">Continue</button>
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
            { value: "Matte", title: "Matte", detail: "A softened, low-glare surface that mutes reflections." },
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
          options={[
            { value: "chronoshield", title: "Case to clasp — ChronoShield+", detail: "Case, bezel, full bracelet, and clasp. Total coverage for daily wear." },
            { value: "chronoguard", title: "Case and clasp — ChronoGuard+", detail: "The two points of contact that take the brunt of wear. No bracelet coverage." },
          ]}
          selected={coverage}
          onSelect={(v) => {
            setCoverage(v as Coverage);
            setStep(5);
          }}
        />
      )}

      {step === 5 && (
        <Choice
          heading="How would you like it applied?"
          options={[
            { value: "self", title: "I'll apply it myself", detail: "Your kit arrives pre-cut and ready to apply at home." },
            { value: "professional", title: "Studio installation", detail: "A ChronoProtect+ studio partner fits it for you. Added as a separate line." },
          ]}
          selected={application}
          onSelect={(v) => {
            setApplication(v as Application);
            setStep(6);
          }}
        />
      )}

      {step === 6 && coverage && finish && application && (
        <section className="cp-kit__result">
          <h1>{COVERAGE_LABELS[coverage]}</h1>
          <p>
            {coverage === "chronoshield" ? "Whole-watch protection" : "Case and clasp protection"}
          </p>

          <dl>
            <Row label="Reference" value={reference.toUpperCase()} />
            {fitment && <Row label="Model" value={fitment.family.model} />}
            {usage && <Row label="Wear pattern" value={USAGE_LABELS[usage]} />}
            <Row label="Finish" value={finish} />
            <Row label="Coverage" value={COVERAGE_LABELS[coverage]} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="cp-kit__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Choice({
  heading,
  options,
  selected,
  onSelect,
}: {
  heading: string;
  options: Array<{ value: string; title: string; detail: string }>;
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <section>
      <h1>{heading}</h1>
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
