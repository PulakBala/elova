"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  type ApiUser,
  getStoredToken,
  setStoredToken,
  USER_STORAGE_KEY,
  loginApi,
  registerApi,
  logoutApi,
  fetchUserProfileApi,
} from "@/lib/api";

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }>;
  register: (payload: {
    name: string;
    phone?: string;
    email?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setAuthSession: (token: string, user: ApiUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from storage & verify with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);

          // Restore cached user first for instant UI
          const cachedUser = localStorage.getItem(USER_STORAGE_KEY);
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
            } catch {}
          }

          // Fetch fresh profile from API
          try {
            const profileRes = await fetchUserProfileApi();
            if (profileRes.success && profileRes.data) {
              setUser(profileRes.data);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profileRes.data));
            }
          } catch (err: any) {
            // If token is invalid or expired (401), clear it
            if (err?.status === 401) {
              setStoredToken(null);
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (loginInput: string, passwordInput: string) => {
    try {
      const res = await loginApi({ login: loginInput, password: passwordInput });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return {
        success: false,
        message: res.message || "Invalid credentials",
        errors: res.errors,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Login failed. Please check your credentials.",
        errors: err.data?.errors,
      };
    }
  };

  const register = async (payload: {
    name: string;
    phone?: string;
    email?: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const res = await registerApi(payload);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return {
        success: false,
        message: res.message || "Registration failed",
        errors: res.errors,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Registration failed. Please check the form errors.",
        errors: err.data?.errors,
      };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setToken(null);
      setUser(null);
      setStoredToken(null);
    }
  };

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetchUserProfileApi();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn("Could not refresh profile:", err);
    }
  }, []);

  const setAuthSession = useCallback((newToken: string, newUser: ApiUser) => {
    setToken(newToken);
    setUser(newUser);
    setStoredToken(newToken);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    setAuthSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

