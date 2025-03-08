"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { GuestsSection } from "@/app/components/guests/GuestsSection";
import { Footer } from "@/app/components/footer/Footer";

export default function GuestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light text-center">
          Our Guests
        </h1>
        <p className="text-xl text-gray-300 text-center mt-6 max-w-3xl mx-auto">
          Meet the brilliant minds who have joined us on the Women in AI Research podcast to share their insights, experiences, and expertise.
        </p>
      </div>

      {/* Guests Section */}
      <GuestsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}