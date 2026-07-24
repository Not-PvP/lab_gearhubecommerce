export type Action =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_MAX_PRICE"; payload: number }
  | { type: "SET_SORT"; payload: "default" | "price-asc" | "price-desc" }
  | { type: "TOGGLE_CART"; payload?: boolean }
  | { type: "TOGGLE_ITEM_SELECTED"; payload: string };