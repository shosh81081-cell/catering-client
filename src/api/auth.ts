import { request } from "./client";
import type { AuthResponse, User } from "../types";

export const login = (email: string, password: string) =>
  request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const register = (data: { name: string; email: string; phone: string; password: string }) =>
  request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const getMe = () => request<User>("/auth/me");
