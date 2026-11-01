"""Prospect dashboard, served from this computer only.

    python3 marketing/dashboard/server.py            # then open http://localhost:8765
    python3 marketing/dashboard/server.py --port 9000

Reads and writes the same trackers as followups.py
(marketing/austin-prospects.csv and marketing/texas-prospects.csv), so the
dashboard, the script and the scheduled follow-ups always agree. Standard
library only: nothing to install.
"""

import argparse
import csv
import datetime as dt
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import followups  # noqa: E402

PAGE = HERE / "index.html"
FOLLOWUPS = HERE.parent / "followups"
METRICS = HERE.parent / "metrics"
# Each metrics sheet, the column that identifies a row, and the columns that are text.
SHEETS = {
    "weekly": ("weekly.csv", "Week", set()),
    "posts": ("posts.csv", "ID", {"Date", "Format", "Storyline", "World", "Angle", "Day theme", "Post", "Posted"}),
    "goals": ("goals.csv", "Month", set()),
}


def read_sheet(name: str):
    path = METRICS / SHEETS[name][0]
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return reader.fieldnames, list(reader)


def write_sheet(name: str, fields, rows) -> None:
    with open(METRICS / SHEETS[name][0], "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def update_sheet(name: str, key: str, changes: dict, add: bool = False) -> dict:
    """Edits one row of a metrics sheet, or adds it. Numbers stay numbers."""
    fields, rows = read_sheet(name)
    key_col, text_cols = SHEETS[name][1], SHEETS[name][2]
    row = next((r for r in rows if r[key_col] == key), None)
    if row is None:
        if not add:
            raise KeyError(f"No {key_col.lower()} {key}")
        row = {field: "" for field in fields}
        row[key_col] = key
        rows.append(row)
    for col, value in changes.items():
        if col not in fields or col == key_col:
            continue
        value = str(value).strip()
        if col not in text_cols and value:
            value = value.replace(",", "")
            if not value.isdigit():
                raise ValueError(f"{col} must be a whole number")
        row[col] = value
    if name == "posts":
        rows.sort(key=lambda r: (r["Date"], r["ID"]))
    write_sheet(name, fields, rows)
    return row


def metrics() -> dict:
    sheets = {name: read_sheet(name)[1] for name in SHEETS}
    touches = []
    if followups.TOUCHES.exists():
        with open(followups.TOUCHES, newline="", encoding="utf-8") as f:
            touches = list(csv.DictReader(f))
    prospects = [row for name in followups.FILES for row in followups.load(name)[1]]
    return {"today": dt.date.today().isoformat(), **sheets, "touches": touches,
            "steps": [followups.step_key(r["Step"]) for r in prospects]}


def snapshot() -> dict:
    lists = {}
    for name in followups.FILES:
        fields, rows = followups.load(name)
        lists[name] = {"fields": fields, "rows": rows}
    files = sorted(p.name for p in FOLLOWUPS.glob("*.md")) if FOLLOWUPS.exists() else []
    return {
        "today": dt.date.today().isoformat(),
        "lists": lists,
        "steps": followups.STEPS,
        "editable": sorted(followups.EDITABLE),
        "kinds": followups.KINDS,
        "followups": files[-5:],
    }


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, body: bytes, kind: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", kind)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status: int, data) -> None:
        self._send(status, json.dumps(data).encode(), "application/json")

    def do_GET(self) -> None:
        if self.path in ("/", "/index.html"):
            self._send(200, PAGE.read_bytes(), "text/html; charset=utf-8")
        elif self.path == "/api/prospects":
            self._json(200, snapshot())
        elif self.path == "/api/metrics":
            self._json(200, metrics())
        elif self.path.startswith("/followups/"):
            name = Path(self.path).name
            target = FOLLOWUPS / name
            if target.suffix == ".md" and target.exists():
                self._send(200, target.read_bytes(), "text/plain; charset=utf-8")
            else:
                self._json(404, {"error": "Not found"})
        else:
            self._json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(length) or b"{}")
            if self.path.startswith("/api/metrics/"):
                sheet = self.path.rsplit("/", 1)[1]
                if sheet not in SHEETS:
                    raise KeyError(f"Unknown sheet {sheet}")
                row = update_sheet(sheet, str(body["key"]), body.get("changes", {}), bool(body.get("add")))
                self._json(200, {"row": row})
                return
            name, number = body["list"], str(body["number"])
            if name not in followups.FILES:
                raise KeyError(f"Unknown list {name}")
            day = dt.date.fromisoformat(body.get("date") or dt.date.today().isoformat())
            if self.path == "/api/touch":
                row = followups.record_touch(name, number, body["kind"], day, body.get("note", ""))
            elif self.path == "/api/step":
                row = followups.move_step(name, number, body["step"], day)
            elif self.path == "/api/update":
                row = followups.update_fields(name, number, body.get("changes", {}))
            else:
                self._json(404, {"error": "Not found"})
                return
            self._json(200, {"row": row})
        except (KeyError, ValueError, json.JSONDecodeError) as error:
            self._json(400, {"error": str(error)})

    def log_message(self, *args) -> None:
        pass


def main() -> None:
    parser = argparse.ArgumentParser(description="Prospect dashboard")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    # Bound to this computer only: the trackers hold contact details.
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Prospect dashboard on http://localhost:{args.port} (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
