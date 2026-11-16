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

Topic pages (`/topics/<slug>/`) are built from `data/topics.json`. Each topic has a name, a short intro and a list of episodes given by their YouTube links. When a new episode comes out, paste its YouTube link into the `episodes` list of each of its topics (one to three) and save: the site rebuilds automatically. The daily update job lists any episode that has no topic yet.
