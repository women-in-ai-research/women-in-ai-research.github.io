import bskyIcon from "@/public/images/icons/bluesky.svg";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <a
        href="https://bsky.app/profile/wiair.bsky.social"
        className="group text-gray-400 hover:text-cyan-400 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bluesky"
      > 
        <div className="w-8 h-8 relative">
          <img 
            src={bskyIcon.src} 
            alt="Bluesky" 
            className="w-8 h-8 absolute top-0 left-0 opacity-60 group-hover:opacity-0 transition-opacity filter invert"
          />
          <img 
            src={bskyIcon.src} 
            alt="" 
            className="w-8 h-8 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ filter: 'invert(48%) sepia(38%) saturate(3867%) hue-rotate(165deg) brightness(101%) contrast(101%)' }}
          />
        </div>
      </a>
      <a
        href="https://www.linkedin.com/company/women-in-ai-research/"
        className="text-gray-400 hover:text-blue-500 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <i className="fa-brands fa-linkedin fa-2x"></i>
      </a>
      <a
        href="https://www.youtube.com/@WomeninAIResearch"
        className="text-gray-400 hover:text-red-600 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <i className="fa-brands fa-youtube fa-2x"></i>
      </a>
      <a
        href="https://x.com/WiAIR_podcast"
        className="text-gray-400 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <i className="fa-brands fa-x-twitter fa-2x"></i>
      </a>
      <a
        href="https://discord.gg/267DPacHT5"
        className="text-gray-400 hover:text-indigo-500 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
      >
        <i className="fa-brands fa-discord fa-2x"></i>
      </a>
      <a
        href="https://spotify.link"
        className="text-gray-400 hover:text-green-500 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Spotify"
      >
        <i className="fa-brands fa-spotify fa-2x"></i>
      </a>
    </div>
  );
} 