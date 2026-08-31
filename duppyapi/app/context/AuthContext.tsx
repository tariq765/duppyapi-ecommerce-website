"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
// Simple TypeScript interface for the user object returned by the backend
interface UserResponseSchema {
  id: string;
  name: string;
  email: string;
  role: { id: number; name: string };
  created_at: string;
  updated_at?: string;
}

interface AuthState {
  user: UserResponseSchema | null;
  accessToken: string | null;
  loading: boolean;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponseSchema | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to set auth headers for axios
  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const fetchMe = async (token?: string) => {
    const activeToken = token || accessToken || (typeof window !== 'undefined' ? localStorage.getItem("duppy_access_token") : null);
    if (!activeToken) {
      setUser(null);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  const getErrorMessage = (err: any, fallback: string) => {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
      return detail[0].msg;
    }
    if (typeof detail === "object" && detail !== null && detail.msg) {
      return detail.msg;
    }
    return fallback;
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email, password, rememberMe }
      );
      const token = res.data.access_token;
      setAccessToken(token);
      setAuthHeader(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem("duppy_access_token", token);
      }
      await fetchMe(token);
      toast.success("Logged in");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Login failed"));
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await axios.post(
        `${API_URL}/auth/signup`,
        { name, email, password }
      );
      toast.success("Account created – please log in");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Signup failed"));
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).catch(() => {});
      }
      setUser(null);
      setAccessToken(null);
      setAuthHeader(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem("duppy_access_token");
      }
      toast.success("Logged out");
    } catch (err: any) {
      toast.error("Logout failed");
    }
  };

  const refresh = async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem("duppy_access_token") : null;
      if (storedToken) {
        setAccessToken(storedToken);
        setAuthHeader(storedToken);
        await fetchMe(storedToken);
      }
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      setAuthHeader(null);
    }
  };

  // On mount, try to restore auth state
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem("duppy_access_token") : null;
        if (storedToken) {
          setAccessToken(storedToken);
          setAuthHeader(storedToken);
          await fetchMe(storedToken);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
