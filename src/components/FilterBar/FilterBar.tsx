import React, { useState } from "react";
import "./FilterBar.css";
import { useCard } from "../../state/CardContext";

const sortOptions = [
  { value: "default", label: "Popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const FilterBar: React.FC = () => {
  const { state, dispatch } = useCard();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortBy = state.filters.sortBy;

  const handleSortSelect = (value: string) => {
    dispatch({
      type: "SET_SORT",
      payload: value as "default" | "price-asc" | "price-desc",
    });
    setIsSortOpen(false);
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ?? "Popular";

  const sliderValue =
  state.filters.maxPrice === Infinity
    ? 200000
    : state.filters.maxPrice;

  const progress = (sliderValue / 200000) * 100;

  return (
    <div className="filter-bar">
      <button
        className="filter-button"
        onClick={() => setIsFilterOpen((prev) => !prev)}
      >
        <img src="/images/filter.svg" alt="" aria-hidden="true" />
        Filter
      </button>

      <div className="sort-wrap">
        <button
          className="sort-button"
          onClick={() => setIsSortOpen((prev) => !prev)}
        >
          Sort: {currentSortLabel}
          <img
            src="/images/arrow-down.svg"
            alt=""
            aria-hidden="true"
            className={`sort-icon ${isSortOpen ? "open" : ""}`}
          />
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
              value={sliderValue}
              onChange={(e) =>
                dispatch({
                  type: "SET_MAX_PRICE",
                  payload: Number(e.target.value),
                })
              }
              style={
                {
                  "--progress": `${progress}%`,
                } as React.CSSProperties
              }
            />
            <p className="filter-panel-value">
              ₱{(state.filters.maxPrice === Infinity ? 200000 : state.filters.maxPrice).toLocaleString()}
            </p>
          </div>

          <div className="filter-panel-actions">
            <button
              className="filter-panel-clear"
              onClick={() => dispatch({ type: "SET_MAX_PRICE", payload: Infinity })}
            >
              Reset
            </button>
            <button
              className="filter-panel-apply"
              onClick={() => setIsFilterOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;