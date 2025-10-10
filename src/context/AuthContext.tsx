// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

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
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.username,
            name: session.user.name,
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
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Login failed");
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          name: data.user.name,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: username,
        username,
      });

      if (error) {
        throw new Error(error.message || "Registration failed");
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          name: data.user.name,
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
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
