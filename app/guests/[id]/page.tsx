import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import episodesData from "@/app/data/episodes.json";
import guestsData from "@/app/data/guests.json";
import type { Episode } from "@/app/components/podcast/EpisodeList";
import { formatDuration } from "@/app/components/common/RichText";
import { linkLabel, parseDescription } from "@/app/lib/description";
import { guestOverride } from "@/app/lib/episodeExtras";
import { episodePath, guestPath, hasEpisodePage } from "@/app/lib/episodePages";

interface Guest { id: string; name: string; title: string; bio: string; imageUrl: string; episodes: { number: number }[] }

const guests = guestsData as Guest[];
const episodes = episodesData as Episode[];
const SITE = "https://women-in-ai-research.github.io";

export function generateStaticParams() {
  return guests.map((g) => ({ id: g.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const g = guests.find((x) => x.id === params.id);
  if (!g) return {};
  return {
    title: `${g.name} | WiAIR Podcast guest`,
    description: g.bio?.slice(0, 300),
    alternates: { canonical: `${SITE}${guestPath(g)}` },
    openGraph: { title: g.name, description: g.bio?.slice(0, 300), images: g.imageUrl ? [g.imageUrl] : [] },
  };
}

const glass = "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10";

export default function GuestPage({ params }: { params: { id: string } }) {
  const g = guests.find((x) => x.id === params.id);
  if (!g) notFound();

  const override = guestOverride(g.name);
  const eps = episodes.filter((e) => g.episodes.some((x) => x.number === e.number)).sort((a, b) => b.number - a.number);
  const parsed = eps.map((e) => parseDescription(e.description, e.guests));

  // Link buttons: hand-edited ones first, then any found in "Connect with ..." sections.
  const seen = new Set<string>();
  const links = [
    ...(override?.links ?? []),
    ...parsed.flatMap((p) => p.guestLinks).map((url) => ({ label: linkLabel(url), url })),
  ].filter((l) => {
    const k = l.url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const papers = Array.from(new Map(parsed.flatMap((p) => p.references).filter((r) => r.isPaper).map((r) => [r.url, r])).values());
  const topics = Array.from(new Map(eps.flatMap((e) => e.topics ?? []).map((t) => [t.slug, t])).values());
  const areas = override?.researchAreas ?? [];
  // The bio from guests.json; if it's empty, the "About [guest]" text (or opening guest intro) from her episode description.
  const bio = g.bio?.trim() || parsed.map((p) => p.guestAbout.join(" ") || p.guestIntro.join(" ")).find(Boolean) || "";
  const side = areas.length > 0 || topics.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: g.name,
    jobTitle: g.title || undefined,
    description: bio || undefined,
    image: g.imageUrl ? `${SITE}${g.imageUrl}` : undefined,
    url: `${SITE}${guestPath(g)}`,
    sameAs: links.map((l) => l.url),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10 relative z-10">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-6">
          <a href="/guests/" className="hover:text-wiair-lightest">Our Guests</a>
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {g.imageUrl ? (
            <img src={g.imageUrl} alt={g.name} className="w-44 h-44 rounded-full object-cover border-2 border-wiair-medium/60 shadow-lg shadow-wiair-medium/20 shrink-0" />
          ) : (
            <span className="w-44 h-44 rounded-full bg-wiair-medium/30 flex items-center justify-center text-white text-5xl shrink-0">{g.name.replace(/^Dr\.?\s+/, "").charAt(0)}</span>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{g.name}</h1>
            {g.title && <p className="text-lg text-wiair-light mt-2">{g.title}</p>}
            {links.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
                {links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 text-sm text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300">{l.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bio && (
          <div className={`${glass} p-6 ${side ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{bio}</p>
          </div>
        )}
        {side && (
          <div className={`${glass} p-6 ${bio ? "" : "lg:col-span-3"}`}>
            {areas.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-white mb-3">Research areas</h2>
                <ul className="flex flex-wrap gap-2 mb-6">
                  {areas.map((a) => <li key={a} className="px-3 py-1 text-xs text-white bg-wiair-medium/25 border border-wiair-medium/40 rounded-full">{a}</li>)}
                </ul>
              </>
            )}
            {topics.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-white mb-3">Topics on WiAIR</h2>
                <ul className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <li key={t.slug}><a href={`/topics/${t.slug}/`} className="inline-block px-3 py-1 text-xs text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300">{t.name}</a></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-5">{eps.length === 1 ? "Episode" : "Episodes"}</h2>
        <div className="space-y-5">
          {eps.map((e) => {
            const href = hasEpisodePage(e) ? episodePath(e) : e.youtubeUrl;
            return (
              <a key={e.slug} href={href} className={`${glass} flex flex-col md:flex-row gap-5 p-5 hover:bg-white/[0.12] transition-all duration-300`}>
                <img src={e.thumbnailUrl} alt="" className="w-full md:w-64 aspect-video object-cover rounded-xl" loading="lazy" />
                <div>
                  <p className="text-wiair-light text-xs font-semibold tracking-widest uppercase mb-1">Episode {e.number}</p>
                  <h3 className="text-xl font-bold text-white mb-1">{e.title}</h3>
                  <p className="text-wiair-light text-sm mb-3">{e.publishDate} · {formatDuration(e.durationSeconds)}</p>
                  <p className="text-sm font-medium text-white">Go to episode page →</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {papers.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-5">Papers discussed on WiAIR</h2>
          <ul className={`${glass} divide-y divide-white/10`}>
            {papers.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex justify-between gap-4 px-6 py-4 hover:bg-white/5">
                  <span className="text-gray-200">📄 {p.title}</span>
                  <span className="text-xs text-wiair-light shrink-0 pt-1">{new URL(p.url).hostname.replace(/^www\./, "")} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />
      <Footer />
    </div>
  );
}
