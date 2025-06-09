import "./SearchBar.css";

function SearchBar({ filterText, onFilterChange }) {
  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Buscar productos..."
      value={filterText}
      onChange={(e) => onFilterChange(e.target.value)}
      aria-label="Buscar productos"
    />
  );
}

export { SearchBar };
