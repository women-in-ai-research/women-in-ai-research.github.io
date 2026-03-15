import { FeedItem } from '@/app/types/socialFeed.types';
import { format, isValid } from 'date-fns';
import { useState } from 'react';

interface AnnouncementCardProps {
    item: FeedItem;
}

export function AnnouncementCard({ item }: AnnouncementCardProps) {
    const [imageLoadError, setImageLoadError] = useState(false);

    const dateObj = new Date(item.date_published);
    const formattedDate = isValid(dateObj) ? format(dateObj, 'MMMM d, yyyy') : 'Date unavailable';

    const authorName = item.authors[0]?.name || 'Unknown Author';
    const postUrl = item.url;
    const displayContent = item.title;

    const handleImageError = () => {
        setImageLoadError(true);
    };

    // Try item.image first, fall back to first attachment URL
    const imageUrl = item.image || item.attachments?.[0]?.url;
    const showImage = imageUrl && !imageLoadError;

    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300 w-full flex flex-col sm:flex-row gap-5 items-start">
            {/* Image or placeholder */}
            <div className="w-full sm:w-36 h-36 sm:h-auto rounded-xl overflow-hidden shrink-0">
                {showImage ? (
                    <img
                        src={imageUrl}
                        alt={`Image for post by ${authorName}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="w-full h-full min-h-[6rem] bg-gradient-to-br from-wiair-medium/20 to-purple-500/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-wiair-medium/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-between h-full">
                <div className="mb-2 text-sm flex justify-between items-center">
                    <span className="text-wiair-light font-medium">{formattedDate}</span>
                    <span className="text-gray-400 text-right">{authorName}</span>
                </div>

                <p className="text-gray-200 text-base mb-4 flex-grow">
                    {displayContent}
                </p>

                <div className="text-right pt-2 border-t border-white/10">
                    <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-sm text-wiair-light hover:text-wiair-lightest transition-colors font-medium"
                    >
                        View on LinkedIn <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
