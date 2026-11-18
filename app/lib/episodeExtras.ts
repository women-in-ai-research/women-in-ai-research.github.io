// Server-side helpers for the episode and researcher pages (uses fs at build time).
import fs from "fs";
import path from "path";
import overridesData from "@/data/guest-overrides.json";

export interface TranscriptFile {
  episode: number;
  videoId: string;
  source?: string;
  segments: { t: number; speaker?: string; text: string }[];
}

/** data/transcripts/<episode>.json, created by `npm run import-transcripts`. */
export function loadTranscript(episodeNumber: number): TranscriptFile | null {
  const file = path.join(process.cwd(), "data", "transcripts", `${episodeNumber}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export interface GuestOverride {
  name: string;
  aliases?: string[];
  /** Optional profile links shown as buttons on the researcher page. */
  links?: { label: string; url: string }[];
  /** Optional 3–5 short research areas shown as tags on the researcher page. */
  researchAreas?: string[];
}

const nameKey = (n: string) => n.toLowerCase().replace(/^dr\.?\s+/, "").replace(/\s+/g, " ").trim();

/** The hand-edited entry for a guest in data/guest-overrides.json, if any. */
export function guestOverride(name: string): GuestOverride | undefined {
  const key = nameKey(name);
  return (overridesData as { guests: GuestOverride[] }).guests.find(
    (o) => nameKey(o.name) === key || (o.aliases ?? []).some((a) => nameKey(a) === key)
  );
}
