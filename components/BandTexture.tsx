"use client";

import { useEffect, useRef } from "react";

export type TextureKind = "guilloche" | "brushing" | "moire" | "crest" | "engine";

/**
 * Engraved line work behind a band, drawn the way a dial or a caseback is
 * finished: a guilloché rosette, straight brushing, or two circle families
 * whose overlap moires. Every one is line work — no fills, no gradients, no
 * colour washes — so a band gains depth without gaining decoration.
 *
 * It answers the pointer. The component only writes two variables, --tx and
 * --ty (each -1 to 1, eased), on its own element; the stylesheet decides what
 * moves and how far. On a touch screen or under reduced motion nothing is
 * written and the pattern simply stands still.
 */
export default function BandTexture({
  kind,
  id,
  /** Turns the whole figure, so two bands with the same pattern do not rhyme. */
  rotate = 0,
}: {
  kind: TextureKind;
  /** Unique per page: it namespaces the pattern definitions. */
  id: string;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduced.matches || !finePointer.matches) return;

    // The whole band is the tracking area, not just the drawing.
    const area = (el.closest("section") as HTMLElement | null) ?? el;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.setProperty("--tx", x.toFixed(4));
      el.style.setProperty("--ty", y.toFixed(4));
      frame =
        Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001
          ? requestAnimationFrame(tick)
          : 0;
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const box = area.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      targetX = clamp(((event.clientX - box.left) / box.width) * 2 - 1);
      targetY = clamp(((event.clientY - box.top) / box.height) * 2 - 1);
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
    <div className={`cp-texture cp-texture--${kind}`} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g transform={rotate ? `rotate(${rotate} 600 350)` : undefined}>
          {kind === "guilloche" ? <Guilloche /> : null}
          {kind === "brushing" ? <Brushing id={id} /> : null}
          {kind === "moire" ? <Moire /> : null}
          {kind === "crest" ? <Crest /> : null}
          {kind === "engine" ? <Crest withMark={false} /> : null}
        </g>
      </svg>
    </div>
  );
}

/**
 * A rosette: one circle walked around a small orbit, the way a guilloché
 * engine cuts a dial. The two layers counter-rotate under the pointer, so the
 * lattice opens and closes as it moves.
 */
function Guilloche() {
  const petal = (count: number, orbit: number, radius: number) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return (
        <circle
          key={i}
          cx={(600 + Math.cos(a) * orbit).toFixed(1)}
          cy={(350 + Math.sin(a) * orbit).toFixed(1)}
          r={radius}
        />
      );
    });

  return (
    <>
      <g className="cp-texture__near">{petal(48, 150, 250)}</g>
      <g className="cp-texture__far">{petal(36, 250, 170)}</g>
    </>
  );
}

/**
 * The crest held inside the lattice: the rosette runs behind it and a ring of
 * engraved arcs around it, so the mark reads as struck into the pattern rather
 * than laid on top. The crest drifts against the lines as the pointer moves.
 */
function Crest({ withMark = true }: { withMark?: boolean } = {}) {
  const arcs = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const inner = i % 6 === 0 ? 190 : 210;
    return `M${(600 + Math.cos(a) * inner).toFixed(1)},${(350 + Math.sin(a) * inner).toFixed(1)} L${(600 + Math.cos(a) * 310).toFixed(1)},${(350 + Math.sin(a) * 310).toFixed(1)}`;
  });

  return (
    <>
      <g className="cp-texture__far">
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={600} cy={350} r={(i + 1) * 17} />
        ))}
      </g>
      <g className="cp-texture__near">
        <path d={arcs.join(" ")} />
      </g>
      {withMark ? (
        <image
          className="cp-texture__crest"
          href="/crest.svg"
          x={600 - 143}
          y={350 - 180}
          width={286}
          height={360}
        />
      ) : null}
    </>
  );
}

/** Straight brushing, as on a case flank: hairlines, a few of them brighter. */
function Brushing({ id }: { id: string }) {
  const lines = Array.from({ length: 90 }, (_, i) => {
    const y = i * 9 + 4;
    return `M-200,${y} H1400`;
  });
  const bright = lines.filter((_, i) => i % 7 === 3);

  return (
    <>
      <g className="cp-texture__far" data-id={id}>
        <path d={lines.join(" ")} />
      </g>
      <g className="cp-texture__near">
        <path d={bright.join(" ")} />
      </g>
    </>
  );
}

/**
 * Two families of concentric circles. Where they cross they interfere, and
 * moving one centre sweeps the fringes across the band — the closest a flat
 * drawing gets to light travelling over metal.
 */
function Moire() {
  const rings = (cx: number, step: number, count: number) =>
    Array.from({ length: count }, (_, i) => (
      <circle key={i} cx={cx} cy={350} r={(i + 1) * step} />
    ));

  return (
    <>
      <g className="cp-texture__far">{rings(430, 26, 26)}</g>
      <g className="cp-texture__near">{rings(770, 26, 26)}</g>
    </>
  );
}
