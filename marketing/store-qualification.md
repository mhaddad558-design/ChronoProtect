# Store qualification

Every store on the two prospect lists sits on one step. A store moves up
only when the step's question has a clear yes, backed by something you saw
or heard, never on a hunch. The step sets the next action and when it is
due, and the follow-ups are drafted automatically (see Automation, below).

The steps live in the `Step` column of `austin-prospects.csv` and
`texas-prospects.csv`, next to `Priority`, `Last touch`, `Last touch type`,
`Touches`, `Next touch` and `Next action`.

## The steps

| Step | The question | It clears when | What you do at this step |
|---|---|---|---|
| 0 Confirm | Does the store exist, where, and when is it open? | An address and hours confirmed by phone, its own site or a visit | Call, or check its own site; no pitching |
| 1 Fit | Does it sell or service Rolex Datejust, Submariner, GMT-Master II or Daytona? | Rolex in its stock, its listings or its service work | Find who decides: call or visit and ask for the owner or watch buyer |
| 2 Decision maker | Do we know who decides, and how to reach them? | A name and a direct email or phone, or a meeting booked | Template 1 (1R for a Rolex store), then the cadence below |
| 3 Conversation | Has the decision maker heard the pitch and agreed the problem is real? | They say clients scratch watches, ask for protection, or bring watches back for polishing | Recap (template 2) and book a demo |
| 4 Demo | Have they seen the film fitted on a watch? | A sample fitted on one of their display pieces, and a question about margin, terms or fitting | Ask who would fit and where the appointments would happen |
| 5 Fitter | Can they fit by appointment? | A watchmaker, bench or trainable staff member named, with a quiet place to fit. For a Rolex store, its agreement with Rolex allows it | Send the proposal |
| 6 Proposal | Do they have a level and terms in hand? | Stock and fit, order and fit, or the card, on paper with the partner agreement | Follow up to a yes or a no |
| 7 Signed | Is the agreement signed and the first order in? | A signed agreement and a stock order or first order-and-fit order | Onboard: opening kits, train the fitter, fitting cards |
| 8 Live | Are clients being fitted? | The first client fitting done | Monthly check-in and reorders |
| Out | Is there a reason to stop? | One of the reasons below | Record the reason; recheck only if it changes |

A store can skip a step when the evidence arrives together: an owner who
asks for a demo on the first call goes from 2 to 3 to 4 in one visit.

**Reasons for Out.** It sells and services no Rolex. It has closed. A brand
or parent company decides, and it will not refer us. Or it said no twice,
with a reason that will not change this quarter.

**A Rolex store whose agreement rules out fitting** does not go Out. It
stays at step 5 and takes the card level instead: a card in the box that
books the fitting elsewhere.

## Questions to ask in the store

Each question clears a step, so ask them in this order and note the answers
in the tracker the same day.

1. Who decides what the store sells alongside its watches? (step 2)
2. How many Datejust, Submariner, GMT-Master II and Daytona go out each
   month, roughly? (priority)
3. Do clients come back with scratches, or ask how to protect a new watch?
   (step 3)
4. Could I fit a sample on one of your display pieces? (step 4)
5. Who on your team would fit it, and where could clients book an hour?
   For a Rolex store: does your agreement allow your team to fit film on a
   watch you have sold? (step 5)
6. Which suits you: kits on your shelf, or ordering one per sale? (step 6)

## Priority

Priority orders the stores within a step, so the best ones get the next
free evening or Saturday. It is a score out of 9 from desk research, and it
changes as you learn more.

| Factor | 3 | 2 | 1 | 0 |
|---|---|---|---|---|
| Rolex volume | Rolex retailer, or a large pre-owned Rolex stock | Regular pre-owned Rolex | Services Rolex only | No Rolex, or not yet known |
| Fitting hands | | Watchmaker or bench on site | Jeweler staff | None, or not known |
| Who decides | | The owner, in the store | A group or head office | A brand or parent company |
| Reach | | Austin, open on Wednesday or Friday evening or Saturday | By appointment, or a city trip | Not reachable this quarter |

