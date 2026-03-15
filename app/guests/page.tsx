"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { GuestsSection } from "@/app/components/guests/GuestsSection";
import { Footer } from "@/app/components/footer/Footer";

export default function GuestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      {/* Navigation */}
      <Navbar />

      {/* Decorative blur orbs */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 relative z-10">
        <div className="text-center">
          <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
            The Podcast
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Our Guests
          </h1>
          <p className="text-xl text-gray-400 text-center mt-6 max-w-2xl mx-auto">
            Meet the brilliant minds who have shared their insights, experiences, and expertise.
          </p>
        </div>
      </div>

      {/* Guests Section */}
      <GuestsSection />

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Footer */}
      <Footer />
    </div>
  );
}