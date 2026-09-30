/* eslint-disable react-refresh/only-export-components */
<<<<<<< HEAD
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  authenticate,
  getAuthenticationErrorMessage,
  type AuthenticatedUser,
} from "../services/api/auth";
=======
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "../types";
import api from "../services/api/api";

interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

interface LoginResponse {
  accessToken: string;
  user: SessionUser;
}

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "matrixflow_session";
const TOKEN_KEY = "matrixflow_token";
<<<<<<< HEAD
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthenticatedUser | null {
  if (!window.localStorage.getItem(TOKEN_KEY)) return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthenticatedUser;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: async (email, password) => {
      try {
        const session = await authenticate(email, password);
        window.localStorage.setItem(TOKEN_KEY, session.accessToken);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session.user));
        setUser(session.user);
      } catch (error) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        throw new Error(getAuthenticationErrorMessage(error), { cause: error });
      }
    },
    logout: () => {
      setUser(null);
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(STORAGE_KEY);
    },
  }), [user]);
=======

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as SessionUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

      login: async (email, password) => {
        try {
          const response = await api.post<LoginResponse>("/auth/login", {
            email,
            password,
          });

          const { accessToken, user } = response.data;

          window.localStorage.setItem(TOKEN_KEY, accessToken);
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(user)
          );

          setUser(user);
        } catch (error: any) {
          const detail = error?.response?.data?.detail;

          throw new Error(
            typeof detail === "string"
              ? detail
              : "No se pudo iniciar sesión."
          );
        }
      },

      logout: () => {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}