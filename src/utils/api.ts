// Client for the GearHub REST API (backend/, Express + Prisma on port 5000).
import { Order, PaymentMethod, Product, ShippingAddress } from "../types/types";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Shape the backend sends for a product (snake_case, numeric id).
interface ApiProduct {
  id: number;
  name: string;
  category: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    // fetch only rejects when the server can't be reached at all
    throw new Error(`Can't reach the GearHub server at ${API_URL}. Is the backend running?`);
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return body as T;
}

const toProduct = (p: ApiProduct): Product => ({
  id: String(p.id),
  name: p.name,
  category: p.category ?? "",
  price: p.price,
  image: p.image_url ?? "",
  stock: p.stock_quantity,
});

export async function fetchProducts(): Promise<Product[]> {
  const products = await request<ApiProduct[]>("/api/products");
  return products.map(toProduct);
}

export interface NewOrder {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: "PENDING" | "PAID";
}

export function createOrder(order: NewOrder): Promise<Order> {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function fetchOrders(ids: string[]): Promise<Order[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return request<Order[]>(`/api/orders?ids=${ids.map(encodeURIComponent).join(",")}`);
}

// Guests don't have accounts yet, so this browser remembers which orders it placed.
const ORDER_IDS_KEY = "gearhub:orderIds";

export function getSavedOrderIds(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_IDS_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.map(String) : [];
  } catch {
    return [];
  }
}

export function saveOrderId(id: string) {
  try {
    const ids = getSavedOrderIds().filter((existing) => existing !== id);
    localStorage.setItem(ORDER_IDS_KEY, JSON.stringify([id, ...ids].slice(0, 100)));
  } catch {
    // storage can be unavailable (private mode); history just won't survive a refresh
  }
}
