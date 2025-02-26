import { useState, useEffect } from 'react';
import { Episode } from '@/lib/types/podcast.types';

export function usePodcastFeed(feedUrl: string, limit: number = 5) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        setLoading(true);
        
        // Try direct fetch first
        let response;
        let xmlText;
        
        try {
          // Attempt direct fetch
          response = await fetch(feedUrl);
          if (!response.ok) {
            throw new Error('Direct fetch failed');
          }
          xmlText = await response.text();
        } catch (directFetchError) {
          console.log('Direct fetch failed, trying without proxy:', directFetchError);
          // If direct fetch fails, we'll continue with the fallback data below
          throw directFetchError;
        }
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = xmlDoc.querySelectorAll('item');
        const parsedEpisodes: Episode[] = [];
        
        // Get channel image as fallback
        const channelImage = xmlDoc.querySelector('channel > image > url')?.textContent || 
                            xmlDoc.querySelector('channel > itunes\\:image')?.getAttribute('href') || '';
        
        items.forEach((item) => {
          // Extract episode details
          const title = item.querySelector('title')?.textContent || 'Untitled Episode';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const enclosure = item.querySelector('enclosure');
          const audioUrl = enclosure?.getAttribute('url') || '';
          const duration = item.querySelector('itunes\\:duration')?.textContent || '';
          
          // Try multiple approaches to get the image
          let imageUrl = '';
          const itunesImage = item.querySelector('itunes\\:image');
          if (itunesImage && itunesImage.getAttribute('href')) {
            imageUrl = itunesImage.getAttribute('href') || '';
          } else {
            // Try to find image in the content encoded
            const content = item.querySelector('content\\:encoded')?.textContent || '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
              imageUrl = imgMatch[1];
            } else {
              // Use channel image as fallback
              imageUrl = channelImage;
            }
          }
          
          // Format date
          const date = new Date(pubDate);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          
          // Clean description (remove HTML tags)
          const cleanDescription = description.replace(/<[^>]*>?/gm, '').trim();
          
          parsedEpisodes.push({
            title,
            date: formattedDate,
            description: cleanDescription,
            audioUrl,
            duration,
            imageUrl,
            spotify: 'https://spotify.link' // Placeholder
          });
        });
       
        // Get the top episodes
        setEpisodes(parsedEpisodes.slice(0, limit));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError('Failed to load episodes. Please try again later.');
        setLoading(false);
        
        // Fallback to sample data with images
        setEpisodes([
          {
            title: 'The Future of AI Ethics',
            date: 'Oct 15, 2023',
            description: 'Exploring the ethical implications of AI development with special guest Dr. Sarah Johnson from MIT.',
            spotify: 'https://spotify.link',
            audioUrl: '',
            duration: '54:22',
            imageUrl: 'https://via.placeholder.com/400x400?text=AI+Ethics'
          },
          {
            title: 'Breaking Barriers in Machine Learning',
            date: 'Oct 1, 2023',
            description: 'Discussing groundbreaking ML research and its impact on society with Prof. Maria Garcia.',
            spotify: 'https://spotify.link',
            audioUrl: '',
            duration: '48:15',
            imageUrl: 'https://via.placeholder.com/400x400?text=ML+Barriers'
          },
          {
            title: 'AI in Healthcare: A Female Perspective',
            date: 'Sep 15, 2023',
            description: 'Examining how women researchers are revolutionizing healthcare AI applications.',
            spotify: 'https://spotify.link',
            audioUrl: '',
            duration: '51:30',
            imageUrl: 'https://via.placeholder.com/400x400?text=AI+Healthcare'
          },
        ]);
      }
    }
    
    fetchEpisodes();
  }, [feedUrl, limit]);

  return { episodes, loading, error };
}