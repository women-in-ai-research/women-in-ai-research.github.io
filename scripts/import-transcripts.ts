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
 * Two input formats are understood, and work best together:
 *  - caption files (.srt / .vtt): the words and timings of the published video;
 *  - speaker-labelled transcripts (.txt) of the recording, one block per speaker turn:
 *        Julie Kallini (12:34.567)
 *        Text of what she said ...
 *  Given both for an episode (npm run import-transcripts -- Ep27-captions.srt Ep27-transcript.txt),
 *  they are aligned word by word: text and timestamps from the captions, speaker names
 *  from the transcript (see mergeWithCaptions). A .txt alone is merged with the
 *  episode's already-imported captions if there are any, otherwise used as it is.
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

/** Speaker names as they should appear: the WiAIR channel account is the host, "(She/Her)" and double spaces go, a bare first name becomes the guest's full name. */
export function normSpeaker(name: string, guests: string[] = [], aliases: Record<string, string> = {}) {
  const n = name.replace(/\s+/g, " ").trim();
  if (aliases[n]) return aliases[n];
  if (/^WiAIR \| Women in AI Research( AI)?$/i.test(n) || /^Jekaterina( Novikova)? WiAIR$/i.test(n)) return HOST;
  const bare = n.replace(/\s*\((she|he|they)\/[a-z]+\)\s*$/i, "").trim();
  if (!bare.includes(" ")) {
    const full = guests.map((g) => g.replace(/^Dr\.?\s+/i, "")).find((g) => g.split(" ")[0].toLowerCase() === bare.toLowerCase());
    if (full) return full;
  }
  return bare;
}

const HOST = "Jekaterina Novikova";
// How the host's recorded intro and outro lines start.
const NARRATION = /^(our guest today is|today my guest is|welcome to (the )?(wiair|women in ai research)|this is women in ai research|stick around|thank you for (watching|listening))/i;
interface Word { w: string; k: string; t: number; cue: number }
const key = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Longest common subsequence of two short key lists; returns matched index pairs. */
function lcs(a: string[], b: string[]): [number, number][] {
  const n = a.length, m = b.length;
  if (!n || !m || n * m > 40_000_000) return [];
  const dp = new Int32Array((n + 1) * (m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i * (m + 1) + j] = a[i] === b[j] ? dp[(i + 1) * (m + 1) + j + 1] + 1 : Math.max(dp[(i + 1) * (m + 1) + j], dp[i * (m + 1) + j + 1]);
  const out: [number, number][] = [];
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
    else if (dp[(i + 1) * (m + 1) + j] >= dp[i * (m + 1) + j + 1]) i++;
    else j++;
  }
  return out;
}

/** Aligns two long word lists: unique 4-word anchors (in order), then exact alignment between anchors. */
function align(a: string[], b: string[]): Int32Array {
  const N = 4, gram = (x: string[], i: number) => x.slice(i, i + N).join(" ");
  const count = (x: string[]) => { const c = new Map<string, number[]>(); for (let i = 0; i + N <= x.length; i++) { const g = gram(x, i); c.set(g, [...(c.get(g) ?? []), i]); } return c; };
  const ca = count(a), cb = count(b);
  const pairs: [number, number][] = [];
  ca.forEach((ia, g) => { const ib = cb.get(g); if (ia.length === 1 && ib?.length === 1) pairs.push([ia[0], ib[0]]); });
  pairs.sort((x, y) => x[0] - y[0]);
  // Longest increasing run of anchors by position in b.
  const tails: number[] = [], prev = new Int32Array(pairs.length).fill(-1);
  pairs.forEach((p, k) => {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (pairs[tails[mid]][1] < p[1]) lo = mid + 1; else hi = mid; }
    if (lo > 0) prev[k] = tails[lo - 1];
    tails[lo] = k;
  });
  const chain: [number, number][] = [];
  for (let k = tails.length ? tails[tails.length - 1] : -1; k >= 0; k = prev[k]) chain.unshift(pairs[k]);
  const match = new Int32Array(a.length).fill(-1);
  let ai = 0, bi = 0;
  const fill = (a1: number, b1: number) => { for (const [i, j] of lcs(a.slice(ai, a1), b.slice(bi, b1))) match[ai + i] = bi + j; };
  for (const [i, j] of chain) {
    if (i < ai || j < bi) continue; // overlaps the previous anchor
    fill(i, j);
    for (let d = 0; d < N; d++) match[i + d] = j + d;
    ai = i + N; bi = j + N;
  }
  fill(a.length, b.length);
  // Drop stray matches: a word matched far from where its neighbours matched (common words in a long gap).
  const near = (i: number, j: number) => i >= 0 && i < a.length && match[i] >= 0 && Math.abs(match[i] - j) <= 6;
  const keep = Array.from(match, (j, i) => j < 0 || near(i - 1, j) || near(i + 1, j) || near(i - 2, j) || near(i + 2, j));
  keep.forEach((k, i) => { if (!k) match[i] = -1; });
  return match;
}

