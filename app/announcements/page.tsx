"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";
import { AnnouncementsList } from "@/app/components/announcements/AnnouncementsList";
import { useSocialFeed } from "@/app/hooks/useSocialFeed";

export default function AnnouncementsPage() {
    const FEED_URL = "https://rss.app/feeds/v1.1/ZT7xuOD7Yal2ZdQv.json";
    const { items, loading, error } = useSocialFeed(FEED_URL);

    return (
        <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light mb-12 text-center">
                    Latest Announcements
                </h1>
                <AnnouncementsList items={items} loading={loading} error={error} />
            </main>
            <Footer />
        </div>
    );
} 