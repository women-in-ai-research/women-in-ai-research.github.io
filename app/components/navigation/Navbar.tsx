"use client";

import Logo from '@/public/images/logo.png';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

// The same menu is shown on every page.
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/guests', label: 'Guests' },
  { href: '/events', label: 'Events' },
  { href: '/mentorship', label: 'Mentorship Lab' },
  { href: '/news', label: 'News' },
  { href: '/#team', label: 'About Us' },
];

function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return path === '/';
  if (href.startsWith('/#')) return false;
  // Topic pages belong to the Episodes section.
  if (href === '/episodes' && path.startsWith('/topics')) return true;
  return path === href || path.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname() ?? '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav aria-label="Main" className="backdrop-blur-xl bg-wiair-darkest/70 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center" aria-label="Women in AI Research home">
            <img
              src={Logo.src}
              alt="Women in AI Research"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl"
            />
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-white hover:text-wiair-light p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`transition-colors duration-300 text-base ${
                    active ? 'font-semibold text-white' : 'text-gray-300 hover:text-wiair-light'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block text-center py-2 transition-colors duration-300 text-lg ${
                    active ? 'font-semibold text-white' : 'text-gray-300 hover:text-wiair-light'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
