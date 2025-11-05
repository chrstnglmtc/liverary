import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import FilterTabs from "../components/FilterTabs";
import ItemCard from "../components/ItemCard";
import Toast from "../components/Toast";
import { processLink } from "../api/links";
import { addLibraryItem, getLibraryItems } from "../api/library";
import type { LibraryItem } from "../types/library";

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "info" | "success" | "error" } | null>(null);

  // ✅ Load all items from Xano on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getLibraryItems();
        setItems(data);
      } catch (err) {
        console.error(err);
        setToast({ message: "❌ Failed to load library items", type: "error" });
      }
    })();
  }, []);

  // ✅ Add a new link and save it to Xano
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!newLink.trim()) return;

    try {
      setLoading(true);

      // 1️⃣ Process metadata from the link (title, type, etc.)
      const item = await processLink(newLink);

      // 2️⃣ Save the item to your Xano API
      const saved = await addLibraryItem(item);

      // 3️⃣ Update UI
      setItems(prev => [saved, ...prev]);
      setNewLink("");
      setToast({ message: "✅ Saved to your library!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ Failed to save item", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <MainLayout>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Add link input */}
      <form
        onSubmit={handleAddLink}
        className="p-6 flex gap-2 justify-center items-center"
      >
        <input
          type="url"
          placeholder="Paste a link (YouTube, Webtoon, etc.)"
          value={newLink}
          onChange={e => setNewLink(e.target.value)}
          className="input input-bordered w-full max-w-lg"
          required
        />
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <FilterTabs filter={filter} onChange={setFilter} />

      {/* Library items */}
      <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No items yet. Add your first link above!
          </p>
        ) : (
          filtered.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </MainLayout>
  );
}
