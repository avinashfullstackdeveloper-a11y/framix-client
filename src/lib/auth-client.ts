// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
