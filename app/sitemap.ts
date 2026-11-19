import type { MetadataRoute } from "next";
import episodesData from "@/app/data/episodes.json";
import guestsData from "@/app/data/guests.json";
import topicsData from "@/app/data/topics.json";
import { researchers } from "@/app/lib/eventResearchers";
import { episodePath, guestPath, hasEpisodePage } from "@/app/lib/episodePages";

/** sitemap.xml: every page of the site, rebuilt on each deploy so new episodes are listed automatically. */
export const dynamic = "force-static";

const SITE = "https://women-in-ai-research.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const episodes = episodesData as { slug: string; guests: string[]; publishDate?: string }[];
  const date = (d?: string) => (d && !isNaN(Date.parse(d)) ? new Date(d) : undefined);
  const times = episodes.map((e) => date(e.publishDate)?.getTime()).filter((t): t is number => t !== undefined);
  const latest = times.length ? new Date(Math.max(...times)).toISOString() : undefined;
  const page = (p: string, lastModified?: Date) => ({ url: `${SITE}${p}`, ...(lastModified ? { lastModified } : {}) });

  return [
    ...["/", "/episodes/", "/guests/", "/events/", "/topics/", "/mentorship/", "/news/", "/announcements/"].map((p) => page(p, date(latest))),
    ...episodes.filter(hasEpisodePage).map((e) => page(episodePath(e), date(e.publishDate))),
    ...(guestsData as { id: string }[]).map((g) => page(guestPath(g))),
    ...researchers.map((r) => page(`/researchers/${r.slug}/`)),
    ...(topicsData as { slug: string }[]).map((t) => page(`/topics/${t.slug}/`)),
  ];
}
