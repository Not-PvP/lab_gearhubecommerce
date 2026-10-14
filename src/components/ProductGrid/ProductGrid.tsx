import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";
import { useCard } from "../../state/CardContext";

function ProductGrid() {
  const { state, reloadProducts } = useCard();
  const { products, filters, productsStatus, productsError } = state;
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
    if (a.stock === 0 && b.stock > 0) return 1;
    if (a.stock > 0 && b.stock === 0) return -1;
    
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  if (productsStatus === "loading") {
    return (
      <div className="product-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 10 }, (_, index) => (
          <div className="product-grid__skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (productsStatus === "error") {
    return (
      <div className="product-grid__status" role="alert">
        <p className="product-grid__status-title">Couldn't load products</p>
        <p className="product-grid__status-text">{productsError}</p>
        <button className="product-grid__retry" onClick={reloadProducts}>
          Try again
        </button>
      </div>
    );
  }

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
