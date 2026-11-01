"""Store follow-ups for the retail outreach.

Reads the two prospect trackers, lists the follow-ups that are due, and
records each touch so the next one is scheduled from the store's step.
The steps and the cadence are explained in store-qualification.md.

    python3 marketing/followups.py due [--date YYYY-MM-DD]
    python3 marketing/followups.py touch austin 3 email [--date YYYY-MM-DD] [--note "..."]
    python3 marketing/followups.py step austin 3 4 [--date YYYY-MM-DD]

`touch` records a touch at the store's current step (email, call, visit,
mail, dm, demo, proposal) and schedules the next one. `step` moves a store to
a new step (0 to 8, or "out"), resets its touch count and schedules the first
action of that step. Both rewrite the CSV in place.
"""

import argparse
import csv
import datetime as dt
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = {"austin": HERE / "austin-prospects.csv", "texas": HERE / "texas-prospects.csv"}

STEPS = {
    "0": "Confirm",
    "1": "Fit",
    "2": "Decision maker",
    "3": "Conversation",
    "4": "Demo",
    "5": "Fitter",
    "6": "Proposal",
    "7": "Signed",
    "8": "Live",
    "out": "Out",
}

# Per step, what happens after each touch with no step change: (days after the
# last touch, kind, action). The last entry repeats; "park" pauses the store.
CADENCE = {
    "0": [(2, "call", "Confirm the store exists, its address and hours, and that it sells or services Rolex")],
    "1": [
        (0, "call", "Call: ask who decides on watch accessories, and for their email"),
        (5, "visit", "Visit and ask for the owner or watch buyer"),
        (7, "call", "Call again for the decision maker's name"),
        (30, "park", "Parked after three tries: new-year email (template 3) in January"),
    ],
    "2": [
        (0, "email", "Email template 1 (template 1R for a Rolex store)"),
        (4, "email", "Short follow-up email: one line, offer to bring a sample"),
        (4, "call", "Call the decision maker"),
        (7, "visit", "Visit with the sample, or a mailer outside Austin"),
        (0, "park", "Parked after four tries: new-year email (template 3) in January"),
    ],
    "3": [
        (1, "email", "Template 2 recap within 24 hours, offer a demo on a display piece"),
        (3, "call", "Call to book the demo"),
        (7, "visit", "Drop in with the sample to show it"),
        (30, "park", "Parked: no demo booked; check in next month"),
    ],
    "4": [
        (1, "email", "Thank them for the demo; ask who would fit and where the appointments would happen"),
        (3, "call", "Call: confirm the fitter and which level suits them"),
        (7, "visit", "Visit to meet the fitter"),
        (30, "park", "Parked: no fitter yet; check in next month"),
    ],
    "5": [
        (2, "email", "Send the proposal: level, opening order and the partner agreement"),
        (4, "call", "Call about the proposal"),
    ],
    "6": [
        (3, "email", "Check in on the proposal"),
        (4, "call", "Call: any questions, and a start date"),
        (7, "visit", "Visit to sign"),
        (30, "park", "Parked: no decision after three weeks; check in next month"),
    ],
    "7": [
        (7, "visit", "Onboard: opening kits, train the fitter on a display piece, fitting cards"),
        (14, "call", "Check in: fittings booked, stock, questions from staff"),
        (30, "call", "Monthly check-in: sales, stock, reorder"),
    ],
    "8": [(30, "call", "Monthly check-in: sales, stock, reorder")],
    "out": [],
}

# No follow-ups over Thanksgiving or the holiday pause (plan weeks 9 and 10).
BLACKOUTS = [
    (dt.date(2026, 11, 26), dt.date(2026, 11, 29)),
    (dt.date(2026, 12, 21), dt.date(2027, 1, 3)),
]
PARK_UNTIL = dt.date(2027, 1, 4)
VISIT_DAYS = {2, 4, 5}  # Wednesday and Friday evenings, Saturday from opening


def step_key(value: str) -> str:
    token = (value or "0").split()[0].lower()
    return token if token in STEPS else "0"


def step_label(key: str) -> str:
    return STEPS[key] if key == "out" else f"{key} {STEPS[key]}"


def in_blackout(day: dt.date) -> bool:
    return any(start <= day <= end for start, end in BLACKOUTS)


def schedule(day: dt.date, kind: str, in_austin: bool) -> dt.date:
    """Moves a date onto a day the action can happen."""
    allowed = VISIT_DAYS if kind == "visit" and in_austin else {0, 1, 2, 3, 4}
    while day.weekday() not in allowed or in_blackout(day):
        day += dt.timedelta(days=1)
    return day


