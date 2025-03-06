"use client";

import { getPageUrl } from "@/app/components/common/urls";
import Logo from '@/public/images/logo.png'; // Make sure to add your logo image
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <nav className="backdrop-blur-xl bg-slate-900/90 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={Logo.src} 
                alt="Women in AI Research" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {isHomePage ? (
              <a
                href="#episodes"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                Episodes
              </a>
            ) : (
              <Link
                href="/#episodes"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                Episodes
              </Link>
            )}
            
            {isHomePage ? (
              <a
                href="#about"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                About Us
              </a>
            ) : (
              <Link
                href="/#about"
                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
              >
                About Us
              </Link>
            )}
            
            <Link
              href="/guests"
              className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
            >
              Guests
            </Link>
            
            <a
              href="https://discord.gg/267DPacHT5"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
