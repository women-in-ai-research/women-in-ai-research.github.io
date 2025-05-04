import { FeedItem } from '@/app/types/socialFeed.types';
import { format } from 'date-fns';
import { useState } from 'react';

interface AnnouncementCardProps {
    item: FeedItem;
}

export function AnnouncementCard({ item }: AnnouncementCardProps) {
    const [imageLoadError, setImageLoadError] = useState(false);
    const formattedDate = format(new Date(item.date_published), 'MMMM d, yyyy');
    const authorName = item.authors[0]?.name || 'Unknown Author'; 
    const postUrl = item.url;

    // Use the title as the primary content for a high-level overview
    const displayContent = item.title;

    const handleImageError = () => {
        setImageLoadError(true);
    };

    // Determine if the image should be shown
    const showImage = item.image && !imageLoadError;

    return (
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-lg shadow-md border border-purple-500/20 w-full flex flex-col sm:flex-row gap-5 items-start">
            {/* Conditionally render the image container */}
            {showImage && (
                <div className="w-full sm:w-32 h-32 sm:h-auto rounded-md overflow-hidden shrink-0">
                    <img 
                        src={item.image} 
                        alt={`Image for post by ${authorName}`} 
                        className="w-full h-full object-cover" 
                        onError={handleImageError}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-between h-full">
                {/* Top section: Date and Author */}
                <div className="mb-2 text-sm text-purple-300 flex justify-between items-center">
                    <span>{formattedDate}</span>
                    <span className="text-right">{authorName}</span>
                </div>

                {/* Middle section: Title/Summary */}
                <p className="text-gray-200 text-base mb-4 flex-grow">
                    {displayContent}
                </p>

                {/* Bottom section: Link to original post */}
                <div className="text-right pt-2 border-t border-purple-500/10">
                    <a 
                        href={postUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-wiair-light hover:text-wiair-lightest transition-colors font-medium"
                    >
                        View on LinkedIn →
                    </a>
                </div>
            </div>
        </div>
    );
} 