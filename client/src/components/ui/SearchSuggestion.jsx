import React from "react";

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const SearchSuggestions = ({
  suggestions,
  isLoading,
  isError,
  onSelect,
  query,
}) => {
  if (!suggestions) return null;

  // Flatten all suggestions into one array
  const flatSuggestions = [
    ...(suggestions.posts?.map((p) => ({
      type: "Post",
      label: p.title,
      id: p._id,
    })) || []),
    ...(suggestions.authors?.map((a) => ({
      type: "Author",
      label: a.name,
      id: a._id,
    })) || []),
    ...(suggestions.tags?.map((t) => ({
      type: "Tag",
      label: t.name,
      id: t._id,
    })) || []),
  ];

  return (
    <div className="absolute top-full left-0 w-80 bg-white border rounded-md mt-1 shadow-md z-50 max-h-64 overflow-y-auto">
      {isLoading && (
        <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
      )}

      {isError && (
        <div className="p-4 text-center text-sm text-red-500">
          Failed to fetch suggestions.
        </div>
      )}

      {flatSuggestions.length > 0
        ? flatSuggestions.map((item) => (
            <div
              key={item.id + item.type}
              className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-green-50 rounded text-sm text-gray-800"
              onMouseDown={() => onSelect(item.label, item.type)} // ✅ pass type too
            >
              <span className="truncate">
                {highlightText(item.label, query)}
              </span>
              <span className="flex items-center text-gray-500 text-xs gap-1">
                <span className="w-1 h-1 rounded-full bg-gray-400 inline-block"></span>
                {item.type}
              </span>
            </div>
          ))
        : !isLoading &&
          !isError && (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found.
            </div>
          )}
    </div>
  );
};

export default SearchSuggestions;
