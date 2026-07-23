import React, { useState } from "react";
import "./Category.css";

// matches the categories list from your wireframe notes
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
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (category: string) => {
    // toggle off if clicking the same one again
    setActive((prev) => (prev === category ? null : category));
    // later: dispatch({ type: "SET_CATEGORY", payload: category })
  };

  return (
    <div className="category-pills">
      {categories.map((category) => (
        <button
          key={category}
          className={
            active === category
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