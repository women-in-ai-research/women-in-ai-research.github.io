"use client";

import { useState, useRef, useEffect } from 'react';
import teamData from '@/app/data/team.json';

interface TeamMemberCardProps {
  image?: string;
  name: string;
  title?: string;
  bio: string;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  visible: boolean;
}

function TeamMemberCard({ image, name, title, bio }: TeamMemberCardProps) {
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
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-lg shadow-md border border-wiair-medium/20">
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Fixed square image - left side */}
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-lg shrink-0 overflow-hidden">
          {image ? (
            <img 
              src={image}
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-wiair-medium/30 flex items-center justify-center text-white text-2xl">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Content container - right side */}
        <div className="flex-1 flex flex-col md:pl-1">
          <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
            {name}
          </h3>
          {title && (
            <p className="text-wiair-light mb-3 text-center md:text-left">
              {title}
            </p>
          )}
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
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  // Filter team members to only show those with visible=true
  const visibleTeamMembers = teamData.filter(member => member.visible);
  
  return (
    <div id="about" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light mb-12 text-center">
        About Us
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {visibleTeamMembers.map((member: TeamMember) => (
          <TeamMemberCard
            key={member.id}
            name={member.name}
            title={member.title}
            bio={member.bio}
            image={member.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
