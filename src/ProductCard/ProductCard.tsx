import "./ProductCard.css";

interface Product {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { name, category, price, image, inStock } = product;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={image} alt={name} className="product-card__image" />
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__category">{category}</p>
        <p className="product-card__price">₱{price.toLocaleString()}</p>
        <p
          className={`product-card__stock ${
            inStock ? "product-card__stock--in" : "product-card__stock--out"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      <button className="product-card__button" disabled={!inStock}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;