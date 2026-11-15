/**
 * Builds the site's content from the WiAIR YouTube channel.
 *
 *   - Episodes: every video in the playlists shown in the channel's Podcasts
 *     section (or the playlist IDs listed in data/youtube-config.json).
 *   - Events:   every other public, long-form video, grouped by playlist.
 *   - Guests:   derived from the episodes ("About <guest>" in the video
 *     description, or "with <guest>" in the title), merged with the
 *     hand-edited details in data/guest-overrides.json.
 *
 * Writes app/data/episodes.json, app/data/events.json and app/data/guests.json.
 *
 * Needs a YouTube Data API v3 key in the YOUTUBE_API_KEY environment variable.
 * Run with: YOUTUBE_API_KEY=... yarn update-content
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..");
const API = "https://www.googleapis.com/youtube/v3";

// ---------- types ----------

interface Config {
  channelHandle: string;
  podcastPlaylistIds: string[];
  excludeVideoIds: string[];
  includeShortsInEvents: boolean;
  shortsMaxSeconds: number;
  spotifyShowUrl: string;
  appleShowUrl: string;
}

interface GuestOverride {
  name: string;
  aliases?: string[];
  title?: string;
  bio?: string;
  imageUrl?: string;
  hidden?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  isPodcast: boolean;
  videoIds: string[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  thumbnailUrl: string;
  live: string;
}

export interface Chapter {
  time: string;
  seconds: number;
  title: string;
}

export interface EpisodeRecord {
  id: string;
  number: number;
  slug: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  publishDate: string;
  durationSeconds: number;
  thumbnailUrl: string;
  youtubeUrl: string;
  podcast: string;
  guests: string[];
  chapters: Chapter[];
}

export interface EventVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  publishDate: string;
  durationSeconds: number;
  thumbnailUrl: string;
  youtubeUrl: string;
}

export interface EventGroup {
  id: string;
  title: string;
  description: string;
  playlistUrl: string | null;
  videos: EventVideo[];
}

export interface GuestRecord {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  episodes: { number: number; title: string; youtubeUrl: string }[];
}

// ---------- API helpers ----------

function apiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error(
      "YOUTUBE_API_KEY is not set. Add it as a repository secret (Settings → Secrets and variables → Actions)."
    );
  }
  return key;
}

async function api(endpoint: string, params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams({ ...params, key: apiKey() });
  const res = await fetch(`${API}/${endpoint}?${qs}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${endpoint} failed (${res.status}): ${body.slice(0, 500)}`);
  }
  return res.json();
}

async function apiAll(endpoint: string, params: Record<string, string>): Promise<any[]> {
  const items: any[] = [];
  let pageToken: string | undefined;
  do {
    const data = await api(endpoint, {
      ...params,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    items.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return items;
}

// ---------- parsing helpers ----------

export function parseDuration(iso: string): number {
  const m = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, d, h, min, s] = m.map((x) => (x ? parseInt(x, 10) : 0));
  return d * 86400 + h * 3600 + min * 60 + s;
}

function bestThumbnail(t: any): string {
  const pick = t?.maxres ?? t?.standard ?? t?.high ?? t?.medium ?? t?.default;
  return pick?.url ?? "";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 10)
    .join("-");
}

export function parseChapters(description: string): Chapter[] {
  const chapters: Chapter[] = [];
  for (const line of description.split(/\r?\n/)) {
    const m = line.trim().match(/^\(?((?:\d{1,2}:)?\d{1,2}:\d{2})\)?\s*[-–—:|]?\s*(.+)$/);
    if (!m) continue;
    const parts = m[1].split(":").map((p) => parseInt(p, 10));
    const seconds = parts.reduce((acc, p) => acc * 60 + p, 0);
    chapters.push({ time: m[1], seconds, title: m[2].trim() });
  }
  // A real chapter list starts at 0:00 and has at least three entries.
  return chapters.length >= 3 && chapters[0].seconds === 0 ? chapters : [];
}

/** Key used to match the same person across spellings ("Dr. Simeng Sophia Han" = "Sophia Simeng Han"). */
export function nameKey(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(dr|prof|professor)\.?\s+/gi, "")
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

const NAME = String.raw`(?:(?:Dr|Prof)\.?\s+)?\p{Lu}[\p{L}'’.-]+(?:\s+\p{Lu}[\p{L}'’.-]+){1,3}`;
const HEADER_RE = new RegExp(String.raw`^[^\p{L}\p{N}"“(]`, "u");
const NOT_A_GUEST = /\b(wiair|women in ai research|this episode|the podcast|the guest|us|the host)\b/i;

