import { formatDuration } from '@/app/components/common/RichText';

export interface EventVideoCardProps {
    title: string;
    youtubeUrl: string;
    thumbnailUrl: string;
    publishDate: string;
    durationSeconds: number;
    eventTitle: string;
    researcher?: { name: string; affiliation: string };
}

/** A conference or workshop interview, as shown on topic pages. */
export function EventVideoCard(v: EventVideoCardProps) {
    const meta = [v.eventTitle, v.publishDate, formatDuration(v.durationSeconds)].filter(Boolean).join(' · ');
    return (
        <a
            href={v.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/[0.12] transition-all duration-300"
        >
            <img src={v.thumbnailUrl} alt="" className="w-full aspect-video object-cover" loading="lazy" />
            <div className="p-5 flex flex-col gap-1.5">
                <p className="text-xs text-gray-400">{meta}</p>
                <h3 className="text-lg font-semibold text-white leading-snug">{v.title}</h3>
                {v.researcher && (
                    <p className="text-sm font-medium text-wiair-light">
                        {v.researcher.name}
                        {v.researcher.affiliation ? `, ${v.researcher.affiliation}` : ''}
                    </p>
                )}
            </div>
        </a>
    );
}
