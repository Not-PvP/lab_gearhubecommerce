import { Product } from "../types/types";

export type Action =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string } // payload is product id
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" };