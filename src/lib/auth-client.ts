// src/lib/auth-client.ts
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AUTH_API = `${API_URL}/api/auth`;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string; // Profile picture URL
  profilePicture?: string; // Google profile picture fallback
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  error?: string;
}

// Custom auth client
export const authClient = {
  // Register new user
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  },

  // Login user
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // Ensure avatar/profilePicture is included if present
      if (result.user && (result.user.avatar || result.user.profilePicture)) {
        result.user.avatar = result.user.avatar || result.user.profilePicture;
      }
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  },

  // Logout user
  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_API}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Logout failed",
      };
    }
  },

  // Get current session
  getSession: async (): Promise<{ success: boolean; user: User | null }> => {
    try {
      const response = await fetch(`${AUTH_API}/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      
      // Ensure avatar/profilePicture is included if present
      if (result.user && (result.user.avatar || result.user.profilePicture)) {
        result.user.avatar = result.user.avatar || result.user.profilePicture;
      }
      
      return {
        success: result.success,
        user: result.user || null,
      };
    } catch (error) {
      return {
        success: false,
        user: null,
      };
    }
  },
};

// Custom useSession hook
export const useSession = () => {
  const [data, setData] = useState<{ user: User | null } | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setIsPending(true);
    try {
      const result = await authClient.getSession();
      setData({ user: result.user });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch session");
      setData({ user: null });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    data,
    isPending,
    error,
    refetch,
  };
};
