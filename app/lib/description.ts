/**
 * Splits a YouTube episode description into the parts the episode and
 * researcher pages show. Sections are recognised by their heading line
 * (any capitalisation, with or without emoji or a trailing colon):
 *
 *   (text before the first heading) -> summary ("About this episode")
 *   In this episode / Key Topics / What you'll learn / Topics we cover /
 *     We explore / You'll see                       -> key points
 *   REFERENCES / Papers discussed / Mentioned in this episode /
 *     Resources & Links                             -> papers & links
 *   ToC / CHAPTERS / Timestamps                     -> chapters (parsed by the sync script)
 *   About <guest>  or  <GUEST NAME>                 -> guest bio
 *   Connect with <guest>                            -> guest link buttons
 *   WiAIR website / Follow us / About WiAIR / Subscribe / hashtags ... -> left out
 *
 * A heading-like line that matches none of these stays in the text, so a
 * sentence ending in a colon is never mistaken for a section break.
 * See README.md ("Writing episode descriptions") for the recommended format.
 */

export type SectionKind =
  | "summary"
  | "highlights"
  | "references"
  | "chapters"
  | "guestAbout"
  | "guestLinks"
  | "drop";

export interface Reference {
  title: string;
  url: string;
  /** Timestamp in seconds where the reference is mentioned, if given. */
  seconds?: number;
  time?: string;
  isPaper: boolean;
  /** Further links on the same reference, e.g. project website or GitHub. */
  extra?: { label: string; url: string }[];
}

export interface ParsedDescription {
  summary: string[];
  /** Opening line(s) that introduce the guest ("Dr. X is a researcher at ..."), used on the researcher page. */
  guestIntro: string[];
  highlights: string[];
  references: Reference[];
  guestAbout: string[];
  guestLinks: string[];
  /** Raw lines of the chapters section (ToC / CHAPTERS / Timestamps), if there is one. */
  chapterLines: string[];
  /** Heading-like lines that weren't recognised; reported by the sync script. */
  unknownHeadings: string[];
}

const RULES: [SectionKind, RegExp][] = [
  ["chapters", /^(toc|chapters|timestamps)\b/],
  ["highlights", /^(in this episode(, we cover)?|key topics|what you.ll learn( in this episode)?|topics we cover|we explore|you.ll see)\b/],
  ["references", /^(references|papers discussed|mentioned in this episode|resources (&|and) links)\b/],
  ["guestLinks", /^connect with\b/],
  ["guestAbout", /^about (?!wiair\b|women in ai research\b)/],
  ["drop", /^(wiair website|follow (us|wiair)( at)?|about wiair|subscribe|the women in ai research podcast is for|don.t have time for the full episode)/],
];

const PAPER_HOSTS = /arxiv\.org|aclanthology|openreview|doi\.org|dl\.acm\.org|\/doi\/|proceedings|journals\.|nature\.com|science\.org|ieee/;

