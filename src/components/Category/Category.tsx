import React from "react";
import "./Category.css";
import { useCard } from "../../state/CardContext";

const categories: string[] = [
  "Mouse",
  "Keyboard",
  "Laptop",
  "Headphones",
  "Cameras",
  "Driving",
  "Monitor",
  "Components",
];

const CategoryPills: React.FC = () => {
  const { state, dispatch } = useCard();
  const activeCategory = state.filters.category;

  const handleClick = (category: string) => {
    dispatch({
      type: "SET_CATEGORY",
      payload: activeCategory === category ? "" : category,
    });
  };

  return (
    <div className="category-pills">
      {categories.map((category) => (
        <button
          key={category}
          className={
            activeCategory === category
              ? "category-pill category-pill-active"
              : "category-pill"
          }
          onClick={() => handleClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;