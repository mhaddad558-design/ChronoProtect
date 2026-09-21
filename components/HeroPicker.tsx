"use client";

import Link from "next/link";
import { useState } from "react";
import HeroReference from "./HeroReference";
import WatchDiagram, { MODEL_NAMES, type WatchModel } from "./WatchDiagram";

const MODELS: WatchModel[] = ["submariner", "gmt", "daytona", "datejust"];

/**
 * The first thing on the home page: four watches to point at. An owner who
 * knows their reference can still type it, but nobody has to go and find a
 * warranty card before the site will talk to them.
 */
export default function HeroPicker({ referenceCount }: { referenceCount: number }) {
  const [typing, setTyping] = useState(false);

  if (typing) {
    return (
      <div className="cp-heropick">
        <HeroReference referenceCount={referenceCount} />
        <p className="cp-heropick__aside">
          <button type="button" onClick={() => setTyping(false)}>
            Pick it from pictures instead
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="cp-heropick">
      <p className="cp-heropick__label">Which watch are you protecting?</p>

      <div className="cp-heropick__models">
        {MODELS.map((m) => (
          <Link key={m} href={`/find-your-kit?model=${m}`} className="cp-heropick__model">
            <WatchDiagram line="chronoshield" model={m} id={`hero-${m}`} height={104} />
            <span>{MODEL_NAMES[m]}</span>
          </Link>
        ))}
      </div>

      <p className="cp-heropick__aside">
        {referenceCount} references cut to order.{" "}
        <button type="button" onClick={() => setTyping(true)}>
          Know your reference number?
        </button>
      </p>
    </div>
  );
}
