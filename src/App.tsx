import ProductGrid from "./components/ProductGrid/ProductGrid";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Category from "./components/Category/Category";
import FilterBar from "./components/FilterBar/FilterBar";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Category />
      <FilterBar />
      <ProductGrid />
      <ShoppingCart />
    </div>
  );
}

export default App;