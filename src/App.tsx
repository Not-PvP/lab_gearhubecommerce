import products from "./utils/mockProduct.json";
import ProductCard from "./components/ProductCard";

function App() {
  return (
    <div>
      <ProductCard product={products[0]} />
    </div>
  );
}

export default App;