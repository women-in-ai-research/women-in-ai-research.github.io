import { SpotifyButton, YouTubeButton, RSSButton} from "@/app/components/common/Buttons";
import { SocialLinks } from "@/app/components/common/SocialLinks";

export function Hero() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center relative">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[120px]"></div>
                </div>
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wiair-medium to-wiair-light mb-8 leading-normal py-1 relative">
                    <!-- <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-purple-400 to-purple-500 opacity-30 rounded-lg"></span> -->
                    <span className="relative">Welcome to Women in AI Research</span>
                </h1>
                <h4 className="text-1xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
                    New episodes released every three weeks on Wednesday.
                </h4>
                <p className="text-md text-white mb-8 max-w-4xl mx-auto leading-relaxed text-justify">
                    Women in AI Research (WiAIR) is a podcast dedicated to celebrating the remarkable
                    contributions of female AI researchers from around the globe. Our mission is to challenge the
                    prevailing perception that AI research is predominantly male-driven.
                </p>
                <div className="flex justify-center space-x-6 mb-12">
                    <YouTubeButton />
                    <SpotifyButton />
                </div>
                <div className="text-white text-md max-w-4xl mx-auto mb-12">
                    <p className="mb-6 text-justify text-md">
                        In WiAIR, we interview successful female AI researchers coming from diverse cultural
                        backgrounds, showcasing their inspirational cutting-edge research and insights into the future
                        of AI. Through these conversations, we explore their personal journeys - how they overcome
                        unique challenges, balance careers and family life, and make difficult decisions when
                        necessary. We aim to understand how women in AI research perceive success and what it
                        takes to achieve their goals.
                    </p>
                    <p className="mb-6 text-justify text-md">
                        With the WiAIR podcast, our goal is to empower early career researchers, especially women, to
                        pursue their passion for AI and make an impact in this exciting rapidly growing field. You will
                        learn from women at different career stages, stay updated on the latest research and
                        advancements, hear powerful stories of overcoming obstacles and breaking stereotypes, and
                        become part of the community that values diversity and inclusion in AI.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-purple-500/20 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                        Why Listen?
                    </h2>
                    <ul className="text-white text-left space-y-4 mb-8">
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span><strong>Gain Insights:</strong> Learn from leading women in AI and stay updated on the latest research and developments.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span><strong>Be Inspired:</strong> Hear powerful stories of overcoming obstacles and breaking stereotypes.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span><strong>Connect:</strong> Join the community of like-minded early career researchers and build your network.</span>
                        </li>
                    </ul>
                    
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                        Stay Connected
                    </h2>
                    <div className="flex justify-center mb-8">
                        <SocialLinks className="justify-center" />
                    </div>
                    <ul className="text-white text-left space-y-4 mb-8">
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>
                                <strong>Social Media Links:</strong> Follow us on{" "}
                                <a href="https://bsky.app/profile/wiair.bsky.social" className="text-purple-300 hover:underline" target="_blank" rel="noopener noreferrer">Bluesky</a>,{" "}
                                <a href="https://www.linkedin.com/company/women-in-ai-research/" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>,{" "}
                                <a href="https://www.youtube.com/@WomeninAIResearch" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">YouTube</a> and{" "}
                                <strong><a href="https://x.com/WiAIR_podcast" className="text-gray-200 hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a></strong> for updates and behind-the-scenes content.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>
                                <strong>Subscription Information:</strong> Subscribe to WiAIR on{" "}
                                <a href="https://open.spotify.com/show/51RJNlZarFTJXXIlz5Qx3M" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Spotify</a> and join our{" "}
                                <a href="https://discord.gg/267DPacHT5" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Discord</a>.
                            </span>
                        </li>
                    </ul>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 mt-8">
                        Call to Action
                    </h2>
                    <ul className="text-white text-left space-y-4">
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span><strong>Subscribe Now:</strong> Don't miss an episode! Subscribe to Women in AI Research (WiAIR) today.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span><strong>Share:</strong> Spread the word and share our podcast with your network.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}


