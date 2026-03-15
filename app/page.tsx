"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { Hero } from "@/app/components/hero/Hero";
import { EpisodeList } from "@/app/components/podcast/EpisodeList";
import { AboutSection } from "@/app/components/about/AboutSection";
import { Footer } from "@/app/components/footer/Footer";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />
      <Hero />

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      <section
        id="episodes"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              Our Podcast
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Latest Episodes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conversations with leading women in AI research from around the globe.
            </p>
          </div>
          <EpisodeList limit={3} />
          <div className="text-center mt-10">
            <a
              href="/episodes"
              className="inline-block px-8 py-4 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full transition-all duration-300 shadow-lg shadow-wiair-medium/25 hover:shadow-xl hover:shadow-wiair-medium/40 font-semibold hover:-translate-y-0.5"
            >
              View All Episodes
            </a>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      <AboutSection />

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      <Footer />
        </div>
    );
}
