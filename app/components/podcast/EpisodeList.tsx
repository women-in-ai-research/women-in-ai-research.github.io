"use client";


import { useState, useRef, useEffect } from 'react';
import { Episode } from '@/lib/types/podcast.types';
import episodeData from '@/app/data/episodes.json';

interface EpisodeListProps {
    episodes: Episode[];
    loading: boolean;
    error: string | null;
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
    
    // Use the longDescription if provided, otherwise use the regular description
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
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-lg shadow-md border border-purple-500/20">
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
                {/* Episode image - left side */}
                <div className="w-full md:w-64 h-48 md:h-auto mx-auto md:mx-0 rounded-lg shrink-0 overflow-hidden">
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
                
                {/* Content container - right side */}
                <div className="flex-1 flex flex-col md:pl-1">
                    <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
                        {title}
                    </h3>
                    <p className="text-purple-300 mb-3 text-center md:text-left">
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
                                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Listen Now
                            </a>
                        )}
                        {youtubeLink && (
                            <a 
                                href={youtubeLink} 
                                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </a>
                        )}
                        {spotifyLink && (
                            <a 
                                href={spotifyLink} 
                                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Spotify
                            </a>
                        )}
                        {!episodeLink && !youtubeLink && !spotifyLink && (
                            <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full cursor-not-allowed">
                                Coming Soon
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EpisodeList({ episodes, loading, error }: EpisodeListProps) {
    // Filter episodes to only show those with visible=true
    const visibleEpisodes = episodeData.filter(episode => episode.visible);
    
    return (
        <div className="grid grid-cols-1 gap-8">
            {visibleEpisodes.map((episode) => (
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
