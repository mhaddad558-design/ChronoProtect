"use client";

import { useEffect, useRef } from "react";

/**
 * A moving background for a section: footage blurred so it reads as light
 * and movement behind the words rather than as a picture. The blur is baked
 * into the files, so the browser does no filtering and each clip stays
 * small. WebM first because it is smaller; the MP4 is for older Safari.
 *
 * `name` picks the files in public/video: <name>.webm, <name>.mp4 and the
 * <name>.jpg poster. The parent section takes the `cp-has-video` class.
 *
 * Two modes:
 * - loop (default): plays on its own, silent. Loop clips are encoded forward
 *   then reversed, so the loop has no jump.
 * - scrub: the footage follows the scroll. It runs from the first frame as
 *   the section enters the viewport to the last as it leaves, and rewinds on
 *   the way back up. Scrub clips are encoded with every frame a keyframe, so
 *   seeking is instant.
 *
 * Decorative only, so it is hidden from assistive technology. Visitors who
 * ask for reduced motion get the still poster instead (see depth.css).
 */
export default function BackgroundVideo({
  name,
  edges = "bottom",
  scrub = false,
}: {
  name: string;
  /** Which edges fade into the section's own ground. */
  edges?: "bottom" | "both";
  scrub?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const poster = `/video/${name}.jpg`;

  useEffect(() => {
    const video = ref.current;
    if (!scrub || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const clip: HTMLVideoElement = video;

    const section = video.closest(".cp-has-video") ?? video;
    let target = 0;
    let shown = 0;
    let frame = 0;

    // iOS will not decode frames for seeking until the video has played once.
    // A muted play is allowed, so play and pause straight away.
    video
      .play()
      .then(() => video.pause())
      .catch(() => {});

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      target = Math.min(1, Math.max(0, progress));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Ease toward the scroll position rather than jumping to it, so a fast
    // flick of the wheel still reads as motion, not a cut.
    // Runs only while catching up with the scroll, then stops until the
    // next scroll event.
    function tick() {
      frame = 0;
      const duration = clip.duration;
      if (!duration || clip.readyState < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const time = shown * (duration - 0.05);
      if (Math.abs(clip.currentTime - time) > 1 / 48) clip.currentTime = time;
      if (shown !== target) frame = requestAnimationFrame(tick);
    }

    measure();
    shown = target;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [scrub]);

  return (
    <div
      className={`cp-bgvideo cp-bgvideo--${edges}`}
      style={{ backgroundImage: `url("${poster}")` }}
      aria-hidden="true"
    >
      <video
        ref={ref}
        autoPlay={!scrub}
        loop={!scrub}
        muted
        playsInline
        preload="auto"
        poster={poster}
        tabIndex={-1}
      >
        <source src={`/video/${name}.webm`} type="video/webm" />
        <source src={`/video/${name}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
