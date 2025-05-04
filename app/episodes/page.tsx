"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { EpisodeList } from "@/app/components/podcast/EpisodeList";
import { Footer } from "@/app/components/footer/Footer";
import { usePodcastFeed } from "@/app/hooks/usePodcastFeed";

export default function EpisodesPage() {
  const RSS_URL = "https://anchor.fm/s/1e4a0eac/podcast/rss";
  const { episodes, loading, error } = usePodcastFeed(RSS_URL);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light text-center">
          All Episodes
        </h1>
        <p className="text-xl text-gray-300 text-center mt-6 max-w-3xl mx-auto">
          Explore all episodes of the Women in AI Research podcast, featuring conversations with leading female AI researchers.
        </p>
      </div>

      {/* Episodes Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EpisodeList episodes={episodes} loading={loading} error={error} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 