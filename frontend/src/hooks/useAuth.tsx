/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "../types";

interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "matrixflow_session";
const AuthContext = createContext<AuthContextValue | null>(null);

const demoUsers: Record<string, { password: string; user: SessionUser }> = {
  "admin@matrixflow.pe": { password: "demo123", user: { name: "Ana Torres", email: "admin@matrixflow.pe", role: "Administrador" } },
  "analista@matrixflow.pe": { password: "demo123", user: { name: "Luis Mendoza", email: "analista@matrixflow.pe", role: "Analista" } },
  "consulta@matrixflow.pe": { password: "demo123", user: { name: "Carla Rojas", email: "consulta@matrixflow.pe", role: "Consulta" } },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored) as SessionUser; } catch { return null; }
  });

  useEffect(() => {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: async (email, password) => {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      const account = demoUsers[email.toLowerCase()];
      if (!account || account.password !== password) throw new Error("Correo o contraseña incorrectos.");
      setUser(account.user);
      window.localStorage.setItem("matrixflow_token", "demo-token-phase-1");
    },
    logout: () => {
      setUser(null);
      window.localStorage.removeItem("matrixflow_token");
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
