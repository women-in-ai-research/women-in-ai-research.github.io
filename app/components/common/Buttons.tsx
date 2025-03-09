import { SpotifyIcon, RSSIcon, YouTubeIcon } from "./Icons";



export function YouTubeButton() {
  return (
      <a
          href="https://www.youtube.com/@WomeninAIResearch"
          className="group relative px-8 py-4 bg-gray-700 rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
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
          href="https://creators.spotify.com/pod/show/wiair"
          className="group relative px-8 py-4 bg-gray-700 rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
          target="_blank"
      >
          <span className="flex items-center space-x-2 text-white">
              <SpotifyIcon />
              <span>Listen on Spotify</span>
          </span>
      </a>
  );
}

export function RSSButton() {
    return (
      <a
        href="https://anchor.fm/s/1e4a0eac/podcast/rss"
        className="group relative px-8 py-4 bg-gray-700 rounded-full hover:bg-wiair-medium transition-all duration-300 shadow-lg hover:shadow-wiair-medium/25"
      >
        <span className="flex items-center space-x-2 text-white">
          <RSSIcon />
          <span>RSS Feed</span>
        </span>
      </a>
    );
  }
