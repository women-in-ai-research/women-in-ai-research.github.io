import type { Metadata } from "next";
import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import topicsData from "@/app/data/topics.json";

interface Topic {
  slug: string;
  name: string;
  intro: string;
  videoIds: string[];
  eventVideoIds: string[];
}

export const metadata: Metadata = {
  title: "Topics — WiAIR: The AI Research Podcast",
  description:
    "Browse Women in AI Research podcast episodes by research topic: evaluation, AI safety, reasoning, interpretability, multilingual AI and more.",
};

function countLabel(episodes: number, events: number): string {
  const parts = [];
  if (episodes) parts.push(`${episodes} ${episodes === 1 ? "episode" : "episodes"}`);
  if (events) parts.push(`${events} conference ${events === 1 ? "interview" : "interviews"}`);
  return parts.join(" · ");
}

export default function TopicsPage() {
  const topics = (topicsData as Topic[]).filter((t) => t.videoIds.length + t.eventVideoIds.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />

      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 relative z-10 text-center">
        <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">Browse by topic</p>
        <h1 className="text-5xl md:text-6xl font-bold text-white">Topics</h1>
        <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
          Find episodes on your research area.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <li key={t.slug}>
              <a
                href={`/topics/${t.slug}/`}
                className="flex flex-col h-full p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-white mb-2">{t.name}</h2>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-grow">{t.intro}</p>
                <p className="text-wiair-light text-sm font-medium mt-4">
                  {countLabel(t.videoIds.length, t.eventVideoIds.length)} →
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />
      <Footer />
    </div>
  );
}
