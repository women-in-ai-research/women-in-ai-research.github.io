import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { TopicButtons } from "@/app/components/topics/TopicButtons";
import { TeamGrid } from "@/app/components/home/TeamGrid";
import { formatDuration } from "@/app/components/common/RichText";
import { YouTubeButton, SpotifyButton, ApplePodcastsButton } from "@/app/components/common/Buttons";
import { EventLogo } from "@/app/components/events/EventLogo";
import type { Episode } from "@/app/components/podcast/EpisodeList";
import { hasEpisodePage, episodePath } from "@/app/lib/episodePages";
import episodesData from "@/app/data/episodes.json";
import guestsData from "@/app/data/guests.json";
import eventsData from "@/app/data/events.json";
import eventResearchers from "@/data/event-researchers.json";

const YOUTUBE_URL = "https://www.youtube.com/@WomeninAIResearch";


// Shown as text in the "Our guests come from" row.
const INSTITUTIONS = [
  "Stanford", "MIT", "Harvard", "Yale", "Carnegie Mellon", "Cambridge", "University of Toronto", "Vector Institute",
  "Mila", "ETH Zurich", "EPFL", "Google DeepMind", "Anthropic", "Meta", "Apple", "Cohere",
];

const HOST_WEBSITE = "https://jeknov.github.io/";
const SITE_URL = "https://women-in-ai-research.github.io/";

/** Same person regardless of title, accents or word order. */
function nameKey(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(dr|prof|professor)\.?\s+/gi, "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

const CARD = "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl";
const PRIMARY_BTN =
  "inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full font-semibold shadow-lg shadow-wiair-medium/25 hover:shadow-xl hover:shadow-wiair-medium/40 transition-all duration-300";
const SECONDARY_BTN =
  "inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300";
const EYEBROW = "text-wiair-light text-sm font-semibold tracking-widest uppercase";

interface EventGroup {
  id: string;
  title: string;
  videos: unknown[];
}

interface Guest {
  id: string;
  name: string;
}

/** First sentence or two of a description, for the episode cards. */
function hook(description: string): string {
  const first = description.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
  if (first.length <= 180) return first;
  const cut = first.slice(0, 180);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return end > 60 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="7 4 20 12 7 20 7 4" />
    </svg>
  );
}

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />;
}

