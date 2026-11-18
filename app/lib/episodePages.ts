// Client-safe helpers shared by cards and pages.

/** Full interviews get their own page; specials without a guest (e.g. the year-in-review) don't. */
export function hasEpisodePage(ep: { guests?: string[] }) {
  return (ep.guests?.length ?? 0) > 0;
}

export function episodePath(ep: { slug: string }) {
  return `/episodes/${ep.slug}/`;
}

export function guestPath(guest: { id: string }) {
  return `/guests/${guest.id}/`;
}

/** "1:02:12" style label for a number of seconds. */
export function stamp(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return (h ? `${h}:` : "") + `${mm}:${String(s).padStart(2, "0")}`;
}
