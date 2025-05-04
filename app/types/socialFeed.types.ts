
export interface SocialFeed {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  favicon?: string;
  language?: string;
  description?: string;
  items: FeedItem[];
}

export interface FeedItem {
  id: string;
  url: string;
  title: string; 
  content_text: string;
  content_html: string;
  image?: string; // Optional image URL directly in the item
  date_published: string; // ISO 8601 format
  authors: Author[];
  attachments?: Attachment[]; // Optional attachments array
}

export interface Author {
  name: string; // e.g., "WiAIR Women in AI Research"
  // LinkedIn doesn't provide handles here, maybe add URL if available later
}

export interface Attachment {
  url: string;
  mime_type?: string;
  title?: string;
  size_in_bytes?: number;
  duration_in_seconds?: number;
} 