"use client";

import { useState } from "react";

/** Just what the list needs; built at build time by researchersByEvent() in app/lib/eventResearchers.ts. */
export interface ResearcherLink { slug: string; name: string; affiliation: string }
export type EventGroups = [event: string, researchers: ResearcherLink[]][];

/** One researcher: name, affiliation underneath. Also used on the event researcher pages. */
export function Name({ r }: { r: ResearcherLink }) {
  return (
    <li>
      <a href={`/researchers/${r.slug}/`} className="group block py-2">
        <span className="block text-white font-medium group-hover:text-wiair-lightest transition-colors">{r.name}</span>
        <span className="block text-sm text-gray-400 leading-snug">{r.affiliation || " "}</span>
      </a>
    </li>
  );
}

/**
 * "Also interviewed at events" on the Guests page: one conference at a time,
 * picked with tabs. Every list is in the page's HTML (inactive ones are only
 * hidden), so all names stay visible to search engines.
 */
export function EventResearchersSection({ groups }: { groups: EventGroups }) {
  const total = groups.reduce((n, [, l]) => n + l.length, 0);
  const [active, setActive] = useState(groups[0]?.[0]);
  if (!groups.length) return null;

  return (
    <section id="at-events" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 scroll-mt-24">
      <div className="text-center mb-10">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">From conferences and workshops</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Also interviewed at events</h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Short on-site interviews about a paper or talk. {total} researchers so far.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Events">
        {groups.map(([e, l]) => (
          <button
            key={e}
            role="tab"
            aria-selected={e === active}
            onClick={() => setActive(e)}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
              e === active
                ? "bg-gradient-to-r from-wiair-medium to-purple-500 text-white font-medium shadow-lg shadow-wiair-medium/25"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            }`}
          >
            {e} <span className={e === active ? "text-white/80" : "text-gray-400"}>· {l.length}</span>
          </button>
        ))}
      </div>
      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-2xl border border-white/10 p-6 md:p-8">
        {groups.map(([e, list]) => (
          <ul key={e} role="tabpanel" aria-label={e} hidden={e !== active} className={`${e === active ? "grid" : "hidden"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8`}>
            {list.map((r) => <Name key={r.slug} r={r} />)}
          </ul>
        ))}
      </div>
    </section>
  );
}
