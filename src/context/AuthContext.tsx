// Context שמחזיק את המשתמש המחובר ונגיש מכל קומפוננטה
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, User } from "../types";
import { getMe } from "../api/auth";
import { TOKEN_KEY } from "../api/client";

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean; // true בזמן בדיקת הטוקן בטעינת האתר
  saveLogin: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // בטעינת האתר: אם יש טוקן שמור, בודקים מול השרת מי המשתמש
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const saveLogin = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: user?.role === "admin", loading, saveLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook לשימוש נוח: const { user, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
