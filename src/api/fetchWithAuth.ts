import { getCurrentUser, handleSessionExpired } from "./authStore";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = getCurrentUser();
  const token = user?.token;

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers });

  // 🔐 If unauthorized, clear user and go to login
  if (res.status === 401 || res.status === 403) {
    handleSessionExpired();
    return Promise.reject(new Error("Session expired. Please log in again."));
  }

  return res;
}
