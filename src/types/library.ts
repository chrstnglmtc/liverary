export interface LibraryItem {
  id?: string | number;
  user_id?: number;
  type: "book" | "webtoon" | "music" | "video" | "other";
  title: string;
  author?: string;
  link: string;
  description?: string;
  current_chapter?: number;
  metadata?: Record<string, any>;
  date_added?: string;
  thumbnail?:string;
}
