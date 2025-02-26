import { Episode } from '@/lib/types/podcast.types';
import { EpisodeCard } from '@/app/components/podcast/EpisodeCard';

interface EpisodeListProps {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
}

export function EpisodeList({ episodes, loading, error }: EpisodeListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col space-y-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Failed to Load Episodes</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-purple-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Episodes Found</h3>
        <p className="text-gray-400">Check back soon for new episodes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {episodes.map((episode, index) => (
        <EpisodeCard key={index} episode={episode} />
      ))}
    </div>
  );
} 