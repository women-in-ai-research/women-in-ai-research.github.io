"use client";

import { useState, useRef, useEffect } from 'react';
import guestsData from '@/app/data/guests.json';
import { guestPath } from '@/app/lib/episodePages';

interface GuestEpisode {
    number: number;
    title: string;
    youtubeUrl: string;
}

interface Guest {
    id: string;
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    episodes: GuestEpisode[];
}

function GuestCard({ guest, episodePages }: { guest: Guest; episodePages: Record<number, string> }) {
    const { name, title, bio, imageUrl, episodes } = guest;
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const checkTruncation = () => {
            if (bioRef.current) {
                const { scrollHeight, clientHeight } = bioRef.current;
                setIsTruncated(scrollHeight > clientHeight);
            }
        };

        checkTruncation();
        window.addEventListener('resize', checkTruncation);

        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, [bio]);

    return (
        <article id={guest.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-xl shrink-0 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-wiair-medium/30 flex items-center justify-center text-white text-2xl">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col md:pl-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
                        <a href={guestPath(guest)} className="hover:text-wiair-lightest transition-colors">
                            {name}
                        </a>
                    </h3>
                    {title && (
                        <p className="text-wiair-light mb-3 text-center md:text-left">
                            {title}
                        </p>
                    )}
                    {bio && (
                        <div className="text-gray-300 text-center md:text-left">
                            <div className={`relative ${expanded ? '' : 'max-h-24 overflow-hidden'}`}>
                                <p ref={bioRef} className={expanded ? '' : 'line-clamp-3'}>
                                    {bio}
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
                    )}
                    <ul className="mt-4 space-y-2">
                        {episodes.map((ep) => (
                            <li key={ep.number} className="text-center md:text-left">
                                {episodePages[ep.number] ? (
                                    <a
                                        href={episodePages[ep.number]}
                                        className="text-wiair-light hover:text-wiair-lightest font-medium"
                                    >
                                        ▶ Episode {ep.number}: {ep.title}
                                    </a>
                                ) : ep.youtubeUrl ? (
                                    <a
                                        href={ep.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-wiair-light hover:text-wiair-lightest font-medium"
                                    >
                                        ▶ Episode {ep.number}: {ep.title}
                                    </a>
                                ) : (
                                    <span className="text-wiair-light font-medium">
                                        Episode {ep.number}: {ep.title}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <a
                        href={guestPath(guest)}
                        className="self-center md:self-start mt-4 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
                    >
                        View researcher page →
                    </a>
                </div>
            </div>
        </article>
    );
}

/** `episodePages`: episode number → episode page path, for episodes that have one. */
export function GuestsSection({ episodePages = {} }: { episodePages?: Record<number, string> }) {
    const guests = guestsData as Guest[];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            <div className="grid grid-cols-1 gap-8">
                {guests.map((guest) => (
                    <GuestCard key={guest.id} guest={guest} episodePages={episodePages} />
                ))}
            </div>
        </div>
    );
}
