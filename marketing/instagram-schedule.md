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
| Carousel | 3 slides, 1080 x 1350, text and crest per the carousel design below |

## Pipeline and cost

- **Reel.** One 9:16 first frame with `gpt_image_2_5`, `quality: high`,
  `resolution: 2k` (2.75 credits), animated with `kling3_0`, `mode: std`,
  `sound: off`, 5 seconds, frame passed as `start_image` (7.5 credits).
  About 10.25 credits.
- **Carousel.** Three 4:5 slides with `gpt_image_2_5`, `quality: high`,
  `resolution: 2k`, 2.75 credits each. Generate slide 1 first, then pass its
  job ID as `image_references` to slides 2 and 3 so the set, the light and
  the watch stay the same across the swipe. About 8.25 credits.
- **Carousel finishing.** The three slides go into the Canva brand template
  (see Carousel design) by autofill, which lays on the headlines, the
  sub-line and the crest. No Higgsfield credits.

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

Take the storylines in this order, one per week, then start over:

S1, S2, S6, S3, S4, S6, S5, S6

S6, Day one, speaks to new buyers, the customers most likely to buy, so it
comes round every two or three weeks instead of once a cycle.

| # | Storyline | Emotion | Thought |
|---|---|---|---|
| S1 | The car and the watch | Great pieces are made to be used: an unbadged red supercar with protected paint, the watch on the wrist at the wheel | The same idea protects both: a film no one sees keeps the factory finish, and the finish holds the value |
| S2 | A day on the wrist | Safety: the watch worn through a day, the desk edge, the door frame, the car keys, and the film takes the mark | An extension, not an addition: ChronoShield+ wraps each link on its own and disappears into the brushing |
| S3 | The collection | Belonging: a collection laid out together on dark wood, every piece protected | Collectors protect what they intend to keep, and wear what they protect |
| S4 | The fit | Trust: a pre-cut piece placed and smoothed with care, gone once it is on | Two lines, two finishes: ChronoShield+ or ChronoGuard+, Gloss or Stealth, cut to the bracelet |
| S5 | The long game | Safety over years: the same watch worn for a decade | Resale: the film lifts clean and the original finish underneath is what the watch is valued on |
| S6 | Day one | The first wear: the watch out of the box and straight onto the wrist, the first scratch that never reaches the steel | The finish is only perfect once, so the film goes on before the first wear. Every thought post in an S6 week is a reference-support post (below) |

The week of October 5 is S1, pattern B: Tuesday carousel (emotion),
Thursday Reel (thought), Saturday carousel (emotion). October 12 is S2 and
October 19 is S6.

### Reference-support posts

These answer a new buyer's first question: will it fit my watch. Each covers
one family from `data/fitment.json`, taking current models in this order and
starting over after the last:

1. Submariner, 2020 to present, 41mm
2. Datejust 41
3. GMT-Master II
4. Daytona, Cerachrom bezel (Oyster bracelet on ChronoShield+ and
   ChronoGuard+, Oysterflex on ChronoGuard+ only)
5. Datejust 36

- As a carousel: slide 1 the watch family's silhouette with the film, slide
  2 the coverage for each line, slide 3 the bracelet or strap options.
- As a Reel: one slow move over the covered case and bracelet.
- The caption names the family and its reference range, states plainly what
  is not covered (Oysterflex and leather take ChronoGuard+ only; gem-set
  bezels are quoted by the studio), and closes with: "Comment your reference
  and we will confirm the fit."
- Always carries the Rolex disclaimer. Rolex model tags are allowed here.
- Check `data/fitment.json` on the day. Families whose `status` is not
  `active` are never featured.

### Timing

- Authorized dealers call waitlisted buyers when an allocation arrives, and
  pickups get posted on Fridays and Saturdays. The Saturday slot gets the
  strongest new-buyer post of the week.
- New-buyer volume peaks in April, after the Watches and Wonders launches,
  and in December. In those months, move S6 up to every other week.

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
| `5e77017d-d639-4103-9c9e-7711d877bc89` | image | Awaiting description | | |
| `187fc378-28fc-4ef1-a1ae-d27b27be7093` | image | Awaiting description | | |
| `626b69f0-9659-45d5-a2b2-c2ccb20e8238` | image | Awaiting description | | |

## Carousel design

Set by the owner on September 29, 2026, from three reference slides kept in
`marketing/carousel-reference/`. Every carousel slide follows it. Positions
are in pixels on the 1080 x 1350 slide, measured from the references.

