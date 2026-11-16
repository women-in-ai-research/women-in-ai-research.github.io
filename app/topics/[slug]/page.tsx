import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { EpisodeList, Episode } from "@/app/components/podcast/EpisodeList";
import { TopicButtons } from "@/app/components/topics/TopicButtons";
import topicsData from "@/app/data/topics.json";
import episodesData from "@/app/data/episodes.json";
import guestsData from "@/app/data/guests.json";
import eventsData from "@/app/data/events.json";
import eventResearchers from "@/data/event-researchers.json";
import { EventVideoCard } from "@/app/components/topics/EventVideoCard";

interface Topic {
  slug: string;
  name: string;
  intro: string;
  videoIds: string[];
  eventVideoIds: string[];
  related: string[];
}

interface Guest {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  episodes: { number: number }[];
}

interface EventGroupData {
  title: string;
  videos: {
    videoId: string;
    title: string;
    youtubeUrl: string;
    thumbnailUrl: string;
    publishDate: string;
    durationSeconds: number;
  }[];
}

const topics = topicsData as Topic[];

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = topics.find((t) => t.slug === params.slug);
  if (!topic) return {};
  const title = `${topic.name} — WiAIR Podcast Episodes`;
  return {
    title,
    description: topic.intro,
    openGraph: { title, description: topic.intro },
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = topics.find((t) => t.slug === params.slug);
  if (!topic) notFound();

  const episodes = (episodesData as Episode[]).filter((e) => topic.videoIds.includes(e.videoId));
  const numbers = new Set(episodes.map((e) => e.number));
  const guests = (guestsData as Guest[]).filter((g) => g.episodes.some((e) => numbers.has(e.number)));
  // Event interviews on this topic, with the researcher from data/event-researchers.json.
  const researcherByVideo = new Map(
    eventResearchers.researchers.map((r) => [r.video.split("v=")[1]?.slice(0, 11) ?? "", r])
  );
  const eventVideos = (eventsData as EventGroupData[])
    .flatMap((g) => g.videos.map((v) => ({ ...v, eventTitle: g.title })))
    .filter((v) => topic.eventVideoIds.includes(v.videoId))
    .sort((a, b) => topic.eventVideoIds.indexOf(a.videoId) - topic.eventVideoIds.indexOf(b.videoId));
  const related = topic.related
    .map((slug) => topics.find((t) => t.slug === slug))
    .filter((t): t is Topic => !!t);

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />

      {/* Decorative blur orbs */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Page Header */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 relative z-10 text-center">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
          <a href="/topics/" className="hover:text-wiair-lightest">Topics</a>
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white">{topic.name}</h1>
        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed">{topic.intro}</p>
        <p className="text-wiair-light mt-4">
          {[
            episodes.length ? `${episodes.length} ${episodes.length === 1 ? "episode" : "episodes"}` : "",
            eventVideos.length ? `${eventVideos.length} conference ${eventVideos.length === 1 ? "interview" : "interviews"}` : "",
          ].filter(Boolean).join(" · ")}
        </p>
      </header>

      {/* Episodes */}
      {episodes.length > 0 && (
        <section aria-label={`${topic.name} episodes`} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <EpisodeList episodes={episodes} />
        </section>
      )}

      {/* Guests on this topic */}
      {guests.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Researchers on this topic</h2>
          <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
            {guests.map((g) => (
              <li key={g.id}>
                <a
                  href={`/guests/#${g.id}`}
                  className="flex items-center gap-3 pr-5 pl-2 py-2 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300"
                >
                  <img src={g.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                  <span className="text-white font-medium">{g.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Conference and workshop interviews */}
      {eventVideos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 relative z-10">
          <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-2 text-center md:text-left">
            From conferences and workshops
          </p>
          <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Interviews recorded on site</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventVideos.map((v) => (
              <EventVideoCard
                key={v.videoId}
                title={v.title}
                youtubeUrl={v.youtubeUrl}
                thumbnailUrl={v.thumbnailUrl}
                publishDate={v.publishDate}
                durationSeconds={v.durationSeconds}
                eventTitle={v.eventTitle}
                researcher={researcherByVideo.get(v.videoId)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Related and all topics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {related.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Related topics</h2>
            <ul className="flex flex-wrap gap-3">
              {related.map((t) => (
                <li key={t.slug}>
                  <a
                    href={`/topics/${t.slug}/`}
                    className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-wiair-medium to-purple-500 text-white font-medium shadow-lg shadow-wiair-medium/25 hover:shadow-wiair-medium/40 transition-all duration-300"
                  >
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h2 className="text-2xl font-bold text-white mb-4">All topics</h2>
        <TopicButtons current={topic.slug} />
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />
      <Footer />
    </div>
  );
}
