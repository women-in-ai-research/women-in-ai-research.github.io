'use client';

import { useGuestData } from '@/app/hooks/useGuestData';
import { GuestCard } from '@/app/components/guests/GuestCard';
import { Pagination } from '@/app/components/common/Pagination';
import { useState } from 'react';

export default function GuestsPage() {
  const GUESTS_PER_PAGE = 6;
  const { guests, loading, error, currentPage, totalPages, setCurrentPage } = useGuestData(GUESTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation - Same as main page */}
      <nav className="backdrop-blur-lg bg-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <a href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Women in AI Research
                </h1>
              </a>
            </div>
            <div className="flex items-center space-x-8">
              <a
                href="/#episodes"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                Episodes
              </a>
              <a
                href="/guests"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg border-b-2 border-purple-400"
              >
                Guests
              </a>
              <a
                href="/#about"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                About Us
              </a>
              <a
                href="/#subscribe"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[120px]"></div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8">
            Our Distinguished Guests
          </h1>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Meet the brilliant minds and trailblazing researchers who have joined us to share their insights and expertise in artificial intelligence.
          </p>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl">{error}</p>
            <button 
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guests.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-black/50 text-white py-16 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Women in AI Research</h3>
              <p className="text-teal-200">
                Exploring the future of artificial intelligence through diverse perspectives.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="#" className="block text-teal-200 hover:text-white transition-colors duration-300">
                  Twitter
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  Email
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Subscribe</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">
                  Spotify
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  Apple Podcasts
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  RSS Feed
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 Women in AI Research Podcast. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
