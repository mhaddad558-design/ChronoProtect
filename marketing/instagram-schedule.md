# Instagram schedule

Three posts a week, all Reels. A Routine runs every Monday
at 8:54am Eastern, generates the following week's media in Higgsfield, and adds a new
week to the log below. Nothing is posted automatically. Each week's files and
captions are handed over for review, then posted by hand.

## Cadence

| Day | Format | Size |
|---|---|---|
| Tuesday | Reel | 9:16, 5 seconds, 720p, silent (music added in Instagram) |
| Thursday | Reel | 9:16, 5 seconds, 720p, silent |
| Saturday | Reel | 9:16, 5 seconds, 720p, silent |

## Pipeline and cost

1. Three stills with `gpt_image_2_5`, `quality: high`, `resolution: 2k`, one
   first frame for each Reel. 2.75 credits each.
2. Each Reel frame animated with `kling3_0`, `mode: std`, `sound: off`,
   5 seconds, frame passed as `start_image`. 7.5 credits each, 720x1280.

About 31 credits a week. If a later Kling job is rejected as "out of
credits" while credit remains, wait for the running one to finish and resubmit.

## Content guide

From the brand's content guide of September 11, 2026. It governs every Reel.

- Emotions to hit: safety, trust, belonging.
- Thoughts to land: the film is an extension of the watch, not an addition.
  Serious collectors protect their pieces. What the film preserves lasts the
  life of the watch and shows up in its resale value.
- About 3 Reels a week, alternating emotion and thought.
- The main story is protection, alongside "wear your fking watch": a watch
  is protected so it can be worn, not kept in a box.
- Allude to a Ferrari: a car and a watch are both great pieces that need
  love and protection to be fully used.
- Build a platform that earns trust and makes the brand recognizable.

How that is applied here:

- The car is an allusion only. It is an unbadged red Italian supercar, and
  no Ferrari name, prancing horse, shield or badge appears in a prompt, a
  frame or a caption. Paint protection film on the car mirrors the film on
  the watch.
- Captions say "Wear the watch." rather than the explicit line.
- Collector trust is stated as how collectors behave. No named collector,
  count or endorsement appears unless it is real and approved.

## Themes

Reels alternate emotion and thought, day by day, and the alternation carries
across weeks: the first Reel of a week is the opposite type to the last Reel
of the week before. For each slot, pick the least recently used theme of that
type and vary the composition from earlier uses.

**Emotion**

| # | Theme |
|---|---|
| E1 | Safety, wear the watch: the watch worn through a day (desk edge, door frame, car keys) and the film takes the mark |
| E2 | Belonging: a collection laid out together on dark wood, every piece protected |
| E3 | Trust in the fit: a pre-cut piece placed and smoothed with care, gone once it is on |
| E4 | The car and the watch: an unbadged red supercar with protected paint, the watch on the wrist at the wheel |

**Thought**

| # | Theme |
|---|---|
| T1 | An extension, not an addition: ChronoShield+ wrapped link by link, film invisible |
| T2 | Collectors protect what they keep: pieces stored and worn, all covered |
| T3 | Resale: film lifted clean, the original finish underneath is what the watch is valued on |
| T4 | Gloss vs Stealth finish |
| T5 | ChronoGuard+ on the case and clasp, bracelet left bare |
| T6 | Oyster, Jubilee and President: how the template changes per bracelet |
| T7 | Supported references, one family per post, from `data/fitment.json` |

## Prompt rules

- Watches are unbranded: blank dials, plain indices, no crown emblem, no
  logos, no engravings, no text in frame. Generated watches must not pass for
  a specific Rolex.
- Ground is deep forest-charcoal `#0B110D` or `#141F19`. Light is one warm
  bronze key or rim light, `#BC906C`. Generous negative space.
- No gradient washes or lens flares. No faces. A wrist and forearm in a dark
  sleeve are allowed where a theme needs the watch worn; keep hands small or
  soft-focus, since generated hands tend to break.
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
- Write about the watch, not the reader. "Wear the watch." is the one
  standing imperative.
- Hit the Reel's emotion or thought from the content guide.
- Any post that names a reference number carries the Rolex disclaimer.
- Posts are AI-generated: tick Instagram's AI label when posting.

## Log

### Week of September 28, 2026 (posts September 29 to October 3)

Generated September 25, then redone the same day at high quality with the
film wrapped around each link.

**Tuesday, Reel, T1.** Still `ed9899f1-3ce1-4034-8204-88ee6c3b8a1b`,
video `566cda6c-0ddf-46ac-b25a-7e70fae878cd`.

> The film becomes part of the watch. ChronoShield+ wraps every bracelet
> link on its own, so the bracelet keeps its articulation and the film
> disappears into the brushing. Wear the watch.

**Thursday, image, T4.** Made before the image post was dropped from
the schedule, so posting it is optional. Still `e8d76d45-258a-49a3-a69a-81ebc7d4822d`.

> Same film, two finishes. Gloss keeps the polish exactly as it left the
> boutique. Stealth turns it to a soft satin, a quieter presence on the same
> piece. Underneath either one, the original finish stays untouched, and that
> finish is what the watch is valued on.

**Saturday, Reel, T5.** Still `1e592dfd-5e1d-4e01-adf9-e101abf192b2`,
video `4147fda0-ba69-4adf-af75-350db06a31d6`.

> Case and clasp only. ChronoGuard+ covers the two surfaces a desk scratches
> first and leaves the bracelet bare. The watch goes out every day and comes
> back as it left. Wear the watch.

Captions rewritten on September 25 to follow the content guide. All three
are thought Reels, made before the guide arrived.

The September 28 run makes the week of October 5 (posts October 6, 8 and 10),
starting with an emotion Reel.