**Type.** Red Hat Display, regular (400), white `#FFFFFF`, set in capitals
with wide tracking, letter-spacing about 0.18em. This is the one place the
brand sets words in capitals: an exception the owner approved for carousel
overlays only. Captions, the site and everything else stay in sentence case.

**Copy.** Overlay text follows the voice rules apart from the capitals. The
car stays unbranded: no Ferrari name, badge or other carmaker's mark in any
slide, the owner's decision to keep clear of trademark trouble. The
reference slides show the style to match, not copy to reuse, and slide 1's
wording is not used as it stands. Contractions stay out, as in captions.
Headlines speak to the reader: "your car", "your watch", not "the car".

| Element | Size | Line spacing | Where |
|---|---|---|---|
| Headline | 56px (capitals 39px tall) | 78px baseline to baseline | See layouts below |
| Sub-line | 22px (capitals 16px tall) | single line | 190px below the headline's last line |

A headline runs two to four lines of about 18 characters, broken by sense,
not by width. A longer, gentler line can run to six lines of up to 20
characters at 49px instead of 56px. Invite rather than instruct: "let us
protect", not "protect". Each line is centred on the slide's text axis.

**Layouts.**

| Slide | Text axis (centre line) | Headline top | Use |
|---|---|---|---|
| Statement | x = 440, text within x 50 to 830 | In the dark space above the subject, 50 to 280 | Slides 1 and 2: the setup and the turn |
| Close | x = 540, centred on the slide | About 360 | Slide 3: a short line, then the sub-line |

On a statement slide the text sits left of centre so the subject can take
the right side. The headline top moves with the image: as high as 50 when
the subject fills the lower two thirds, down to about 280 when the upper
third is empty.

**Crest.** The crest from `public/crest.svg`, alone, no wordmark, in
bronze `#BC906C`, bottom left on every slide: 220px wide (about 280px
tall), 70px from the left edge, 52px from the bottom. It sits directly on
the image, with no panel or shadow behind it.

**Close slide sub-line.** The call to action, in capitals: while preorder
mode is on, "PREORDER FOR NOVEMBER OPEN NOW, LINK IN BIO", with the month
from `PREORDER.ships`. Separate its parts with a comma, not a dash.

**Reference slides**

| File | Layout | Headline |
|---|---|---|
| `slide-1-statement.webp` | Statement, top 51 | Style reference only: its wording names a carmaker, which the copy rule above rules out. The version in use: YOU PROTECT THE / PAINT ON YOUR CAR. / WHY NOT THE WATCH / YOU WEAR DAILY? |
| `slide-2-statement.webp` | Statement, top 278 | Reference: CHANCES ARE, YOU / WEAR YOUR WATCH / MORE THAN YOU / DRIVE YOUR CAR. The version in use, at 49px: YOUR WATCH IS LIKELY / WORN MORE OFTEN THAN / YOUR CAR IS DRIVEN, / SO LET US PROTECT / YOUR MOST-USED / INVESTMENT. |
| `slide-3-close.webp` | Close, top 358 | GET PROTECTED. |

**Canva brand template.** "ChronoProtect+ Instagram carousel", brand
template `EAHWmLk3xss` (source design `DAHWmF28wS0`), 4:5, three pages.
Autofill fields: `photo_1`, `photo_2`, `photo_3`, `headline_1`,
`headline_2`, `headline_3`, `subline_3`. The crest is fixed on every page.
Its sample photos are the ones in `carousel-reference/photos/`, in order:
the rose gold lug, the red car, the bronze car. Canva's API cannot set the
font or tracking, so the template's text is set to Red Hat Display and
about 180 letter-spacing by hand in the editor, in the brand template itself so every copy inherits it.

**Weekly autofill.** Each carousel becomes its own Canva design:

1. Import each slide into Canva with `upload-asset-from-url`, from the
   generation's image URL (Canva fetches Higgsfield's CDN itself) or, for a
   real photo, its media URL.
2. `autofill-design` with brand template `EAHWmLk3xss`, titled
   "ChronoProtect+ carousel, <posting date>, <storyline>". `photo_1` to
   `photo_3` take the three asset IDs in order; `headline_1` to
   `headline_3` take the headlines with a line break between lines;
   `subline_3` takes the close sub-line.
3. Read the new design's thumbnails. The text positions are fixed by the
   template, so check each headline sits in dark space and clear of the
   subject. If one does not, say which slide, and nudge it in Canva before
   posting rather than regenerating.
