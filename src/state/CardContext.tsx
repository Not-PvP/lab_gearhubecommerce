import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { cardReducer, initialState } from "./CardReducer";
import { Action } from "./actions";
import { State } from "../types/types";
import productsData from "../utils/mockProduct.json";

interface CardContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function CardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardReducer, {
    ...initialState,
    products: productsData as State["products"],
  });

  return (
    <CardContext.Provider value={{ state, dispatch }}>
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