# Instagram schedule

Three posts a week, alternating Reels and 3-slide carousels, all telling one
storyline per week. A Routine runs every Monday at 8:54am Eastern, generates
the following week's media in Higgsfield, and adds a new week to the log
below. Nothing is posted automatically. Each week's files and captions are
handed over for review, then posted by hand.

## Cadence

Posts go out Tuesday, Thursday and Saturday. The format alternates post to
post, and the alternation carries across weeks, so weeks take turns between
two patterns:

| Pattern | Tuesday | Thursday | Saturday | Credits |
|---|---|---|---|---|
| A | Reel | Carousel | Reel | about 29 |
| B | Carousel | Reel | Carousel | about 27 |

The week of September 28 was pattern A, so the week of October 5 is B, the
week of October 12 is A, and so on.

| Format | Size |
|---|---|
| Reel | 9:16, 5 seconds, 720p, silent (music added in Instagram) |
| Carousel | 3 slides, 4:5, no text in frame |

## Pipeline and cost

- **Reel.** One 9:16 first frame with `gpt_image_2_5`, `quality: high`,
  `resolution: 2k` (2.75 credits), animated with `kling3_0`, `mode: std`,
  `sound: off`, 5 seconds, frame passed as `start_image` (7.5 credits).
  About 10.25 credits.
- **Carousel.** Three 4:5 slides with `gpt_image_2_5`, `quality: high`,
  `resolution: 2k`, 2.75 credits each. Generate slide 1 first, then pass its
  job ID as `image_references` to slides 2 and 3 so the set, the light and
  the watch stay the same across the swipe. About 8.25 credits.

If a Kling job is rejected as "out of credits" while credit remains, wait for
the running one to finish and resubmit.

## Content guide

From the brand's content guide of September 11, 2026. It governs every Reel.

- Emotions to hit: safety, trust, belonging.
- Thoughts to land: the film is an extension of the watch, not an addition.
  Serious collectors protect their pieces. What the film preserves lasts the
  life of the watch and shows up in its resale value.
- About 3 posts a week, alternating emotion and thought.
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

## Storylines

Each week tells one storyline across its three posts. Posts alternate emotion
and thought, and that alternation also carries across weeks: the first post
of a week is the opposite type to the last post of the week before. So a week
runs emotion, thought, emotion or thought, emotion, thought, and uses its
storyline's emotion or thought twice, from two different angles.

A carousel's three slides are beats of the story: a setup, a turn and a
close. A Reel is one beat, a hook either side of the carousel or the middle
of the week.

Take the storylines in order, one per week, and start over after the last.

| # | Storyline | Emotion | Thought |
|---|---|---|---|
| S1 | The car and the watch | Great pieces are made to be used: an unbadged red supercar with protected paint, the watch on the wrist at the wheel | The same idea protects both: a film no one sees keeps the factory finish, and the finish holds the value |
| S2 | A day on the wrist | Safety: the watch worn through a day, the desk edge, the door frame, the car keys, and the film takes the mark | An extension, not an addition: ChronoShield+ wraps each link on its own and disappears into the brushing |
| S3 | The collection | Belonging: a collection laid out together on dark wood, every piece protected | Collectors protect what they intend to keep, and wear what they protect |
| S4 | The fit | Trust: a pre-cut piece placed and smoothed with care, gone once it is on | Two lines, two finishes: ChronoShield+ or ChronoGuard+, Gloss or Stealth, cut to the bracelet |
| S5 | The long game | Safety over years: the same watch worn for a decade | Resale: the film lifts clean and the original finish underneath is what the watch is valued on |

The week of October 5 is S1, pattern B: Tuesday carousel (emotion),
Thursday Reel (thought), Saturday carousel (emotion).

## Your media

Real photos and footage beat generated ones: the film, the fit and the
finish are exactly right, and a real photo costs nothing to post. When the
library has something that fits the week's storyline, use it before
generating.

- **Photo in a carousel.** Use it as a slide as it is, or as an
  `image_references` input so the generated slides match it.
- **Photo in a Reel.** Use it as the Kling `start_image` (7.5 credits, no
  still to generate).
- **Video.** Cut it to a Reel as it is, or restyle it with Shorts Studio.

Real photos may show the watch's own branding, since they are the real
product. Any post that shows or names a Rolex reference carries the Rolex
disclaimer. Generated media stays unbranded.

Media reaches Higgsfield in one of three ways:

1. Attach it in this conversation with one line on what it shows. It is
   uploaded to Higgsfield and added to the table below.
2. Upload it in the Higgsfield web app. The Monday run finds it with
   `show_medias`, but cannot see what it shows, so it lists new files in
   its reply and asks for a line on each. It uses a file only once it has a
   description.
3. Share a public link (Google Drive, Dropbox) here. It is imported with
   `media_import_url`.

| Media ID | Type | What it shows | Best for | Used |
|---|---|---|---|---|

## Prompt rules

- Watches are unbranded: blank dials, plain indices, no crown emblem, no
  logos, no engravings, no text in frame. Generated watches must not pass for
  a specific Rolex.
- Ground is deep forest-charcoal `#0B110D` or `#141F19`. Light is one warm
  bronze key or rim light, `#BC906C`. Generous negative space.
- No gradient washes or lens flares. No faces. A wrist and forearm in a dark
  sleeve are allowed where a theme needs the watch worn; keep hands small or
  soft-focus, since generated hands tend to break.
- A carousel's three slides share one set, one light and one watch, and
  each slide shows a different moment or angle.
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
- Hit the post's emotion or thought from the content guide, and carry the
  week's storyline.
- A carousel caption walks the three slides in order, one short sentence
  each, then closes. Its opening line has to make someone swipe.
- Any post that names a reference number carries the Rolex disclaimer.
- Posts are AI-generated: tick Instagram's AI label when posting.

## Log

### Week of September 28, 2026 (posts September 29 to October 3)

Generated September 25, then redone the same day at high quality with the
film wrapped around each link.

**Tuesday, Reel, thought: an extension, not an addition.** Still `ed9899f1-3ce1-4034-8204-88ee6c3b8a1b`,
video `566cda6c-0ddf-46ac-b25a-7e70fae878cd`.

> The film becomes part of the watch. ChronoShield+ wraps every bracelet
> link on its own, so the bracelet keeps its articulation and the film
> disappears into the brushing. Wear the watch.

**Thursday, image, thought: Gloss or Stealth.** Made before the image post was dropped from
the schedule, so posting it is optional. Still `e8d76d45-258a-49a3-a69a-81ebc7d4822d`.

> Same film, two finishes. Gloss keeps the polish exactly as it left the
> boutique. Stealth turns it to a soft satin, a quieter presence on the same
> piece. Underneath either one, the original finish stays untouched, and that
> finish is what the watch is valued on.

**Saturday, Reel, thought: ChronoGuard+ case and clasp.** Still `1e592dfd-5e1d-4e01-adf9-e101abf192b2`,
video `4147fda0-ba69-4adf-af75-350db06a31d6`.

> Case and clasp only. ChronoGuard+ covers the two surfaces a desk scratches
> first and leaves the bracelet bare. The watch goes out every day and comes
> back as it left. Wear the watch.

Captions rewritten on September 25 to follow the content guide. All three
are thought Reels, made before the guide arrived.

The September 28 run makes the week of October 5 (posts October 6, 8 and 10):
storyline S1, pattern B.
