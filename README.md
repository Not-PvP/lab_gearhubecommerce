# GitHub Repository

- GitHub Link: https://github.com/Not-PvP/lab_gearhubecommerce

## Team Members

- Mark Angelo L. Florencio
- Niño Kriebel C. Olmo

## GEARHUB - Mini E-commerce
## Features

- **Product Browsing & Filtering**
  - Product grid rendered from static/mock JSON data
  - Filter by category, max price, and search query
  - Sort by price (low→high, high→low) or by title
- **Global Cart Management**
  - Slide-out cart drawer overlay
  - Add / remove items, adjust quantity with +/-
  - Real-time subtotal and grand total calculation
- **UX Details**
  - Cart icon badge shows total item count (sums quantities, not just line items)

## Tech Stack

- React
- `useReducer` + `createContext` for global state (products, cart, filters, cart-open state)
- Create React App

## State Shape

```ts
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selected: boolean;
}

interface State {
  products: Product[];
  cart: CartItem[];
  filters: {
    searchQuery: string;
    category: string;
    maxPrice: number;
    sortBy: 'default' | 'price-asc' | 'price-desc';
  };
  isCartOpen: boolean;
}
```

## Actions

| Action Type | Payload | Description |
|---|---|---|
| `ADD_TO_CART` | `Product` | Adds item to cart or increments quantity if already present |
| `REMOVE_FROM_CART` | `string` (id) | Removes line item completely from cart |
| `UPDATE_QUANTITY` | `{ id: string; quantity: number }` | Sets specific quantity (removes item if quantity reaches 0) |
| `CLEAR_CART` | `undefined` | Empties the cart array and resets promo code |
| `SET_SEARCH_QUERY` | `string` | Updates search term filter |
| `SET_CATEGORY` | `string` | Filters products by selected category |
| `SET_SORT` | `string` | Updates sorting strategy |
| `TOGGLE_CART` | `boolean` (optional) | Opens or closes the cart drawer |

## Getting Started
### 1. Clone the repo

```bash
git clone https://github.com/Not-PvP/lab_gearhubecommerce.git gearhub
cd gearhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm start
```

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 4. Run tests (optional)

```bash
npm test
```

### 5. Build for production (optional)

```bash
npm run build
```

Bundles the app into the `build/` folder, minified and optimized for deployment.

## Known Limitations

- Checkout is simulated only, no real payment processing.
- Product data such as stocks is static/mock, no live backend.