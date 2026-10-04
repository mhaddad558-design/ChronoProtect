/**
 * A moving background for a section: footage blurred so it reads as light
 * and movement behind the words rather than as a picture. The blur is baked
 * into the files, so the browser does no filtering and each clip stays
 * small. Each clip plays forward then in reverse, so the loop has no jump,
 * and it is silent. WebM first because it is a third the size; the MP4 is
 * for older Safari.
 *
 * `name` picks the files in public/video: <name>.webm, <name>.mp4 and the
 * <name>.jpg poster. The parent section takes the `cp-has-video` class.
 *
 * Decorative only, so it is hidden from assistive technology. Visitors who
 * ask for reduced motion get the still poster instead (see depth.css).
 */
export default function BackgroundVideo({
  name,
  edges = "bottom",
}: {
  name: string;
  /** Which edges fade into the section's own ground. */
  edges?: "bottom" | "both";
}) {
  const poster = `/video/${name}.jpg`;

  return (
    <div
      className={`cp-bgvideo cp-bgvideo--${edges}`}
      style={{ backgroundImage: `url("${poster}")` }}
      aria-hidden="true"
    >
      <video autoPlay muted loop playsInline preload="auto" poster={poster} tabIndex={-1}>
        <source src={`/video/${name}.webm`} type="video/webm" />
        <source src={`/video/${name}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
