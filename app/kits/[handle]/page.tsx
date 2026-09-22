import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BraceletLinks from "@/components/BraceletLinks";
import FinishSwatch from "@/components/FinishSwatch";
import Lockup from "@/components/Lockup";
import WatchDiagram from "@/components/WatchDiagram";
import Price from "@/components/Price";
import { allFamilies } from "@/lib/fitment";
import { formatMoney, getProduct, startingPrice } from "@/lib/shopify/products";
import { BRACELETS, FINISHES, KIT_COPY, SHIPPING } from "@/lib/site";

type KitHandle = keyof typeof KIT_COPY;

const HANDLES = Object.keys(KIT_COPY) as KitHandle[];

function isKitHandle(value: string): value is KitHandle {
  return (HANDLES as string[]).includes(value);
}

export function generateStaticParams() {
  return HANDLES.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  if (!isKitHandle(handle)) return {};

  const copy = KIT_COPY[handle];
  return {
    title: copy.title,
    description: `${copy.coverage}. ${copy.summary}`,
  };
}

export default async function KitPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!isKitHandle(handle)) notFound();

  const copy = KIT_COPY[handle];
  const product = await getProduct(handle);
  const families = allFamilies();
  const referenceCount = families.reduce((total, family) => total + family.references.length, 0);

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 4rem" }}>
        <div className="cp-pagehead">
          <div>
            <p className="cp-eyebrow">{copy.coverage}</p>
            <h1 style={{ fontSize: "clamp(2.4rem, 6.5vw, 3.8rem)" }}>{copy.title}</h1>
            <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
              {product?.description?.trim() || copy.summary}
            </p>

            <div style={{ marginTop: "2.5rem" }}>
              <Price value={startingPrice(product)} lead="From" />
              <p className="cp-shipping">
                {SHIPPING.line[handle]} {SHIPPING.cut}
              </p>
            </div>

            <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
              <Link href="/find-your-kit" className="cp-btn">
                Configure this kit
              </Link>
              <Link href="/catalog" className="cp-btn cp-btn--ghost">
                Check your reference
              </Link>
            </div>
          </div>

          <div className="cp-pagehead__mark">
            <Lockup word={copy.lockupWord} label={copy.title} height={300} />
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>What the kit covers.</h2>

          <div className="cp-coverage">
            <div className="cp-halftone">
              <WatchDiagram
                line={handle}
                model={handle === "chronoshield" ? "submariner" : "daytona"}
                id={`kit-${handle}`}
                height={400}
              />
            </div>
          <dl className="cp-spec">
            {copy.covers.map((area) => (
              <div className="cp-spec__row" key={area}>
                <dt>Covered</dt>
                <dd>{area}</dd>
              </div>
            ))}
            {copy.omits.map((area) => (
              <div className="cp-spec__row" key={area}>
                <dt>Not covered</dt>
                <dd>{area}</dd>
              </div>
            ))}
          </dl>
          </div>

          {handle === "chronoguard" ? (
            <p className="cp-note" style={{ marginTop: "2rem" }}>
              <span className="cp-dot" />
              Want the bracelet covered too?{" "}
              <Link href="/kits/chronoshield">ChronoShield+</Link> runs the film from case to
              clasp.
            </p>
          ) : (
            <p className="cp-note" style={{ marginTop: "2rem" }}>
              <span className="cp-dot" />
              Only want the contact points?{" "}
              <Link href="/kits/chronoguard">ChronoGuard+</Link> covers the case and clasp and leaves
              the bracelet bare.
            </p>
          )}
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <p className="cp-eyebrow">Finishes</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
            Pick the surface, not the protection.
          </h2>

          <div className="cp-grid cp-grid--3">
            {FINISHES.map((finish) => {
              // ChronoShield+ has a variant per finish AND bracelet, so a finish
              // maps to three prices, not one. Show the cheapest as a "From" —
              // picking any single variant's price would misreport the others.
              const matching =
                product?.variants.nodes.filter((node) =>
                  node.selectedOptions.some(
                    (option) =>
                      option.name.toLowerCase() === "finish" &&
                      option.value.toLowerCase() === finish.name.toLowerCase()
                  )
                ) ?? [];

              const cheapest = matching.reduce<(typeof matching)[number] | null>(
                (low, node) =>
                  low && Number(low.price.amount) <= Number(node.price.amount) ? low : node,
                null
              );
              const varies = matching.length > 1;

              return (
                <article className="cp-card" key={finish.name}>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <FinishSwatch finish={finish.name} id={`kit-${handle}-${finish.name}`} size={96} />
                  </div>
                  <h3 style={{ fontSize: "1.35rem" }}>{finish.name}</h3>
                  <p>{finish.detail}</p>
                  <div className="cp-card__foot">
                    <Price
                      value={formatMoney(cheapest?.price)}
                      lead={varies ? "From" : undefined}
                    />
                    {matching.length > 0 && !matching.some((node) => node.availableForSale) ? (
                      <p className="cp-price--pending" style={{ marginTop: "0.5rem" }}>
                        Currently unavailable
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {handle === "chronoshield" ? (
        <section className="cp-band">
          <div className="cp-shell">
            <div className="cp-measure">
              <p className="cp-eyebrow">Bracelets</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
                Cut to the bracelet, link by link.
              </h2>
              <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
                Every link is covered individually, so the template and the price both follow the
                bracelet. The configurator reads it from your reference, and only asks when that
                reference was sold on more than one.
              </p>
            </div>

            <dl className="cp-spec" style={{ marginTop: "3rem" }}>
              {BRACELETS.map((option) => (
                <div className="cp-spec__row cp-spec__row--visual" key={option.name}>
                  <dt>
                    <BraceletLinks kind={option.name} height={52} />
                    {option.name}
                  </dt>
                  <dd>{option.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="cp-band cp-band--mid">
        <div className="cp-shell cp-measure">
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
            Cut to one reference, not to a size chart.
          </h2>
          <p className="cp-lede" style={{ margin: "1.25rem 0 2.5rem" }}>
            {copy.title} is available for all {referenceCount} references in the catalog. The
            configurator checks yours before anything reaches the cart.
          </p>
          <Link href="/find-your-kit" className="cp-btn">
            Find your kit
          </Link>
        </div>
      </section>
    </>
  );
}
