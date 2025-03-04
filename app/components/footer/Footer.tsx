import { getPageUrl } from '@/app/components/common/urls';

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
                    <p>&copy; 2023 Women in AI Research Podcast. All rights reserved.</p>
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
                Exploring the future of artificial intelligence through diverse perspectives.
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
                    href="#"
                    className="block text-teal-200 hover:text-white transition-colors duration-300"
                >
                    Twitter
                </a>
                <a
                    href="#"
                    className="block text-gray-400 hover:text-white"
                >
                    LinkedIn
                </a>
                <a
                    href="#"
                    className="block text-gray-400 hover:text-white"
                >
                    Email
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
                    href="#"
                    className="block text-gray-400 hover:text-white"
                >
                    Spotify
                </a>
                <a
                    href="#"
                    className="block text-gray-400 hover:text-white"
                >
                    Apple Podcasts
                </a>
                <a
                    href="#"
                    className="block text-gray-400 hover:text-white"
                >
                    RSS Feed
                </a>
            </div>
        </div>
    );
} 