import topicsData from '@/app/data/topics.json';

interface Topic {
    slug: string;
    name: string;
    videoIds: string[];
}

/** One button per topic, each opening that topic's page. */
export function TopicButtons({ current, className = '' }: { current?: string; className?: string }) {
    const topics = (topicsData as Topic[]).filter((t) => t.videoIds.length > 0);
    return (
        <ul className={`flex flex-wrap gap-3 ${className}`} aria-label="Topics">
            {topics.map((t) => {
                const active = t.slug === current;
                return (
                    <li key={t.slug}>
                        <a
                            href={`/topics/${t.slug}/`}
                            aria-current={active ? 'page' : undefined}
                            className={`inline-block px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                                active
                                    ? 'bg-gradient-to-r from-wiair-medium to-purple-500 text-white shadow-lg shadow-wiair-medium/25'
                                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                            }`}
                        >
                            {t.name}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
