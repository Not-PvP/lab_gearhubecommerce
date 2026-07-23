import type { Product } from "../types/types";
import "../index.css";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img
        className="product-card-image"
        src={product.image}
        alt={product.name}
      />

      <h2 className="product-card-name">{product.name}</h2>

      <p className="product-card-category">{product.category}</p>

      <p className="product-card-price">₱{product.price}</p>

      <p className="product-card-stock">
        {product.inStock ? "In Stock" : "Out of Stock"}
      </p>

      <button className="product-card-button">Add to Cart</button>
    </div>
  );
}

export default ProductCard;