/**
 * Speaker-labelled transcript + captions of the published video → paragraphs.
 * Words and timings come from the captions (so passages cut from the video are
 * left out and the YouTube links are exact); speaker names come from the transcript.
 */
export function mergeWithCaptions(
  raw: string, cues: [number, number, string][], chapterSecs: number[], guests: string[] = [], aliases: Record<string, string> = {},
): { segments: Segment[]; coverage: number } {
  // Transcript words with their speakers.
  const tw: { k: string; s: string }[] = [];
  let speaker = "";
  for (const line of raw.replace(/\r/g, "").replace(/^﻿/, "").split("\n")) {
    const t = line.replace(/⁓/g, "").trim();
    const h = t.match(HEADER);
    if (h) speaker = normSpeaker(h[1], guests, aliases);
    else if (t) for (const w of t.split(/\s+/)) { const k = key(w); if (k) tw.push({ k, s: speaker }); }
  }
  // Caption words, timed by their position inside the cue.
  const cw: Word[] = [];
  cues.forEach(([a, b, text], c) => {
    // Tokens with no letters or digits ("%", "–") stay attached to the word before them.
    const ws = text.split(/\s+/).filter(Boolean).reduce<string[]>((acc, w) => {
      if (key(w) || !acc.length) acc.push(w); else acc[acc.length - 1] += ` ${w}`;
      return acc;
    }, []).filter((w) => key(w));
    ws.forEach((w, i) => cw.push({ w, k: key(w), t: a + ((b - a) * i) / ws.length, cue: c }));
  });
  const match = align(cw.map((x) => x.k), tw.map((x) => x.k));
  const sp: (string | null)[] = Array.from(match, (j) => (j >= 0 ? tw[j].s : null));
  // Stretches the in-order alignment couldn't place (teaser clips, moved segments): find their phrases
  // anywhere in the transcript and take the speaker who said them.
  const where = new Map<string, number[]>();
  for (let j = 0; j + 4 <= tw.length; j++) { const g = tw.slice(j, j + 4).map((x) => x.k).join(" "); where.set(g, [...(where.get(g) ?? []), j]); }
  for (let i = 0; i < cw.length; ) {
    if (match[i] >= 0) { i++; continue; }
    let e = i; while (e < cw.length && match[e] < 0) e++;
    if (e - i >= 6) {
      // Decide caption line by caption line, since a teaser clip and narration can sit side by side.
      let prevWho: string | null = null;
      for (let q = i; q < e; ) {
        let r = q; while (r < e && cw[r].cue === cw[q].cue) r++;
        const votes = new Map<string, number>();
        let grams = 0;
        for (let g = q; g < r && g + 4 <= e; g++, grams++)
          for (const j of where.get(cw.slice(g, g + 4).map((x) => x.k).join(" ")) ?? []) votes.set(tw[j].s, (votes.get(tw[j].s) ?? 0) + 1);
        const best = Array.from(votes.entries()).sort((x, y) => y[1] - x[1])[0];
        // Not in the recording at all (intro or outro narration added in editing): the host.
        const narration = NARRATION.test(cw.slice(q, r).map((x) => x.w).join(" "));
        const who: string = narration ? HOST : best && best[1] >= 0.4 * grams ? best[0] : (r - q < 8 || !grams) && prevWho ? prevWho : HOST;
        for (let k = q; k < r; k++) sp[k] = who;
        prevWho = who;
        q = r;
      }
    }
    i = e;
  }
  // Unmatched words: the speaker of the nearest matched word in the same cue, else the previous word's.
  for (let i = 0; i < cw.length; i++) {
    if (sp[i]) continue;
    let best: string | null = null;
    for (let d = 1; d < 30 && !best; d++)
      for (const j of [i - d, i + d]) if (j >= 0 && j < cw.length && cw[j].cue === cw[i].cue && match[j] >= 0) { best = sp[j]; break; }
    sp[i] = best ?? sp[i - 1] ?? null;
  }
  for (let i = cw.length - 1; i >= 0; i--) if (!sp[i]) sp[i] = sp[i + 1] ?? (tw[0]?.s || "");

  // Speaker turns; short reactions picked up from crosstalk are dropped, and the turns around them rejoin.
  type Turn = { s: string; words: Word[] };
  let turns: Turn[] = [];
  cw.forEach((w, i) => {
    const last = turns[turns.length - 1];
    if (last && last.s === sp[i]) last.words.push(w); else turns.push({ s: sp[i]!, words: [w] });
  });
  turns = turns.filter((t) => !(t.words.length <= 3 && BACKCHANNEL.test(t.words.map((w) => w.w).join(" ").replace(/[.!?,]+$/, ""))));
  // A one- or two-word scrap that doesn't finish a sentence is the start of the next speaker's sentence.
  turns.forEach((t, i) => {
    const next = turns[i + 1];
    if (next && t.words.length <= 2 && !/[.?!]["”]?$/.test(t.words[t.words.length - 1].w)) { next.words.unshift(...t.words); t.words = []; }
  });
  turns = turns.filter((t) => t.words.length);
  turns = turns.reduce<Turn[]>((acc, t) => {
    const last = acc[acc.length - 1];
    if (last && last.s === t.s) last.words.push(...t.words); else acc.push({ s: t.s, words: [...t.words] });
    return acc;
  }, []);

  const segments: Segment[] = [];
  let carry: number | null = null; // a chapter that starts with the next speaker's turn
  for (const turn of turns) {
    let cur: Word[] = [];
    let at: number | null = carry; // chapter the paragraph starts, if any
    carry = null;
    const flush = (keep = 0) => {
      const done = cur.slice(0, cur.length - keep);
      const text = clean(done.map((w) => w.w).join(" "));
      if (text) {
        const prev = segments[segments.length - 1];
        // A paragraph that opens a chapter starts at the chapter time, so it is listed under that chapter.
        let t = Math.floor(at !== null ? Math.max(done[0].t, at) : done[0].t);
        if (prev && t <= prev.t) t = prev.t + 1;
        segments.push({ t, speaker: turn.s, text: text[0].toUpperCase() + text.slice(1) });
      }
      cur = cur.slice(cur.length - keep);
      at = null;
    };
    const ends = (w: Word) => /[.?!]["”]?$/.test(w.w);
    turn.words.forEach((w, idx) => {
      if (cur.length) {
        const last = cur[cur.length - 1], dur = w.t - cur[0].t;
        const chapter = chapterSecs.find((c) => last.t < c - 0.5 && w.t >= c - 0.5);
        if (chapter !== undefined && !ends(last) && turn.words.length - idx <= 6) carry = chapter; // the speaker is just finishing
        else if (chapter !== undefined) {
          // Break at the chapter, or at a sentence end shortly before it, so sentences stay whole.
          let k = cur.length - 1;
          while (k >= 0 && !ends(cur[k])) k--;
          if (ends(last)) flush();
          else if (k >= 0 && cur[k].t >= chapter - 12) flush(cur.length - 1 - k);
          else if (cur[0].t < chapter - 20) flush(); // a long paragraph with no sentence end nearby
          at = chapter;
        } else if ((ends(last) && dur >= 45) || dur >= 90) flush();
      }
      cur.push(w);
    });
    flush();
  }
  return { segments, coverage: match.filter((j) => j >= 0).length / Math.max(1, cw.length) };
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: npm run import-transcripts -- <caption and/or transcript files…>");
    process.exit(1);
  }
  const episodes: Episode[] = JSON.parse(fs.readFileSync(path.join(ROOT, "app", "data", "episodes.json"), "utf8"));
  const fixesFile = fs.existsSync(FIXES_FILE) ? JSON.parse(fs.readFileSync(FIXES_FILE, "utf8")) : {};
  const fixes: Record<string, Record<string, string>> = fixesFile.episodes ?? {};
  // Optional per-episode renames of speaker labels, e.g. a channel name used for a played clip.
  const speakers: Record<string, Record<string, string>> = fixesFile.speakers ?? {};
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Group the files by episode: a .txt and a caption file for the same episode are merged.
  const byEp = new Map<number, { ep: Episode; txt?: string; captions?: string }>();
  for (const file of files) {
    const base = path.basename(file);
    const num = base.match(/(?:wiair-)?ep0*(\d+)[-_ .]/i)?.[1];
    const ep = num ? episodes.find((e) => e.number === Number(num)) : episodes.find((e) => base.includes(e.videoId));
    if (!ep) { console.error(`✗ ${base}: no matching episode (name it wiair-epNN-… / EpNN-… or include the video id)`); continue; }
    const raw = fs.readFileSync(file, "utf8");
    const entry = byEp.get(ep.number) ?? { ep };
    if (isSpeakerLabelled(raw)) entry.txt = raw; else entry.captions = raw;
    byEp.set(ep.number, entry);
  }

  for (const { ep, txt, captions } of Array.from(byEp.values())) {
    const aliases = (speakers[String(ep.number)] ?? {}) as Record<string, string>;
    const chapters = ep.chapters.map((c) => c.seconds);
    const outFile = path.join(OUT_DIR, `${ep.number}.json`);
    let segments: Segment[];
    let source: string;
    if (txt) {
      // Captions for the timings: the file given, or else the transcript already imported from captions.
      let cues: [number, number, string][] | null = captions ? parseCaptions(captions) : null;
      if (!cues && fs.existsSync(outFile)) {
        const prev: Segment[] = JSON.parse(fs.readFileSync(outFile, "utf8")).segments;
        cues = prev.map((s, i) => [s.t, prev[i + 1]?.t ?? s.t + 30, s.text]);
      }
      if (cues) {
        const r = mergeWithCaptions(txt, cues, chapters, ep.guests, aliases);
        segments = r.segments;
        source = "Creator-uploaded YouTube captions with speaker names from the recording transcript, lightly cleaned (filler words and crosstalk removed)";
        const pct = Math.round(r.coverage * 100);
        console.log(`  Episode ${ep.number}: ${pct}% of caption words matched the transcript${pct < 80 ? " ⚠ low — check that both files are for this episode" : ""}`);
      } else {
        segments = parseSpeakerLabelled(txt, aliases).map((s) => ({ ...s, speaker: normSpeaker(s.speaker!, ep.guests, aliases) }));
        source = "Speaker-labelled transcript, lightly cleaned (filler words and crosstalk removed)";
      }
    } else {
      segments = paragraphs(parseCaptions(captions!), chapters);
      source = "Creator-uploaded YouTube captions, lightly cleaned (filler words removed)";
    }
    for (const [wrong, right] of Object.entries(fixes[String(ep.number)] ?? {})) {
      const rx = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      segments = segments.map((s) => ({ ...s, text: s.text.replace(rx, right) }));
    }
    fs.writeFileSync(outFile, JSON.stringify({ episode: ep.number, videoId: ep.videoId, source, segments }, null, 1) + "\n");
    const names = Array.from(new Set(segments.map((s) => s.speaker).filter(Boolean)));
    console.log(`✓ Episode ${ep.number}: ${segments.length} paragraphs${names.length ? ` (${names.join(", ")})` : ""} → data/transcripts/${ep.number}.json`);
  }
}

if (require.main === module) main();
