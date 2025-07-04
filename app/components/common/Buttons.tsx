import { SpotifyIcon, RSSIcon, YouTubeIcon, AppleIcon } from "./Icons";


export function YouTubeButton() {
  return (
      <a
          href="https://www.youtube.com/@WomeninAIResearch"
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-red-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-700/25 flex justify-center"
          target="_blank"
      >
          <span className="flex items-center space-x-2 text-white">
              <YouTubeIcon />
              <span>Watch on YouTube</span>
          </span>
      </a>
  );
}

export function SpotifyButton() {
  return (
      <a
          href="https://open.spotify.com/show/51RJNlZarFTJXXIlz5Qx3M"
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-green-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-600/25 flex justify-center"
          target="_blank"
      >
          <span className="flex items-center space-x-2 text-white">
              <SpotifyIcon />
              <span>Listen on Spotify</span>
          </span>
      </a>
  );
}

export function ApplePodcastsButton() {
  return (
      <a
          href="https://podcasts.apple.com/ca/podcast/women-in-ai-research-wiair/id1805993416"
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-pink-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-600/25 flex justify-center"
          target="_blank"
      >
          <span className="flex items-center space-x-2 text-white">
              <AppleIcon />
              <span>Listen on Apple Podcasts</span>
          </span>
      </a>
  );
}

export function RSSButton() {
    return (
      <a
        href="https://anchor.fm/s/1e4a0eac/podcast/rss"
        className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-orange-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-600/25 flex justify-center"
        target="_blank"
      >
        <span className="flex items-center space-x-2 text-white">
          <RSSIcon />
          <span>RSS Feed</span>
        </span>
      </a>
    );
  }
