import { createContext, useCallback, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("fk_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const auth = await authService.login(email, password);
      const sessionUser = {
        id: auth.userId,
        name: auth.name,
        email: auth.email,
        role: auth.role,
      };
      localStorage.setItem("fk_token", auth.token);
      localStorage.setItem("fk_user", JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      await authService.register(name, email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fk_token");
    localStorage.removeItem("fk_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
