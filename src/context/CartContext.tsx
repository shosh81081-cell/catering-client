// Context לסל ההזמנה: אילו מנות נבחרו ובאיזו כמות
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Dish } from "../types";

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  addItem: (dish: Dish) => void;
  setQuantity: (dishId: string, quantity: number) => void;
  removeItem: (dishId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish._id === dish._id);
      if (existing) {
        return prev.map((i) => (i.dish._id === dish._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const setQuantity = (dishId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.dish._id !== dishId)
        : prev.map((i) => (i.dish._id === dishId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish._id !== dishId));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, addItem, setQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
