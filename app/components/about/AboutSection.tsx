"use client";

import { useState, useRef, useEffect } from 'react';
import JekaterinaNovikova from "@/public/images/about/jekaterina-novikova.jpg";
import MalikehEhghaghi from "@/public/images/about/malikeh-ehghaghi.jpg";
import MaryMcCarthy from "@/public/images/about/mary-maccarthy.jpg";
import AnaisHristea from "@/public/images/about/anais-hristea.jpg";
import AliAkram from "@/public/images/about/ali-akram.jpg";

interface TeamMemberCardProps {
  image?: any;
  name: string;
  title?: string;
  bio: string;
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
    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-lg shadow-md border border-purple-500/20">
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Fixed square image - left side */}
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-lg shrink-0 overflow-hidden">
          {image ? (
            <img 
              src={image.src}
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-400/30 flex items-center justify-center text-white text-2xl">
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
            <p className="text-purple-300 mb-3 text-center md:text-left">
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
                className="text-purple-300 hover:text-purple-200 mt-2 transition-colors font-medium"
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
  return (
    <div id="about" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500 mb-12 text-center">
        About Us
      </h2>
      <div className="grid grid-cols-1 gap-8">
        <TeamMemberCard
          image={JekaterinaNovikova}
          name="Jekaterina Novikova"
          title="Founder & Host"
          bio={"Dr. Jekaterina Novikova is the AI researcher with over 10 years of experience in natural language processing and human-AI interaction. She holds a Ph.D. in Computer Science from the University of Bath and has an extensive international experience working in the academia, industry and non-profits. She was recognized as one of the Top 50 Most Extraordinary Women Advancing AI In 2024, Top 25 Women in AI in Canada in 2022, received the \"Industry Icon Award\" by the University of Toronto in 2021, and included in the list of 30 Influential Women Advancing AI in Canada in 2018."}
        />
        <TeamMemberCard
          image={MalikehEhghaghi}
          name="Malikeh Ehghaghi"
          title="Co-Host & Researcher"
          bio="Malikeh is a machine learning researcher at the Vector Institute, and an incoming PhD student at the University of Toronto, where she works under the supervision of Prof. Colin Raffel. Born and raised in Iran, she is a bilingual researcher fluent in Farsi and English who immigrated to Canada in 2019. She earned an MScAC degree in Computer Science from the University of Toronto and has over five years of industry research experience at companies such as Winterlight Labs, Cambridge Cognition, and Arcee AI."
        />
        <TeamMemberCard
          image={MaryMcCarthy}
          name="Mary McCarthy"
          title="Head of Growth & Marketing"
          bio="Head of Growth & Marketing @ Arcee.ai | AI, Data, & Growth Advisor | Host of the Tech Bros Show"
        />
        <TeamMemberCard
          image={AnaisHristea}
          name="Anais Hristea"
          title="Graphic Designer / Illustrator"
          bio="Anais is a talented graphic designer and illustrator who creates all the visual assets for the Women in AI Research podcast. With a background in digital art and design, she brings a unique aesthetic to the podcast's brand identity."
        />
        <TeamMemberCard
          image={AliAkram}
          name="Ali Akram"
          title="AI Engineer / Technical Producer"
          bio="Ali is an experienced AI engineer and technical producer who ensures the podcast's technical quality. He handles audio editing, production, and technical aspects of the podcast, bringing years of experience in audio engineering and AI development."
        />
      </div>
    </div>
  );
}
