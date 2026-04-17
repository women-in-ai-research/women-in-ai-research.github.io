"use client";

import { useState, useRef, useEffect } from 'react';
import episodeData from '@/app/data/episodes.json';

interface EpisodeListProps {
    limit?: number;
}

interface EpisodeCardProps {
    id: string;
    title: string;
    description: string;
    publishDate: string;
    imageUrl: string;
    imagePosition?: string;
    longDescription?: string;
    episodeLink?: string | null;
    youtubeLink?: string | null;
    spotifyLink?: string | null;
}

function EpisodeCard({
    id,
    title,
    description,
    publishDate,
    imageUrl,
    imagePosition = "object-center",
    longDescription,
    episodeLink,
    youtubeLink,
    spotifyLink
}: EpisodeCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    const fullDescription = longDescription || description;

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
    }, [fullDescription]);

    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
                <div className="w-full md:w-64 h-48 md:h-64 mx-auto md:mx-0 rounded-xl shrink-0 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full"
                        style={{
                            objectFit: 'cover',
                            objectPosition: imagePosition
                        }}
                    />
                </div>

                <div className="flex-1 flex flex-col md:pl-1">
                    <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
                        {title}
                    </h3>
                    <p className="text-wiair-light text-sm mb-3 text-center md:text-left">
                        {publishDate}
                    </p>
                    <div className="text-gray-300 text-center md:text-left">
                        <div className={`relative ${expanded ? '' : 'max-h-24 overflow-hidden'}`}>
                            <p ref={descriptionRef} className={expanded ? '' : 'line-clamp-3'}>
                                {fullDescription}
                            </p>
                            {!expanded && isTruncated && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            )}
                        </div>
                        {isTruncated && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-wiair-light hover:text-wiair-lightest mt-2 transition-colors font-medium"
                            >
                                {expanded ? 'See less' : 'See more'}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {episodeLink && (
                            <a
                                href={episodeLink}
                                className="px-4 py-2 bg-gradient-to-r from-wiair-medium to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-wiair-medium/25 transition-all duration-300 font-medium text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Listen Now
                            </a>
                        )}
                        {youtubeLink && (
                            <a
                                href={youtubeLink}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </a>
                        )}
                        {spotifyLink && (
                            <a
                                href={spotifyLink}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Spotify
                            </a>
                        )}
                        {!episodeLink && !youtubeLink && !spotifyLink && (
                            <span className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-full cursor-not-allowed text-sm">
                                Coming Soon
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const EPISODES_PER_PAGE = 6;

export function EpisodeList({ limit }: EpisodeListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const visibleEpisodes = episodeData
        .filter(episode => episode.visible)
        .sort((a, b) => parseInt(b.id) - parseInt(a.id));

    // If limit is set (e.g. homepage), show without pagination
    if (limit) {
        const displayEpisodes = visibleEpisodes.slice(0, limit);
        return (
            <div className="grid grid-cols-1 gap-8">
                {displayEpisodes.map((episode) => (
                    <EpisodeCard
                        key={episode.id}
                        id={episode.id}
                        title={episode.title}
                        description={episode.description}
                        publishDate={episode.publishDate}
                        imageUrl={episode.imageUrl}
                        imagePosition={episode.imagePosition}
                        longDescription={episode.longDescription}
                        episodeLink={episode.episodeLink}
                        youtubeLink={episode.youtubeLink}
                        spotifyLink={episode.spotifyLink}
                    />
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
                    <EpisodeCard
                        key={episode.id}
                        id={episode.id}
                        title={episode.title}
                        description={episode.description}
                        publishDate={episode.publishDate}
                        imageUrl={episode.imageUrl}
                        imagePosition={episode.imagePosition}
                        longDescription={episode.longDescription}
                        episodeLink={episode.episodeLink}
                        youtubeLink={episode.youtubeLink}
                        spotifyLink={episode.spotifyLink}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
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
