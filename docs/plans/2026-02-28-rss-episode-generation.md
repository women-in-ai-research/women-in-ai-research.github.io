# RSS-Driven Episode Generation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace manually-maintained episodes.json with an auto-generated version fetched from the Anchor FM RSS feed, plus a scheduled GitHub Action to keep episodes up to date.

**Architecture:** A Node.js script (`scripts/generate-episodes.ts`) fetches the RSS feed, parses XML, and writes `app/data/episodes.json`. This runs as a `prebuild` step and also via a daily GitHub Action that commits changes and triggers deployment.

**Tech Stack:** TypeScript, Node.js built-in fetch, regex-based XML parsing, Next.js static export, GitHub Actions.

---

### Task 1: Create the RSS-to-JSON generation script

**Files:**
- Create: `scripts/generate-episodes.ts`

**Step 1: Create the script**

The script fetches the RSS feed, parses each `<item>` using regex (no DOM parser in Node), extracts title/description/date/image/audio, numbers episodes chronologically (oldest = 1), and writes `app/data/episodes.json`.

Key details:
- RSS URL: `https://anchor.fm/s/100f18168/podcast/rss`
- RSS items are newest-first, so reverse them before numbering
- Channel-level `<itunes:image>` is the fallback image
- Clean CDATA and HTML tags from descriptions
- Short description = first ~200 chars, long description = full text
- Title format: `Ep.N: <RSS title>`
- `youtubeLink: null`, `spotifyLink: null`, `visible: true` for all
- `episodeLink` = the audio enclosure URL

**Step 2: Run the script to verify it works**

Run: `npx tsx scripts/generate-episodes.ts`
Expected: Prints "Found 15 episodes" and "Wrote episodes.json"

**Step 3: Commit**

```bash
git add scripts/generate-episodes.ts
git commit -m "feat: add RSS-to-episodes.json generation script"
```

---

### Task 2: Add npm scripts for episode generation

**Files:**
- Modify: `package.json`

**Step 1: Add the scripts**

Add to `"scripts"`:
- `"update-episodes": "npx tsx scripts/generate-episodes.ts"`
- `"prebuild": "npx tsx scripts/generate-episodes.ts"`

**Step 2: Verify**

Run: `yarn update-episodes`
Expected: Same output as Task 1 Step 2.

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add update-episodes and prebuild scripts"
```

---

### Task 3: Clean up page components — remove usePodcastFeed usage

**Files:**
- Modify: `app/page.tsx` — remove `usePodcastFeed` import, `RSS_URL`, and pass only `limit={3}` to `EpisodeList`
- Modify: `app/episodes/page.tsx` — same cleanup, just `<EpisodeList />`

Remove all references to `usePodcastFeed`, `RSS_URL`, `episodes`, `loading`, `error` from both pages. `EpisodeList` already reads from `episodes.json` internally.

**Step 1: Commit**

```bash
git add app/page.tsx app/episodes/page.tsx
git commit -m "refactor: remove usePodcastFeed from page components"
```

---

### Task 4: Simplify EpisodeList component interface

**Files:**
- Modify: `app/components/podcast/EpisodeList.tsx`

Change `EpisodeListProps` to only have `limit?: number`. Remove the `episodes`, `loading`, `error` props. Remove the `Episode` import from `@/lib/types/podcast.types`.

**Step 1: Verify build**

Run: `yarn build:local`
Expected: Build succeeds.

**Step 2: Commit**

```bash
git add app/components/podcast/EpisodeList.tsx
git commit -m "refactor: simplify EpisodeList to only accept limit prop"
```

---

### Task 5: Delete unused usePodcastFeed hook and clean up types

**Files:**
- Delete: `app/hooks/usePodcastFeed.ts`
- Check/delete: `lib/types/podcast.types.ts` if unused

**Step 1: Grep for remaining usages before deleting**

**Step 2: Delete and commit**

```bash
git add -A
git commit -m "chore: remove unused usePodcastFeed hook and dead types"
```

---

### Task 6: Add GitHub Action for scheduled episode updates

**Files:**
- Create: `.github/workflows/update-episodes.yml`

The workflow:
- Triggers daily at midnight UTC via cron, plus manual `workflow_dispatch`
- Checks out repo, installs deps, runs `yarn update-episodes`
- If `episodes.json` changed, commits and pushes to main
- The push to main triggers the existing `deploy.yml` automatically

```yaml
name: Update episodes from RSS

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-episodes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: yarn
      - run: yarn install
      - run: yarn update-episodes
      - name: Check for changes
        id: changes
        run: |
          git diff --quiet app/data/episodes.json && echo "changed=false" >> $GITHUB_OUTPUT || echo "changed=true" >> $GITHUB_OUTPUT
      - name: Commit and push
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add app/data/episodes.json
          git commit -m "chore: update episodes from RSS feed"
          git push
```

**Step 1: Commit**

```bash
git add .github/workflows/update-episodes.yml
git commit -m "feat: add GitHub Action for daily RSS episode updates"
```

---

### Task 7: Final verification

**Step 1:** Run `yarn update-episodes` — expect 15 episodes
**Step 2:** Run `yarn build:local` — expect clean build
**Step 3:** Run `yarn serve` and check homepage (3 episodes) and /episodes (all 15)
**Step 4:** Final commit if any fixes needed
