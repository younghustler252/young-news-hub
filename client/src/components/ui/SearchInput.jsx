// components/ui/SearchInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSearchSuggest } from "../../hooks/useSearch";
import SearchSuggestions from "./SearchSuggestion";

const SearchInput = ({ query, setQuery, onSelect, autoFocus = false }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const {
    data: suggestions,
    isLoading,
    isError,
  } = useSearchSuggest(debouncedQuery);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {debouncedQuery && (
        <SearchSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          isError={isError}
          onSelect={onSelect}
        />
      )}
    </div>
  );
};

export default SearchInput;