/** Guest name + bio from an "About <name>" block in the description. */
export function guestsFromDescription(description: string): { name: string; bio: string }[] {
  const lines = description.split(/\r?\n/);
  const found: { name: string; bio: string }[] = [];
  const aboutRe = new RegExp(String.raw`^[^\p{L}]*About\s+(${NAME})\s*:?\s*$`, "u");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(aboutRe);
    if (!m || NOT_A_GUEST.test(m[1])) continue;
    const bio: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (!line) {
        if (bio.length) break;
        continue;
      }
      // Stop at the next section header (lines starting with an emoji or symbol).
      if (HEADER_RE.test(line)) break;
      bio.push(line);
    }
    found.push({ name: m[1].trim(), bio: bio.join(" ") });
  }
  return found;
}

/** Guest names from the title: "..., with Dr. Jane Doe" or "Dr. Jane Doe on ...". */
export function guestsFromTitle(title: string): string[] {
  const withRe = new RegExp(String.raw`\bwith\s+(${NAME})`, "gu");
  const drRe = new RegExp(String.raw`\b((?:Dr|Prof)\.?\s+\p{Lu}[\p{L}'’.-]+(?:\s+\p{Lu}[\p{L}'’.-]+){1,3})`, "gu");
  const names = new Set<string>();
  for (const m of Array.from(title.matchAll(withRe))) names.add(m[1].replace(/\s+\((?:Part|Pt).*$/i, "").trim());
  if (!names.size) for (const m of Array.from(title.matchAll(drRe))) names.add(m[1].trim());
  return Array.from(names).map((n) => n.replace(/\s+(on|about|and)$/i, "")).filter((n) => !NOT_A_GUEST.test(n));
}

// ---------- main ----------

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf-8")) as T;
}

