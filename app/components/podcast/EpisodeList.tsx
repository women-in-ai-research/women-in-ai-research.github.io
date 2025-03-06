import { Episode } from '@/app/types/podcast';
import Logo from '@/public/images/logo.png'; // Use your logo as a placeholder
import BiasInAIImage from '@/public/images/episodes/ep-2-bias-in-ai.jpg'; // Make sure to add this image

interface EpisodeListProps {
    episodes: Episode[];
    loading: boolean;
    error: string | null;
}

export function EpisodeList({ episodes, loading, error }: EpisodeListProps) {
    // Instead of using the fetched episodes, we'll use our predefined upcoming episodes
    const upcomingEpisodes = [
        {
            id: '1',
            title: 'Limits of Transformers',
            description: 'Interview with Dr. Nouha Dziri, a research scientist at Allen Institute for AI (AI2), USA.',
            publishDate: 'Mar 12, 2025',
            imageUrl: Logo.src // Placeholder for now
        },
        {
            id: '2',
            title: 'Bias in AI',
            description: 'Interview with Dr. Amanda Cercas Curry, a postdoc researcher at MilaNLP in Bocconi University, Italy.',
            publishDate: 'April 02, 2025',
            imageUrl: BiasInAIImage.src // Use the specific image for this episode
        },
        {
            id: '3',
            title: 'Responsible AI for Health',
            description: 'Interview with Aparna Balagopalan, a PhD student at MIT, USA.',
            publishDate: 'April 23, 2025',
            imageUrl: Logo.src // Use logo as thumbnail
        },
        {
            id: '4',
            title: 'Robots with Empathy',
            description: 'Interview with Dr. Angelica Lim, Assistant Professor at Simon Fraser University, Canada.',
            publishDate: 'TBD',
            imageUrl: Logo.src // Use logo as thumbnail
        }
    ];

    return (
        <div className="space-y-8">
            {upcomingEpisodes.map((episode) => (
                <div key={episode.id} className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-purple-500/20 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-48 overflow-hidden rounded-lg shrink-0">
                        <img 
                            src={episode.imageUrl} 
                            alt={episode.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{episode.title}</h3>
                        <p className="text-purple-300 mb-2">{episode.publishDate}</p>
                        <p className="text-gray-300 mb-6">{episode.description}</p>
                        <div className="flex flex-wrap gap-3">
                            <a href="#" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                                Listen Now
                            </a>
                            <a href="#" className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-300">
                                YouTube
                            </a>
                            <a href="#" className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                                Spotify
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
