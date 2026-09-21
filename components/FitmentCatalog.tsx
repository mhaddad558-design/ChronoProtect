"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allFamilies, braceletWords, type FitmentFamily } from "@/lib/fitment";
import { DATEJUST_LOOKS, DATEJUST_SIZES, lookFor } from "@/lib/looks";
import { STUDIO_EMAIL } from "@/lib/site";
import LookChip, { datejustDetail, describeDatejust, describeLook, lookDetail } from "./LookChip";
import WatchDiagram, { modelForFamily } from "./WatchDiagram";

function normalize(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

/**
 * The fitment catalog, filtered client-side.
 *
 * Prefix families (the Datejusts) are shown as the stored prefix with a note,
 * because Rolex appends dial and bezel digits per configuration and listing
 * every combination would be noise.
 */
export default function FitmentCatalog() {
  const families = allFamilies();
  const [query, setQuery] = useState("");

  const normalized = normalize(query);

  const results = useMemo(() => {
    if (!normalized) return families;

    return families
      .map((family) => {
        const modelHit = normalize(`${family.model}${family.series ?? ""}`).includes(normalized);
        const refs = family.references.filter((ref) => {
          const stored = normalize(ref);
          return family.matchType === "prefix"
            ? stored.startsWith(normalized) || normalized.startsWith(stored)
            : stored.includes(normalized);
        });

        if (refs.length > 0) return { ...family, references: refs };
        if (modelHit) return family;
        return null;
      })
      .filter((family): family is FitmentFamily => family !== null);
  }, [families, normalized]);

  const shown = results.reduce((total, family) => total + family.references.length, 0);

  return (
    <>
      <label htmlFor="catalog-search" className="cp-eyebrow" style={{ marginBottom: 0 }}>
        Search by reference or model
      </label>
      <input
        id="catalog-search"
        className="cp-cat__search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="126610LN, Daytona, GMT"
        autoComplete="off"
        type="search"
      />
      <p className="cp-cat__count">
        {shown} {shown === 1 ? "reference" : "references"}
        {normalized ? " matching" : " in the catalog"}
      </p>

      <div style={{ marginTop: "3rem" }}>
        {results.map((family) => (
          <section className="cp-cat__family" key={`${family.model}-${family.series ?? "base"}`}>
            <div className="cp-cat__head">
              <WatchDiagram
                line="chronoshield"
                model={modelForFamily(family.model)}
                id={`cat-${normalize(family.model + (family.series ?? ""))}`}
                height={110}
              />
              <div>
                <h3>{family.model}</h3>
                {family.series ? <p className="cp-cat__series">{family.series}</p> : null}
              </div>
            </div>
            {/*
              Only called out when the family is restricted — saying "both lines"
              on every other row would be noise.
            */}
            {family.status === "bespoke" ? (
              <p className="cp-cat__only">
                <span className="cp-dot" />
                Cut to order and quoted per watch
              </p>
            ) : family.coverage.length === 1 ? (
              <p className="cp-cat__only">
                <span className="cp-dot" />
                {family.coverage[0] === "chronoguard" ? "ChronoGuard+ only" : "ChronoShield+ only"}
                {family.bracelets?.length ? `, on ${braceletWords(family.bracelets)}` : ""}
              </p>
            ) : null}

            <ul className={family.matchType === "prefix" ? "cp-cat__refs" : "cp-cat__looks"}>
              {family.references.map((ref) => {
                const prefix = family.matchType === "prefix";
                const look = prefix ? undefined : lookFor(ref);
                const model = modelForFamily(family.model);

                // Prefix families are ranges, not watches: they stay as numbers.
                if (prefix || !look) {
                  return (
                    <li key={ref}>
                      <Reference value={ref} query={normalized} prefix={prefix} />
                    </li>
                  );
                }

                // A bespoke reference is quoted, not configured, so it has
                // nowhere to link to but the studio.
                const href =
                  family.status === "bespoke"
                    ? `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(`ChronoProtect+ bespoke enquiry — ${ref}`)}`
                    : `/find-your-kit?ref=${encodeURIComponent(ref)}`;

                return (
                  <li key={ref}>
                    <a className="cp-cat__look" href={href}>
                      <LookChip
                        metal={look.metal}
                        bezel={look.bezel}
                        dial={look.dial}
                        model={model}
                        strap={/rubber|strap/i.test(look.detail ?? "")}
                        lefty={look.lefty}
                        seconds={look.seconds}
                        id={`cat-chip-${ref}`}
                      />
                      <span className="cp-cat__look-name">{describeLook(look)}</span>
                      <span className="cp-cat__look-detail">{lookDetail(look)}</span>
                      <span className="cp-cat__look-ref">
                        <Reference value={ref} query={normalized} prefix={false} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* The Datejust has no single look per number, so it shows the looks
                owners actually wear, each one a way into the configurator. */}
            {family.matchType === "prefix" && !normalized ? (
              <DatejustLooks family={family} />
            ) : null}

            {family.matchType === "prefix" ? (
              <p className="cp-cat__prefix">
                Matched on the leading digits. Rolex appends dial and bezel digits per
                configuration, so any reference starting with one of these is covered.
              </p>
            ) : null}
          </section>
        ))}

        {results.length === 0 ? (
          <div className="cp-cat__empty">
            <p>
              Nothing in the catalog matches that yet. Templates are added as the studio approves
              new fitment.
            </p>
            <p>
              <a
                href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
                  `ChronoProtect+ fit guide — ${query}`
                )}`}
              >
                Request a fit guide for {query.trim() || "your reference"}
              </a>{" "}
              or <Link href="/find-your-kit">start the configurator anyway</Link>.
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}

function DatejustLooks({ family }: { family: FitmentFamily }) {
  const size = DATEJUST_SIZES.find((s) => family.references.some((ref) => ref === s.token));
  if (!size) return null;
  const looks = DATEJUST_LOOKS.filter((l) => !l.sizes || l.sizes.includes(size.size));

  return (
    <ul className="cp-cat__looks">
      {looks.map((look) => (
        <li key={look.id}>
          <a
            className="cp-cat__look"
            href={`/find-your-kit?ref=${encodeURIComponent(size.token)}&look=${encodeURIComponent(look.id)}`}
          >
            <LookChip
              metal={look.metal}
              bezel={look.bezel}
              dial={look.dial}
              model="datejust"
              id={`cat-dj-${size.size}-${look.id}`}
            />
            <span className="cp-cat__look-name">{describeDatejust(look)}</span>
            <span className="cp-cat__look-detail">{datejustDetail(look)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Highlights the matched span inside a reference. */
function Reference({
  value,
  query,
  prefix,
}: {
  value: string;
  query: string;
  prefix: boolean;
}) {
  const label = prefix ? `${value}…` : value;
  if (!query) return <>{label}</>;

  const at = normalize(value).indexOf(query);
  if (at < 0) return <>{label}</>;

  // normalize() only strips spaces and hyphens, so walk the raw string to map
  // the normalized offsets back onto the characters actually rendered.
  let seen = 0;
  let start = -1;
  let end = value.length;
  for (let i = 0; i < value.length; i += 1) {
    if (seen === at + query.length) {
      end = i;
      break;
    }
    if (/[\s-]/.test(value[i])) continue;
    if (seen === at) start = i;
    seen += 1;
  }
  if (start < 0) return <>{label}</>;

  return (
    <>
      {value.slice(0, start)}
      <mark>{value.slice(start, end)}</mark>
      {value.slice(end)}
      {prefix ? "…" : ""}
    </>
  );
}
