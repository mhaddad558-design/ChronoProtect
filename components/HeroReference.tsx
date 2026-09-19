"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { describeFamily, findFitment, suggestReferences } from "@/lib/fitment";
import { STUDIO_EMAIL } from "@/lib/site";

/**
 * The home page opens on the reference field, because the moment the site
 * recognises the customer's watch is the thing no one else offers. It confirms
 * the watch as they type, then hands over to the configurator at step 2 with
 * the reference already filled in.
 */
export default function HeroReference({ referenceCount }: { referenceCount: number }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const fitment = useMemo(() => findFitment(value), [value]);
  const suggestions = useMemo(
    () => (fitment ? [] : suggestReferences(value, 4)),
    [value, fitment]
  );
  const typed = value.trim();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!typed) return;
    router.push(`/find-your-kit?ref=${encodeURIComponent(typed.toUpperCase())}`);
  }

  let status: React.ReactNode = "On the warranty card, or engraved between the lugs at 12 o'clock.";
  if (fitment) {
    // The bespoke series already says "made to order", so the second sentence
    // says what happens next rather than repeating it.
    status = `${describeFamily(fitment.family)}. ${
      fitment.family.status === "bespoke"
        ? "The studio quotes these individually."
        : "Templates are cut for this reference."
    }`;
  } else if (typed.length >= 5 && suggestions.length === 0) {
    status = (
      <>
        Not in the catalog. Check the number, or{" "}
        <a href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(`Fit guide for ${typed.toUpperCase()}`)}`}>
          request a fit guide
        </a>
        .
      </>
    );
  }

  return (
    <form className="cp-heroref" onSubmit={submit}>
      <label htmlFor="hero-reference" className="cp-heroref__label">
        Your watch's reference number
      </label>
      <div className="cp-heroref__row">
        <input
          id="hero-reference"
          className="cp-heroref__input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="126610LN"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="hero-reference-status"
        />
        <button type="submit" className="cp-btn">
          Find your kit
        </button>
      </div>

      <p id="hero-reference-status" className="cp-heroref__status" aria-live="polite">
        {status}
      </p>

      {suggestions.length > 0 ? (
        <ul className="cp-heroref__suggestions" aria-label="Matching references">
          {suggestions.map((ref) => (
            <li key={ref}>
              <button type="button" onClick={() => setValue(ref)}>
                {ref}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="cp-heroref__browse">
        <Link href="/catalog">Browse all {referenceCount} references</Link>
      </p>
    </form>
  );
}
