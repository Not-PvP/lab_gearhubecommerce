import React, { useState } from "react";
import "./FilterBar.css";

const sortOptions = [
  { value: "default", label: "Popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const FilterBar: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // placeholder local values — wire these to dispatch({ type: "SET_CATEGORY"/"SET_SORT" ... }) later
  const [maxPrice, setMaxPrice] = useState(50000);

  const handleSortSelect = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
    // later: dispatch({ type: "SET_SORT", payload: value })
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ?? "Popular";

  return (
    <div className="filter-bar">
      <button
        className="filter-button"
        onClick={() => setIsFilterOpen((prev) => !prev)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
        Filter
      </button>

      <div className="sort-wrap">
        <button
          className="sort-button"
          onClick={() => setIsSortOpen((prev) => !prev)}
        >
          Sort: {currentSortLabel}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isSortOpen && (
          <div className="sort-menu">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                className={
                  opt.value === sortBy
                    ? "sort-menu-item sort-menu-item-active"
                    : "sort-menu-item"
                }
                onClick={() => handleSortSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="filter-panel">
          <div className="filter-panel-group">
            <p className="filter-panel-label">Max price</p>
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <p className="filter-panel-value">₱{maxPrice.toLocaleString()}</p>
          </div>

          <div className="filter-panel-actions">
            <button
              className="filter-panel-clear"
              onClick={() => setMaxPrice(200000)}
            >
              Clear
            </button>
            <button
              className="filter-panel-apply"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;