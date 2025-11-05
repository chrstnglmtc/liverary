import type { User } from "../types/auth";

let currentUser: User | null = null;

export function setCurrentUser(user: User) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (!currentUser) {
    const saved = localStorage.getItem("currentUser");
    if (saved) currentUser = JSON.parse(saved);
  }
  return currentUser;
}

export function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
}