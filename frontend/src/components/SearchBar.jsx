import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ searchValue = '', onSearchChange }) => {
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar tareas..."
          value={searchValue}
          onChange={handleChange}
          maxLength={50}
        />
        {searchValue && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
