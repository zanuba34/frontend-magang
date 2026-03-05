<template>
  <div class="auth-wrapper">
    <!-- ✅ tombol balik dashboard pojok kanan atas (tanpa ubah fungsi login) -->
    <button class="dashboardBtn" type="button" @click="goDashboard">« Dashboard</button>

    <div class="auth-card" :class="{ leaving }">
      <img src="../assets/edukaryaopening.png" class="logo" alt="Edukarya" />

      <h2>Login</h2>

      <div class="form">
        <input v-model.trim="email" type="email" placeholder="Email" />

        <!-- PASSWORD -->
        <div class="pw-wrap">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
          />

          <button
            type="button"
            class="pw-eye"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8" />
              <path d="M1 1l22 22" />
            </svg>
          </button>
        </div>

        <button class="btn" @click="submit" :disabled="loading">
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>

        <p class="switch">
          Belum punya akun?
          <span @click="goRegister">Register</span>
        </p>
      </div>
    </div>

    <!-- ✅ toast sukses -->
    <div class="toast" :class="{ show: toast }">
      Login berhasil ✅
    </div>

    <!-- ✅ MODAL NOTIFIKASI (error/info) -->
    <div
      class="modal-backdrop"
      v-if="modal.show"
      @click.self="closeModal"
      aria-hidden="true"
    >
      <div class="modal-card" :class="{ pop: modal.show }" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="modal-icon" :class="modal.type">
            <span v-if="modal.type === 'error'">!</span>
            <span v-else>i</span>
          </div>
          <div class="modal-title">
            {{ modal.title }}
          </div>

          <button class="modal-x" type="button" @click="closeModal" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          {{ modal.message }}
        </div>

        <div class="modal-actions">
          <button class="modal-btn" type="button" @click="closeModal">
            Oke
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { login } from "../services/auth.js"

const router = useRouter()
const email = ref("")
const password = ref("")
const loading = ref(false)
const toast = ref(false)
const leaving = ref(false)
const showPassword = ref(false)

// ✅ modal state
const modal = reactive({
  show: false,
  type: "error", // "error" | "info"
  title: "Login Gagal",
  message: ""
})

const goRegister = () => router.push("/register")
const goDashboard = () => router.push("/") // ✅ dipakai tombol dashboard

function openModal(message, opts = {}) {
  modal.type = opts.type || "error"
  modal.title = opts.title || (modal.type === "error" ? "Login Gagal" : "Informasi")
  modal.message = message || "Terjadi kesalahan. Silakan coba lagi."
  modal.show = true
}

function closeModal() {
  modal.show = false
}

// ✅ rapihin teks error
function normalizeErrorMessage(errMsg = "") {
  const msg = String(errMsg || "").toLowerCase()

  // mapping umum (buat berbagai kemungkinan dari backend)
  if (!email.value && !password.value) {
    return "Email dan password wajib diisi."
  }
  if (!email.value) {
    return "Email wajib diisi."
  }
  if (!password.value) {
    return "Password wajib diisi."
  }

  if (msg.includes("not found") || msg.includes("tidak terdaftar") || msg.includes("user not found")) {
    return "Akun tidak ditemukan. Pastikan email sudah terdaftar."
  }
  if (
    msg.includes("password") ||
    msg.includes("invalid credentials") ||
    msg.includes("unauthorized") ||
    msg.includes("salah")
  ) {
    return "Email atau password salah. Silakan coba lagi."
  }

  // fallback
  return "Login gagal. Periksa kembali data yang kamu masukkan."
}

