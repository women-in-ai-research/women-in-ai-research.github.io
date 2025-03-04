import { SpotifyButton, RSSButton } from '@/app/components/common/Buttons';

export function Hero() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center relative">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[120px]"></div>
                </div>
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8 leading-normal py-1">
                    Amplifying Women's Voices in AI
                </h1>
                <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join Jekaterina Novikova and Malikeh Ehghaghi as they explore the frontiers
                    of artificial intelligence research
                </p>
                <HeroButtons />
            </div>
        </div>
    );
}

function HeroButtons() {
    return (
        <div className="flex justify-center space-x-6">
            <SpotifyButton />
            <RSSButton />
        </div>
    );
}





