import { useCard } from "../../state/CardContext";
import "./ProductCard.css";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCard();
  const { name, price, image, stock } = product;

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={image} alt={name} className="product-card__image" loading="lazy" />
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">₱{price.toLocaleString()}</p>
        {stock > 0 && (
          <p
            className="product-card__stock product-card__stock--in"
          >
            {stock > 5 ? "In Stock" : `Only ${stock} left`}
          </p>
        )}
      </div>

      <button
        className="product-card__button"
        disabled={stock === 0}
        onClick={handleAddToCart}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;