def plan_next(row: dict, today: dt.date, in_austin: bool) -> None:
    key = step_key(row["Step"])
    steps = CADENCE[key]
    if not steps:
        row["Next touch"], row["Next action"] = "", "Out: no follow-up"
        return
    touches = int(row.get("Touches") or 0)
    days, kind, action = steps[min(touches, len(steps) - 1)]
    if kind == "park":
        when = PARK_UNTIL if key in ("1", "2") else today + dt.timedelta(days=days)
        row["Next touch"] = schedule(when, "email", in_austin).isoformat()
        row["Next action"] = action
        return
    if kind == "visit" and not in_austin:
        kind, action = "call", action.replace("Visit", "Call (or visit on a booked trip day)", 1)
    row["Next touch"] = schedule(today + dt.timedelta(days=days), kind, in_austin).isoformat()
    row["Next action"] = action


def load(name: str):
    with open(FILES[name], newline="") as f:
        reader = csv.DictReader(f)
        return reader.fieldnames, list(reader)


def save(name: str, fields, rows) -> None:
    with open(FILES[name], "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def find(rows, number: str) -> dict:
    for row in rows:
        if row["#"] == number:
            return row
    raise KeyError(f"No store #{number}")


def cmd_due(args) -> None:
    today = dt.date.fromisoformat(args.date)
    due = []
    for name in FILES:
        _, rows = load(name)
        for row in rows:
            if row["Next touch"] and dt.date.fromisoformat(row["Next touch"]) <= today:
                due.append((name, row))
    due.sort(key=lambda item: (item[1]["Next touch"], -int(item[1]["Priority"] or 0)))
    print(f"# Follow-ups due by {today.isoformat()}\n")
    if not due:
        print("Nothing due.")
        return
    print("| Due | List | # | Store | Step | Priority | Action | Contact |")
    print("|---|---|---|---|---|---|---|---|")
    for name, row in due:
        contact = ", ".join(x for x in (row["Decision maker"][:60], row["Email"], row["Phone"]) if x)
        print(f"| {row['Next touch']} | {name} | {row['#']} | {row['Shop']} | {row['Step']} | "
              f"{row['Priority']} | {row['Next action']} | {contact} |")


def record_touch(name: str, number: str, kind: str, day: dt.date, note: str = "") -> dict:
    """Records a touch at the store's current step and schedules the next one."""
    fields, rows = load(name)
    row = find(rows, number)
    row["Last touch"], row["Last touch type"] = day.isoformat(), kind
    row["Touches"] = str(int(row.get("Touches") or 0) + 1)
    if note:
        row["Notes"] = f"{day.isoformat()}: {note}. {row['Notes']}".strip()
    plan_next(row, day, name == "austin")
    save(name, fields, rows)
    return row


def move_step(name: str, number: str, step: str, day: dt.date) -> dict:
    """Moves a store to a new step and schedules that step's first action."""
    fields, rows = load(name)
    row = find(rows, number)
    key = step_key(step)
    row["Step"], row["Touches"] = step_label(key), "0"
    plan_next(row, day, name == "austin")
    save(name, fields, rows)
    return row


EDITABLE = {"Decision maker", "Phone", "Email", "Instagram", "Notes", "Level and code", "Next touch", "Next action"}


def update_fields(name: str, number: str, changes: dict) -> dict:
    """Edits the contact and note fields of one store."""
    fields, rows = load(name)
    row = find(rows, number)
    for key, value in changes.items():
        if key in EDITABLE:
            row[key] = str(value).strip()
    save(name, fields, rows)
    return row


def cmd_touch(args) -> None:
    row = record_touch(args.list, args.number, args.kind, dt.date.fromisoformat(args.date), args.note or "")
    print(f"{row['Shop']}: next {row['Next touch']}, {row['Next action']}")


def cmd_step(args) -> None:
    row = move_step(args.list, args.number, args.step, dt.date.fromisoformat(args.date))
    print(f"{row['Shop']}: {row['Step']}, next {row['Next touch']}, {row['Next action']}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    today = dt.date.today().isoformat()

    due = sub.add_parser("due")
    due.add_argument("--date", default=today)
    due.set_defaults(run=cmd_due)

    touch = sub.add_parser("touch")
    touch.add_argument("list", choices=FILES)
    touch.add_argument("number")
    touch.add_argument("kind", choices=["email", "call", "visit", "mail", "dm", "demo", "proposal"])
    touch.add_argument("--date", default=today)
    touch.add_argument("--note")
    touch.set_defaults(run=cmd_touch)

    step = sub.add_parser("step")
    step.add_argument("list", choices=FILES)
    step.add_argument("number")
    step.add_argument("step")
    step.add_argument("--date", default=today)
    step.set_defaults(run=cmd_step)

    args = parser.parse_args()
    args.run(args)


if __name__ == "__main__":
    main()
