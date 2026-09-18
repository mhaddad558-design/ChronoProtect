import type { Metadata } from "next";
import Link from "next/link";
import FitmentCatalog from "@/components/FitmentCatalog";
import { allFamilies } from "@/lib/fitment";
import "@/components/fitment-catalog.css";
import fitmentData from "@/data/fitment.json";

export const metadata: Metadata = {
  title: "Fitment catalog",
  description:
    "Every Rolex reference ChronoProtect+ cuts templates for, across Submariner, GMT-Master II, Daytona, and Datejust.",
};

export default function CatalogPage() {
  const families = allFamilies();
  const referenceCount = families.reduce((total, family) => total + family.references.length, 0);
  const updated = new Date(`${(fitmentData as { updated: string }).updated}T00:00:00Z`);

  return (
    <section className="cp-shell" style={{ paddingBlock: "clamp(3.5rem, 8vw, 6rem) 6rem" }}>
      <div className="cp-measure">
        <p className="cp-eyebrow">Fitment catalog</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)" }}>
          {referenceCount} references, and what each one gets.
        </h1>
        <p className="cp-lede" style={{ marginTop: "1.5rem" }}>
          Rows are split by whatever changes the template, not by date alone. A 40mm Submariner and
          a 41mm Submariner are different cuts, and so are an engraved Daytona bezel and a Cerachrom
          one. Most families take both lines; where the watch is on a strap we do not cut film
          for, only ChronoGuard+ is listed.
        </p>
      </div>

      <FitmentCatalog />

      <div className="cp-note" style={{ marginTop: "3rem" }}>
        <p style={{ margin: 0 }}>
          <span className="cp-dot" />
          Catalog updated{" "}
          <time dateTime={(fitmentData as { updated: string }).updated}>
            {updated.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
          . Found your reference?{" "}
          <Link href="/find-your-kit">Start the configurator</Link>.
        </p>
      </div>
    </section>
  );
}
