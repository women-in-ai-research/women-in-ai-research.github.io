"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { AnnouncementsList } from "@/app/components/announcements/AnnouncementsList";
import { useSocialFeed } from "@/app/hooks/useSocialFeed";

export default function AnnouncementsPage() {
    const FEED_URL = "https://rss.app/feeds/v1.1/ZT7xuOD7Yal2ZdQv.json";
    const { items, loading, error } = useSocialFeed(FEED_URL);

    return (
        <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest flex flex-col relative">
            <Navbar />

            {/* Decorative blur orbs */}
            <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10">
                <div className="text-center mb-16">
                    <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
                        Stay Updated
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Latest Announcements
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        News, updates, and highlights from the Women in AI Research community.
                    </p>
                </div>
                <AnnouncementsList items={items} loading={loading} error={error} />
            </main>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

            <Footer />
        </div>
    );
} 