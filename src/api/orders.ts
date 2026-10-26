import { request } from "./client";
import type { ExtraItem, Order, OrderInput, OrderOptions, ShoppingList } from "../types";

export const getOrders = (status?: string) =>
  request<Order[]>(`/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`);

export const getOrder = (id: string) => request<Order>(`/orders/${id}`);

export const getOrderOptions = () => request<OrderOptions>("/orders/options");

export const createOrder = (order: OrderInput) =>
  request<Order>("/orders", { method: "POST", body: JSON.stringify(order) });

export const cancelOrder = (id: string) =>
  request<Order>(`/orders/${id}/cancel`, { method: "PATCH" });

// מנהל בלבד
export const updateOrder = (
  id: string,
  data: { status?: string; depositPaid?: boolean; extraItems?: ExtraItem[] }
) => request<Order>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const getShoppingList = (id: string) => request<ShoppingList>(`/orders/${id}/shopping-list`);

export const deleteOrder = (id: string) => request<void>(`/orders/${id}`, { method: "DELETE" });
