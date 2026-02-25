# WCID Internal Dashboard

A real-time dashboard showing key metrics from your WCID Sanity database.

## Metrics Displayed

- **Total Actions** — Overall action count
- **Actions by Verb** — Distribution across categories (Be Heard, Donate, etc.)
- **Actions by Noun** — Top topics
- **Actions by Country** — Geographic distribution
- **US vs International** — Percentage breakdown
- **Be Heard by Level** — Federal, State, Local breakdown
- **Top Skills** — Most common skills
- **Verb + Noun Combos** — Most frequent combinations
- **APL Coverage** — Actions with/without position mappings
- **Positions with Most Actions** — Top APL positions (once imported)

## Quick Deploy to Vercel

### Option 1: One-Click Deploy

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project" → Import your repo
4. Add environment variables:
   - `SANITY_PROJECT_ID` = `syt2s38k`
   - `SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN` = (your read-only token)
5. Click Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add SANITY_PROJECT_ID
vercel env add SANITY_DATASET
vercel env add SANITY_API_TOKEN

# Redeploy with env vars
vercel --prod
```

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Then edit .env.local with your Sanity token

# Run development server
npm run dev

# Open http://localhost:3000
```

## Data Refresh

- Dashboard data refreshes every hour (via Next.js ISR)
- Force refresh by redeploying or visiting `/_vercel/refresh`

## Adding Password Protection (Optional)

For basic auth, add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "WWW-Authenticate",
          "value": "Basic realm=\"WCID Dashboard\""
        }
      ]
    }
  ]
}
```

Or use Vercel's built-in password protection (Pro plan).

## Customization

To add new metrics, edit `lib/sanity.ts`:
1. Add a new GROQ query to the `queries` object
2. Fetch it in `fetchDashboardData()`
3. Display it in `app/page.tsx`

## Tech Stack

- **Next.js 14** — React framework with App Router
- **Sanity Client** — GROQ queries to your CMS
- **Tailwind CSS** — Styling
- **Vercel** — Hosting (free tier works fine)
