// src/services/auth.js
import { api, setAuth, clearAuth, getCachedUser } from "./api.js";

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  setAuth(res);
  return res;
}

export async function register(email, password) {
  const res = await api.post("/api/auth/register", { email, password });
  // Do NOT set token on register; user must verify OTP first
  return res.data;
}

export async function me() {
  const res = await api.get("/api/auth/me");
  // res.user includes profile/application
  const user = res.user || null;
  if (user) setAuth({ token: null, user });
  return user;
}

export function logout() {
  clearAuth();
}

export async function verifyOtp(email, otp) {
  const res = await api.post("/api/auth/verify-otp", { email, otp });
  return res.data;
}

export async function resendOtp(email) {
  const res = await api.post("/api/auth/resend-otp", { email });
  return res.data;
}

export function cachedUser() {
  return getCachedUser();
}
