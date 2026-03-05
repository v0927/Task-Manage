import React, { useState, useEffect } from 'react';
import '../styles/FilterBar.css';

const FilterBar = ({ onFiltersChange, initialFilters = { category: '', status: '' } }) => {
  const [filters, setFilters] = useState(initialFilters);

  // Sincronizar cuando los filtros iniciales cambien
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleCategoryChange = (e) => {
    const newFilters = { ...filters, category: e.target.value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (e) => {
    const newFilters = { ...filters, status: e.target.value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { category: '', status: '' };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const isFiltered = filters.category !== '' || filters.status !== '';

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category-select">📁 Categoría</label>
          <select
            id="category-select"
            className="filter-select"
            value={filters.category}
            onChange={handleCategoryChange}
          >
            <option value="">Todas las categorías</option>
            <option value="Estudio">Estudio</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-select">✓ Estado</label>
          <select
            id="status-select"
            className="filter-select"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        {isFiltered && (
          <button
            className="btn-clear-filters"
            onClick={handleClearFilters}
            title="Limpiar todos los filtros"
          >
            ✕ Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
