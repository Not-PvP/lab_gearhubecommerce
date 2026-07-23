import React from "react";
import "./Navbar.css";


const Navbar: React.FC = () => {
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
          />
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn">
          <img src="/images/user.svg" alt="user" className="navbar-user-icon" />
        </button>

        <button className="navbar-icon-btn">
          <img src="/images/cart.svg" alt="cart" className="navbar-cart-icon" />
          <span className="navbar-cart-badge">3</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;