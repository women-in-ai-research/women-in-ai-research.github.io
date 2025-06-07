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
  const [isMobile, setIsMobile] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const hiddenBioRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };
    
    const checkTruncation = () => {
      // Use a more reliable method to detect truncation
      if (hiddenBioRef.current && bioRef.current) {
        const fullHeight = hiddenBioRef.current.scrollHeight;
        const visibleHeight = bioRef.current.clientHeight;
        setIsTruncated(fullHeight > visibleHeight);
      } else {
        // Fallback: assume long text needs truncation
        setIsTruncated(bio.length > 200);
      }
    };
    
    checkMobile();
    
    // Small delay to ensure DOM is ready
    setTimeout(checkTruncation, 10);
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [bio]);

  return (
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-lg shadow-md border border-wiair-medium/20">
      <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
        {/* Fixed square image - larger on mobile, centered */}
        <div className="w-40 h-40 md:w-40 md:h-40 mx-auto md:mx-0 rounded-lg shrink-0 overflow-hidden">
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
        
        {/* Content container - right side, items centered on mobile */}
        <div className="flex-1 flex flex-col items-center md:items-start md:pl-1">
          <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
            {name}
          </h3>
          {title && (
            <p className="text-wiair-light mb-3 text-center md:text-left">
              {title}
            </p>
          )}
          <div className="text-gray-300 text-center md:text-left w-full">
            {/* Hidden reference for measuring full text height */}
            <p ref={hiddenBioRef} className="absolute opacity-0 pointer-events-none" aria-hidden="true">
              {bio}
            </p>
            
            {/* Show nothing on mobile unless expanded */}
            <div className={`relative ${!expanded && isMobile ? 'hidden sm:block' : ''}`}>
              <p 
                ref={bioRef} 
                className={
                  expanded 
                    ? '' 
                    : isMobile 
                      ? 'hidden' 
                      : 'line-clamp-3'
                }
              >
                {bio}
              </p>
              {!expanded && !isMobile && isTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-purple-900/60 to-transparent pointer-events-none"></div>
              )}
            </div>
            
            {/* Show button when text is truncated or on mobile */}
            {(isTruncated || isMobile) && (
              <div className="flex justify-center md:justify-start">
                <button 
                  onClick={() => setExpanded(!expanded)} 
                  className="text-wiair-light hover:text-wiair-lightest mt-3 transition-colors font-medium text-sm"
                >
                  {expanded ? 'See less' : 'See more'}
                </button>
              </div>
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
