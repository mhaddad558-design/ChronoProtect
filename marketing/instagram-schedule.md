# Instagram schedule

Three posts a week: two Reels and one image post. A Routine runs every Monday
at 8:54am Eastern, generates the week's media in Higgsfield, and adds a new
week to the log below. Nothing is posted automatically. Each week's files and
captions are handed over for review, then posted by hand.

## Cadence

| Day | Format | Size |
|---|---|---|
| Tuesday | Reel | 9:16, 5 seconds, silent (music added in Instagram) |
| Thursday | Image post | 4:5 |
| Saturday | Reel | 9:16, 5 seconds, silent |

## Pipeline and cost

1. Three stills with `gpt_image_2_5`: the image post, plus a first frame for
   each Reel. 0.25 credits each.
2. Each Reel frame animated with `kling3_0`, `mode: std`, `sound: off`,
   5 seconds, frame passed as `start_image`. 7.5 credits each.

About 16 credits a week. Submit one Kling job at a time: the Plus plan
rejected a second job running in parallel as "out of credits" even with
credit left.

## Pillars

Rotate in order, starting each week where the last one stopped. Each week
needs two Reel pillars and one image pillar.

| # | Pillar | Best as |
|---|---|---|
| 1 | ChronoShield+ over the bracelet, link by link | Reel |
| 2 | Gloss vs Stealth finish | Image |
| 3 | ChronoGuard+ on the case and clasp, bracelet left bare | Reel |
| 4 | Oyster, Jubilee and President: how the template changes per bracelet | Image |
| 5 | Installation: pre-cut piece placed, squeegeed, gone | Reel |
| 6 | It comes off the way it went on: film lifted from a clean case | Reel |
| 7 | Supported references, one family per post, from `data/fitment.json` | Image |
| 8 | Bezel and case edge in raking light, film invisible | Reel |

## Prompt rules

- Watches are unbranded: blank dials, plain indices, no crown emblem, no
  logos, no engravings, no text in frame. Generated watches must not pass for
  a specific Rolex.
- Ground is deep forest-charcoal `#0B110D` or `#141F19`. Light is one warm
  bronze key or rim light, `#BC906C`. Generous negative space.
- No gradient washes, lens flares, people or hands (hands tend to break).
- Reel motion is slow and single-shot: a glide, a push-in, a light sweep.

## Caption rules

Follow `BRAND-VOICE.md`. In short:

- Open with a full-sentence headline that ends in a full stop.
- Sentence case, active voice, no exclamation marks, no contractions.
- Name the line with its plus: ChronoShield+, ChronoGuard+.
- Say what the film physically does. State limits plainly.
- Write about the watch, not the reader.
- Any post that names a reference number carries the Rolex disclaimer.
- Posts are AI-generated: tick Instagram's AI label when posting.

## Log

### Week of September 28, 2026

Generated September 25 as the test batch.

**Tuesday, Reel, pillar 1.** Still `f2e55af6-398d-449a-a02d-5a1b727363b9`,
video `4e95a7f2-e6bc-4589-875d-c22fbc625b28`.

> Cut to the bracelet, link by link. ChronoShield+ covers the case, bezel,
> every bracelet link and the clasp, and each piece of film is cut to the
> reference number. The bracelet keeps its articulation, and the film disappears into
> the brushing.

**Thursday, image, pillar 2.** Still `883f9ebe-e0f4-499f-925f-49c239c2ba9a`.

> Same film, two finishes. Gloss keeps the polish exactly as it left the
> boutique. Stealth turns it to a soft satin, a quieter presence on the same
> piece. Both are offered on ChronoShield+ and ChronoGuard+.

**Saturday, Reel, pillar 3.** Still `60bc624c-8f5e-49c0-93cc-94172b0fe244`,
video `2d325f26-5bd0-42c9-a048-9d905da5246e`.

> Case and clasp only. ChronoGuard+ covers the two surfaces a desk scratches
> first and leaves the bracelet bare. Two finishes, cut to the reference number.

Next week starts at pillar 4.
