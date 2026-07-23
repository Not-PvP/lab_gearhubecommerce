import React from "react";
import "./Navbar.css";
import { useCard } from "../../state/CardContext";

const Navbar: React.FC = () => {
  const { state, dispatch } = useCard();
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <a className="navbar-logo" href="/" aria-label="GearHub home">
        <span className="navbar-logo-icon"></span>
        <span className="navbar-logo-text-group">
          <span className="navbar-logo-title">GearHub</span>
          <span className="navbar-logo-tagline">Gear Up. Level Up.</span>
        </span>
      </a>

      <div className="navbar-search-wrap">
        <div className="navbar-search-bar">
          <img src="/images/search.svg" alt="search" className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search for gears"
            value={state.filters.searchQuery}
            onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
          />
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn">
          <img src="/images/user.svg" alt="user" className="navbar-user-icon" />
        </button>

        <button
          className="navbar-icon-btn"
          onClick={() => dispatch({ type: "TOGGLE_CART" })}
        >
          <img src="/images/cart.svg" alt="cart" className="navbar-cart-icon" />
          {itemCount > 0 && (
            <span className="navbar-cart-badge">{itemCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;