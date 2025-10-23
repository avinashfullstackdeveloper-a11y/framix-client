// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type User = {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
            username: result.user.name, // Use name as username for display
            role: result.user.role,
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
          username: result.user.name, // Use name as username for display
          role: result.user.role, // Ensure role is set on login
        });
      }
      // Do not use localStorage for user state
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const result = await authClient.register({
        name: username,
        email,
        password,
      });

      if (!result.success) {
        throw new Error(
          result.error || result.message || "Registration failed"
        );
      }

      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          username: result.user.name, // Use name as username for display
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  /**
   * Logs out the user and resets authentication state.
   */
  const logout = async () => {
    try {
      await authClient.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  /**
   * Frontend-only Delete Account workflow.
   * - Clears all user data from localStorage and sessionStorage.
   * - Sets user state to null.
   * - Triggers redirect via protected route logic.
   */
  /**
   * Deletes the user account by calling backend API.
   * - Waits for backend confirmation before clearing local data and logging out.
   * - Handles errors gracefully.
   */
  const deleteAccount = async () => {
    if (!user?.id) throw new Error("User ID not found.");
    try {
      // Call backend DELETE endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/${
          user.id
        }`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete account.");
      }
      // Backend confirmed deletion, clear local data
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  const refetchUser = async () => {
    try {
      const result = await authClient.getSession();
      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          username: result.user.name, // Use name as username for display
          role: result.user.role, // Ensure role is set on refetch
        });
        // Do not use localStorage for user state
      }
    } catch (error) {
      console.error("Failed to refetch user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refetchUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
