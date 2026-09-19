import Link from "next/link";
import HeroReference from "@/components/HeroReference";
import Lockup from "@/components/Lockup";
import Price from "@/components/Price";
import { allFamilies } from "@/lib/fitment";
import { getKitProducts, startingPrice } from "@/lib/shopify/products";
import { FINISHES, KIT_COPY, SITE_NAME } from "@/lib/site";

export default async function HomePage() {
  const products = await getKitProducts();
  const families = allFamilies();
  const referenceCount = families.reduce((total, family) => total + family.references.length, 0);

  return (
    <>
      <section className="cp-shell cp-hero">
        <div className="cp-pagehead">
          <div>
            <p className="cp-eyebrow">Precision-cut protective film</p>
            <h1>A watch you wear should not be a watch you worry about.</h1>
            <p className="cp-hero__line">
              Every kit is cut to a single reference, applied by hand, and removed without residue.
              The case keeps its lines, the bracelet keeps its brushing, and the piece keeps its
              value.
            </p>
            <HeroReference referenceCount={referenceCount} />
          </div>

          <div className="cp-pagehead__mark">
            <Lockup word="PROTECT+" label={SITE_NAME} height={340} />
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Cover the whole watch, or only where it takes the wear.
          </h2>

          <div className="cp-grid cp-grid--2">
            <KitCard
              handle="chronoshield"
              price={startingPrice(products.chronoshield)}
            />
            <KitCard handle="chronoguard" price={startingPrice(products.chronoguard)} />
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>Four steps, one reference.</h2>

          <div className="cp-grid cp-grid--3">
            <Step
              no="01"
              title="Give us the reference"
              body="The configurator checks the number against the fitment catalog and confirms the model before you go any further."
            />
            <Step
              no="02"
              title="Choose coverage and finish"
              body="Case to clasp or case and clasp, in gloss or stealth. Five questions, no account required."
            />
            <Step
              no="03"
              title="We cut the kit"
              body="Nothing is stocked. The template for your reference is cut after the order lands, so the tolerances stay tight."
            />
            <Step
              no="04"
              title="Apply it, or let the studio"
              body="Kits arrive pre-cut and ready for a careful hour at home. A studio partner can fit it instead."
            />
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <div className="cp-measure">
            <p className="cp-eyebrow">Finishes</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
              Two surfaces, one film thickness.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              The finish changes how the watch reads in light. It does not change the protection.
            </p>
          </div>

          <dl className="cp-spec" style={{ marginTop: "3rem" }}>
            {FINISHES.map((finish) => (
              <div className="cp-spec__row" key={finish.name}>
                <dt>{finish.name}</dt>
                <dd>{finish.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
              {referenceCount} references, checked before you order.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              Submariner, GMT-Master II, Daytona, and Datejust. Templates are drawn per reference,
              because a Cerachrom bezel and an engraved one are not the same cut.
            </p>
            <p style={{ marginTop: "2rem" }}>
              <Link href="/catalog" className="cp-btn cp-btn--ghost">
                Browse the catalog
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell cp-measure">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Start with the number on the case.
          </h2>
          <p className="cp-lede" style={{ margin: "1.25rem 0 2.5rem" }}>
            Five questions and you will have the right kit in the cart.
          </p>
          <Link href="/find-your-kit" className="cp-btn">
            Find your kit
          </Link>
        </div>
      </section>
    </>
  );
}

function KitCard({
  handle,
  price,
}: {
  handle: "chronoshield" | "chronoguard";
  price: string | null;
}) {
  const copy = KIT_COPY[handle];

  return (
    <article className="cp-card">
      <p className="cp-eyebrow" style={{ marginBottom: "0.75rem" }}>
        {copy.coverage}
      </p>
      <h3>{copy.title}</h3>
      <p>{copy.summary}</p>
      <div className="cp-card__foot">
        <Price value={price} lead="From" />
        <p style={{ marginTop: "1.5rem", marginBottom: 0 }}>
          <Link href={`/kits/${handle}`} className="cp-btn cp-btn--ghost">
            See what it covers
          </Link>
        </p>
      </div>
    </article>
  );
}

function Step({ no, title, body }: { no: string; title: string; body: string }) {
  return (
    <div className="cp-step">
      <span className="cp-step__no">{no}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
