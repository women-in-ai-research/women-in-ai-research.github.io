"use client";

import { useState, useEffect } from 'react';
import { SocialFeed, FeedItem } from '@/app/types/socialFeed.types';
import { isValid } from 'date-fns';

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
                
                // Safer date sorting with validation
                const sortedItems = data.items.sort((a, b) => {
                    const dateA = new Date(a.date_published);
                    const dateB = new Date(b.date_published);
                    
                    // If both dates are valid, sort normally
                    if (isValid(dateA) && isValid(dateB)) {
                        return dateB.getTime() - dateA.getTime();
                    }
                    
                    // If only one date is valid, prioritize the valid one
                    if (isValid(dateA)) return -1;
                    if (isValid(dateB)) return 1;
                    
                    // If neither date is valid, maintain original order
                    return 0;
                });

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