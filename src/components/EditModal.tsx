import { useState, useEffect } from "react";
import type { LibraryItem } from "../types/library";

interface EditModalProps {
  item: LibraryItem | null;
  onClose: () => void;
  onSave: (updated: LibraryItem) => Promise<void> | void;
}

export default function EditModal({ item, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<Partial<LibraryItem> | null>(item);

  useEffect(() => {
    setForm(item);
  }, [item]);

  if (!form) return null;

  function handleChange(
    field: keyof LibraryItem,
    value: string | number | object
  ) {
    setForm(prev => (prev ? { ...prev, [field]: value } : { [field]: value }));
  }

  async function handleSave() {
    if (!form?.title || !form?.type) return; // Ensure required fields
    await onSave(form as LibraryItem);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-200 text-base-content max-w-md">
        <h3 className="font-bold text-lg mb-4">Edit Item</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Title"
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Author"
            value={form.author || ""}
            onChange={(e) => handleChange("author", e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* Overlay background */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
