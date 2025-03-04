'use client';

import { getPageUrl } from '@/app/components/common/urls';

export function Navbar() {
    return (
        <nav className="backdrop-blur-xl bg-slate-900/90 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                            Women in AI Research
                        </h1>
                    </div>
                    <div className="flex items-center space-x-8">
                        <a href={getPageUrl('#episodes')} className="text-white hover:text-purple-300 transition-colors duration-300 text-lg">
                            Episodes
                        </a>
                        <a href={getPageUrl('/guests')} className="text-white hover:text-purple-300 transition-colors duration-300 text-lg">
                            Guests
                        </a>
                        <a href={getPageUrl('#about')} className="text-white hover:text-purple-300 transition-colors duration-300 text-lg">
                            About Us
                        </a>
                        <a href={getPageUrl('#subscribe')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                            Subscribe
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
} 