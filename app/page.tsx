"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { Hero } from "@/app/components/hero/Hero";
import { EpisodeList } from "@/app/components/podcast/EpisodeList";
import { AboutSection } from "@/app/components/about/AboutSection";
import { Footer } from "@/app/components/footer/Footer";
import { usePodcastFeed } from "@/app/hooks/usePodcastFeed";

export default function Page() {
  const RSS_URL = "https://anchor.fm/s/1e4a0eac/podcast/rss";
    const { episodes, loading, error } = usePodcastFeed(RSS_URL, 3);
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <Hero />

      <div
        id="episodes"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500 mb-12 text-center">
          Upcoming Episodes
                </h2>
                <EpisodeList episodes={episodes} loading={loading} error={error} />
            </div>

      <AboutSection />

      <Footer />
        </div>
    );
}
