import { useState } from 'react';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  imageUrl: string;
  episodeLink: string;
}

interface GuestCardProps {
  guest: Guest;
}

export function GuestCard({ guest }: GuestCardProps) {  
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-xl overflow-hidden border border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1">
      <div className="h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 relative">
        {guest.imageUrl ? (
          <img 
            src={guest.imageUrl} 
            alt={guest.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-purple-300/50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
          {guest.name}
        </h3>
        <p className="text-purple-200 text-sm mb-3">
          {guest.title} at {guest.organization}
        </p>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {guest.bio}
        </p>
        <Link 
          href={guest.episodeLink.replace(/^\//, '')}
          className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          Listen to Episode
        </Link>
      </div>
    </div>
  );
}
