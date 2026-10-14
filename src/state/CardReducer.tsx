import { State } from "../types/types";
import { Action } from "./actions";


export const initialState: State = {
  products: [],
  productsStatus: "loading",
  productsError: "",
  cart: [],
  orders: [],
  filters: {
    searchQuery: "",
    category: "",
    maxPrice: Infinity,
    sortBy: "default",
  },
  isCartOpen: false,
  isCheckoutOpen: false,
  isOrderHistoryOpen: false,
};

export function cardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART": {
      if (action.payload.stock <= 0) { 
        return state;
      }
      const existing = state.cart.find((item) => item.id === action.payload.id);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item,
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1, selected: true }],
      };
    }

    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item,
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        cart: [],
      };
    }

    case "SET_SEARCH_QUERY": {
      return {
        ...state,
        filters: { ...state.filters, searchQuery: action.payload },
      };
    }

    case "SET_CATEGORY": {
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };
    }

    case "SET_MAX_PRICE": {
      return {
        ...state,
        filters: { ...state.filters, maxPrice: action.payload },
      };
    }

    case "SET_SORT": {
      return {
        ...state,
        filters: { ...state.filters, sortBy: action.payload },
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        isCartOpen:
          action.payload !== undefined ? action.payload : !state.isCartOpen,
      };
    }

    case "TOGGLE_CHECKOUT": {
      return {
        ...state,
        isCheckoutOpen:
          action.payload !== undefined ? action.payload : !state.isCheckoutOpen,
      };
    }

    case "TOGGLE_ORDER_HISTORY": {
      return {
        ...state,
        isOrderHistoryOpen:
          action.payload !== undefined ? action.payload : !state.isOrderHistoryOpen,
      };
    }

    case "SET_PRODUCTS": {
      return { ...state, products: action.payload, productsStatus: "ready", productsError: "" };
    }

    case "SET_PRODUCTS_STATUS": {
      return {
        ...state,
        productsStatus: action.payload.status,
        productsError: action.payload.error ?? "",
      };
    }

    case "SET_ORDERS": {
      return { ...state, orders: action.payload };
    }

    case "PLACE_ORDER": {
      // the backend already validated stock and saved the order; mirror it locally
      const order = action.payload;
      const orderedQty = new Map(order.items.map((item) => [item.id, item.quantity]));

      return {
        ...state,
        products: state.products.map((product) =>
          orderedQty.has(product.id)
            ? { ...product, stock: Math.max(0, product.stock - orderedQty.get(product.id)!) }
            : product,
        ),
        orders: [order, ...state.orders.filter((existing) => existing.id !== order.id)],
        cart: state.cart.filter((item) => !orderedQty.has(item.id)),
        isCheckoutOpen: true,
        isCartOpen: false,
      };
    }

    case "TOGGLE_ITEM_SELECTED": {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, selected: !item.selected }
            : item,
        ),
      };
    }

    default:
      return state;
  }
}