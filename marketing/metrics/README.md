# Marketing metrics

The numbers behind the dashboard's Marketing tab
(`python3 marketing/dashboard/server.py`, then the Marketing tab). Edit them
there, or here, and commit after.

| File | What it holds | Who fills it |
|---|---|---|
| `weekly.csv` | Account totals per week, Monday's date first | You for Instagram and orders; the website columns fill themselves from Vercel |
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

From Vercel Analytics, nothing to do: the Monday run of the "Store follow-ups"
scheduled task reads it through the Vercel connector and fills:

- **Website visitors**: every visitor that week.
- **From Instagram**: the instagram.com and l.instagram.com referrers.
- **From outreach email**: visitors to `/partners`, the page the email's
  "See what it adds" button opens.
- **From dealer card**: visitors to `/care`, the page the card's QR code
  opens.
- **Search and direct**: everything else.

The two pages are counted only when the visit did not come from another page
on chronoprotect.store, so someone clicking through from the footer is not
counted as an email or a card. Vercel's Hobby plan keeps only 31 days of
analytics, which is why the task pulls every week. Campaign tags (UTM) stay
on the email link but are not read: Vercel reports them only on its paid
plans. Weeks before November 2026 have no email or card figures, because the
pages did not exist yet.

From Shopify: **Orders** placed that week.

## Posts

Posts from the log are listed already; mark **Posted** yes for the ones that
went out. Fill a post's numbers from its Insights seven days after it went
up, so posts compare fairly. Log every Reel past 10,000 views: breakouts
count toward the monthly goal.
