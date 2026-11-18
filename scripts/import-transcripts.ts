/**
 * Turns episode caption files (.srt or .vtt) into the transcripts shown on the
 * episode pages: data/transcripts/<episode number>.json.
 *
 *   npm run import-transcripts -- path/to/wiair-ep27-XXXXXXXXXXX.srt [more files...]
 *
 * The episode is taken from the file name: either "wiair-ep27-…" or a name
 * containing the YouTube video id (e.g. "XLixB8pSdC4.srt"). Use the captions
 * you uploaded to YouTube (YouTube Studio → Subtitles → your English track →
 * Download .srt), not the automatic ones.
 *
 * What it does:
 *  - joins caption lines into readable paragraphs, starting a new paragraph at
 *    each chapter, at longer pauses, and at least every ~90 seconds;
 *  - removes filler words (uh, um, ah, eh) and doubled words ("the the");
 *  - applies the name corrections in data/transcript-name-fixes.json;
 *  - if a caption line starts with "Name:" (e.g. "Julie:"), uses it as the
 *    speaker for that paragraph.
 */
import fs from "fs";
import path from "path";

interface Chapter { seconds: number }
interface Episode { number: number; videoId: string; chapters: Chapter[]; guests?: string[] }
interface Segment { t: number; speaker?: string; text: string }

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "transcripts");
const FIXES_FILE = path.join(ROOT, "data", "transcript-name-fixes.json");

const toSec = (s: string) => {
  const [h, m, sec] = s.trim().replace(",", ".").split(":");
  return sec === undefined ? Number(h) * 60 + Number(m) : Number(h) * 3600 + Number(m) * 60 + Number(sec);
};

function parseCaptions(raw: string): [number, number, string][] {
  const cues: [number, number, string][] = [];
  for (const block of raw.replace(/\r/g, "").replace(/^﻿/, "").trim().split(/\n\s*\n/)) {
    const lines = block.split("\n");
    const i = lines.findIndex((l) => l.includes("-->"));
    if (i < 0) continue;
    const [a, b] = lines[i].split("-->").map((x) => x.trim().split(/\s/)[0]);
    const text = lines.slice(i + 1).map((l) => l.replace(/<[^>]+>/g, "").trim()).filter(Boolean).join(" ");
    if (text) cues.push([toSec(a), toSec(b), text]);
  }
  cues.sort((x, y) => x[0] - y[0]);
  // Repair the occasional cue whose end is before its start.
  cues.forEach((c, k) => { if (c[1] < c[0]) c[1] = cues[k + 1]?.[0] ?? c[0] + 1; });
  return cues;
}

function clean(t: string) {
  return t
    .replace(/(?<![\w'])(?:uh|um|ah|eh)(?![\w'])[,.]?\s*/gi, "")
    .replace(/\s+([,.?!])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\b(\w+) \1\b/g, "$1")
    .trim();
}

function paragraphs(cues: [number, number, string][], chapterSecs: number[]): Segment[] {
  const out: Segment[] = [];
  let cur: string[] = [];
  let start: number | null = null;
  let speaker: string | undefined;
  const flush = () => {
    const text = clean(cur.join(" "));
    if (text && start !== null) out.push({ t: Math.floor(start), ...(speaker ? { speaker } : {}), text });
    cur = []; start = null; speaker = undefined;
  };
  cues.forEach(([a, , text], k) => {
    const label = text.match(/^([A-Z][\w.'-]*(?: [A-Z][\w.'-]*){0,2}):\s+(.*)$/);
    if (label && cur.length) flush();
    if (cur.length && start !== null) {
      const gap = a - cues[k - 1][1];
      const dur = a - start;
      const crosses = chapterSecs.some((c) => start! < c && c <= a + 0.5);
      const ends = /[.?!]["”]?$/.test(cur[cur.length - 1]);
      if (crosses || (gap >= 1 && dur >= 8) || (ends && dur >= 45) || dur >= 90) flush();
    }
    if (start === null) start = a;
    if (label) { speaker = label[1]; cur.push(label[2]); } else cur.push(text);
  });
  flush();
  return out;
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: npm run import-transcripts -- <caption files…>");
    process.exit(1);
  }
  const episodes: Episode[] = JSON.parse(fs.readFileSync(path.join(ROOT, "app", "data", "episodes.json"), "utf8"));
  const fixes: Record<string, Record<string, string>> = fs.existsSync(FIXES_FILE)
    ? JSON.parse(fs.readFileSync(FIXES_FILE, "utf8")).episodes ?? {}
    : {};
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of files) {
    const base = path.basename(file);
    const num = base.match(/wiair-ep(\d+)/i)?.[1];
    const ep = num ? episodes.find((e) => e.number === Number(num)) : episodes.find((e) => base.includes(e.videoId));
    if (!ep) { console.error(`✗ ${base}: no matching episode (name it wiair-epNN-… or include the video id)`); continue; }

    let segments = paragraphs(parseCaptions(fs.readFileSync(file, "utf8")), ep.chapters.map((c) => c.seconds));
    for (const [wrong, right] of Object.entries(fixes[String(ep.number)] ?? {})) {
      const rx = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      segments = segments.map((s) => ({ ...s, text: s.text.replace(rx, right) }));
    }
    const out = {
      episode: ep.number,
      videoId: ep.videoId,
      source: "Creator-uploaded YouTube captions, lightly cleaned (filler words removed)",
      segments,
    };
    fs.writeFileSync(path.join(OUT_DIR, `${ep.number}.json`), JSON.stringify(out, null, 1) + "\n");
    console.log(`✓ Episode ${ep.number}: ${segments.length} paragraphs → data/transcripts/${ep.number}.json`);
  }
}

main();
