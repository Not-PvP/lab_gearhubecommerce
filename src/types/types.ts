export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface State {
  products: Product[];
  cart: CartItem[];
  filters: {
    searchQuery: string;
    category: string;
    maxPrice: number;
    sortBy: "default" | "price-asc" | "price-desc";
  };
  isCartOpen: boolean;
}