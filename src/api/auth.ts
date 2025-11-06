import type { User } from "../types/auth";
import { setCurrentUser } from "./authStore";

const LOGIN_URL = import.meta.env.VITE_API_LOGIN!;
const SIGNUP_URL = import.meta.env.VITE_API_SIGNUP!;
const ME_URL = import.meta.env.VITE_API_ME!;

async function fetchUser(authToken: string): Promise<User> {
  const res = await fetch(ME_URL, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) {
    const text = await res.text(); // for debugging
    throw new Error(`Failed to fetch user data: ${text}`);
  }

  return res.json();
}

export async function signup(user: User): Promise<User> {
  const res = await fetch(SIGNUP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
      display_name: user.display_name || user.email.split("@")[0],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to signup");
  }

  const { authToken } = await res.json();
  if (!authToken) throw new Error("No auth token returned from signup");

  const fullUser = await fetchUser(authToken);
  setCurrentUser({ ...fullUser, token: authToken });
  return { ...fullUser, token: authToken };
}

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

  const { authToken } = await res.json();
  if (!authToken) throw new Error("No auth token returned from login");

  const fullUser = await fetchUser(authToken);
  setCurrentUser({ ...fullUser, token: authToken });
  return { ...fullUser, token: authToken };
}
