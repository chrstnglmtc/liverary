import type { LibraryItem } from "../types/library";
import { getCurrentUser, handleSessionExpired } from "./authStore";

const API_BASE = import.meta.env.VITE_API_BASE;

// ✅ Helper: Get auth headers (with error handling)
function getAuthHeaders() {
  const user = getCurrentUser();
  const token = user?.token;
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ✅ Helper: Handle fetch with session check
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);

  // 🔒 If session expired or unauthorized → logout + redirect
  if (res.status === 401 || res.status === 403) {
    handleSessionExpired();
    throw new Error("Session expired. Please log in again.");
  }

  return res;
}

// ✅ Add new item
export async function addLibraryItem(item: LibraryItem): Promise<LibraryItem> {
  const user = getCurrentUser();
  if (!user) throw new Error("User not logged in");

  const thumbnail = item.thumbnail || item.metadata?.thumbnail || "";

  const payload = {
    type: item.type,
    title: item.title,
    user_id: user.id,
    author: item.author,
    link: item.link,
    description: item.description || "",
    current_chapter: item.current_chapter || 0,
    thumbnail,
    metadata: { ...item.metadata, thumbnail },
    date_added: new Date().toISOString(),
  };

  const res = await fetchWithAuth(`${API_BASE}/library`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save item");
  return res.json();
}

// ✅ Fetch all items for the logged-in user
export async function getLibraryItems(): Promise<LibraryItem[]> {
  const res = await fetchWithAuth(`${API_BASE}/my_library`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}

// ✅ Delete item
export async function deleteLibraryItem(id: string | number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/library/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete item");
}

// ✅ Update item
export async function updateLibraryItem(
  id: string | number,
  updates: Partial<LibraryItem>
): Promise<LibraryItem> {
  const thumbnail = updates.thumbnail || updates.metadata?.thumbnail || "";

  const payload = {
    ...updates,
    thumbnail,
    metadata: { ...updates.metadata, thumbnail },
  };

  const res = await fetchWithAuth(`${API_BASE}/library/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}
