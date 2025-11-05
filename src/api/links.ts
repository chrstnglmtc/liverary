import type { LibraryItem } from "../types/library";

export function detectType(link: string): LibraryItem["type"] {
  const lower = link.toLowerCase();

  if (/(youtube\.com|youtu\.be|tiktok\.com)/.test(lower)) return "video";
  if (/(webtoon|mto\.to|bato\.to)/.test(lower)) return "webtoon";
  if (/(spotify\.com|soundcloud\.com|\.mp3|\.wav)/.test(lower)) return "music";
  if (
    /(pdf|epub|book|goodreads\.com|kindle|wattpad\.com|archiveofourown\.org|asianfanfics\.com)/
      .test(lower)
  )
    return "book";
  return "other";
}

export async function processLink(link: string): Promise<LibraryItem> {
  const type = detectType(link);

  try {
    if (type === "video") {
      if (link.includes("youtube") || link.includes("youtu.be")) {
        return await fetchYouTubeMetadata(link);
      }
      if (link.includes("tiktok")) {
        return await fetchOpenGraphMetadata(link, type);
      }
    }

    if (type === "webtoon") {
      return await fetchOpenGraphMetadata(link, type);
    }

    if (type === "book") {
      return await fetchOpenGraphMetadata(link, type);
    }

    if (type === "music") {
      return await fetchOpenGraphMetadata(link, type);
    }

    return await fetchOpenGraphMetadata(link, type);
  } catch (err) {
    console.error("Metadata fetch failed:", err);
    return {
      id: Date.now().toString(),
      type,
      title: link,
      author: "Unknown",
      link,
    };
  }
}

/* --- YouTube --- */
async function fetchYouTubeMetadata(link: string): Promise<LibraryItem> {
  const match = link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
  const videoId = match ? match[1] : null;
  if (!videoId) throw new Error("Invalid YouTube link");

  const res = await fetch(
    `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
  );
  const data = await res.json();

  return {
    id: Date.now().toString(),
    type: "video",
    title: data.title || "Unknown video",
    author: data.author_name || "Unknown channel",
    thumbnail: data.thumbnail_url,
    link,
  };
}

/* --- Open Graph fallback for everything else --- */
async function fetchOpenGraphMetadata(
  url: string,
  type: LibraryItem["type"]
): Promise<LibraryItem> {
  const res = await fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
  );
  const data = await res.json();
  const html = data.contents as string;

  const title = html.match(/<meta property="og:title" content="(.*?)"/)?.[1];
  const image = html.match(/<meta property="og:image" content="(.*?)"/)?.[1];
  const siteName = html.match(/<meta property="og:site_name" content="(.*?)"/)?.[1];

  return {
    id: Date.now().toString(),
    type,
    title: title || url,
    author: siteName || "Unknown",
    thumbnail: image,
    link: url,
  };
}
