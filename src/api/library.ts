import type { LibraryItem } from "../types/library";

const API_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:syWh6Ivm";

// ✅ Add new item
export async function addLibraryItem(item: LibraryItem): Promise<LibraryItem> {
  const response = await fetch(`${API_BASE}/library`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: 1, // TODO: replace with logged-in user ID from Xano auth later
      type: item.type,
      title: item.title,
      author: item.author,
      link: item.link,
      description: item.description || "",
      current_chapter: item.current_chapter || 0,
      metadata: item.metadata || {},
      date_added: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save item: ${response.statusText}`);
  }

  return response.json();
}

// ✅ Fetch all items
export async function getLibraryItems(): Promise<LibraryItem[]> {
  const response = await fetch(`${API_BASE}/library`);
  if (!response.ok) throw new Error("Failed to load library items");
  return response.json();
}

// ✅ Delete item
export async function deleteLibraryItem(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE}/library/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete item");
}
