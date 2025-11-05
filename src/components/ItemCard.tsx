import type { LibraryItem } from "../types/library";

interface Props {
  item: LibraryItem;
  onDelete?: (id: string | number) => void;
  onEdit?: (item: LibraryItem) => void;
}

export default function ItemCard({ item, onDelete, onEdit }: Props) {
  const thumbnail = item.metadata?.thumbnail || "";

  // detect if title is a link (no proper title found)
  const isLinkTitle = item.title?.startsWith("http");

  return (
    <div className="card bg-base-100 shadow-md rounded-2xl overflow-hidden transition hover:shadow-lg flex flex-col md:flex-row h-full">
      {/* Thumbnail */}
      <figure className="w-full h-40 md:w-48 md:h-auto flex-shrink-0 bg-gray-800 flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No thumbnail</span>
        )}
      </figure>

      {/* Card Content */}
      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <span className="badge badge-outline mb-1 uppercase text-xs tracking-wide">
            {item.type}
          </span>

          <h2
            className={`card-title text-base font-semibold line-clamp-1 ${
              isLinkTitle ? "text-sm text-white-400 mb-1 break-all" : "mb-1"
            }`}
          >
            {item.title}
          </h2>

          {item.author && (
            <p className="text-sm text-gray-500 mb-2">{item.author}</p>
          )}

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            Open Link →
          </a>
        </div>

        <div className="card-actions justify-end mt-3">
          <button
            className="btn btn-xs btn-outline btn-primary"
            onClick={() => onEdit?.(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-outline btn-error"
            onClick={() => onDelete?.(item.id!)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
