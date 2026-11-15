"use client";

import eventsData from '@/app/data/events.json';
import { formatDuration } from '@/app/components/common/RichText';

interface EventVideo {
    videoId: string;
    title: string;
    description: string;
    publishDate: string;
    durationSeconds: number;
    thumbnailUrl: string;
    youtubeUrl: string;
}

interface EventGroup {
    id: string;
    title: string;
    description: string;
    playlistUrl: string | null;
    videos: EventVideo[];
}

function VideoCard({ video }: { video: EventVideo }) {
    const meta = [video.publishDate, formatDuration(video.durationSeconds)].filter(Boolean).join(' · ');
    return (
        <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/[0.12] transition-all duration-300"
        >
            <div className="aspect-video overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{video.title}</h3>
                <p className="text-wiair-light text-sm">{meta}</p>
            </div>
        </a>
    );
}

export function EventsSection() {
    const groups = eventsData as EventGroup[];

    if (!groups.length) {
        return (
            <p className="text-center text-gray-400 py-16">Event recordings will appear here soon.</p>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-20">
            {groups.map((group) => (
                <section key={group.id} id={group.id}>
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">{group.title}</h2>
                        {group.description && (
                            <p className="text-gray-300 max-w-3xl whitespace-pre-line">{group.description}</p>
                        )}
                        {group.playlistUrl && (
                            <a
                                href={group.playlistUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-wiair-light hover:text-wiair-lightest font-medium"
                            >
                                Watch the full playlist on YouTube →
                            </a>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.videos.map((video) => (
                            <VideoCard key={video.videoId} video={video} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
