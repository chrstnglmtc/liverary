import type { LibraryItem } from "../types/library";

export default function ItemCard({ item }: { item: LibraryItem }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p className="text-sm text-gray-500">{item.author}</p>
        <div className="card-actions justify-between items-center mt-3">
          <span className="badge badge-outline capitalize">{item.type}</span>
          <a href={item.link} target="_blank" className="btn btn-sm btn-secondary">
            Open
          </a>
        </div>
      </div>
    </div>
  );
}
