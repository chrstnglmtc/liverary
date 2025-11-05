import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authStore";
import { getLibraryItems } from "../api/library";
import type { LibraryItem } from "../types/library";
import MainLayout from "../layout/MainLayout";

interface FilterSortState {
  type: string; // 'all', 'book', 'webtoon', etc.
  sortBy: "date" | "title" | "type";
  sortOrder: "asc" | "desc";
}

const TYPE_ICONS: Record<string, string> = {
  all: "📚",
  book: "📖",
  webtoon: "🖼️",
  music: "🎵",
  video: "🎬",
  other: "🔖",
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSort, setFilterSort] = useState<FilterSortState>({
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  // Load user and items
  useEffect(() => {
    const currentUser =
      getCurrentUser() || JSON.parse(sessionStorage.getItem("authUser") || "null");
    if (!currentUser) return;
    setUser(currentUser);

    setLoading(true);
    getLibraryItems()
      .then((res) => setItems(res))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort
  useEffect(() => {
    let result = [...items];
    if (filterSort.type !== "all") {
      result = result.filter((i) => i.type === filterSort.type);
    }

    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (filterSort.sortBy) {
        case "title":
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case "type":
          valA = a.type;
          valB = b.type;
          break;
        case "date":
        default:
          valA = a.date_added || "";
          valB = b.date_added || "";
          break;
      }

      if (valA < valB) return filterSort.sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return filterSort.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(result);
  }, [items, filterSort]);

  if (!user) return <div className="text-center mt-20">Loading user...</div>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-base-200 p-6">
        <h1 className="text-3xl font-bold mb-2">{user.display_name}'s Profile</h1>
        <p className="mb-4">Bookmarked items: {items.length}</p>

        {/* Filter Row with Icons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(TYPE_ICONS).map((type) => (
            <button
              key={type}
              className={`btn btn-sm ${
                filterSort.type === type ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setFilterSort({ ...filterSort, type })}
              title={type}
            >
              <span className="mr-1">{TYPE_ICONS[type]}</span>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2 mb-4">
          <select
            className="select select-bordered"
            value={filterSort.sortBy}
            onChange={(e) =>
              setFilterSort({ ...filterSort, sortBy: e.target.value as any })
            }
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="type">Type</option>
          </select>

          <select
            className="select select-bordered"
            value={filterSort.sortOrder}
            onChange={(e) =>
              setFilterSort({ ...filterSort, sortOrder: e.target.value as any })
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Library Items List */}
        {loading ? (
          <div className="text-center">Loading library items...</div>
        ) : (
          <ul className="list bg-base-100 rounded-box shadow-md">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              Bookmarked Library Items
            </li>

            {filteredItems.length === 0 && (
              <li className="p-4 text-center opacity-60">No items found</li>
            )}

        {filteredItems.map((item) => (
          <li key={item.id} className="list-row items-center gap-2">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <div className="font-bold">{item.title}</div>
              <div className="text-xs uppercase font-semibold opacity-60">{item.type}</div>
              {item.description && (
                <div className="text-xs opacity-70 mt-1">{item.description}</div>
              )}
            </div>

            {/* Eye icon button to view details */}
            <button
              className="btn btn-square btn-ghost ml-2"
              onClick={() => setSelectedItem(item)}
              title="View Details"
            >
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* External link icon button */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-square btn-ghost ml-2"
                title="Open Link"
              >
                <svg
                  className="size-[1.2em]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </li>
        ))}

          </ul>
        )}

        {/* Details Popup */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded shadow-md w-11/12 max-w-lg relative">
              <button
                className="btn btn-sm btn-ghost absolute top-2 right-2"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{selectedItem.type}</p>
              {selectedItem.author && <p className="mb-2">Author: {selectedItem.author}</p>}
              {selectedItem.description && <p className="mb-2">{selectedItem.description}</p>}
              {selectedItem.link && (
                <p className="mt-2">
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    Open Link
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
