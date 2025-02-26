'use client';

import { usePodcastFeed } from '@/app/hooks/usePodcastFeed';
import { EpisodeList } from '@/app/components/podcast/EpisodeList';
import JekaterinaNovikova from '@/public/images/jekaterina-novikova.jpg';
import MalikehEhghaghi from '@/public/images/malikeh-ehghaghi.jpg';
import { useState } from 'react';
import { getPageUrl } from '@/app/components/common/urls';


export default function Page() {
    const RSS_URL = 'https://anchor.fm/s/1e4a0eac/podcast/rss'; // Women in AI Research podcast feed
    const { episodes, loading, error } = usePodcastFeed(RSS_URL, 3);
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="backdrop-blur-lg bg-white/10 sticky top-0 z-50" data-oid="35pyfzc">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="s6251km">
                    <div className="flex justify-between h-20" data-oid="4z:yhu1">
                        <div className="flex items-center" data-oid="a-e:gqc">
                            <h1
                                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text"
                                data-oid="u3wzvg5"
                            >
                                Women in AI Research
                            </h1>
                        </div>
                        <div className="flex items-center space-x-8" data-oid=".a0cuk8">
                            <a
                                href={getPageUrl('#episodes')}
                                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
                                data-oid="-t7f49u"
                            >
                                Episodes
                            </a>
                            <a
                                href={getPageUrl('/guests')}
                                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
                            >
                                Guests
                            </a>
                            <a
                                href={getPageUrl('#about')}
                                className="text-white hover:text-purple-300 transition-colors duration-300 text-lg"
                                data-oid="ienusfe"
                            >
                                About Us
                            </a>
                            <a
                                href={getPageUrl('#subscribe')}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                                data-oid="lh.u22g"
                            >
                                Subscribe
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32" data-oid="plrcb_x">
                <div className="text-center relative" data-oid="zzx.m_2">
                    <div className="absolute inset-0 -z-10" data-oid="4jdie1m">
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"
                            data-oid="5np27wg"
                        ></div>
                        <div
                            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[120px]"
                            data-oid="z2_w1vs"
                        ></div>
                    </div>
                    <h1
                        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8"
                        data-oid="rwii_dd"
                    >
                        Amplifying Women's Voices in AI
                    </h1>
                    <p
                        className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed"
                        data-oid="j7np8cy"
                    >
                        Join Jekaterina Novikova and Malikeh Ehghaghi as they explore the frontiers
                        of artificial intelligence research
                    </p>
                    <div className="flex justify-center space-x-6" data-oid="ypf17m6">
                        <a
                            href="https://spotify.link"
                            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                            data-oid="zjs_y.h"
                        >
                            <span
                                className="flex items-center space-x-2 text-white"
                                data-oid="4ef-zpr"
                            >
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    data-oid=":9cqlde"
                                >
                                    <path
                                        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                                        data-oid="luprlzw"
                                    />
                                </svg>
                                <span data-oid="cn10p-z">Listen on Spotify</span>
                            </span>
                        </a>
                        <a
                            href="https://rss.link"
                            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                            data-oid="4fn1a1:"
                        >
                            <span
                                className="flex items-center space-x-2 text-white"
                                data-oid="l5gyyyt"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="e4kghpy"
                                >
                                    <path
                                        d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"
                                        data-oid="enhtel1"
                                    />
                                </svg>
                                <span data-oid=":m4_.se">RSS Feed</span>
                            </span>
                        </a>
                    </div>
                </div>
            </div>


            {/* Episodes Section */}
            <div id="episodes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-12 text-center">
                Latest Episodes
                </h2>
                <EpisodeList episodes={episodes} loading={loading} error={error} />
            </div>

            {/* About Section */}
            <div id="about" className="bg-purple-50 py-16" data-oid="y.mo3fy">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="x2mnzxt">
                    <h2
                        className="text-3xl font-bold text-gray-900 mb-12 text-center"
                        data-oid="t8r6:ar"
                    >
                        Meet Your Hosts
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12" data-oid="p-ke-i0">
                        <div className="bg-white p-8 rounded-lg shadow-md" data-oid="3b9c9ww">
                            <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                                <img 
                                    src={JekaterinaNovikova.src}
                                    alt="Dr. Jekaterina Novikova" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 text-center mb-4"
                                data-oid="li-oejl"
                            >
                                Jekaterina Novikova
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="j7lnvx2">
                                Dr. Jekaterina Novikova is a renowned AI researcher with over 15
                                years of experience in natural language processing and human-AI
                                interaction. She holds a Ph.D. in Computer Science and has led
                                numerous groundbreaking research projects at prestigious
                                institutions.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md" data-oid="3lyymr8">
                            <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                                <img 
                                    src={MalikehEhghaghi.src}
                                    alt="Malikeh Ehghaghi" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 text-center mb-4"
                                data-oid="-2wp_ca"
                            >
                                Malikeh Ehghaghi
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="2kc4-z1">
                                Malikeh Ehghaghi is a distinguished AI researcher specializing in
                                machine learning and ethical AI development. With a background in
                                both computer science and philosophy, she brings a unique
                                perspective to discussions about AI's role in society.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" data-oid="mge5t57">
                <div className="grid md:grid-cols-2 gap-12" data-oid="5johhzy">
                    {/* Blog Preview */}
                    <div
                        className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-purple-500/20"
                        data-oid="l4412jl"
                    >
                        <h3
                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6"
                            data-oid="hm.pcb2"
                        >
                            Latest from the Blog
                        </h3>
                        <div className="space-y-4" data-oid="bcmdifv">
                            <a
                                href={getPageUrl('/blog/post-1')}
                                className="block hover:bg-white/5 p-4 rounded-lg transition-colors duration-300"
                                data-oid="wzzwz1y"
                            >
                                <h4
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 font-semibold mb-2"
                                    data-oid="ua_6-u4"
                                >
                                    The Evolution of AI Ethics
                                </h4>
                                <p className="text-teal-300 text-sm" data-oid="yegwkkm">
                                    Exploring the latest developments in AI ethics and their
                                    implications...
                                </p>
                            </a>
                            <a
                                href={getPageUrl('/blog/post-2')}
                                className="block hover:bg-white/5 p-4 rounded-lg transition-colors duration-300"
                                data-oid="it1eyjn"
                            >
                                <h4
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-semibold mb-2"
                                    data-oid="g-yud3f"
                                >
                                    Women Leading AI Research
                                </h4>
                                <p className="text-indigo-300 text-sm" data-oid="hji.wbe">
                                    Highlighting groundbreaking research by women in the AI field...
                                </p>
                            </a>
                        </div>
                        <a
                            href={getPageUrl('/blog')}
                            className="inline-block mt-6 text-purple-400 hover:text-purple-300"
                            data-oid="81cc2:r"
                        >
                            Read More →
                        </a>
                    </div>

                    {/* Reviews/Testimonials Preview */}
                    <div
                        className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-purple-500/20"
                        data-oid="ygdp_u3"
                    >
                        <h3
                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6"
                            data-oid="iioqvsg"
                        >
                            Listener Reviews
                        </h3>
                        <div className="space-y-6" data-oid="5:43:52">
                            <div className="relative" data-oid="iemoxfp">
                                <div
                                    className="absolute -top-2 -left-2 text-4xl text-purple-400"
                                    data-oid="z2z_89r"
                                >
                                    "
                                </div>
                                <p className="text-gray-200 pl-6" data-oid=".:9skr5">
                                    One of the most insightful podcasts about AI and its impact on
                                    society. The diverse perspectives are invaluable.
                                </p>
                                <p className="text-teal-300 text-sm mt-2 pl-6" data-oid="z98hr:u">
                                    - Sarah M., AI Researcher
                                </p>
                            </div>
                            <div className="relative" data-oid="nje66ty">
                                <div
                                    className="absolute -top-2 -left-2 text-4xl text-purple-400"
                                    data-oid="jmumxu9"
                                >
                                    "
                                </div>
                                <p className="text-gray-200 pl-6" data-oid="pxmkazw">
                                    Essential listening for anyone interested in the future of AI
                                    and technology.
                                </p>
                                <p className="text-indigo-300 text-sm mt-2 pl-6" data-oid=".77jtl-">
                                    - Dr. Emily Chen
                                </p>
                            </div>
                        </div>
                        <a
                            href={getPageUrl('/reviews')}
                            className="inline-block mt-6 text-purple-400 hover:text-purple-300"
                            data-oid="6cc8fi-"
                        >
                            View All Reviews →
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer
                className="backdrop-blur-xl bg-black/50 text-white py-16 border-t border-purple-500/20"
                data-oid="3wt6tdc"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="w-vb5f4">
                    <div className="grid md:grid-cols-4 gap-8" data-oid="x.expl-">
                        <div data-oid="vfqubrl">
                            <h3 className="text-xl font-bold mb-4" data-oid="x4-5wm2">
                                Women in AI Research
                            </h3>
                            <p className="text-teal-200" data-oid="9npsjn7">
                                Exploring the future of artificial intelligence through diverse
                                perspectives.
                            </p>
                        </div>
                        <div data-oid="i7nf43r">
                            <h3 className="text-xl font-bold mb-4" data-oid="cgo.xcq">
                                Connect
                            </h3>
                            <div className="space-y-2" data-oid="g:x1hjq">
                                <a
                                    href="#"
                                    className="block text-teal-200 hover:text-white transition-colors duration-300"
                                    data-oid="416_fcb"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-400 hover:text-white"
                                    data-oid="q6fn-sy"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-400 hover:text-white"
                                    data-oid="74o18:s"
                                >
                                    Email
                                </a>
                            </div>
                        </div>
                        <div data-oid="1tc3:i_">
                            <h3 className="text-xl font-bold mb-4" data-oid="_goo1p2">
                                Subscribe
                            </h3>
                            <div className="space-y-2" data-oid="y6ze062">
                                <a
                                    href="#"
                                    className="block text-gray-400 hover:text-white"
                                    data-oid="xv0ys_z"
                                >
                                    Spotify
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-400 hover:text-white"
                                    data-oid="orq5s13"
                                >
                                    Apple Podcasts
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-400 hover:text-white"
                                    data-oid="e5ezh-s"
                                >
                                    RSS Feed
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400"
                        data-oid="mj4502d"
                    >
                        <p data-oid="5:_dep_">
                            &copy; 2023 Women in AI Research Podcast. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
