"""Prospect dashboard, served from this computer only.

    python3 marketing/dashboard/server.py            # then open http://localhost:8765
    python3 marketing/dashboard/server.py --port 9000

Reads and writes the same trackers as followups.py
(marketing/austin-prospects.csv and marketing/texas-prospects.csv), so the
dashboard, the script and the scheduled follow-ups always agree. Standard
library only: nothing to install.
"""

import argparse
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