## Follow-up cadence

After each touch with no change of step, the next one is due this many days
later, moved to a weekday for email and calls, and to a Wednesday, Friday or
Saturday for an Austin visit. Outside Austin a visit becomes a call, or a
visit on a booked trip day. Nothing is due over Thanksgiving (November 26 to
29) or the holiday pause (December 21 to January 3).

| Step | First touch | Then | Then | Then | After that |
|---|---|---|---|---|---|
| 0 Confirm | Call | Call every 2 days until confirmed | | | |
| 1 Fit | Call for the decision maker | Visit, 5 days | Call, 7 days | | Park until January 4 |
| 2 Decision maker | Template 1 or 1R | Short follow-up email, 4 days | Call, 4 days | Visit or mailer, 7 days | Park until January 4, then template 3 |
| 3 Conversation | Template 2, next day | Call to book the demo, 3 days | Drop in with the sample, 7 days | | Park 30 days |
| 4 Demo | Thank-you, next day | Call about the fitter and level, 3 days | Visit to meet the fitter, 7 days | | Park 30 days |
| 5 Fitter | Proposal, 2 days | Call, 4 days | | | |
| 6 Proposal | Check-in, 3 days | Call, 4 days | Visit to sign, 7 days | | Park 30 days |
| 7 Signed | Onboarding visit, 7 days | Check-in, 14 days | Monthly | | |
| 8 Live | Monthly check-in | | | | |

## Automation

**The script.** `marketing/followups.py` reads both trackers and keeps the
dates:

```
python3 marketing/followups.py due                       # what is due today
python3 marketing/followups.py touch austin 3 call --note "Owner is Sam"
python3 marketing/followups.py step austin 3 3           # move to step 3
```

`touch` records what happened and schedules the next follow-up from the
cadence; `step` moves a store and schedules the first action of its new
step.

**The scheduled task.** "Store follow-ups" runs on Monday, Thursday and
Saturday at 7:43 am Central, the mornings after the visit evenings and the
Saturday rounds. With Gmail connected, it:

1. Checks Gmail's Sent folder for anything sent to a tracked store since
   the last touch, and logs it, so a sent draft needs no note.
2. Reads replies from those stores and lists each with the step it would
   clear. A reply never moves a store on its own; you confirm.
3. Creates a Gmail draft for every email that is due and has an address.
   First emails use the branded HTML template; follow-ups are short plain
   text with your Gmail signature, replying in the earlier thread. A draft
   still unsent from an earlier run is updated rather than doubled.
4. Writes the call sheets, visit notes and mailers to
   `marketing/followups/<date>.md`, and replies with a short summary and
   the draft links.

Nothing is ever sent automatically: you open each draft, read it and send
it. Drafts come from the Gmail account you connected, so a reply comes back
there rather than to store@chronoprotect.co.

**Telling it what happened.** Calls and visits need one line: "Korman, met
Kat, wants a demo next week". The tracker is updated with the touch, the
step, the next date and any new name or email address. A store with no
news stays due, and comes back in each run until it is done or parked.

## Where the stores start

Set on November 1 from the prospect research, before any contact.

| Step | Stores |
|---|---|
| 0 Confirm | 14 |
| 1 Fit | 13 |
| 2 Decision maker | 31 |
| Out | 3: L Majors (no Rolex), Omega Boutique (brand boutique), Time Delay Corp (wholesaler) |

Highest priority: Korman and ATX Watches (9); Diamond & Jewelry Gallery,
Eiseman and Deutsch (8). Group rows (Bachendorf's, Lee Michaels, Deutsch,
DJP, Zadok) are pitched once, through the row marked as the lead; the
others say "With row n" and carry no date of their own.
