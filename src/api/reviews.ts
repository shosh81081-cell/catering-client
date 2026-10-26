import { request } from "./client";

export interface Review {
    _id: string;
    name: string;
    rating: number;
    text: string;
    createdAt: string;
}

export const getReviews = () => request<Review[]>("/reviews");

export const createReview = (data: { rating: number; text: string }) =>
    request<Review>("/reviews", { method: "POST", body: JSON.stringify(data) });

export const deleteReview = (id: string) =>
    request<void>(`/reviews/${id}`, { method: "DELETE" });