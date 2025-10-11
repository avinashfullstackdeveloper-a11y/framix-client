// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: `${apiUrl}/api/auth`,
  credentials: "include", // Important: Send cookies with requests
});

export const { signIn, signUp, signOut, useSession } = authClient;
