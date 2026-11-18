import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { Transcript } from "@/app/components/episode/Transcript";
import type { Episode } from "@/app/components/podcast/EpisodeList";
import episodesData from "@/app/data/episodes.json";
import guestsData from "@/app/data/guests.json";
import config from "@/data/youtube-config.json";
import { formatDuration } from "@/app/components/common/RichText";
import { parseDescription } from "@/app/lib/description";
import { loadTranscript } from "@/app/lib/episodeExtras";
import { episodePath, guestPath, hasEpisodePage, stamp } from "@/app/lib/episodePages";

interface Guest { id: string; name: string; title: string; bio: string; imageUrl: string; episodes: { number: number }[] }

const episodes = (episodesData as Episode[]).filter(hasEpisodePage).sort((a, b) => a.number - b.number);
const guests = guestsData as Guest[];
const SITE = "https://women-in-ai-research.github.io";

export function generateStaticParams() {
  return episodes.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ep = episodes.find((e) => e.slug === params.slug);
  if (!ep) return {};
  const description = parseDescription(ep.description, ep.guests).summary[0]?.slice(0, 300);
  return {
    title: `${ep.title} | WiAIR Podcast`,
    description,
    alternates: { canonical: `${SITE}${episodePath(ep)}` },
    openGraph: { title: ep.title, description, images: [ep.thumbnailUrl], type: "video.episode" },
  };
}

const glass = "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10";

