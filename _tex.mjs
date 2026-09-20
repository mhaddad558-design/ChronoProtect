import fs from "fs";
const rd = (p) => fs.readFileSync(p, "utf8");
const wr = (p, s) => fs.writeFileSync(p, s);
function edit(p, pairs) {
  let s = rd(p);
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(p + " miss: " + a.slice(0, 50)); s = s.replace(a, b); }
  wr(p, s);
}

// --- a fourth kind: the crest held inside the lattice
edit("components/BandTexture.tsx", [
  [`export type TextureKind = "guilloche" | "brushing" | "moire";`,
   `export type TextureKind = "guilloche" | "brushing" | "moire" | "crest";`],
  [`          {kind === "moire" ? <Moire /> : null}`,
   `          {kind === "moire" ? <Moire /> : null}
          {kind === "crest" ? <Crest /> : null}`],
  [`/** Straight brushing, as on a case flank: hairlines, a few of them brighter. */`,
   `/**
 * The crest held inside the lattice: the rosette runs behind it and a ring of
 * engraved arcs around it, so the mark reads as struck into the pattern rather
 * than laid on top. The crest drifts against the lines as the pointer moves.
 */
function Crest() {
  const arcs = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const inner = i % 6 === 0 ? 190 : 210;
    return \`M\${(600 + Math.cos(a) * inner).toFixed(1)},\${(350 + Math.sin(a) * inner).toFixed(1)} L\${(600 + Math.cos(a) * 310).toFixed(1)},\${(350 + Math.sin(a) * 310).toFixed(1)}\`;
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
      <image
        className="cp-texture__crest"
        href="/crest.svg"
        x={600 - 143}
        y={350 - 180}
        width={286}
        height={360}
      />
    </>
  );
}

/** Straight brushing, as on a case flank: hairlines, a few of them brighter. */`],
]);

// --- styles
let css = rd("app/depth.css");
css += `
/* ------------------------------------------------------- engraved backdrops */

/*
 * Line work behind a band. It is drawn, never filled, and it answers the
 * pointer through --tx/--ty written by BandTexture. Kept faint: it is the
 * surface a section sits on, not an image on the page.
 */
.cp-texture {
  --tx: 0;
  --ty: 0;
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  mask-image: radial-gradient(circle at center, #000 42%, transparent 78%);
}

.cp-texture svg {
  width: 100%;
  height: 100%;
}

.cp-texture circle,
.cp-texture path {
  fill: none;
  vector-effect: non-scaling-stroke;
}

/* The two layers move by different amounts; that difference is the effect. */
.cp-texture__far {
  stroke: var(--cp-sage);
  stroke-width: 0.6;
  opacity: 0.16;
  transform: translate3d(calc(var(--tx) * 26px), calc(var(--ty) * 18px), 0);
  transition: transform 0.35s ease-out;
}

.cp-texture__near {
  stroke: var(--cp-bronze);
  stroke-width: 0.7;
  opacity: 0.2;
  transform: translate3d(calc(var(--tx) * -34px), calc(var(--ty) * -24px), 0);
  transition: transform 0.35s ease-out;
}

.cp-texture--brushing .cp-texture__far {
  opacity: 0.12;
}

.cp-texture--moire .cp-texture__near,
.cp-texture--moire .cp-texture__far {
  opacity: 0.14;
}

/* The crest sits between the two layers and moves least, so it holds still
   while the engraving slides behind it. */
.cp-texture__crest {
  opacity: 0.14;
  transform: translate3d(calc(var(--tx) * -8px), calc(var(--ty) * -6px), 0);
  transition: transform 0.35s ease-out;
}

/* A band carrying a texture becomes the positioning context for it. */
.cp-band,
.cp-kit {
  position: relative;
  isolation: isolate;
}

@media (prefers-reduced-motion: reduce) {
  .cp-texture__far,
  .cp-texture__near,
  .cp-texture__crest {
    transform: none;
    transition: none;
  }
}
`;
wr("app/depth.css", css);

// --- home bands
edit("app/page.tsx", [
  [`import Image from "next/image";`, `import BandTexture from "@/components/BandTexture";\nimport Image from "next/image";`],
  [`      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Cover the whole watch, or only where it takes the wear.
          </h2>`,
   `      <section className="cp-band cp-band--mid">
        <BandTexture kind="guilloche" id="home-coverage-bg" />
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>
            Cover the whole watch, or only where it takes the wear.
          </h2>`],
  [`      <section className="cp-band">
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>Four steps, one reference.</h2>`,
   `      <section className="cp-band">
        <BandTexture kind="brushing" id="home-steps-bg" rotate={-4} />
        <div className="cp-shell">
          <h2 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)" }}>Four steps, one reference.</h2>`],
  [`      <section className="cp-band cp-band--mid">
        <div className="cp-shell">
          <div className="cp-measure">
            <p className="cp-eyebrow">Finishes</p>`,
   `      <section className="cp-band cp-band--mid">
        <BandTexture kind="moire" id="home-finishes-bg" />
        <div className="cp-shell">
          <div className="cp-measure">
            <p className="cp-eyebrow">Finishes</p>`],
  [`      <section className="cp-band cp-band--mid cp-watermark">
        <div className="cp-shell cp-measure">`,
   `      <section className="cp-band cp-band--mid cp-watermark">
        <BandTexture kind="crest" id="home-close-bg" />
        <div className="cp-shell cp-measure">`],
]);

// --- the configurator: the crest inside the lattice, behind the questions
edit("components/FindYourKit.tsx", [
  [`import WatchDiagram, { modelForFamily } from "./WatchDiagram";`,
   `import BandTexture from "./BandTexture";\nimport WatchDiagram, { modelForFamily } from "./WatchDiagram";`],
  [`    <div className="cp-kit">
      <header className="cp-kit__progress">`,
   `    <div className="cp-kit">
      <BandTexture kind="crest" id="kit-bg" />
      <header className="cp-kit__progress">`],
]);
