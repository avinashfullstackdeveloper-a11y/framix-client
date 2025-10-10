// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

type User = {
  uid: string;
  email: string | null;
  username?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement your custom authentication logic here
    // Example: API call to your backend
    console.log("Login attempt:", { email, password });

    // Mock user for now
    setUser({
      uid: "mock-user-id",
      email: email,
    });
  };

  const register = async (email: string, password: string, username: string) => {
    // TODO: Implement your custom registration logic here
    // Example: API call to your backend
    console.log("Register attempt:", { email, password, username });

    // Mock user for now
    setUser({
      uid: "mock-user-id",
      email: email,
      username: username,
    });
  };

  const logout = async () => {
    // TODO: Implement your custom logout logic here
    console.log("Logout");
    setUser(null);
  };

  const googleSignIn = async () => {
    // TODO: Implement your custom Google Sign-In logic here
    console.log("Google sign-in attempt");
    throw new Error("Google Sign-In not implemented yet");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleSignIn }}>
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
