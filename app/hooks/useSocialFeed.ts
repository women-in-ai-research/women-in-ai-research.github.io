"use client";

import { useState, useEffect } from 'react';
import { SocialFeed, FeedItem } from '@/app/types/socialFeed.types';

export function useSocialFeed(feedUrl: string, limit?: number) {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(feedUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: SocialFeed = await response.json();
                
                const sortedItems = data.items.sort((a, b) => 
                    new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
                );

                const limitedItems = limit ? sortedItems.slice(0, limit) : sortedItems;

                setItems(limitedItems);
            } catch (err: any) {
                console.error("Error fetching social feed:", err);
                setError(err.message || "Failed to fetch social feed");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [feedUrl, limit]);

    return { items, loading, error };
} 