function writeJson(rel: string, data: unknown) {
  writeFileSync(join(ROOT, rel), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function main() {
  const config = readJson<Config>("data/youtube-config.json");
  const overrides = readJson<{ guests: GuestOverride[] }>("data/guest-overrides.json").guests;

  // 1. Channel and its uploads playlist.
  const handle = config.channelHandle.replace(/^@/, "");
  const channel = (await api("channels", { part: "contentDetails", forHandle: handle })).items?.[0];
  if (!channel) throw new Error(`No YouTube channel found for handle @${handle}`);
  const uploadsId: string = channel.contentDetails.relatedPlaylists.uploads;

  // 2. All public playlists, with their videos.
  const rawPlaylists = await apiAll("playlists", {
    part: "snippet,status,contentDetails",
    channelId: channel.id,
  });
  const playlists: Playlist[] = [];
  for (const p of rawPlaylists) {
    const items = await apiAll("playlistItems", { part: "contentDetails", playlistId: p.id });
    playlists.push({
      id: p.id,
      title: p.snippet.title,
      description: p.snippet.description ?? "",
      isPodcast: p.status?.podcastStatus === "enabled",
      videoIds: items.map((it) => it.contentDetails.videoId),
    });
  }

  const podcastIds = config.podcastPlaylistIds.length
    ? config.podcastPlaylistIds
    : playlists.filter((p) => p.isPodcast).map((p) => p.id);
  const podcasts = podcastIds.map((id) => {
    const p = playlists.find((pl) => pl.id === id);
    if (!p) throw new Error(`Podcast playlist ${id} not found among the channel's public playlists`);
    return p;
  });
  if (!podcasts.length) {
    throw new Error(
      "No podcasts found on the channel. Add the podcast playlist IDs to podcastPlaylistIds in data/youtube-config.json."
    );
  }
  console.log(`Podcasts: ${podcasts.map((p) => `${p.title} (${p.videoIds.length})`).join(", ")}`);

  // 3. Details for every uploaded video.
  const uploadIds = (await apiAll("playlistItems", { part: "contentDetails", playlistId: uploadsId })).map(
    (it) => it.contentDetails.videoId as string
  );
  const allIds = Array.from(new Set(uploadIds.concat(podcasts.flatMap((p) => p.videoIds))));
  const videos = new Map<string, Video>();
  for (let i = 0; i < allIds.length; i += 50) {
    const batch = await api("videos", {
      part: "snippet,contentDetails,status",
      id: allIds.slice(i, i + 50).join(","),
      maxResults: "50",
    });
    for (const v of batch.items ?? []) {
      if (v.status?.privacyStatus !== "public") continue;
      videos.set(v.id, {
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description ?? "",
        publishedAt: v.snippet.publishedAt,
        durationSeconds: parseDuration(v.contentDetails?.duration ?? ""),
        thumbnailUrl: bestThumbnail(v.snippet.thumbnails),
        live: v.snippet.liveBroadcastContent ?? "none",
      });
    }
  }
  const excluded = new Set(config.excludeVideoIds);
  const usable = (id: string) => videos.has(id) && !excluded.has(id) && videos.get(id)!.live === "none";

  // 4. Episodes: all podcast videos, numbered in order of publication.
  const episodeOwner = new Map<string, string>();
  for (const p of podcasts) for (const id of p.videoIds) if (usable(id) && !episodeOwner.has(id)) episodeOwner.set(id, p.title);
  const episodeVideos = Array.from(episodeOwner.keys())
    .map((id) => videos.get(id)!)
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  if (!episodeVideos.length) throw new Error("The podcast playlists contain no public videos; nothing written.");

  const episodeGuests = new Map<string, { name: string; bio: string }[]>();
  const episodes: EpisodeRecord[] = episodeVideos.map((v, i) => {
    const number = i + 1;
    const fromDesc = guestsFromDescription(v.description);
    const guests = fromDesc.length ? fromDesc : guestsFromTitle(v.title).map((name) => ({ name, bio: "" }));
    episodeGuests.set(v.id, guests);
    return {
      id: String(number),
      number,
      slug: `${number}-${slugify(v.title)}`,
      videoId: v.id,
      title: v.title,
      description: v.description,
      publishedAt: v.publishedAt,
      publishDate: formatDate(v.publishedAt),
      durationSeconds: v.durationSeconds,
      thumbnailUrl: v.thumbnailUrl,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
      podcast: episodeOwner.get(v.id)!,
      guests: guests.map((g) => g.name),
      chapters: parseChapters(v.description),
    };
  });

  // 5. Events: every other long-form public video, grouped by its most specific playlist.
  const isShort = (v: Video) => v.durationSeconds > 0 && v.durationSeconds <= config.shortsMaxSeconds;
  const eventIds = uploadIds.filter(
    (id) => usable(id) && !episodeOwner.has(id) && (config.includeShortsInEvents || !isShort(videos.get(id)!))
  );
  const otherPlaylists = playlists
    .filter((p) => !podcastIds.includes(p.id))
    .sort((a, b) => a.videoIds.length - b.videoIds.length);
  const groups = new Map<string, EventGroup>();
  for (const id of eventIds) {
    const v = videos.get(id)!;
    const pl = otherPlaylists.find((p) => p.videoIds.includes(id));
    const key = pl?.id ?? "_other";
    if (!groups.has(key)) {
      groups.set(key, {
        id: pl ? pl.id : "more-videos",
        title: pl ? pl.title : "More videos",
        description: pl?.description ?? "",
        playlistUrl: pl ? `https://www.youtube.com/playlist?list=${pl.id}` : null,
        videos: [],
      });
    }
    groups.get(key)!.videos.push({
      videoId: v.id,
      title: v.title,
      description: v.description,
      publishedAt: v.publishedAt,
      publishDate: formatDate(v.publishedAt),
      durationSeconds: v.durationSeconds,
      thumbnailUrl: v.thumbnailUrl,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
    });
  }
  const events = Array.from(groups.values());
  for (const g of events) g.videos.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  // Most recent event first; the catch-all group always last.
  events.sort((a, b) => {
    if (a.id === "more-videos") return 1;
    if (b.id === "more-videos") return -1;
    const last = (g: EventGroup) => g.videos[g.videos.length - 1].publishedAt;
    return last(b).localeCompare(last(a));
  });

  // 6. Guests: one entry per person, newest first, hand-edited details win.
  const overrideFor = (name: string) => {
    const key = nameKey(name);
    return overrides.find((o) => nameKey(o.name) === key || (o.aliases ?? []).some((a) => nameKey(a) === key));
  };
  const guests = new Map<string, GuestRecord & { hidden: boolean }>();
  for (const ep of episodes) {
    for (const g of episodeGuests.get(ep.videoId) ?? []) {
      const ov = overrideFor(g.name);
      const key = nameKey(ov?.name ?? g.name);
      if (!guests.has(key)) {
        guests.set(key, {
          id: slugify(ov?.name ?? g.name.replace(/^(Dr|Prof)\.?\s+/, "")),
          name: ov?.name ?? g.name,
          title: ov?.title ?? "",
          bio: ov?.bio || g.bio,
          imageUrl: ov?.imageUrl ?? ep.thumbnailUrl,
          hidden: !!ov?.hidden,
          episodes: [],
        });
      }
      const rec = guests.get(key)!;
      if (!rec.bio && g.bio) rec.bio = g.bio;
      rec.episodes.push({ number: ep.number, title: ep.title, youtubeUrl: ep.youtubeUrl });
    }
  }
  const guestList = Array.from(guests.values())
    .filter((g) => !g.hidden)
    .map(({ hidden, ...g }) => g)
    .sort((a, b) => Math.max(...b.episodes.map((e) => e.number)) - Math.max(...a.episodes.map((e) => e.number)));

  const noGuest = episodes.filter((e) => !e.guests.length).map((e) => `#${e.number} ${e.title}`);
  if (noGuest.length) console.log(`No guest found for: ${noGuest.join(" | ")}`);

  writeJson("app/data/episodes.json", episodes);
  writeJson("app/data/events.json", events);
  writeJson("app/data/guests.json", guestList);
  console.log(
    `Wrote ${episodes.length} episodes, ${events.length} event groups (${eventIds.length} videos), ${guestList.length} guests.`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
