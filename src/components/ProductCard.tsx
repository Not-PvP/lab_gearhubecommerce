import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-info">
        <h2>{product.name}</h2>

        <p>{product.category}</p>

        <p>₱{product.price}</p>

        <p>{product.inStock ? "In Stock" : "Out of Stock"}</p>

        <button>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;