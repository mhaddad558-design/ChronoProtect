import type { Metadata } from "next";
import Link from "next/link";
import { allFamilies } from "@/lib/fitment";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "For watch stores",
  description:
    "What ChronoProtect+ could add to a watch store: something more to offer at the handover, a reason for clients to come back, and margin on every Datejust, Submariner, GMT-Master II and Daytona you sell.",
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
 * visits from the email by path. It is written as an offer to stores that
 * already run a good business: what the film could add for them and their
 * clients, never instructions on how to sell. It never states the terms; the
 * wholesale price is discussed in person.
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
  const partnerMail = `mailto:${STUDIO_EMAIL}?subject=Sample%20fitting`;

  return (
    <>
      <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 3rem" }}>
        <div className="cp-measure">
          <p className="cp-eyebrow">For watch stores</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>
            More to offer with every watch you sell.
          </h1>
          <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
            Your clients already trust you with the watch. ChronoProtect+ gives them a way to keep
            it as it was on the day they bought it: film cut to the reference and fitted by
            appointment, much as paint protection film is offered with a new car. For the store, it
            is a considered extra at the handover, and margin on a sale you have already made.
          </p>
          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <a href={partnerMail} className="cp-btn">
              Arrange a sample fitting
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
              Margin on the Rolex models you already sell.
            </h2>
            <p className="cp-lede" style={{ marginTop: "1.25rem" }}>
              Kits come to the store wholesale and sell at retail, so each one adds margin to a sale
              already made, with no new clients to find. It steadies the month when the market is
              quiet, and adds to every sale when it is busy.
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
          <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>What it brings to the showroom.</h2>

          <dl className="cp-spec" style={{ marginTop: "2.5rem" }}>
            <Row label="For your clients">
              A watch that stays as it left the case. The film takes the desk edges and door frames,
              and comes off clean whenever they choose.
            </Row>
            <Row label="At the handover">
              Something considered to offer beyond the box and papers, cut to the exact reference, so
              the fit is certain before anyone commits.
            </Row>
            <Row label="Return visits">
              A fitting appointment brings the client back into the showroom after the sale, and
              replacement film brings them back again in a year or two.
            </Row>
            <Row label="Margin">
              A retail add-on bought wholesale, with kits kept on the shelf or ordered per sale,
              whichever suits the store.
            </Row>
            <Row label="Support">
              We fit a sample on one of your display pieces and show whoever you choose how it is
              done. A fitting takes about an hour.
            </Row>
          </dl>
        </div>
      </section>

      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>For Rolex retailers.</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              Nothing goes on display, and nothing touches a watch in the case. Where your agreement
              leaves fitting outside the store, a card in the box can point the client to a fitting by
              appointment, and the sale is still credited to you.
            </p>
          </div>
        </div>
      </section>

      <section className="cp-band">
        <div className="cp-shell">
          <div className="cp-measure">
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>See it on one of your pieces.</h2>
            <p className="cp-lede" style={{ marginTop: "1rem" }}>
              If it sounds right for your clients, we would be glad to fit a sample on a display piece
              and talk through how it could work in the way that suits your store.
            </p>
          </div>
          <div className="cp-hero__actions" style={{ marginTop: "2rem" }}>
            <a href={partnerMail} className="cp-btn">
              Arrange a sample fitting
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
