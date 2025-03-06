import { SpotifyIcon, RSSIcon, YouTubeIcon } from "./Icons";



export function YouTubeButton() {
  return (
      <a
          href="https://youtube.com/channel/your-channel"
          className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-700 rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
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
          href="https://spotify.link"
          className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
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
        href="https://rss.link"
        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
      >
        <span className="flex items-center space-x-2 text-white">
          <RSSIcon />
          <span>RSS Feed</span>
        </span>
      </a>
    );
  }