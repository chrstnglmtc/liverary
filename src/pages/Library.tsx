import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import FilterTabs from "../components/FilterTabs";
import ItemCard from "../components/ItemCard";
import Toast from "../components/Toast";
import { processLink } from "../api/links";
import {
  addLibraryItem,
  getLibraryItems,
  deleteLibraryItem,
  updateLibraryItem,
} from "../api/library";
import type { LibraryItem } from "../types/library";
import EditModal from "../components/EditModal";

export default function Library() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "info" | "success" | "error" } | null>(null);
  const [editing, setEditing] = useState<LibraryItem | null>(null);

  // Load all items
  useEffect(() => {
    getLibraryItems()
      .then(setItems)
      .catch(() => setToast({ message: "Failed to load items", type: "error" }));
  }, []);

  // Add link
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!newLink.trim()) return;

    try {
      setLoading(true);
      const item = await processLink(newLink);
      const saved = await addLibraryItem(item);
      setItems(prev => [saved, ...prev]);
      setNewLink("");
      setToast({ message: "Added to library!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to save item", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Delete item
  async function handleDelete(id: string | number) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteLibraryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setToast({ message: "Item deleted", type: "info" });
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  }

  // Save edit
  async function handleSaveEdit() {
    if (!editing) return;
    try {
      const updated = await updateLibraryItem(editing.id!, editing);
      setItems(prev =>
        prev.map(item => (item.id === updated.id ? updated : item))
      );
      setEditing(null);
      setToast({ message: "Changes saved", type: "success" });
    } catch {
      setToast({ message: "Failed to update", type: "error" });
    }
  }

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <MainLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Add new link */}
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

      {/* Item grid */}
      <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No items yet. Add your first link above!
          </p>
        ) : (
          filtered.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={setEditing}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        item={editing}
        onClose={() => setEditing(null)}
        onSave={async (updated) => {
          try {
            const result = await updateLibraryItem(updated.id!, updated);
            setItems((prev) =>
              prev.map((i) => (i.id === result.id ? result : i))
            );
            setEditing(null);
            setToast({ message: "Changes saved", type: "success" });
          } catch {
            setToast({ message: "Failed to update", type: "error" });
          }
        }}
      />

    </MainLayout>
  );
}
