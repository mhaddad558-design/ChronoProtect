"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  onConsentOpen,
  openConsent,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

/**
 * The cookie choice, along the bottom of every page until the visitor makes
 * one. Opt-in: the Meta pixel stays off until "Accept". The footer's cookie
 * settings link brings the bar back to change the choice.
 */
export default function ConsentBar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read after mount: the server cannot see this browser's choice.
    if (readConsent() === null) setOpen(true);
    return onConsentOpen(() => {
      setOpen(true);
      // Someone who asked for it from the footer gets keyboard focus on it.
      requestAnimationFrame(() => ref.current?.focus());
    });
  }, []);

  if (!open) return null;

  function choose(choice: ConsentChoice) {
    writeConsent(choice);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className="cp-consent"
      role="region"
      aria-label="Cookie choice"
      tabIndex={-1}
    >
      <p className="cp-consent__text">
        We use cookies to measure our Instagram and Facebook ads. None are set unless you
        accept. <Link href="/privacy">Privacy policy</Link>
      </p>
      <div className="cp-consent__actions">
        <button type="button" className="cp-btn cp-btn--ghost" onClick={() => choose("denied")}>
          Decline
        </button>
        <button type="button" className="cp-btn" onClick={() => choose("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}

/** "Cookie settings" in the footer: brings the bar back. */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="cp-linkbutton"
      onClick={openConsent}
    >
      Cookie settings
    </button>
  );
}
