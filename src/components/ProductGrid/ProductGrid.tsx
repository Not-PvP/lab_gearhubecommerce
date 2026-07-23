import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";
import { useCard } from "../../state/CardContext";

function ProductGrid() {
  const { state } = useCard();
  const { products, filters } = state;
  const { searchQuery, category, maxPrice, sortBy } = filters;

  const filteredProducts = products
    .filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    })
    .filter((product) => (category ? product.category === category : true))
    .filter((product) => product.price <= maxPrice);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="product-grid">
      {sortedProducts.length === 0 ? (
        <p className="product-grid__empty">No products match your filters.</p>
      ) : (
        sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}

export default ProductGrid;
