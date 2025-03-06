import { getPageUrl } from "@/app/components/common/urls";

export function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-black/50 text-white py-16 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <FooterBrand />
          <FooterConnect />
          <FooterSubscribe />
          
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Women in AI Research Podcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Women in AI Research
      </h3>
      <p className="text-teal-200">
        Highlighting the women shaping the future of AI research
      </p>
    </div>
  );
}

function FooterConnect() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Connect
      </h3>
      <div className="space-y-2">
        <a
          href="https://bsky.app/profile/wiair.bsky.social"
          className="block text-gray-400 hover:text-white"
        >
          Bluesky
        </a>
        <a
          href="https://www.linkedin.com/company/women-in-ai-research/"
          className="block text-gray-400 hover:text-white"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/WiAIR_podcast"
          className="block text-gray-400 hover:text-white"
        >
          Twitter
        </a>
      </div>
    </div>
  );
}

function FooterSubscribe() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Subscribe
      </h3>
      <div className="space-y-2">
        <a
          href="https://www.youtube.com/@WomeninAIResearch"
          className="block text-gray-400 hover:text-white"
        >
          YouTube
        </a>
        <a
          href="https://spotify.link"
          className="block text-gray-400 hover:text-white"
        >
          Spotify
        </a>
        <a
          href="https://discord.gg/267DPacHT5"
          className="block text-gray-400 hover:text-white"
        >
          Discord
        </a>
      </div>
    </div>
  );
}
