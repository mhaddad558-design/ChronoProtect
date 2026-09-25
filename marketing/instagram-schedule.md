# Instagram schedule

Two posts a week, both Reels. A Routine runs every Monday
at 8:54am Eastern, generates the week's media in Higgsfield, and adds a new
week to the log below. Nothing is posted automatically. Each week's files and
captions are handed over for review, then posted by hand.

## Cadence

| Day | Format | Size |
|---|---|---|
| Tuesday | Reel | 9:16, 5 seconds, 720p, silent (music added in Instagram) |
| Saturday | Reel | 9:16, 5 seconds, 720p, silent |

## Pipeline and cost

1. Two stills with `gpt_image_2_5`, `quality: high`, `resolution: 2k`, one
   first frame for each Reel. 2.75 credits each.
2. Each Reel frame animated with `kling3_0`, `mode: std`, `sound: off`,
   5 seconds, frame passed as `start_image`. 7.5 credits each, 720x1280.

About 21 credits a week. If a second Kling job is rejected as "out of
credits" while credit remains, wait for the first to finish and resubmit.

## Pillars

Rotate in order, two per week, starting where the last week stopped. Every
pillar is made as a Reel.

| # | Pillar |
|---|---|
| 1 | ChronoShield+ over the bracelet, link by link |
| 2 | Gloss vs Stealth finish |
| 3 | ChronoGuard+ on the case and clasp, bracelet left bare |
| 4 | Oyster, Jubilee and President: how the template changes per bracelet |
| 5 | Installation: pre-cut piece placed, squeegeed, gone |
| 6 | It comes off the way it went on: film lifted from a clean case |
| 7 | Supported references, one family per post, from `data/fitment.json` |
| 8 | Bezel and case edge in raking light, film invisible |

## Prompt rules

- Watches are unbranded: blank dials, plain indices, no crown emblem, no
  logos, no engravings, no text in frame. Generated watches must not pass for
  a specific Rolex.
- Ground is deep forest-charcoal `#0B110D` or `#141F19`. Light is one warm
  bronze key or rim light, `#BC906C`. Generous negative space.
- No gradient washes, lens flares, people or hands (hands tend to break).
- The film wraps around each link individually: it follows the link's
  contour, curls around its edges and tucks into the gaps. It is never a flat
  sheet laid over the bracelet, and the gaps between links stay open.
- On ChronoGuard+ the film wraps the case and clasp and the links stay bare.
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

Generated September 25, then redone the same day at high quality with the
film wrapped around each link.

**Tuesday, Reel, pillar 1.** Still `ed9899f1-3ce1-4034-8204-88ee6c3b8a1b`,
video `566cda6c-0ddf-46ac-b25a-7e70fae878cd`.

> Cut to the bracelet, link by link. ChronoShield+ covers the case, bezel,
> every bracelet link and the clasp, and each piece of film is cut to the
> reference number. The bracelet keeps its articulation, and the film disappears into
> the brushing.

**Thursday, image, pillar 2.** Made before the image post was dropped from
the schedule, so posting it is optional. Still `e8d76d45-258a-49a3-a69a-81ebc7d4822d`.

> Same film, two finishes. Gloss keeps the polish exactly as it left the
> boutique. Stealth turns it to a soft satin, a quieter presence on the same
> piece. Both are offered on ChronoShield+ and ChronoGuard+.

**Saturday, Reel, pillar 3.** Still `1e592dfd-5e1d-4e01-adf9-e101abf192b2`,
video `4147fda0-ba69-4adf-af75-350db06a31d6`.

> Case and clasp only. ChronoGuard+ covers the two surfaces a desk scratches
> first and leaves the bracelet bare. Two finishes, cut to the reference number.

Next week starts at pillar 4.
