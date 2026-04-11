import { useCallback } from 'react';

/**
 * SearchBar component — renders a search input for filtering the file tree.
 */
export default function SearchBar({ value, onChange }) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="search-bar">
      <span className="search-bar-icon">🔍</span>
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search files..."
        value={value}
        onChange={handleChange}
        aria-label="Search files"
      />
      {value && (
        <button
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
