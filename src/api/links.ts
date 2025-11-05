import type { LibraryItem } from "../types/library";

export function detectType(link: string): LibraryItem["type"] {
  if (link.match(/(youtube\.com|youtu\.be|tiktok\.com)/)) return "video";
  if (link.match(/(webtoon|mto|bato)/)) return "webtoon";
  if (link.match(/(mp3|wav|spotify|soundcloud)/)) return "music";
  if (
    link.match(
      /(pdf|epub|book|goodreads|kindle|wattpad|archiveofourown|asianfanfics)/
    )
  )
    return "book";
  return "other";
}

export async function processLink(link: string): Promise<LibraryItem> {
  const type = detectType(link);

  try {
    let item: LibraryItem;

    if (type === "video") {
      if (link.includes("youtube") || link.includes("youtu.be")) {
        item = await fetchYouTubeMetadata(link);
      } else if (link.includes("tiktok")) {
        item = await fetchOpenGraphMetadata(link, type);
      } else {
        item = await fetchOpenGraphMetadata(link, type);
      }
    } else {
      item = await fetchOpenGraphMetadata(link, type);
    }
    
    return {
      ...item,
      metadata: { thumbnail: item.thumbnail },
    };
  } catch (err) {
    console.error("Metadata fetch failed:", err);
    return {
      id: Date.now().toString(),
      type,
      title: link,
      author: "Unknown",
      link,
      thumbnail: "",
      metadata: { thumbnail: "" },
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
    thumbnail: image || "",
    link: url,
  };
}
