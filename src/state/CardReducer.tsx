import { State, Order, OrderItem } from "../types/types";
import { Action } from "./actions";

const SHIPPING_FEE = 150;

export const initialState: State = {
  products: [],
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

    case "PLACE_ORDER": {
      const selectedItems = state.cart.filter((item) => item.selected);
      if (selectedItems.length === 0) {
        return state;
      }

      const orderItems: OrderItem[] = selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        unitPrice: item.price,
        quantity: item.quantity,
      }));

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );
      const shipping = subtotal > 0 ? SHIPPING_FEE : 0;

      const newOrder: Order = {
        id: action.payload.id,
        items: orderItems,
        subtotal,
        shipping,
        total: subtotal + shipping,
        shippingAddress: action.payload.shippingAddress,
        paymentMethod: action.payload.paymentMethod,
        status: action.payload.status,
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        products: state.products.map((product) => {
          const orderedItem = orderItems.find((item) => item.id === product.id);
          return orderedItem
            ? { ...product, stock: product.stock - orderedItem.quantity }
            : product;
        }),
        orders: [...state.orders, newOrder],
        cart: state.cart.filter((item) => !item.selected),
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