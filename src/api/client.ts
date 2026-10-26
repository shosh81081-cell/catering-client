// פונקציה אחת לכל הקריאות לשרת - מונעת שכפול קוד
// מוסיפה את הטוקן, ממירה ל-JSON וזורקת שגיאה עם ההודעה מהשרת

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const TOKEN_KEY = "token";

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (res.status === 204) return undefined as T; // מחיקה - אין תוכן

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "שגיאה בתקשורת עם השרת");
  return data as T;
}
