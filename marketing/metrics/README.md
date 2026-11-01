# Marketing metrics

The numbers behind the dashboard's Marketing tab
(`python3 marketing/dashboard/server.py`, then the Marketing tab). Edit them
there, or here, and commit after.

| File | What it holds | Who fills it |
|---|---|---|
| `weekly.csv` | Account totals per week, Monday's date first | You, once a week |
| `posts.csv` | One row per post, seeded from the schedule log | You, for the posts worth comparing |
| `goals.csv` | The six-month goals, November 2026 to April 2027 | Set; change only on purpose |
| `../touches.csv` | Every email, call, visit, reply and step change | Automatic, from the dashboard and the follow-up task |

## Filling in a week

Every Monday, for the week just ended, click the week in the dashboard.

From Instagram Insights (professional dashboard, last 7 days):

- **Instagram views**: Views.
- **Reels posted**: Reels published that week.
- **Instagram reach**: Accounts reached.
- **Profile visits** and **Link clicks** (external link taps).
- **Followers**: the total at the end of the week.

From Vercel Analytics (chronoprotect.store, last 7 days):

- **Website visitors**: Visitors.
- **From Instagram**: the instagram.com and l.instagram.com referrers. The bio
  link should end in `?utm_source=instagram` so it is counted even when the
  referrer is lost.
- **From outreach email**: `utm_source=outreach`. The email buttons carry it.
- **From dealer card**: `utm_source=dealer-card`. The card's QR code carries it.
- **Search and direct**: everything else.

From Shopify: **Orders** placed that week.

## Posts

Posts from the log are listed already; mark **Posted** yes for the ones that
went out. Fill a post's numbers from its Insights seven days after it went
up, so posts compare fairly. Log every Reel past 10,000 views: breakouts
count toward the monthly goal.
