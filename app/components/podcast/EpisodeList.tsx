"use client";

import { useState, useRef, useEffect } from 'react';
import episodeData from '@/app/data/episodes.json';
import config from '@/data/youtube-config.json';
import { RichText, formatDuration } from '@/app/components/common/RichText';

interface Chapter {
    time: string;
    seconds: number;
    title: string;
}

export interface Episode {
    id: string;
    number: number;
    slug: string;
    videoId: string;
    title: string;
    description: string;
    publishDate: string;
    durationSeconds: number;
    thumbnailUrl: string;
    youtubeUrl: string;
    podcast: string;
    guests: string[];
    chapters: Chapter[];
}

interface EpisodeListProps {
    limit?: number;
}

const episodes = episodeData as Episode[];

function EpisodeCard({ episode }: { episode: Episode }) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const { number, title, description, publishDate, durationSeconds, thumbnailUrl, youtubeUrl, podcast } = episode;

    useEffect(() => {
        const checkTruncation = () => {
            if (descriptionRef.current) {
                const { scrollHeight, clientHeight } = descriptionRef.current;
                setIsTruncated(scrollHeight > clientHeight);
            }
        };

        checkTruncation();
        window.addEventListener('resize', checkTruncation);

        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, [description]);

    const meta = [publishDate, formatDuration(durationSeconds), podcast].filter(Boolean).join(' · ');

    const image = (
        <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
        />
    );

    return (
        <article className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
                <div className="w-full md:w-80 aspect-video mx-auto md:mx-0 rounded-xl shrink-0 overflow-hidden self-start">
                    {youtubeUrl ? (
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${title} on YouTube`}>
                            {image}
                        </a>
                    ) : image}
                </div>

                <div className="flex-1 flex flex-col md:pl-1 min-w-0">
                    <p className="text-wiair-light text-xs font-semibold tracking-widest uppercase mb-1 text-center md:text-left">
                        Episode {number}
                    </p>
                    <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
                        {title}
                    </h3>
                    <p className="text-wiair-light text-sm mb-3 text-center md:text-left">
                        {meta}
                    </p>
                    <div className="text-gray-300 text-left">
                        <div ref={descriptionRef} className={`relative ${expanded ? '' : 'max-h-24 overflow-hidden'}`}>
                            <RichText text={description} />
                            {!expanded && isTruncated && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            )}
                        </div>
                        {isTruncated || expanded ? (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-wiair-light hover:text-wiair-lightest mt-2 transition-colors font-medium"
                            >
                                {expanded ? 'See less' : 'See more'}
                            </button>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                        {youtubeUrl && (
                            <a
                                href={youtubeUrl}
                                className="px-4 py-2 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-wiair-medium/25 transition-all duration-300 font-medium text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Watch on YouTube
                            </a>
                        )}
                        <a
                            href={config.spotifyShowUrl}
                            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Spotify
                        </a>
                        <a
                            href={config.appleShowUrl}
                            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Apple Podcasts
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}

const EPISODES_PER_PAGE = 6;

export function EpisodeList({ limit }: EpisodeListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const visibleEpisodes = [...episodes].sort((a, b) => b.number - a.number);

    // If limit is set (e.g. homepage), show without pagination
    if (limit) {
        return (
            <div className="grid grid-cols-1 gap-8">
                {visibleEpisodes.slice(0, limit).map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} />
                ))}
            </div>
        );
    }

    // Paginated view for /episodes page
    const totalPages = Math.ceil(visibleEpisodes.length / EPISODES_PER_PAGE);
    const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
    const displayEpisodes = visibleEpisodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div className="grid grid-cols-1 gap-8">
                {displayEpisodes.map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                                page === currentPage
                                    ? 'bg-gradient-to-r from-wiair-medium to-purple-500 text-white shadow-lg shadow-wiair-medium/25'
                                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
