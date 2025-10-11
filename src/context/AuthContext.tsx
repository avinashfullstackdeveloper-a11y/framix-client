// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type User = {
  id: string;
  email: string;
  username?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await authClient.getSession();
        if (result.user) {
          setUser({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.login({
        email,
        password,
      });

      if (!result.success) {
        throw new Error(result.error || result.message || "Login failed");
      }

      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const result = await authClient.register({
        name: username,
        email,
        password,
      });

      if (!result.success) {
        throw new Error(result.error || result.message || "Registration failed");
      }

      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    // TODO: Implement Google Sign-In when configured
    console.log("Google sign-in attempt");
    throw new Error("Google Sign-In not implemented yet");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
