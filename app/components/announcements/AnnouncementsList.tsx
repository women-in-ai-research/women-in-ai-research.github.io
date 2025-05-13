import { FeedItem } from '@/app/types/socialFeed.types';
import { AnnouncementCard } from './AnnouncementCard';
import { LoadingSpinner } from '@/app/components/common/LoadingSpinner';

interface AnnouncementsListProps {
    items: FeedItem[];
    loading: boolean;
    error: string | null;
}

export function AnnouncementsList({ items, loading, error }: AnnouncementsListProps) {
    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-red-400">Error loading announcements: {error}</div>;
    }

    if (!items || items.length === 0) {
        return <div className="text-center text-gray-400">No announcements found.</div>;
    }

    // Check if the feed is showing the trial expiration message
    const hasExpiredTrial = items.some(item => 
        item.title?.includes("RSS.app Trial has Expired") || 
        item.content_text?.includes("RSS.app Trial has Expired")
    );

    if (hasExpiredTrial) {
        return (
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-lg shadow-md border border-purple-500/20 text-center">
                <h3 className="text-wiair-light text-xl font-semibold mb-3">RSS Feed Subscription Expired</h3>
                <p className="text-gray-300 mb-4">
                    The RSS feed subscription has expired and needs to be renewed to display the latest announcements.
                </p>
                <p className="text-sm text-gray-400">
                    Please contact the site administrator to update the RSS.app subscription.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 w-full max-w-3xl mx-auto">
            {items.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
            ))}
        </div>
    );
} 