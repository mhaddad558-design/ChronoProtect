# Visits and emails on hold

Put on hold on November 8, 2026, until the supplier and the product are
confirmed. The schedule then starts over: new dates, rebuilt from the
store hours and visit rules in `retail-outreach.md`.

## What was paused

- **Emails, from November 8.** `EMAILS_ON_HOLD = True` in `followups.py`.
  No first email or follow-up is scheduled or drafted. Bernard Watch Co.,
  Exclusive Timepieces, Jonathan's Fine Jewelers, DeMesy & Co. and The
  Diamond Factory had an email due and now carry no date. The seven
  unsent Gmail drafts stay in store@chronoprotect.co, with the visit dates
  and "Kits ship in November" taken out; do not send them until the hold
  is lifted. Calls to find the right person carry on.

- **Tracker visits.** `VISITS_ON_HOLD = True` in `followups.py`. While it is
  on, no visit is scheduled: a store whose next action would be a visit gets
  no date and the action "On hold: visit once supplier and product are
  confirmed". Calls, emails and confirms carry on as before. To restart,
  set it to False and run `python3 marketing/followups.py resume` to give
  every held store a date again. The same works for emails with
  `EMAILS_ON_HOLD`.
- **Google Calendar.** The visit and trip events below were removed from
  mhaddad558@gmail.com. Their details are kept here so they can be
  recreated on new dates. Nothing else on the calendar was touched.

## Removed calendar events

All times America/Chicago.

| Was | Event | Notes |
|---|---|---|
| Wed Nov 11 and Fri Nov 13, 5 to 7 pm | Evening visits: pre-owned Rolex dealers | ATX Watches, Regard, DJP, Hilderbrand, Zadok return visit; by appointment Diamonds Above and Bernard |
| Sat Nov 14, 10 am to 2 pm | Saturday visits: pre-owned dealers and service shops | Hilderbrand, Benold's, Time Masters, Korman return; call first: ATX Watches, Copeland, Martinez & Hood, Rees |
| Wed Nov 18 and Fri Nov 20, 5 to 7 pm | Evening visits: demos and first proposals | Return demos; Twelve Tables (512-636-4301) |
| Sat Nov 21, 8:30 am to 5:30 pm | Trip: San Antonio watch stores | Lee Michaels (La Cantera and Alamo Quarry), Watch Affinity, Diamond & Jewelry Gallery, Exclusive Timepieces, Broadway Watches, Gurinsky's |
| Wed Nov 25, 5 to 6:30 pm | Evening visits: close store 1 | Thanksgiving eve; call first |
| Wed Dec 2 and Fri Dec 4, 5 to 7 pm | Evening visits: onboarding and holiday drop-ins | |
| Sat Dec 5, 10 am to noon | Saturday drop-ins: holiday | Hilderbrand, Benold's, Time Masters, Korman, Zadok |
| Wed Dec 9 and Fri Dec 11, 5 to 7 pm | Evening visits: close store 2 | |
| Sat Dec 12, 10 am to noon | Saturday drop-ins: close store 2 | |
| Wed Jan 6 and Fri Jan 8, 5 to 7 pm | Evening visits: January re-engagement | |
| Sat Jan 9, 7 am to 7 pm | Trip: Houston watch stores | deBoulle, Deutsch (Galleria and Westheimer), Zadok Post Oak, Thomas Markle; Ace Watch, FS Fine Watches, Jonathan's, Swiss Watch Company |
| Wed Jan 13 and Fri Jan 15, 5 to 7 pm | Evening visits: close store 3 | |
| Sat Jan 16, 7 am to 7 pm | Trip: Dallas-Fort Worth watch stores | Bachendorf's (three stores), Eiseman, Pieter Andries; DeMesy, Grand Caliber, The Diamond Factory, Chamosa, Marc Samuels |
| Wed Jan 20 and Fri Jan 22, 5 to 7 pm | Evening visits: close store 4 | |
| Sat Jan 23, 10 am to 2 pm | Saturday visits: close store 4 | Then the quarter review |

The visits already past (Zadok, Wed Nov 4; Korman, Fri Nov 6) were left
on the calendar as they happened, or did not.

## Stores whose visit was held

Zadok Jewelers (Austin, with Zadok Houston), Korman Fine Jewelry, Benold's
Jewelers, Martinez & Hood. Any other store reaching a visit in its cadence
is held the same way.
