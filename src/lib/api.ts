// Shared API helper for frontend (admin and shared code)
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const apiUrl =
    url.startsWith("/api")
      ? `${import.meta.env.VITE_API_URL}${url}`
      : url;
  const res = await fetch(apiUrl, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    let message = "API error";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore JSON parse error for error message
    }
    throw new Error(message);
  }
  return res.json();
}