export default function Page() {
  const episodes = [...(episodesData as Episode[])].sort((a, b) => b.number - a.number);
  const latest = episodes[0];
  const recent = episodes.slice(0, 3);
  // Podcast guests plus researchers interviewed at events, each person counted once.
  const people = new Set((guestsData as Guest[]).map((g) => nameKey(g.name)));
  for (const r of eventResearchers.researchers) people.add(nameKey(r.name));
  const researcherCount = people.size;
  // Only event playlists reach events.json (see data/youtube-config.json), most recent first.
  const events = eventsData as EventGroup[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest relative overflow-x-clip">
      <Navbar />

      {/* Decorative blur orbs */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] -right-32 w-[420px] h-[420px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] -left-32 w-[320px] h-[320px] bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[58%] -right-24 w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[82%] -left-24 w-[320px] h-[320px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastSeries",
            name: "Women in AI Research (WiAIR)",
            url: SITE_URL,
            author: {
              "@type": "Person",
              name: "Jekaterina Novikova",
              url: HOST_WEBSITE,
              sameAs: [HOST_WEBSITE],
            },
          }),
        }}
      />

      <main className="relative z-10">
        {/* 1. Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex flex-wrap items-center gap-x-14 gap-y-10">
          <div className="order-1 flex-[999_1_520px] min-w-0 flex flex-col gap-6">
            <p className={EYEBROW}>Women in AI Research · The WiAIR podcast</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              WiAIR: The AI research podcast
            </h1>
            <p className="text-xl leading-relaxed text-gray-300 max-w-2xl">
              In-depth conversations with female AI researchers from around the globe: the people behind the papers,
              and the research itself. <strong className="text-white font-semibold">By researchers, for researchers.</strong>
            </p>
          </div>

          {latest && (
            <a
              href={latest.youtubeUrl || YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CARD} order-3 lg:order-2 flex-[1_1_340px] min-w-0 max-w-[400px] overflow-hidden flex flex-col hover:bg-white/[0.12] transition-all duration-300`}
            >
              <img src={latest.thumbnailUrl} alt="" className="w-full aspect-video object-cover" />
              <div className="p-6 flex flex-col gap-2">
                <p className="text-wiair-light text-xs font-semibold tracking-widest uppercase">New · Episode {latest.number}</p>
                <p className="text-xl font-bold text-white leading-snug">{latest.title}</p>
                <p className="text-gray-400 text-sm">{formatDuration(latest.durationSeconds)}</p>
              </div>
            </a>
          )}

          {/* Same buttons as the previous Home page */}
          <div className="order-2 lg:order-3 basis-full flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 -mt-4 lg:mt-0 [&>a]:whitespace-nowrap">
            <YouTubeButton />
            <SpotifyButton />
            <ApplePodcastsButton />
          </div>
        </section>

        <Divider />

        {/* 2. Host, numbers and institutions */}
        <section aria-label="About the show" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col gap-10">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex-[1_1_420px] min-w-0 flex items-center gap-5">
              <img
                src="/images/about/jekaterina-novikova.jpg"
                alt="Dr. Jekaterina Novikova"
                className="w-[88px] h-[88px] rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col gap-1.5">
                <p className={EYEBROW}>Your host</p>
                <p className="text-xl font-bold text-white">
                  <a
                    href={HOST_WEBSITE}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1.5 hover:text-wiair-lightest underline decoration-white/30 underline-offset-4 hover:decoration-wiair-light transition-colors"
                  >
                    Dr. Jekaterina Novikova
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7" /><path d="M8 7h9v9" />
                    </svg>
                    <span className="sr-only">(personal website, opens in a new tab)</span>
                  </a>
                </p>
                <p className="text-gray-300 leading-relaxed">
                  AI research scientist with 13+ years in NLP and ML, published at ACL, EMNLP, NeurIPS and NAACL.
                </p>
              </div>
            </div>
            <dl className="flex-[1_1_460px] min-w-0 flex flex-wrap gap-4">
              {[
                { value: episodes.length, label: "long-form episodes" },
                { value: researcherCount, label: "researchers interviewed" },
                { value: events.length, label: "events covered" },
              ].map((s) => (
                <div key={s.label} className={`${CARD} flex-[1_1_120px] p-5 flex flex-col-reverse justify-end`}>
                  <dt className="text-sm text-gray-400 mt-1">{s.label}</dt>
                  <dd className="text-4xl font-bold text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-wiair-light">Our guests come from</p>
            <ul className="flex flex-wrap justify-center items-baseline gap-x-5 gap-y-2.5 max-w-4xl">
              {INSTITUTIONS.map((name) => (
                <li key={name} className="text-lg font-medium text-white/85 tracking-tight">{name}</li>
              ))}
            </ul>
          </div>
        </section>

        <Divider />

        {/* 3. Every episode */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 flex flex-col gap-9">
          <div className="flex flex-col gap-3 max-w-3xl">
            <p className={EYEBROW}>Every episode</p>
            <h2 className="text-4xl font-bold text-white leading-tight">
              The story behind the paper, and the person behind the story
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`${CARD} p-8 flex flex-col gap-3`}>
              <p className="text-sm font-semibold text-wiair-light">Part 1</p>
              <h3 className="text-2xl font-bold text-white">Getting to know her</h3>
              <p className="text-lg leading-relaxed text-gray-300">
                Her path into AI research, the challenges she has overcome, how she balances career and life, and the
                decisions that shaped her work.
              </p>
            </div>
            <div className={`${CARD} p-8 flex flex-col gap-3`}>
              <p className="text-sm font-semibold text-wiair-light">Part 2</p>
              <h3 className="text-2xl font-bold text-white">One topic, explored in depth</h3>
              <p className="text-lg leading-relaxed text-gray-300">
                A single research question, approached from several angles and grounded in her latest published work:
                what she set out to find, how she tested it, and what it means for the field.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Latest episodes */}
        <section id="episodes" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3 max-w-2xl">
              <p className={EYEBROW}>Latest episodes</p>
              <h2 className="text-4xl font-bold text-white leading-tight">Female AI researchers on their latest work</h2>
              <p className="text-lg text-gray-300">
                Meet the women shaping AI research, and hear about their papers from the source.
              </p>
            </div>
            <a href="/episodes/" className="font-semibold text-wiair-light hover:text-wiair-lightest py-3">
              See all {episodes.length} episodes →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((ep) => (
              <article key={ep.videoId || ep.id} className={`${CARD} overflow-hidden flex flex-col`}>
                <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${ep.title} on YouTube`}>
                  <img src={ep.thumbnailUrl} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                </a>
                <div className="p-6 flex flex-col gap-2.5 flex-grow">
                  <p className="text-sm text-gray-400">
                    {[`Episode ${ep.number}`, ep.publishDate, formatDuration(ep.durationSeconds)].filter(Boolean).join(" · ")}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-snug">{ep.title}</h3>
                  {ep.guests.length > 0 && (
                    <p className="font-semibold text-wiair-light">{ep.guests.join(", ")}</p>
                  )}
                  <p className="text-gray-300 leading-relaxed flex-grow">{hook(ep.description)}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className={`${SECONDARY_BTN} !py-2.5 text-sm`}>
                      <PlayIcon size={14} /> Watch
                    </a>
                    {hasEpisodePage(ep) && (
                      <a href={episodePath(ep)} className={`${SECONDARY_BTN} !py-2.5 text-sm`}>
                        Episode page →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* 5. Browse by topic */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className={EYEBROW}>Browse by topic</p>
              <h2 className="text-4xl font-bold text-white leading-tight">Find episodes on your research area</h2>
            </div>
            <a href="/topics/" className="font-semibold text-wiair-light hover:text-wiair-lightest py-3">
              All topics →
            </a>
          </div>
          <TopicButtons />
        </section>

        <Divider />

        {/* 6. Events */}
        {events.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-3 max-w-2xl">
                <p className={EYEBROW}>From conferences and workshops</p>
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Interviews, talks and panels, recorded on site
                </h2>
              </div>
              <a href="/events/" className="font-semibold text-wiair-light hover:text-wiair-lightest py-3">
                All events →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {events.slice(0, 4).map((g) => (
                <a key={g.id} href={`/events/#${g.id}`} className={`${CARD} p-6 flex flex-col gap-2 hover:bg-white/[0.12] transition-all duration-300`}>
                  <EventLogo title={g.title} className="h-16 w-full mb-2" />
                  <p className="text-2xl font-bold text-white">{g.title}</p>
                  <p className="text-gray-400">{g.videos.length} videos</p>
                  <p className="mt-2 font-semibold text-wiair-light">Watch the playlist →</p>
                </a>
              ))}
            </div>
          </section>
        )}

        <Divider />

        {/* 7. Who it's for */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <p className={EYEBROW}>Who it&apos;s for</p>
            <h2 className="text-4xl font-bold text-white leading-tight">Made for people who read the papers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "PhD students and early-career researchers",
                text: "Learn from researchers at every career stage, and see what it takes to pursue your passion for AI.",
                icon: <><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></>,
              },
              {
                title: "Experienced researchers",
                text: "Go beyond the abstract: the methods, the open questions and what didn't make it into the paper.",
                icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
              },
              {
                title: "Practitioners in industry",
                text: "Hear what new results mean in practice, from the people who produced them.",
                icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
              },
            ].map((c) => (
              <div key={c.title} className={`${CARD} p-7 flex flex-col gap-3`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B380F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {c.icon}
                </svg>
                <h3 className="text-xl font-bold text-white">{c.title}</h3>
                <p className="text-gray-300 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* 8. Our mission */}
        <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-wrap gap-10 items-start scroll-mt-28">
          <div className="flex-[1_1_280px] flex flex-col gap-3">
            <p className={EYEBROW}>Our mission</p>
            <h2 className="text-4xl font-bold text-white leading-tight">Celebrating female AI researchers</h2>
          </div>
          <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-5">
            <p className="text-2xl leading-relaxed font-semibold text-white">
              Women in AI Research (WiAIR) is a podcast dedicated to celebrating the remarkable contributions of female AI
              researchers from around the globe. Our mission is to challenge the prevailing perception that AI research is
              predominantly male-driven.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              We aim to empower early-career researchers, especially women, to pursue their passion for AI and make an
              impact in this rapidly growing field, and to build a community that values diversity and inclusion in AI.
            </p>
            <a href="#team" className="self-start font-semibold text-wiair-light hover:text-wiair-lightest py-2">
              Meet the team →
            </a>
          </div>
        </section>

        <Divider />

        {/* 9. Team */}
        <section id="team" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col gap-9 scroll-mt-28">
          <div className="flex flex-col gap-3">
            <p className={EYEBROW}>The team</p>
            <h2 className="text-4xl font-bold text-white leading-tight">Meet the people behind Women in AI Research</h2>
          </div>
          <TeamGrid />
        </section>

        <Divider />

        {/* 10. Community */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`${CARD} p-8 md:p-12 flex flex-wrap items-center justify-between gap-7`}>
            <div className="flex-[999_1_420px] min-w-0 flex flex-col gap-2.5">
              <h2 className="text-3xl font-bold text-white">Join the community</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Be part of a community that values diversity and inclusion in AI: talk about the episodes on Discord, or
                join the WiAIR Mentorship Lab.
              </p>
            </div>
            <div className="flex-[1_1_280px] flex flex-wrap gap-3">
              <a href="https://discord.gg/267DPacHT5" target="_blank" rel="noopener noreferrer" className={PRIMARY_BTN}>
                Join Discord
              </a>
              <a href="/mentorship/" className={SECONDARY_BTN}>
                Mentorship Lab
              </a>
            </div>
          </div>
        </section>

      </main>

      <Divider />
      <Footer />
    </div>
  );
}
