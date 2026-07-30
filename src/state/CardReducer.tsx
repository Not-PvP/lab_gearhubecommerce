import { State } from "../types/types";
import { Action } from "./actions";

export const initialState: State = {
  products: [],
  cart: [],
  filters: {
    searchQuery: "",
    category: "",
    maxPrice: Infinity,
    sortBy: "default",
  },
  isCartOpen: false,
};

export function cardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((item) => item.id === action.payload.id);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
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
          item.id === id ? { ...item, quantity } : item,
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
