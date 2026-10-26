import { request } from "./client";
import type { Dish, DishInput } from "../types";

export interface DishFilters {
  search?: string;
  category?: string;
  sort?: "name" | "price" | "-price" | "newest";
}

export const getDishes = (filters: DishFilters = {}) => {
  // הופך אובייקט פילטרים ל- ?search=...&category=...
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  const query = params.toString();
  return request<Dish[]>(`/dishes${query ? `?${query}` : ""}`);
};

export const getDish = (id: string) => request<Dish>(`/dishes/${id}`);

export const getCategories = () => request<string[]>("/dishes/categories");

export const createDish = (dish: DishInput) =>
  request<Dish>("/dishes", { method: "POST", body: JSON.stringify(dish) });

export const updateDish = (id: string, dish: Partial<DishInput>) =>
  request<Dish>(`/dishes/${id}`, { method: "PUT", body: JSON.stringify(dish) });

export const deleteDish = (id: string) => request<void>(`/dishes/${id}`, { method: "DELETE" });
