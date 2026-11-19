## Welcome to Women in AI Research (WiAIR) 👋

Women in AI Research (WiAIR) is a podcast dedicated to celebrating the remarkable contributions of female AI researchers from around the globe. Our mission is to challenge the prevailing perception that AI research is predominantly male-driven. 

## 🎙️ About WiAIR

In WiAIR, we interview successful female AI researchers coming from diverse cultural backgrounds, showcasing their inspirational cutting-edge research and insights into the future of AI. Through these conversations, we explore their personal journeys - how they overcome unique challenges, balance careers and family life, and make difficult decisions when necessary. We aim to understand how women in AI research perceive success and what it takes to achieve their goals. 

With the WiAIR podcast, our goal is to empower early career researchers, especially women, to pursue their passion for AI and make an impact in this exciting rapidly growing field. You will learn from women at different career stages, stay updated on the latest research and advancements, hear powerful stories of overcoming obstacles and breaking stereotypes, and become part of the community that values diversity and inclusion in AI.

## 🎧 Why Listen?
- ⁠**Gain Insights**: Learn from leading women in AI and stay updated on the latest research and developments.
- ⁠**Be Inspired:** Hear powerful stories of overcoming obstacles and breaking stereotypes.
- ⁠**Connect**: Join a community of like-minded early career researchers and build your network.

