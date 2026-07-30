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
  selected: boolean;
}

export interface Filters {
  searchQuery: string;
  category: string;
  maxPrice: number;
  sortBy: "default" | "price-asc" | "price-desc";
}

export interface State {
  products: Product[];
  cart: CartItem[];
  filters: Filters;
  isCartOpen: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selected: boolean;
}