import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../pages/Dashboard.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Applicant from "../pages/Applicant.vue"
import SuperAdmin from "../pages/SuperAdmin.vue"
import AdminDashboard from "../pages/AdminDashboard.vue"

import { cachedUser, me } from "../services/auth.js"
import { getToken } from "../services/api.js"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Dashboard },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/verify-otp", component: () => import("../pages/VerifyOtp.vue") },

    { path: "/applicant", component: Applicant, meta: { requiresAuth: true, roles: ["APPLICANT"] } },
    { path: "/admin-dashboard", component: AdminDashboard, meta: { requiresAuth: true, roles: ["ADMIN", "SUPER_ADMIN"] } },
    { path: "/superadmin", component: SuperAdmin, meta: { requiresAuth: true, roles: ["SUPER_ADMIN"] } },
  ],
})

router.beforeEach(async (to) => {
  const needsAuth = !!to.meta?.requiresAuth
  if (!needsAuth) return true

  const token = getToken()
  if (!token) return { path: "/login" }

  let user = cachedUser()
  if (!user) {
    try {
      user = await me()
    } catch (e) {
      return { path: "/login" }
    }
  }

  const roles = to.meta?.roles || []
  if (roles.length && !roles.includes(user?.role)) {
    return { path: "/" }
  }

  return true
})

export default router
