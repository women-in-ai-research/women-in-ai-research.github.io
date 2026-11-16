"use client";

import { useEffect, useRef, useState } from 'react';
import teamData from '@/app/data/team.json';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  visible: boolean;
}

function TeamCard({ member }: { member: TeamMember }) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const check = () => {
      if (bioRef.current && !expanded) {
        setIsTruncated(bioRef.current.scrollHeight > bioRef.current.clientHeight + 1);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [expanded]);

  return (
    <article className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
      <div className="flex items-center gap-4">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-[72px] h-[72px] rounded-full object-cover shrink-0"
          loading="lazy"
        />
        <div>
          <h3 className="text-lg font-bold text-white">{member.name}</h3>
          <p className="text-sm font-semibold text-wiair-light">{member.title}</p>
        </div>
      </div>
      <p ref={bioRef} className={`text-gray-300 leading-relaxed ${expanded ? '' : 'line-clamp-5'}`}>
        {member.bio}
      </p>
      {(isTruncated || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="self-start text-wiair-light hover:text-wiair-lightest font-medium text-sm transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </article>
  );
}

export function TeamGrid() {
  const members = (teamData as TeamMember[]).filter((m) => m.visible);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {members.map((m) => (
        <TeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}