4. Export the design as PNG, one file per slide, and give the download
   links with the Canva edit link.

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
- Carousel slides leave the space the carousel design needs: the headline
  area dark and empty, the subject kept to the right and lower half, and the
  bottom-left corner clear for the crest. The image itself carries no text;
  the words and the crest are laid on afterwards.
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
- While preorder mode is on (`PREORDER.on` in `lib/site.ts`), every caption
  ends, before the hashtags, with its own line: "On preorder now, shipping
  in November 2026." The month comes from `PREORDER.ships`. When preorder
  mode is off, the line is left out.
- Any post that names a reference number carries the Rolex disclaimer.
- Posts are AI-generated: tick Instagram's AI label when posting.

## Hashtags

Instagram allows at most 5 hashtags per post. Every post uses exactly 5: the
owned tag, then four from the pool below, picked for the post. Tag volumes
were not checked live; Instagram Insights decides what stays.

**Owned, on every post.** `#ChronoProtect`. Hashtags cannot carry a `+`, so
this is the one place the name appears without it.

**Pool**

| Tier | Tags |
|---|---|
| Viral format | `#oddlysatisfying` `#satisfying` `#satisfyingvideo` `#quietluxury` `#luxurylifestyle` `#watchreels` `#watchtok` |
| Generic reach, Reels only, at most one | `#reels` `#reelsinstagram` `#explorepage` |
| Watch community | `#wristcheck` `#watchesofinstagram` `#watchcollector` `#womw` `#wotd` |
| Rolex | `#rolex` `#rolexcollector` `#rolexwatch` `#rolexlover` |
| Rolex model | `#rolexsubmariner` `#rolexdaytona` `#rolexgmt` `#rolexdatejust` `#rolexdaydate` |
| Intent | `#watchprotection` `#watchcare` `#wearyourwatch` `#carsandwatches` |
| New owner, S6 weeks and reference posts only | `#newwatch` `#newrolex` `#rolexunboxing` `#newwatchday` |

**Starting sets**

| Post | Tags |
|---|---|
| Reel, film placed or peeled | `#ChronoProtect #oddlysatisfying #watchprotection #wristcheck #rolexcollector` |
| Reel, the car and the watch | `#ChronoProtect #carsandwatches #quietluxury #wearyourwatch #rolex` |
| Reel, on the wrist | `#ChronoProtect #watchreels #wristcheck #wearyourwatch #rolexcollector` |
| Reel, links or clasp close-up | `#ChronoProtect #satisfying #watchesofinstagram #watchcare #rolexwatch` |
| Carousel, the collection | `#ChronoProtect #watchcollector #rolexcollector #watchesofinstagram #watchcare` |
| Carousel, the fit | `#ChronoProtect #watchprotection #rolexwatch #watchesofinstagram #wotd` |
| Carousel, the long game | `#ChronoProtect #rolexcollector #watchcare #rolex #watchcollector` |
| Reel, day one | `#ChronoProtect #rolexunboxing #newwatchday #wristcheck #rolexcollector` |
| Carousel, day one | `#ChronoProtect #newrolex #newwatch #watchprotection #rolexcollector` |
| Reference post, Submariner 41 | `#ChronoProtect #rolexsubmariner #newrolex #watchprotection #rolexcollector` |

**Rules**

- Reels take one viral-format tag. Carousels take none, and no generic
  reach tags.
- `#carsandwatches` only on the car-and-watch storyline.
- New-owner tags only in S6 weeks and on reference posts. Swap one watch
  or intent tag for one of them. New-owner tag volumes were not checked;
  Insights decides which stay.
- Rolex model tags only on a real photo or video of that exact model, or a
  post about that supported reference with the Rolex disclaimer. Generated
  watches are unbranded, so they never take a model tag.
- Never post the same five tags twice in one week. Swap at least two
  between posts.
- Tags go at the end of the caption, after a blank line.

## Before posting

Run Higgsfield's `virality_predictor` (`action: create`, the Reel's job ID
as a `video` media) on each Reel, then open each dashboard with
`action: preview` for review. It cost no credits on September 25. The
dashboards are HTML on Higgsfield's CDN, which the cloud container cannot
reach, so the scores are read in the Higgsfield viewer, not by the run.
Use its notes on the hook, pacing and sound. A weak score is a reason to
swap the audio or the first frame, not to skip a week.

## Log

### Week of September 28, 2026 (posts September 29 to October 3)

Generated September 25, then redone the same day at high quality with the
film wrapped around each link.

**Tuesday, Reel, thought: an extension, not an addition.** Still `ed9899f1-3ce1-4034-8204-88ee6c3b8a1b`,
video `566cda6c-0ddf-46ac-b25a-7e70fae878cd`.