## 🌐 Socials
- [LinkedIn](https://www.linkedin.com/company/women-in-ai-research)
- [X (Twitter)](https://x.com/WiAIR_podcast)
- [Bluesky](https://bsky.app/profile/wiair.bsky.social)
- [YouTube](https://www.youtube.com/@WomeninAIResearch)
- [Spotify](https://creators.spotify.com/pod/show/wiair)
- [Website](https://women-in-ai-research.github.io/)

## ⁠📅 Release Schedule 

New episodes are released every three weeks.

## 👥💬 Join our Discord

[Invitation link](https://discord.gg/267DPacHT5)

## 🔄 How the website updates itself

Episodes, guests and events on the website come from the [WiAIR YouTube channel](https://www.youtube.com/@WomeninAIResearch). A GitHub Action (`.github/workflows/update-content.yml`) runs every day, and you can also start it by hand from the **Actions** tab ("Run workflow").

- **Episodes**: every video in the playlists shown in the channel's **Podcasts** section, numbered in order of publication.
- **Events**: only event playlists: the ones listed in `eventPlaylistIds` in `data/youtube-config.json`, plus any playlist whose YouTube description contains `[Events]`. Other videos (trailers, clips, Shorts) are not shown.
- **Guests**: built from the episodes, using the "About [guest]" section of each video description (or "with [guest]" in the title).

To add a headshot, title or bio for a guest, put the photo in `public/images/guests/` and add an entry to `data/guest-overrides.json`; anything there takes priority over what comes from YouTube. Other settings (which playlists count as podcasts, videos to exclude, Shorts) are in `data/youtube-config.json`.

The workflow needs a YouTube Data API key saved as the repository secret `YOUTUBE_API_KEY`. To run it locally: `YOUTUBE_API_KEY=... yarn update-content`.

## 🏷️ Topics

Topic pages (`/topics/<slug>/`) are built from `data/topics.json`. Each topic has a name, a short intro and a `videos` list of YouTube links: podcast episodes and event interviews can both go there. When a new video comes out, paste its link into the `videos` list of each of its topics (one to three) and save: the site rebuilds automatically. The daily update job lists any episode that has no topic yet.

The Home page's "researchers interviewed" count adds the podcast guests to the researchers listed in `data/event-researchers.json` (each person counted once). Add a line there when you publish a new event interview.

## 📄 Episode pages and transcripts

Every full episode has its own page at `/episodes/<slug>/` with the video, guest, summary, key points, chapters, the papers and links mentioned, and (when available) the full transcript. Specials without a guest, such as the year-in-review, stay as plain YouTube links.

**Adding a transcript**

The best result comes from giving **both** files for an episode:

- **Caption file (`.srt` / `.vtt`)**: in YouTube Studio, open the episode → **Subtitles** → your uploaded English track (not "automatic") → ⋮ → **Download** → `.srt`. Its words and timings match the published video exactly.
- **Speaker-labelled transcript (`.txt`)** of the recording, with one block per speaker turn:

  ```
  Julie Kallini (12:34.567)
  What she said ...
  ```

  It can be of the raw recording: it is only used for **who** is speaking.

Name the files after the episode (`Ep27-captions.srt` and `Ep27-transcript.txt`, `wiair-ep27-....srt`, or anything containing the video id) and run:

```
npm run import-transcripts -- Ep27-captions.srt Ep27-transcript.txt
```

With both files, the import lines up the two word by word: the words and YouTube timestamps come from the captions (so anything cut from the video is left out, and teaser clips at the start are attributed to the right person), and the speaker names come from the transcript. It prints how much of the captions it matched; anything under 80% is flagged, which usually means the two files are for different episodes. Narration you recorded separately (intro, outro) is not in the recording transcript and is credited to the host.

Other options:

- **Only a `.txt`** for an episode whose captions were already imported: the existing transcript is used for the timings, so the speakers are added to it.
- **Only a `.srt`**: a transcript without speaker names. In a caption file you can mark speakers by starting lines with the name, e.g. `Julie: ...`.
- **Only a `.txt`, nothing imported before**: used as it is, so only do this if it was made from the final published video (a raw recording's timestamps drift wherever the video was trimmed).

Then commit the new `data/transcripts/NN.json`. The import joins the words into paragraphs per speaker (and starts a new paragraph at each chapter), removes filler words (uh, um) and crosstalk such as "mm-hmm", and applies the corrections in `data/transcript-name-fixes.json` (per episode: wrong spelling → right spelling; `speakers` renames a speaker label, e.g. for a played clip). Speaker labels are tidied automatically: "WiAIR | Women In AI Research" and "Jekaterina WiAIR" become Jekaterina Novikova, "(She/Her)" is removed, and a first name alone ("Hila") becomes the guest's full name.

## ✍️ Writing episode descriptions

The episode page is built from the YouTube description. It recognises these section headings (capitalisation, emoji and colons don't matter):

| On the website | Headings |
|---|---|
| About this episode | everything before the first heading |
| Key points | In this episode · Key Topics · What you'll learn · Topics we cover · We explore |
| Papers & links mentioned | Papers discussed · REFERENCES · Mentioned in this episode · Resources & Links |
| Chapters | Chapters · ToC · Timestamps |
| Researcher page bio | About [Guest Name] |
| Researcher page link buttons | Connect with [Guest Name] (one link per line) |
| Left off the website | WiAIR website · Follow us · About WiAIR · Subscribe lines · hashtags |

Recommended template:

```
[1–2 opening paragraphs]

In this episode:
→ ...

📄 Papers discussed
• Title (Venue Year): https://arxiv.org/abs/...

👩‍🔬 About [Guest Name]
...

Connect with [Guest Name]:
• https://...

⏱️ Chapters
00:00 ...

🎙️ About WiAIR
...
```

Put each heading on its own line, write each paper as `Title: link` on one line, and spell the guest's name in "About …" as in the episode title. A timestamp before a reference (`[21:04] Title (link)`) adds a "mentioned at 21:04" link that jumps into the transcript.

## 👩‍🔬 Researcher pages

Each podcast guest has a page at `/guests/<id>/` and each event interviewee at `/researchers/<name>/` (listed by conference under "Also interviewed at events" on the Guests page). To add link buttons or research-area tags to a guest's page, add `links` and `researchAreas` to her entry in `data/guest-overrides.json`:

```json
{
  "name": "Julie Kallini",
  "links": [
    { "label": "Website", "url": "https://..." },
    { "label": "Google Scholar", "url": "https://scholar.google.com/..." }
  ],
  "researchAreas": ["Tokenization", "Byte-level modeling"]
}
```

Links from "Connect with …" in the description are added automatically.
