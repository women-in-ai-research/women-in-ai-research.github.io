"use client";

import { getPageUrl } from "@/app/components/common/urls";
import Logo from '@/public/images/logo.png'; // Make sure to add your logo image
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="backdrop-blur-xl bg-wiair-dark sticky top-0 z-50 shadow-xl border-b border-wiair-medium/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-auto py-2">
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center">
              <img 
                src={Logo.src} 
                alt="Women in AI Research" 
                className="h-16 sm:h-24 md:h-32 lg:h-40 w-auto opacity-100 my-auto" // Responsive height
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-wiair-light"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                isHomePage ? 'font-bold text-wiair-light' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/episodes"
              className={`text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                pathname === '/episodes' ? 'font-bold text-wiair-light' : ''
              }`}
            >
              Episodes
            </Link>
            
            {isHomePage ? (
              <a
                href="#about"
                className="text-white hover:text-wiair-light transition-colors duration-300 text-lg"
              >
                About Us
              </a>
            ) : (
              <Link
                href="/#about"
                className="text-white hover:text-wiair-light transition-colors duration-300 text-lg"
              >
                About Us
              </Link>
            )}
            
            <Link
              href="/guests"
              className={`text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                pathname === '/guests' ? 'font-bold text-wiair-light' : ''
              }`}
            >
              Guests
            </Link>
            
            <a
              href="https://discord.gg/267DPacHT5"
              className="bg-gray-700 text-white px-6 py-2.5 rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fadeIn">
            <Link
              href="/"
              className={`block text-center text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                isHomePage ? 'font-bold text-wiair-light' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/episodes"
              className={`block text-center text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                pathname === '/episodes' ? 'font-bold text-wiair-light' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Episodes
            </Link>
            
            {isHomePage ? (
              <a
                href="#about"
                className="block text-center text-white hover:text-wiair-light transition-colors duration-300 text-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </a>
            ) : (
              <Link
                href="/#about"
                className="block text-center text-white hover:text-wiair-light transition-colors duration-300 text-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            )}
            
            <Link
              href="/guests"
              className={`block text-center text-white hover:text-wiair-light transition-colors duration-300 text-lg ${
                pathname === '/guests' ? 'font-bold text-wiair-light' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Guests
            </Link>
            
            <div className="text-center">
              <a
                href="https://discord.gg/267DPacHT5"
                className="inline-block bg-gray-700 text-white px-6 py-2.5 rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Discord
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
