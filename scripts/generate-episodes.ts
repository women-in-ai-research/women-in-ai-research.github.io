import { writeFileSync } from "fs";
import { join } from "path";

const RSS_URL = "https://anchor.fm/s/100f18168/podcast/rss";

interface Episode {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  publishDate: string;
  imageUrl: string;
  imagePosition: string;
  episodeLink: string | null;
  youtubeLink: string | null;
  spotifyLink: string | null;
  visible: boolean;
}

function stripCdataAndHtml(raw: string): string {
  // Unwrap CDATA
  let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  // Strip HTML tags
  text = text.replace(/<[^>]+>/g, "");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
  // Normalise whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*?\\s${attr}\\s*=\\s*"([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1] : null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeShortDescription(text: string, maxLen = 200): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  // Try to break at last space
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

async function main() {
  console.log("Fetching RSS feed...");
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`);
  const xml = await res.text();

  // Channel-level fallback image
  // Match <itunes:image> outside of <item> blocks
  const channelPart = xml.split("<item>")[0];
  const fallbackImage = extractAttr(channelPart, "itunes:image", "href") ?? "";

  // Extract items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(match[1]);
  }

  console.log(`Found ${items.length} items in RSS feed`);

  // RSS items are newest-first; reverse so oldest = id 1
  items.reverse();

  const episodes: Episode[] = items.map((item, index) => {
    const id = String(index + 1);
    const rawTitle = extractTag(item, "title") ?? "Untitled";
    const title = `Ep.${id}: ${stripCdataAndHtml(rawTitle)}`;

    const rawDesc = extractTag(item, "description") ?? "";
    const cleanedDesc = stripCdataAndHtml(rawDesc);
    const description = makeShortDescription(cleanedDesc);
    const longDescription = cleanedDesc;

    const pubDate = extractTag(item, "pubDate") ?? "";
    const publishDate = formatDate(pubDate);

    const itemImage = extractAttr(item, "itunes:image", "href");
    const imageUrl = itemImage ?? fallbackImage;

    const episodeLink = extractAttr(item, "enclosure", "url") ?? null;

    return {
      id,
      title,
      description,
      longDescription,
      publishDate,
      imageUrl,
      imagePosition: "center center",
      episodeLink,
      youtubeLink: null,
      spotifyLink: null,
      visible: true,
    };
  });

  const outPath = join(__dirname, "..", "app", "data", "episodes.json");
  const json = JSON.stringify(episodes, null, 2) + "\n";
  writeFileSync(outPath, json, "utf-8");
  console.log(`Wrote ${episodes.length} episodes to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