export default function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = episodes.find((e) => e.slug === params.slug);
  if (!ep) notFound();

  const idx = episodes.indexOf(ep);
  const prev = episodes[idx - 1];
  const next = episodes[idx + 1];
  const epGuests = guests.filter((g) => g.episodes.some((x) => x.number === ep.number));
  const d = parseDescription(ep.description, ep.guests);
  const transcript = loadTranscript(ep.number);
  const papers = d.references.filter((r) => r.isPaper);
  const links = d.references.filter((r) => !r.isPaper);

  // "Mentioned at 21:04": jump to the transcript paragraph containing that moment, or to YouTube.
  const momentHref = (sec: number) => {
    if (!transcript) return `${ep.youtubeUrl}&t=${sec}s`;
    const para = [...transcript.segments].reverse().find((s) => s.t <= sec) ?? transcript.segments[0];
    return `#p-${para.t}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    episodeNumber: ep.number,
    datePublished: ep.publishDate,
    url: `${SITE}${episodePath(ep)}`,
    description: d.summary.join(" ").slice(0, 500),
    partOfSeries: { "@type": "PodcastSeries", name: "Women in AI Research (WiAIR)", url: SITE },
    associatedMedia: { "@type": "VideoObject", name: ep.title, embedUrl: `https://www.youtube.com/embed/${ep.videoId}`, thumbnailUrl: ep.thumbnailUrl, uploadDate: ep.publishDate },
    actor: epGuests.map((g) => ({ "@type": "Person", name: g.name, url: `${SITE}${guestPath(g)}` })),
  };

  const refItem = (r: (typeof d.references)[number]) => (
    <li key={r.url} className="text-sm">
      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
        {r.isPaper ? "📄" : "🔗"} {r.title}
      </a>
      <span className="block text-xs mt-0.5 space-x-3">
        {r.seconds !== undefined && (
          <a href={momentHref(r.seconds)} className="text-wiair-light hover:text-wiair-lightest">mentioned at {stamp(r.seconds)}</a>
        )}
        {r.extra?.map((x) => (
          <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">{x.label} ↗</a>
        ))}
      </span>
    </li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 relative z-10">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
          <a href="/episodes/" className="hover:text-wiair-lightest">Episodes</a> · Episode {ep.number}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">{ep.title}</h1>
        <p className="text-wiair-light mt-4">{[ep.publishDate, formatDuration(ep.durationSeconds), ep.podcast].filter(Boolean).join(" · ")}</p>
        {ep.topics && ep.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-4" aria-label="Topics">
            {ep.topics.map((t) => (
              <li key={t.slug}>
                <a href={`/topics/${t.slug}/`} className="inline-block px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300">{t.name}</a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${ep.title} on YouTube`} className="block relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
            <img src={ep.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-full bg-gradient-to-r from-wiair-medium to-purple-500 flex items-center justify-center shadow-lg shadow-wiair-medium/40 group-hover:scale-105 transition-transform">
                <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6V4z" /></svg>
              </span>
            </span>
          </a>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-wiair-medium/25 transition-all duration-300 font-medium text-sm">Watch on YouTube</a>
            <a href={config.spotifyShowUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm">Spotify</a>
            <a href={config.appleShowUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm">Apple Podcasts</a>
            {transcript && <a href="#transcript" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm">Read transcript ↓</a>}
          </div>
        </div>

        <aside className="space-y-4">
          {epGuests.map((g) => (
            <a key={g.id} href={guestPath(g)} className={`${glass} block p-5 hover:bg-white/[0.12] transition-all duration-300`}>
              <p className="text-wiair-light text-xs font-semibold tracking-widest uppercase mb-3">Guest</p>
              <div className="flex items-center gap-4 mb-3">
                {g.imageUrl ? (
                  <img src={g.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-white/20 shrink-0" />
                ) : (
                  <span className="w-16 h-16 rounded-full bg-wiair-medium/30 flex items-center justify-center text-white text-xl shrink-0">{g.name.replace(/^Dr\.?\s+/, "").charAt(0)}</span>
                )}
                <div>
                  <p className="text-lg font-bold text-white">{g.name}</p>
                  {g.title && <p className="text-sm text-gray-300">{g.title}</p>}
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-4">{g.bio}</p>
              <p className="text-sm font-medium text-wiair-light mt-3">View researcher page →</p>
            </a>
          ))}
        </aside>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${glass} p-6 ${d.references.length ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h2 className="text-2xl font-bold text-white mb-4">About this episode</h2>
          {d.summary.map((p, i) => <p key={i} className="text-gray-300 leading-relaxed mb-3">{p}</p>)}

          {d.highlights.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Key points</h3>
              <ul className="space-y-2">
                {d.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-gray-300"><span className="text-wiair-light">→</span><span>{h}</span></li>
                ))}
              </ul>
            </>
          )}

          {ep.chapters.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-white mt-6 mb-3">Chapters</h3>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {ep.chapters.map((c) => (
                  <li key={c.seconds}>
                    <a href={transcript ? `#t-${c.seconds}` : `${ep.youtubeUrl}&t=${c.seconds}s`} className="flex gap-3 text-sm text-gray-300 hover:text-white">
                      <span className="font-mono text-wiair-light w-14 shrink-0">{c.time}</span>{c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        {d.references.length > 0 && (
          <div className={`${glass} p-6`}>
            <h2 className="text-xl font-bold text-white mb-4">Papers &amp; links mentioned</h2>
            <ul className="space-y-3">{papers.map(refItem)}</ul>
            {links.length > 0 && <ul className={`space-y-3 ${papers.length ? "mt-5 pt-5 border-t border-white/10" : ""}`}>{links.map(refItem)}</ul>}
          </div>
        )}
      </section>

      {transcript && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
          <Transcript segments={transcript.segments} chapters={ep.chapters} youtubeUrl={ep.youtubeUrl} />
        </section>
      )}

      <nav aria-label="More episodes" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10 grid grid-cols-2 gap-6">
        <div>{prev && <a href={episodePath(prev)} className={`${glass} block p-5 hover:bg-white/[0.12] transition-all duration-300`}><p className="text-xs text-wiair-light uppercase tracking-widest">← Episode {prev.number}</p><p className="text-white font-medium mt-1 line-clamp-2">{prev.title}</p></a>}</div>
        <div>{next && <a href={episodePath(next)} className={`${glass} block p-5 text-right hover:bg-white/[0.12] transition-all duration-300`}><p className="text-xs text-wiair-light uppercase tracking-widest">Episode {next.number} →</p><p className="text-white font-medium mt-1 line-clamp-2">{next.title}</p></a>}</div>
      </nav>

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />
      <Footer />
    </div>
  );
}
