import type { Metadata } from "next";
import Link from "next/link";
import Lockup from "@/components/Lockup";
import Price from "@/components/Price";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import { KIT_COPY } from "@/lib/site";

export const metadata: Metadata = {
  title: "The two lines",
  description:
    "ChronoShield+ covers case, bezel, bracelet, and clasp. ChronoGuard+ covers case and clasp. Same film, different reach.",
};

export default async function KitsPage() {
  const products = await getKitProducts();
  const prices: Record<string, string | null> = {
    chronoshield: startingPrice(products.chronoshield),
    chronoguard: startingPrice(products.chronoguard),
  };

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">The two lines</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>Same film, different reach.</h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Both kits use the same material, the same two finishes, and the same per-reference
            templates. The only question is how far the coverage runs.
          </p>
        </div>

        <div className="cp-grid cp-grid--2">
          {(Object.keys(KIT_COPY) as Array<keyof typeof KIT_COPY>).map((handle) => {
            const copy = KIT_COPY[handle];
            return (
              <article className="cp-card" key={handle}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <Lockup word={copy.lockupWord} label={copy.title} height={150} />
                </div>
                <p className="cp-eyebrow" style={{ marginBottom: "0.75rem" }}>
                  {copy.coverage}
                </p>
                <h3>{copy.title}</h3>
                <p>{copy.summary}</p>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 1.75rem",
                    display: "grid",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--cp-ink-soft)",
                  }}
                >
                  {copy.covers.map((area) => (
                    <li key={area}>
                      <span className="cp-dot" />
                      {area}
                    </li>
                  ))}
                  {copy.omits.map((area) => (
                    <li key={area} style={{ color: "var(--cp-ink-faint)" }}>
                      <span
                        className="cp-dot"
                        style={{ background: "var(--cp-border)" }}
                      />
                      {area}
                    </li>
                  ))}
                </ul>

                <div className="cp-card__foot">
                  <Price value={prices[handle]} lead="From" />
                  <p style={{ marginTop: "1.5rem", marginBottom: 0 }}>
                    <Link href={`/kits/${handle}`} className="cp-btn cp-btn--ghost">
                      Read the detail
                    </Link>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell cp-measure">
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
            Not sure which one your watch wants?
          </h2>
          <p className="cp-lede" style={{ margin: "1.25rem 0 2.5rem" }}>
            The configurator asks how you wear the piece and recommends from there.
          </p>
          <Link href="/find-your-kit" className="cp-btn">
            Find your kit
          </Link>
        </div>
      </section>
    </>
  );
}
