# RSS-Driven Episode Generation

## Problem
Episodes are manually maintained in `app/data/episodes.json`. This gets out of date and requires manual updates whenever a new episode is published.

## Solution
A build-time script fetches the Anchor FM RSS feed and generates `episodes.json` automatically. A scheduled GitHub Action ensures the site rebuilds daily to pick up new episodes.

## Components

### 1. Build-time script (`scripts/generate-episodes.ts`)
- Fetches RSS from `https://anchor.fm/s/100f18168/podcast/rss`
- Parses XML, maps each `<item>` to the episode JSON format
- Extracts: title, description, publish date, image (RSS artwork), audio URL, duration
- Numbers episodes chronologically (oldest = ep 1)
- Sets `visible: true`, `youtubeLink: null`, `spotifyLink: null`
- Writes to `app/data/episodes.json`

### 2. Component updates
- `EpisodeList.tsx`: Keep as-is (buttons already handle null links gracefully)
- Remove `usePodcastFeed` hook usage from `page.tsx` and `episodes/page.tsx`
- Clean up unused RSS_URL constants

### 3. NPM scripts
- `"update-episodes": "npx tsx scripts/generate-episodes.ts"`
- `"prebuild": "npm run update-episodes"`

### 4. GitHub Action (`.github/workflows/update-episodes.yml`)
- Cron schedule: daily at midnight UTC
- Runs `npm run update-episodes`
- If `episodes.json` changed, commits and pushes, triggering deploy

### 5. Data shape
```json
{
  "id": "15",
  "title": "Episode title from RSS",
  "description": "Short description",
  "longDescription": "Full RSS description",
  "publishDate": "February 11, 2026",
  "imageUrl": "https://d3t3ozftmdmh3i.cloudfront.net/...",
  "imagePosition": "center center",
  "episodeLink": "https://anchor.fm/.../audio.mp3",
  "youtubeLink": null,
  "spotifyLink": null,
  "visible": true
}
```

## Decisions
- RSS is the sole data source (no manual overrides)
- YouTube/Spotify per-episode links are dropped
- Episode images come from RSS artwork
- Fetch happens at build time, not client-side
