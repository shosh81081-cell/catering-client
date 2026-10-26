// טיפוסים שתואמים למה שהשרת מחזיר

export type Role = "customer" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Dish {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  ingredients: Ingredient[];
}

// מה ששולחים לשרת ביצירה/עריכה של מנה (בלי _id)
export type DishInput = Omit<Dish, "_id">;

export interface OrderItem {
  dish: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ExtraItem {
  _id?: string;
  name: string;
  amount: number;
  unit: string;
}

export interface Order {
  _id: string;
  user: Pick<User, "_id" | "name" | "email" | "phone">;
  eventName: string;
  eventDate: string;
  guests: number;
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
  deposit: number;
  depositPaid: boolean;
  paymentMethod: string;
  status: string;
  extraItems: ExtraItem[];
  createdAt: string;
}

// מה ששולחים לשרת ביצירת הזמנה
export interface OrderInput {
  eventName: string;
  eventDate: string;
  guests: number;
  address: string;
  notes: string;
  paymentMethod: string;
  items: { dishId: string; quantity: number }[];
}

export interface OrderOptions {
  statuses: string[];
  paymentMethods: string[];
  depositRate: number;
}

export interface ShoppingList {
  orderId: string;
  eventName: string;
  eventDate: string;
  ingredients: Ingredient[];
  extraItems: ExtraItem[];
}
