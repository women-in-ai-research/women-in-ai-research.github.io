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

    return (
        <div className="grid grid-cols-1 gap-8 w-full max-w-3xl mx-auto">
            {items.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
            ))}
        </div>
    );
} 