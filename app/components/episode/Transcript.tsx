"use client";

import { useEffect, useMemo, useState } from "react";
import { stamp } from "@/app/lib/episodePages";

/** One transcript paragraph. `speaker` is optional: caption files usually don't say who is talking. */
export interface Segment { t: number; speaker?: string; text: string }

const HOSTS = /^(jekaterina|malikeh)\b/i;
interface Chapter { time: string; seconds: number; title: string }

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-wiair-medium/60 text-white rounded px-0.5">{p}</mark> : p
  );
}

export function Transcript({ segments, chapters, youtubeUrl }: {
  segments: Segment[]; chapters: Chapter[]; youtubeUrl: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const q = query.trim();

  // Links like #p-871 ("mentioned at 14:31") or #t-1137 (a chapter) expand the transcript and jump there.
  useEffect(() => {
    const go = () => {
      const h = window.location.hash;
      if (!/^#[pt]-\d+$/.test(h)) return;
      setOpen(true);
      setTimeout(() => document.getElementById(h.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  const groups = useMemo(() => {
    // No chapter list in the description: show the transcript as one section.
    const chs: Chapter[] = chapters.length ? [...chapters] : [{ time: "0:00", seconds: 0, title: "Full conversation" }];
    // Anything before the first chapter (e.g. a cold open) goes under the first heading.
    if (chs[0].seconds > 0) chs[0] = { ...chs[0], seconds: 0 };
    const out = chs.map((c, i) => ({
      chapter: c,
      segs: segments.filter((s) => s.t >= c.seconds && (i === chs.length - 1 || s.t < chs[i + 1].seconds)),
    }));
    return out.filter((g) => g.segs.length);
  }, [segments, chapters]);

  const matches = q ? segments.filter((s) => s.text.toLowerCase().includes(q.toLowerCase())).length : 0;
  const expanded = open || !!q;

  return (
    <section id="transcript" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-wiair-light text-xs font-semibold tracking-widest uppercase mb-1">Full transcript</p>
          <h2 className="text-2xl font-bold text-white">Read the conversation</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find in transcript…"
            className="w-64 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-wiair-light"
          />
          {q && <span className="text-sm text-wiair-light whitespace-nowrap">{matches} {matches === 1 ? "match" : "matches"}</span>}
        </div>
      </div>

      <div className={`relative ${expanded ? "" : "max-h-[620px] overflow-hidden"}`}>
        {groups.map(({ chapter, segs }) => {
          const shown = q ? segs.filter((s) => s.text.toLowerCase().includes(q.toLowerCase())) : segs;
          if (!shown.length) return null;
          return (
            <div key={chapter.seconds} id={`t-${chapter.seconds}`} className="mb-8 scroll-mt-28">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
                <span className="text-wiair-light font-mono text-sm mr-3">{chapter.time}</span>{chapter.title}
              </h3>
              <div className="space-y-4">
                {shown.map((s) => (
                  <div key={s.t} id={`p-${s.t}`} className="grid grid-cols-[64px_1fr] gap-4 scroll-mt-28">
                    <a
                      href={`${youtubeUrl}&t=${s.t}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Play from here on YouTube"
                      className="text-xs font-mono text-gray-400 hover:text-wiair-lightest pt-1"
                    >
                      ▶ {stamp(s.t)}
                    </a>
                    <div>
                      {s.speaker && (
                        <p className={`text-sm font-semibold mb-0.5 ${HOSTS.test(s.speaker) ? "text-wiair-light" : "text-pink-300"}`}>
                          {s.speaker}
                        </p>
                      )}
                      <p className="text-gray-200 leading-relaxed">{highlight(s.text, q)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {!expanded && <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#2a1050] to-transparent" />}
      </div>

      {!q && (
        <div className="text-center mt-4">
          <button
            onClick={() => setOpen(!open)}
            className="px-5 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
          >
            {open ? "Collapse transcript" : "Show full transcript"}
          </button>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-6">Transcript based on the episode&apos;s captions. Click a timestamp to play from that moment on YouTube.</p>
    </section>
  );
}
