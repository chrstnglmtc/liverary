import type { User } from "../types/auth";
import { setCurrentUser } from "./authStore";

const LOGIN_URL = import.meta.env.VITE_API_LOGIN;
const SIGNUP_URL = import.meta.env.VITE_API_SIGNUP;
const ME_URL = import.meta.env.VITE_API_ME;

// Fetch full user data with authToken
async function fetchUser(authToken: string): Promise<User> {
  const res = await fetch(ME_URL, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

// ✅ Signup
export async function signup(user: User): Promise<User> {
  const payload = {
    email: user.email,
    password: user.password,
    display_name: user.display_name || user.email.split("@")[0],
  };

  const res = await fetch(SIGNUP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to signup");
  }

  const data = await res.json();
  const authToken = data.authToken;
  if (!authToken) throw new Error("No auth token returned from signup");

  const fullUser = await fetchUser(authToken);
  setCurrentUser({ ...fullUser, token: authToken });
  return { ...fullUser, token: authToken };
}

// ✅ Login
export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to login");
  }

  const data = await res.json();
  const authToken = data.authToken;
  if (!authToken) throw new Error("No auth token returned from login");

  const fullUser = await fetchUser(authToken);
  setCurrentUser({ ...fullUser, token: authToken });
  return { ...fullUser, token: authToken };
}