> The film becomes part of the watch. ChronoShield+ wraps every bracelet
> link on its own, so the bracelet keeps its articulation and the film
> disappears into the brushing. Wear the watch.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #satisfying #watchesofinstagram #wristcheck #rolexcollector

**Thursday, image, thought: Gloss or Stealth.** Made before the image post was dropped from
the schedule, so posting it is optional. Still `e8d76d45-258a-49a3-a69a-81ebc7d4822d`.

> Same film, two finishes. Gloss keeps the polish exactly as it left the
> boutique. Stealth turns it to a soft satin, a quieter presence on the same
> piece. Underneath either one, the original finish stays untouched, and that
> finish is what the watch is valued on.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #watchcollector #watchcare #watchesofinstagram #rolexwatch

**Saturday, Reel, thought: ChronoGuard+ case and clasp.** Still `1e592dfd-5e1d-4e01-adf9-e101abf192b2`,
video `4147fda0-ba69-4adf-af75-350db06a31d6`.

> Case and clasp only. ChronoGuard+ covers the two surfaces a desk scratches
> first and leaves the bracelet bare. The watch goes out every day and comes
> back as it left. Wear the watch.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #oddlysatisfying #watchprotection #wotd #rolexwatch

Captions rewritten on September 25 to follow the content guide. All three
are thought Reels, made before the guide arrived.

Virality predictor jobs, September 25: Tuesday Reel
`fd3bfc4d-2737-47c7-9765-73909b2d41aa`, Saturday Reel
`a3d6297d-587a-4e33-bcf1-b0ee0dc64125`.

The September 28 run makes the week of October 5 (posts October 6, 8 and 10):
storyline S1, pattern B.

### Week of October 5, 2026 (posts October 6 to 10)

Generated September 28, run by hand after the scheduled run could not reach
Higgsfield. Storyline S1, the car and the watch, pattern B. Shot as
close-ups and finishes rather than full watches, at the user's request.

**Tuesday, carousel, emotion: great pieces are made to be used.** Slides
`b74b54f4-859c-46d9-8b2f-5c52210833d6` (film on red paint),
`c8b7b7bb-4082-4b35-99b2-25775b86151a` (film on the bezel edge),
`958d5498-9a20-481e-b7b0-c9cf0d46e6aa` (clasp on the wrist at the wheel).

> Great pieces are made to be used, not kept.
>
> The paint wears a film no one sees. The bezel wears one too, curled over
> its edge. On the drive, the clasp meets the wheel and the steel takes
> nothing. ChronoShield+ is cut to the reference and comes off clean. Wear
> the watch.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #carsandwatches #wearyourwatch #rolexcollector #watchesofinstagram

**Thursday, Reel, thought: the finish no one sees protected is the finish
it is valued on.** Still `d5faf859-9805-4129-924e-6f15dddfd946`, video
`2cce006a-72ca-48d0-a87c-0ee88e3ed5e4`, virality predictor
`540faeeb-0d19-4e1d-b877-60fa82d47583`.

> The polish and the brushing are what the watch is valued on.
> ChronoShield+ wraps every link on its own, so the light finds steel, not
> film. The finish stays as it left the factory. Wear the watch.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #satisfying #watchcare #wristcheck #rolexwatch

**Saturday, carousel, emotion: made to be used, in either finish.** Slides
`41cafef9-41b2-4bc0-9838-51220a6ef26a` (Gloss on the lug),
`9d2d4192-452b-46c6-ab86-6ea59f92f75f` (Stealth on the same lug),
`f0c45b6d-7ed0-498f-9168-814a2bfa5ac0` (on the wrist at the car door).

> Same watch, two finishes, and it goes on the drive in either one.
>
> Gloss keeps the mirror polish exactly as it is. Stealth turns it to a soft
> satin, the same piece in a quieter voice. Either way, the watch leaves the
> car on the wrist, not in the box. Both finishes come on ChronoShield+ and
> ChronoGuard+. Wear the watch.
>
> On preorder now, shipping in November 2026.
>
> #ChronoProtect #carsandwatches #watchcollector #watchprotection #rolex

New uploads in the Higgsfield library, not yet described so not used:
`5e77017d-d639-4103-9c9e-7711d877bc89`,
`187fc378-28fc-4ef1-a1ae-d27b27be7093`,
`626b69f0-9659-45d5-a2b2-c2ccb20e8238`.

The October 5 run makes the week of October 12 (posts October 13, 15 and
17): storyline S2, pattern A.
