// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setAuth({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCachedUser() {
  const raw = localStorage.getItem("user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

async function parseResponse(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  return await res.blob();
}

export async function apiRequest(path, { method="GET", body=null, headers={}, isForm=false, expectBlob=false } = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const token = getToken();
  const h = { ...headers };

  if (token) h["Authorization"] = `Bearer ${token}`;

  let payload = body;
  if (body && !isForm && !(body instanceof Blob)) {
    h["Content-Type"] = h["Content-Type"] || "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers: h,
    body: ["GET","HEAD"].includes(method.toUpperCase()) ? undefined : payload,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (expectBlob) return await res.blob();
  return await parseResponse(res);
}

export const api = {
  get: (path, opts={}) => apiRequest(path, { ...opts, method: "GET" }),
  post: (path, body, opts={}) => apiRequest(path, { ...opts, method: "POST", body }),
  put: (path, body, opts={}) => apiRequest(path, { ...opts, method: "PUT", body }),
  del: (path, opts={}) => apiRequest(path, { ...opts, method: "DELETE" }),
};
