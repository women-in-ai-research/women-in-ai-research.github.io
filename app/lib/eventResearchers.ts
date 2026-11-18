import eventsData from "@/app/data/events.json";
import eventResearchers from "@/data/event-researchers.json";
import topicsData from "@/app/data/topics.json";
import { slugify } from "@/app/lib/slugify";

export interface EventVideo { videoId: string; title: string; description: string; youtubeUrl: string; thumbnailUrl: string; publishDate: string; durationSeconds: number }
export interface EventResearcher { slug: string; name: string; affiliation: string; eventTitle: string; video: EventVideo; topics: { slug: string; name: string }[] }

const events = eventsData as { title: string; videos: EventVideo[] }[];
const topics = topicsData as { slug: string; name: string; eventVideoIds: string[] }[];

export const researchers: EventResearcher[] = eventResearchers.researchers.flatMap((r) => {
  const id = r.video.split("v=")[1]?.slice(0, 11) ?? "";
  for (const g of events) {
    const v = g.videos.find((x) => x.videoId === id);
    if (v)
      return [{
        slug: slugify(r.name),
        name: r.name,
        affiliation: r.affiliation,
        eventTitle: g.title,
        video: v,
        topics: topics.filter((t) => t.eventVideoIds.includes(id)).map((t) => ({ slug: t.slug, name: t.name })),
      }];
  }
  return [];
});

/** Event interviewees grouped by event (newest event first, as in events.json), with only the fields the Guests page list needs. */
export function researchersByEvent(): [string, { slug: string; name: string; affiliation: string }[]][] {
  const m = new Map<string, { slug: string; name: string; affiliation: string }[]>();
  for (const r of researchers) m.set(r.eventTitle, [...(m.get(r.eventTitle) ?? []), { slug: r.slug, name: r.name, affiliation: r.affiliation }]);
  return Array.from(m.entries());
}
