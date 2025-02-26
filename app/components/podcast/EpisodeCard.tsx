import { Episode } from '@/lib/types/podcast.types';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-purple-500/20 hover:bg-white/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <img 
            src={episode.imageUrl || 'https://via.placeholder.com/400x400?text=Episode'} 
            alt={episode.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-3/4">
          <h3 className="text-xl font-bold text-white mb-2">{episode.title}</h3>
          <p className="text-purple-300 mb-3">{episode.date} • {episode.duration}</p>
          <p className="text-gray-300 mb-4 line-clamp-3">{episode.description}</p>
          <div className="flex space-x-4">
            <a 
              href={episode.audioUrl} 
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Listen Now
            </a>
            {episode.spotify && (
              <a 
                href={episode.spotify} 
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z" />
                </svg>
                Spotify
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
