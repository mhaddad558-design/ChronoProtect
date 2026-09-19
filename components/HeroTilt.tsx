"use client";

import { useEffect, useRef } from "react";

/**
 * Tilts its contents toward the pointer while it moves over the enclosing
 * section, and eases back to rest when it leaves. It only writes two CSS
 * variables, --mx and --my (each -1 to 1); the stylesheet decides what moves
 * and by how much, which is how the crest's layers separate into depth.
 *
 * Off entirely on touch screens and under reduced motion, where the contents
 * simply stay at rest.
 */
export default function HeroTilt({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduced.matches || !finePointer.matches) return;

    // Track across the whole hero, not just the crest, so the effect starts as
    // soon as the pointer enters the section.
    const area = (el.closest("section") as HTMLElement | null) ?? el;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const tick = () => {
      // Ease toward the target rather than snapping to it.
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      frame =
        Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001
          ? requestAnimationFrame(tick)
          : 0;
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      targetX = clamp((event.clientX - cx) / (window.innerWidth / 2));
      targetY = clamp((event.clientY - cy) / (window.innerHeight / 2));
      start();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className ? `cp-tilt ${className}` : "cp-tilt"}>
      {children}
    </div>
  );
}