const submit = async () => {
  // ✅ validasi rapi sebelum request (tanpa ubah fungsi login)
  const emailVal = email.value?.trim()
  const passVal = password.value

  if (!emailVal && !passVal) return openModal("Email dan password wajib diisi.")
  if (!emailVal) return openModal("Email wajib diisi.")
  if (!passVal) return openModal("Password wajib diisi.")

  // validasi format email sederhana
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)
  if (!emailOk) return openModal("Format email tidak valid. Contoh: nama@email.com")

  loading.value = true
  try {
    const res = await login(email.value, password.value)
    toast.value = true
    leaving.value = true

    const role = res?.user?.role
    setTimeout(() => {
      if (role === "SUPER_ADMIN") return router.push("/superadmin")
      if (role === "ADMIN") return router.push("/admin-dashboard")
      return router.push("/applicant")
    }, 450)
  } catch (e) {
    openModal(normalizeErrorMessage(e?.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== SAMA PERSIS KAYAK REGISTER ===== */
.auth-wrapper{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background: linear-gradient(rgba(40,80,200,.92), rgba(40,80,200,.92)), url('../assets/poto.png');
  background-size:cover;
  background-position:center;
  position: relative;
  padding: 18px;
  box-sizing: border-box;
}

/* ✅ tombol dashboard pojok kanan atas */
.dashboardBtn{
  position: absolute;
  top: 20px;
  right: 24px;
  background: #ffffff;
  color: #3C59C1;
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transition: 0.2s ease;
  z-index: 5;
}
.dashboardBtn:hover{
  transform: translateY(-2px);
}
@media (max-width:600px){
  .dashboardBtn{
    top: 16px;
    right: 16px;
    padding: 7px 12px;
    font-size: 12px;
  }
}

.auth-card{
  width: min(420px, 92vw);
  background:white;
  padding: 34px;
  box-sizing: border-box;
  border-radius: 22px;
  box-shadow: 0 25px 60px rgba(0,0,0,.25);
  text-align:center;
  animation: pop .6s cubic-bezier(.2,.9,.2,1);
}

@keyframes pop{
  from{opacity:0; transform: translateY(40px) scale(.95);}
  to{opacity:1; transform: translateY(0) scale(1);}
}

.auth-card.leaving{
  animation: out .45s ease forwards;
}
@keyframes out{
  from{opacity:1; transform: translateY(0) scale(1);}
  to{opacity:0; transform: translateY(20px) scale(.98);}
}

.logo{
  width: 160px;
  margin: 0 auto 18px;
  display:block;
}

h2{
  color:#3C59C1;
  margin: 0 0 16px;
  font-weight: 900;
}

.form{
  margin-top: 8px;
}

input{
  width:100%;
  box-sizing: border-box;
  padding: 12px 14px;
  margin-bottom: 12px;
  border-radius: 14px;
  border:1px solid rgba(0,0,0,.14);
  font-size:14px;
  background: rgba(245,248,255,.9);
  font-weight: 700;
}

input:focus{
  outline:none;
  border-color:#3C59C1;
}

.btn{
  width:100%;
  padding: 12px 14px;
  background:#3C59C1;
  color:white;
  border:none;
  border-radius: 999px;
  font-weight: 900;
  cursor:pointer;
  transition:.2s;
  margin-top: 4px;
}

.btn:hover{ transform: translateY(-2px); }
.btn:disabled{ opacity:.7; cursor:not-allowed; }

.switch{
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,.65);
}

.switch span{
  color:#3C59C1;
  font-weight: 900;
  cursor:pointer;
}

.toast{
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  background: #fff;
  color: #3C59C1;
  padding: 12px 16px;
  border-radius: 14px;
  box-shadow: 0 14px 35px rgba(0,0,0,.18);
  transition: .28s ease;
  font-weight: 900;
  z-index: 50;
}

.toast.show{
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ===== PASSWORD WRAPPER (SAMA) ===== */
.pw-wrap{
  position: relative;
}
.pw-wrap input{
  padding-right: 44px;
}
.pw-eye{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0,0,0,.45);
  padding: 6px;
  border-radius: 10px;
}
.pw-eye:hover{
  color:#3C59C1;
  background: rgba(60,89,193,.08);
}

/* ===== MODAL ===== */
.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 18px;
  z-index: 80;
}

.modal-card{
  width: min(420px, 94vw);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 25px 70px rgba(0,0,0,.28);
  transform: translateY(14px) scale(.96);
  opacity: 0;
  animation: modalPop .22s ease forwards;
}

@keyframes modalPop{
  from{ opacity:0; transform: translateY(16px) scale(.96); }
  to{ opacity:1; transform: translateY(0) scale(1); }
}

.modal-head{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 16px 16px 10px;
}

.modal-icon{
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: 900;
  color: #fff;
  background: #3C59C1;
  flex: 0 0 auto;
}
.modal-icon.error{
  background: #e74c3c;
}

.modal-title{
  font-weight: 900;
  color: rgba(0,0,0,.8);
  font-size: 15px;
  flex: 1;
}

.modal-x{
  border:none;
  background: transparent;
  cursor:pointer;
  font-size: 16px;
  color: rgba(0,0,0,.45);
  padding: 6px 8px;
  border-radius: 10px;
}
.modal-x:hover{
  background: rgba(0,0,0,.06);
  color: rgba(0,0,0,.65);
}

.modal-body{
  padding: 0 16px 14px;
  color: rgba(0,0,0,.65);
  font-weight: 700;
  line-height: 1.45;
  font-size: 14px;
}

.modal-actions{
  padding: 0 16px 16px;
  display:flex;
  justify-content:flex-end;
}

.modal-btn{
  background: #3C59C1;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 900;
  cursor:pointer;
  transition: .2s ease;
}
.modal-btn:hover{
  transform: translateY(-1px);
}
</style>