import ProductGrid from "./components/ProductGrid/ProductGrid";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Category from "./components/Category/Category";
import FilterBar from "./components/FilterBar/FilterBar";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import Checkout from "./components/Checkout/Checkout";

function App() {
  return (
    <>
      <Navbar />

      <div className="app">
        <Hero />
        <Category />
        <FilterBar />
        <ProductGrid />
        <ShoppingCart />
        <Checkout />
      </div>
    </>
  );
}

export default App;