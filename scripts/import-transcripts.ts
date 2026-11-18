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
 * Two input formats are understood:
 *  - caption files (.srt / .vtt): timed caption lines, usually without speaker names;
 *  - speaker-labelled transcripts (.txt), one block per speaker turn:
 *        Julie Kallini (12:34.567)
 *        Text of what she said ...
 *    Use these only if they were made from the final published video: their
 *    timestamps are used as-is for the YouTube links.
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

const HEADER = /^(.{2,80}?)\s*\(((?:\d{1,2}:)?\d{1,2}:\d{2})(?:\.\d+)?\)\s*$/;
// One- to three-word turns that are just reactions ("Mm-hmm", "Thanks", "you") picked up from crosstalk.
const BACKCHANNEL = /^(you|thank you|thanks|bye|okay|ok|okay, bye|mm-hmm|mmm|hmm|yeah|yep|yes|right|sure|exactly|interesting|nice|cool|wow|great|amazing|and|of course,?|that's great|that's massive|sounds great)[.!?,]*$/i;

/** True when the file looks like "Speaker Name (mm:ss)" blocks rather than captions. */
export function isSpeakerLabelled(raw: string) {
  const first = raw.replace(/^\uFEFF/, "").split(/\r?\n/).find((l) => l.trim());
  return !!first && HEADER.test(first.trim()) && !raw.includes("-->");
}

/** Speaker-labelled transcript → paragraphs with speakers, times interpolated within long turns. */
export function parseSpeakerLabelled(raw: string, speakerAliases: Record<string, string> = {}): Segment[] {
  const turns: { speaker: string; start: number; chunks: string[] }[] = [];
  let cur: { speaker: string; start: number; chunks: string[] } | null = null;
  let buf: string[] = [];
  const endChunk = () => { if (cur && buf.length) cur.chunks.push(buf.join(" ")); buf = []; };
  for (const line of raw.replace(/\r/g, "").replace(/^\uFEFF/, "").split("\n")) {
    const t = line.replace(/⁓/g, "").trim();
    const h = t.match(HEADER);
    if (h) {
      endChunk();
      const name = h[1].replace(/\s+/g, " ").trim();
      cur = { speaker: speakerAliases[name] ?? name, start: toSec(h[2]), chunks: [] };
      turns.push(cur);
    } else if (!t) endChunk();
    else buf.push(t);
  }
  endChunk();

  // Drop crosstalk: short reactions, and turns that just repeat the previous speaker's words.
  const words = (x: string) => x.toLowerCase().match(/[a-z']+/g) ?? [];
  const kept = turns.filter((turn, i) => {
    const text = clean(turn.chunks.join(" "));
    if (!text) return false;
    if (words(text).length <= 3 && BACKCHANNEL.test(text)) return false;
    const prev = turns[i - 1];
    if (prev && prev.speaker !== turn.speaker && turn.start - prev.start < 15) {
      const pw = new Set(words(prev.chunks.join(" ")));
      const w = words(text);
      if (w.length >= 4 && w.filter((x) => pw.has(x)).length / w.length > 0.85) return false;
    }
    return true;
  });

  // Back-to-back turns by the same speaker (a reaction in between was dropped) become one turn.
  const merged = kept.reduce<typeof kept>((acc, turn) => {
    const last = acc[acc.length - 1];
    if (last && last.speaker === turn.speaker) last.chunks.push(...turn.chunks);
    else acc.push({ ...turn, chunks: [...turn.chunks] });
    return acc;
  }, []);
  kept.length = 0;
  kept.push(...merged);
  // Drop stray one-word fragments ("I" left over from crosstalk).
  for (const turn of kept) turn.chunks = turn.chunks.filter((c) => words(c).length > 1 || /[.?!]$/.test(c.trim()));

  // Rejoin paragraphs the source split mid-sentence.
  for (const turn of kept) {
    turn.chunks = turn.chunks.reduce<string[]>((acc, c) => {
      const last = acc[acc.length - 1];
      if (last !== undefined && !/[.?!"”)]\s*$/.test(last)) acc[acc.length - 1] = `${last} ${c}`;
      else acc.push(c);
      return acc;
    }, []);
  }

  const out: Segment[] = [];
  kept.forEach((turn, i) => {
    const end = kept[i + 1]?.start ?? turn.start + 30;
    const counts = turn.chunks.map((c) => words(c).length || 1);
    const total = counts.reduce((a, b) => a + b, 0);
    let acc = 0;
    turn.chunks.forEach((c, k) => {
      const text = clean(c);
      const t = Math.floor(turn.start + ((end - turn.start) * acc) / total);
      acc += counts[k];
      if (!text) return;
      const prev = out[out.length - 1];
      // Same speaker again after dropped crosstalk: continue their paragraph flow.
      out.push({ t: prev && t <= prev.t ? prev.t + 1 : t, speaker: turn.speaker, text });
    });
  });
  return out;
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: npm run import-transcripts -- <caption files…>");
    process.exit(1);
  }
  const episodes: Episode[] = JSON.parse(fs.readFileSync(path.join(ROOT, "app", "data", "episodes.json"), "utf8"));
  const fixesFile = fs.existsSync(FIXES_FILE) ? JSON.parse(fs.readFileSync(FIXES_FILE, "utf8")) : {};
  const fixes: Record<string, Record<string, string>> = fixesFile.episodes ?? {};
  // Optional per-episode renames of speaker labels, e.g. a channel name used for a played clip.
  const speakers: Record<string, Record<string, string>> = fixesFile.speakers ?? {};
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of files) {
    const base = path.basename(file);
    const num = base.match(/(?:wiair-)?ep0*(\d+)[-_ .]/i)?.[1];
    const ep = num ? episodes.find((e) => e.number === Number(num)) : episodes.find((e) => base.includes(e.videoId));
    if (!ep) { console.error(`✗ ${base}: no matching episode (name it wiair-epNN-… / EpNN-… or include the video id)`); continue; }

    const raw = fs.readFileSync(file, "utf8");
    const aliases = (speakers[String(ep.number)] ?? {}) as Record<string, string>;
    let segments = isSpeakerLabelled(raw)
      ? parseSpeakerLabelled(raw, aliases)
      : paragraphs(parseCaptions(raw), ep.chapters.map((c) => c.seconds));
    for (const [wrong, right] of Object.entries(fixes[String(ep.number)] ?? {})) {
      const rx = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      segments = segments.map((s) => ({ ...s, text: s.text.replace(rx, right) }));
    }
    const out = {
      episode: ep.number,
      videoId: ep.videoId,
      source: isSpeakerLabelled(raw)
        ? "Speaker-labelled transcript, lightly cleaned (filler words and crosstalk removed)"
        : "Creator-uploaded YouTube captions, lightly cleaned (filler words removed)",
      segments,
    };
    fs.writeFileSync(path.join(OUT_DIR, `${ep.number}.json`), JSON.stringify(out, null, 1) + "\n");
    console.log(`✓ Episode ${ep.number}: ${segments.length} paragraphs → data/transcripts/${ep.number}.json`);
  }
}

if (require.main === module) main();