function stripDecor(line: string) {
  return line.trim().replace(/^[^A-Za-z0-9À-ɏ[(]+/, "").trim();
}

function classify(line: string, guests: string[]): SectionKind | "unknown" | null {
  const s = stripDecor(line);
  if (!s || s.length > 70 || /https?:\/\//.test(s) || /^[[\d•→-]/.test(s)) return null;
  const low = s.toLowerCase().replace(/:\s*$/, "").trim();
  for (const [kind, rx] of RULES) if (rx.test(low)) return kind;
  const plain = (n: string) => n.toLowerCase().replace(/^dr\.?\s+/, "");
  if (guests.some((g) => low === g.toLowerCase() || low === plain(g))) return "guestAbout";
  if (s.endsWith(":") || (s === s.toUpperCase() && /[A-Z]/.test(s))) return "unknown";
  return null;
}

function toSeconds(t: string) {
  return t.split(":").map(Number).reduce((acc, n) => acc * 60 + n, 0);
}

/** Words that can label a link inside a reference, as in "(paper: …, project website: …)". */
const LINK_LABELS = "paper|pdf|arxiv|project website|project page|project|website|github|code|data|dataset|slides|video|blog|demo|link";

export function parseReferences(lines: string[]): Reference[] {
  // Group lines into items: a new item starts with a timestamp, a bullet, or an
  // unindented title; indented lines or lines starting with "(" continue it
  // (older descriptions put the link(s) on the lines after the title).
  const items: string[] = [];
  for (const l of lines) {
    if (!l.trim()) continue;
    const starts = /^\s*(\[?\d{1,2}:\d{2}|[•\-–*]\s)/.test(l) || (!/^\s/.test(l) && !/^\(/.test(l.trim()));
    if (starts || !items.length) items.push(l.trim());
    else items[items.length - 1] += " " + l.trim();
  }
  // "A (link) , and B (link)" on one line: two references sharing the timestamp.
  const split = items.flatMap((item) => {
    const parts = item.split(/\)\s*,\s*(?:and\s+)?(?=[A-Z])/);
    if (parts.length < 2) return [item];
    const time = item.match(/^\s*(?:[•\-–*]\s*)?(\[?\d{1,2}:\d{2}(?::\d{2})?\]?)/)?.[1];
    return parts.map((p, i) => (i < parts.length - 1 ? p + ")" : p)).map((p, i) => (i && time ? `${time} ${p}` : p));
  });
  const out: Reference[] = [];
  for (const item of split) {
    const urlRx = new RegExp(`(?:\\b(${LINK_LABELS})\\s*[:\\-–]\\s*)?(https?:\\/\\/[^\\s),]+)`, "gi");
    const links = Array.from(item.matchAll(urlRx)).map((m) => ({ label: (m[1] ?? "").trim().toLowerCase(), url: m[2] }));
    if (!links.length) continue;
    const head = item.match(new RegExp(`^(?:[•\\-–*]\\s*)?(?:\\[?(\\d{1,2}:\\d{2}(?::\\d{2})?)\\]?\\s*)?(.*?)\\s*(?:\\(\\s*)?(?:(?:${LINK_LABELS})\\s*[:\\-–]\\s*)?https?:\\/\\/`, "i"));
    const time = head?.[1];
    const main = links.find((l) => l.label === "paper") ?? links[0];
    const title = (head?.[2] ?? "").replace(/[\s:(–-]+$/, "").trim() || main.url.replace(/^https?:\/\//, "");
    const extra = links.filter((l) => l !== main).map((l) => ({ label: l.label || "link", url: l.url }));
    out.push({
      title, url: main.url, time, seconds: time ? toSeconds(time) : undefined,
      isPaper: PAPER_HOSTS.test(main.url) || main.label === "paper",
      ...(extra.length ? { extra } : {}),
    });
  }
  return out;
}

function paragraphs(lines: string[]) {
  return lines
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function parseDescription(description: string, guests: string[] = []): ParsedDescription {
  const buckets: Record<SectionKind, string[]> = {
    summary: [], highlights: [], references: [], chapters: [], guestAbout: [], guestLinks: [], drop: [],
  };
  const unknownHeadings: string[] = [];
  let current: SectionKind = "summary";

  for (const line of description.split(/\r?\n/)) {
    const t = line.trim();
    if (/^(#\w+\s*)+$/.test(t)) continue; // hashtag lines
    if (t.startsWith("🔔") || t.startsWith("🎧")) continue; // subscribe call-to-action lines
    const kind = classify(line, guests);
    if (kind === "unknown") unknownHeadings.push(t);
    else if (kind) { current = kind; continue; }
    buckets[current].push(line);
  }

  // Older descriptions open with a one-line guest intro ("Dr. X is a ... at ...").
  const summaryParas = paragraphs(buckets.summary).map((p) => p.replace(/\s*https?:\/\/\S+/g, "").trim());
  const guestIntro: string[] = [];
  const surnames = guests.map((g) => g.split(/\s+/).pop()!.toLowerCase());
  if (summaryParas.length > 1 && surnames.some((s) => summaryParas[0].toLowerCase().includes(s)) && /\b(is|was) (an?|the)\b/.test(summaryParas[0]) && summaryParas[0].length < 300) {
    guestIntro.push(summaryParas.shift()!);
  }

  const highlights = buckets.highlights
    .map((l) => l.trim().replace(/^[•→\-–*]\s*/, ""))
    .filter((l) => l && !/https?:\/\//.test(l));

  // Links can sit under "Connect with ..." or directly under the guest's "About" section.
  const urls = (l: string) => l.match(/https?:\/\/[^\s)]+/g) ?? [];
  const guestLinks = Array.from(new Set([...buckets.guestLinks, ...buckets.guestAbout].flatMap(urls)));
  const isWiairBlurb = (p: string) => /^(women in ai research )?\(?wiair\)? (features|is a podcast)\b/i.test(p);
  const guestAbout = paragraphs(buckets.guestAbout.filter((l) => !urls(l).length)).filter((p) => !isWiairBlurb(p));

  return {
    summary: summaryParas.filter((p) => !isWiairBlurb(p)),
    guestIntro,
    highlights,
    references: parseReferences(buckets.references),
    guestAbout,
    guestLinks,
    chapterLines: buckets.chapters,
    unknownHeadings,
  };
}

/** Readable button label for a profile link. */
export function linkLabel(url: string) {
  const u = url.toLowerCase();
  if (u.includes("linkedin.com")) return "LinkedIn";
  if (u.includes("scholar.google")) return "Google Scholar";
  if (u.includes("bsky.app")) return "Bluesky";
  if (/\/\/(www\.)?(x|twitter)\.com/.test(u)) return "X";
  if (u.includes("github.com")) return "GitHub";
  return "Website";
}
