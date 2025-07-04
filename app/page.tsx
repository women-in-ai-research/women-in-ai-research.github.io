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
        <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />
      <Hero />

      <div
        id="episodes"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light mb-12 text-center">
          Latest Episodes
                </h2>
                <EpisodeList episodes={episodes} loading={loading} error={error} limit={3} />
                <div className="text-center mt-8">
                  <a 
                    href="/episodes" 
                    className="inline-block px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
                  >
                    View All Episodes
                  </a>
                </div>
            </div>

      <AboutSection />

      <Footer />
        </div>
    );
}
