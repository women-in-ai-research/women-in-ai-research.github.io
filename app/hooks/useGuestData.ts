import { useState, useEffect } from 'react';
import guestsData from '@/data/guests.json';
import { Guest, GuestsData } from '@/lib/types/guest.types';

interface GuestDisplay {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  imageUrl: string;
  episodeLink: string;
}

export function useGuestData(guestsPerPage: number) {
  const [guests, setGuests] = useState<GuestDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      try {
        // Import data from guests.json
        const importedGuests = guestsData.guests;
        
        // Transform the data to match our display format
        const transformedGuests: GuestDisplay[] = importedGuests.map(guest => ({
          id: guest.id.toString(),
          name: guest.name,
          title: guest.title,
          organization: guest.organization,
          bio: guest.bio,
          imageUrl: guest.image,
          episodeLink: `/episodes/${guest.episodes[0]}` // Link to first episode
        }));
        
        // Calculate total pages
        const calculatedTotalPages = Math.ceil(transformedGuests.length / guestsPerPage);
        setTotalPages(calculatedTotalPages);
        
        // Get guests for current page
        const startIndex = (currentPage - 1) * guestsPerPage;
        const endIndex = startIndex + guestsPerPage;
        const paginatedGuests = transformedGuests.slice(startIndex, endIndex);
        
        setGuests(paginatedGuests);
        setLoading(false);
      } catch (err) {
        console.error('Error loading guest data:', err);
        setError('Failed to load guest data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [currentPage, guestsPerPage]);
  
  return { guests, loading, error, currentPage, totalPages, setCurrentPage };
}