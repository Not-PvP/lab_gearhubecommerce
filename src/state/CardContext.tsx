import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { cardReducer, initialState } from "./CardReducer";
import { Action } from "./actions";
import { State } from "../types/types";
import { fetchOrders, fetchProducts, getSavedOrderIds } from "../utils/api";

interface CardContextValue {
  state: State;
  dispatch: Dispatch<Action>;
  reloadProducts: () => void;
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function CardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  const reloadProducts = useCallback(() => {
    dispatch({ type: "SET_PRODUCTS_STATUS", payload: { status: "loading" } });
    fetchProducts()
      .then((products) => dispatch({ type: "SET_PRODUCTS", payload: products }))
      .catch((error: Error) =>
        dispatch({ type: "SET_PRODUCTS_STATUS", payload: { status: "error", error: error.message } }),
      );
  }, []);

  useEffect(() => {
    reloadProducts();

    // restore this browser's past orders from the database
    fetchOrders(getSavedOrderIds())
      .then((orders) => dispatch({ type: "SET_ORDERS", payload: orders }))
      .catch((error) => console.error("Failed to load order history:", error));
  }, [reloadProducts]);

  return (
    <CardContext.Provider value={{ state, dispatch, reloadProducts }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCard() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
}
