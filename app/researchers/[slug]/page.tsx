import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { formatDuration } from "@/app/components/common/RichText";
import { researchers } from "@/app/lib/eventResearchers";
import { parseDescription } from "@/app/lib/description";
import { Name } from "@/app/components/guests/EventResearchersSection";

export function generateStaticParams() {
  return researchers.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = researchers.find((x) => x.slug === params.slug);
  return r ? { title: `${r.name} | Interviewed by WiAIR at ${r.eventTitle}`, description: `${r.name}${r.affiliation ? ` (${r.affiliation})` : ""} talks with Women in AI Research at ${r.eventTitle}.` } : {};
}

const glass = "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10";

export default function EventResearcherPage({ params }: { params: { slug: string } }) {
  const r = researchers.find((x) => x.slug === params.slug);
  if (!r) notFound();
  const v = r.video;
  const summary = parseDescription(v.description, [r.name]).summary.slice(0, 2);
  const paper = v.description.match(/Paper:\s*(https?:\/\/\S+)/)?.[1];
  const sameEvent = researchers.filter((x) => x.eventTitle === r.eventTitle && x.slug !== r.slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 relative z-10">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
          <a href="/guests/#at-events" className="hover:text-wiair-lightest">Researchers</a> · Interviewed at {r.eventTitle}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white">{r.name}</h1>
        {r.affiliation && <p className="text-lg text-wiair-light mt-2">{r.affiliation}</p>}
        {r.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-4">
            {r.topics.map((t) => (
              <li key={t.slug}><a href={`/topics/${t.slug}/`} className="inline-block px-3 py-1 text-xs text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20">{t.name}</a></li>
            ))}
          </ul>
        )}
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <div className={`${glass} flex flex-col md:flex-row gap-6 p-6`}>
          <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block w-full md:w-96 shrink-0 aspect-video rounded-xl overflow-hidden">
            <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </a>
          <div>
            <p className="text-xs text-gray-400 mb-1">{[r.eventTitle, v.publishDate, formatDuration(v.durationSeconds)].join(" · ")}</p>
            <h2 className="text-xl font-bold text-white mb-3">{v.title}</h2>
            {summary.map((p, i) => <p key={i} className="text-sm text-gray-300 leading-relaxed mb-2">{p}</p>)}
            <div className="flex flex-wrap gap-3 mt-4">
              <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full font-medium text-sm">Watch the interview</a>
              {paper && <a href={paper} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm">📄 Read the paper</a>}
            </div>
          </div>
        </div>
      </section>

      {sameEvent.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-bold text-white">More from {r.eventTitle}</h2>
            <a href="/guests/#at-events" className="text-sm text-wiair-light hover:text-wiair-lightest">All event interviews →</a>
          </div>
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-2xl border border-white/10 p-6 md:p-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
              {sameEvent.map((x) => <Name key={x.slug} r={x} />)}
            </ul>
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />
      <Footer />
    </div>
  );
}
