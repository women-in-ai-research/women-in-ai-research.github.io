export interface Episode {
  title: string;
  date: string;
  description: string;
  spotify?: string;
  audioUrl: string;
  duration: string;
  imageUrl?: string;
}

export interface PodcastFeed {
  title: string;
  description: string;
  link: string;
  episodes: Episode[];
} 