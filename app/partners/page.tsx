import type { Metadata } from "next";
import Link from "next/link";
import { allFamilies } from "@/lib/fitment";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "For watch stores",
  description:
    "Offer ChronoProtect+ with every Datejust, Submariner, GMT-Master II and Daytona you sell, and fit it by appointment, the way paint protection film is sold with a car. Kits come to you wholesale.",
};

/** The four families as a store thinks of them, in the order they sell. */
const MODELS = [
  { name: "Datejust", match: (model: string) => model.startsWith("Datejust"), note: "36 and 41, every dial and bezel" },
  { name: "Submariner", match: (model: string) => model === "Submariner", note: "40mm before 2020, 41mm from 2020" },
  { name: "GMT-Master II", match: (model: string) => model === "GMT-Master II", note: "2007 to the present" },
  { name: "Daytona", match: (model: string) => model === "Daytona", note: "engraved and Cerachrom bezels, gem-set quoted per watch" },
];

/**
 * The page the outreach email's button opens, so Web Analytics can count
 * visits from the email by path. It sells the arrangement, never the terms:
 * the wholesale price is discussed in person, not written here.
 */
export default function PartnersPage() {
  const families = allFamilies();
  const references = families.flatMap((family) => family.references);
  const models = MODELS.map((model) => ({
    ...model,
    count: families
      .filter((family) => model.match(family.model))
      .reduce((sum, family) => sum + family.references.length, 0),
  }));
  const partnerMail = `mailto:${STUDIO_EMAIL}?subject=Fitting%20partner`;

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">For watch stores</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>
            Sold with the watch, fitted by appointment.
          </h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Paint protection film is offered with the car, and a fitter puts it on at a time the
            owner books. ChronoProtect+ works the same way: your client adds the film at the sale,
            and your fitter puts it on in about an hour, the next day or whenever suits them.
          </p>
          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <a href={partnerMail} className="cp-btn">
              Become a fitting partner
            </a>
            <Link href="/shop" className="cp-btn cp-btn--ghost">
              See the kits
            </Link>
          </div>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell cp-wall">
          {/* Every reference the kits are cut for, as the texture behind the panel. */}
          <div className="cp-wall__refs" aria-hidden="true">
            {references.map((ref) => (
              <span key={ref}>{ref.endsWith("-") ? `${ref}…` : ref}</span>
            ))}
          </div>

          <div className="cp-wall__panel">
            <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
              Margin on the Rolex models you sell most.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              You sell the film at retail as an add-on, and the kits come to you wholesale. That is
              margin on every one of these that leaves the store: a cushion when the market is slow,
              and more on every sale when it is busy.
            </p>
            <dl className="cp-spec" style={{ marginTop: "2rem" }}>
              {models.map((model) => (
                <div className="cp-spec__row" key={model.name}>
                  <dt>{model.name}</dt>
                  <dd>
                    {model.count} references, {model.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>How it works in your store.</h2>

          <dl className="cp-spec cp-spec--steps" style={{ marginTop: "2.5rem" }}>
            <Row label="Sell it with the watch">
              Offer the film at handover, at retail. Each kit is cut to the reference, so you know it
              fits before the client pays.
            </Row>
            <Row label="Fit it by appointment">
              The client books an hour, the next day or whenever suits them, or leaves the watch with
              you for a day or two. Nobody has to do it at the kitchen table.
            </Row>
            <Row label="We train your fitter">
              We fit a sample on one of your display pieces and train whoever will do the fittings: a
              watchmaker, the bench, or a member of staff.
            </Row>
            <Row label="Stock it or order it">
              Keep the kits you sell most on the shelf, and order the rest when the watch sells.
            </Row>
          </dl>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>Selling new Rolex.</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              Nothing goes on display and nothing touches a watch in the case. The film is offered at
              handover. If your agreement rules out fitting in the store, a card in the box points the
              client to a fitting by appointment, and the sale is still credited to you.
            </p>
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>Talk to us about your store.</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              Tell us which models you sell most, and we will bring a sample to fit on one of your
              display pieces.
            </p>
          </div>
          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <a href={partnerMail} className="cp-btn">
              Become a fitting partner
            </a>
            <Link href="/catalog" className="cp-btn cp-btn--ghost">
              Browse the catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cp-spec__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
