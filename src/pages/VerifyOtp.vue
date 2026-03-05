<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <img src="../assets/edukaryaopening.png" class="logo" alt="Edukarya" />

      <h2>Verifikasi OTP</h2>
      <p class="muted">
        Kami sudah mengirim kode OTP ke:
        <b>{{ email }}</b>
      </p>

      <div class="form">
        <!-- OTP BOXES -->
        <div class="otp-wrap">
          <input
            v-for="(_, i) in otpDigits"
            :key="i"
            ref="otpRefs"
            class="otp-box"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="1"
            :value="otpDigits[i]"
            @input="onOtpInput($event, i)"
            @keydown="onOtpKeydown($event, i)"
            @paste="onOtpPaste($event)"
          />
        </div>

        <button class="btn" :disabled="loading || otp.length < 6" @click="submit">
          {{ loading ? "Memverifikasi..." : "Verifikasi" }}
        </button>

        <button class="btn-secondary" :disabled="resendLoading || cooldown > 0" @click="resend">
          <span v-if="cooldown > 0">Kirim ulang OTP ({{ cooldown }}s)</span>
          <span v-else>{{ resendLoading ? "Mengirim..." : "Kirim ulang OTP" }}</span>
        </button>

        <p class="switch">
          Salah email?
          <span @click="goLogin">Kembali ke Login</span>
        </p>
      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div
      v-if="successModal"
      class="modal-overlay"
      @click.self="closeSuccess"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-card">
        <div class="check-wrap" aria-hidden="true">
          <!-- check icon -->
          <svg class="check-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h3>Email berhasil diverifikasi!</h3>
        <p class="modal-muted">Silakan login untuk melanjutkan.</p>

        <button class="btn modal-btn" @click="closeSuccess">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyOtp, resendOtp } from "../services/auth.js";

const route = useRoute();
const router = useRouter();

const email = computed(() => (route.query.email || "").toString());

// state
const otpDigits = ref(["", "", "", "", "", ""]);
const otp = computed(() => otpDigits.value.join(""));
const loading = ref(false);
const resendLoading = ref(false);
const cooldown = ref(0);

let timer = null;

// modal success
const successModal = ref(false);
let successTimeout = null;

// refs for inputs
const otpRefs = ref([]);

function showError(msg) {
  alert(msg || "Terjadi kesalahan");
}

function startCooldown(sec = 60) {
  cooldown.value = sec;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0) {
      clearInterval(timer);
      timer = null;
      cooldown.value = 0;
    }
  }, 1000);
}

function focusIndex(i) {
  nextTick(() => {
    const el = otpRefs.value?.[i];
    el?.focus?.();
    el?.select?.();
  });
}

function onlyDigit(ch) {
  return (ch || "").replace(/\D/g, "");
}

function onOtpInput(e, i) {
  const v = onlyDigit(e.target.value);
  otpDigits.value[i] = v ? v[0] : "";

  if (v && i < 5) focusIndex(i + 1);
}

function onOtpKeydown(e, i) {
  if (e.key === "Backspace") {
    if (otpDigits.value[i]) {
      otpDigits.value[i] = "";
      return;
    }
    if (i > 0) {
      otpDigits.value[i - 1] = "";
      focusIndex(i - 1);
    }
  }

  if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
  if (e.key === "ArrowRight" && i < 5) focusIndex(i + 1);
}

function onOtpPaste(e) {
  const text = onlyDigit(e.clipboardData?.getData("text") || "");
  if (!text) return;

  e.preventDefault();
  const chars = text.slice(0, 6).split("");
  otpDigits.value = Array.from({ length: 6 }, (_, idx) => chars[idx] || "");
  focusIndex(Math.min(chars.length, 6) - 1);
}

/**
 * Suara "centang/ding" tanpa file audio (Web Audio API)
 * Note: butuh user gesture biasanya sudah aman karena dipanggil setelah klik "Verifikasi".
 */
function playSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const gain = ctx.createGain();

    o1.type = "sine";
    o2.type = "triangle";

    // nada ding (dua tone naik)
    const now = ctx.currentTime;
    o1.frequency.setValueAtTime(880, now); // A5
    o2.frequency.setValueAtTime(1320, now); // E6

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    o1.connect(gain);
    o2.connect(gain);
    gain.connect(ctx.destination);

    o1.start(now);
    o2.start(now);

    o1.stop(now + 0.26);
    o2.stop(now + 0.26);

    // tutup context biar gak leak
    setTimeout(() => ctx.close?.(), 350);
  } catch (e) {
    // kalau browser blok / error, skip aja
  }
}

function openSuccess() {
  successModal.value = true;
  playSuccessSound();

  // OPTIONAL auto redirect (hapus kalau gak mau)
  if (successTimeout) clearTimeout(successTimeout);
  successTimeout = setTimeout(() => {
    closeSuccess();
  }, 5000);
}

function closeSuccess() {
  successModal.value = false;
  if (successTimeout) {
    clearTimeout(successTimeout);
    successTimeout = null;
  }
  router.push("/login");
}

const submit = async () => {
  if (!email.value) return showError("Email tidak ditemukan");
  if (otp.value.length < 6) return showError("OTP harus 6 digit");

  loading.value = true;
  try {
    await verifyOtp(email.value, otp.value);

    // ganti alert jadi modal
    openSuccess();
  } catch (e) {
    showError(e?.response?.data?.message || e.message);
  } finally {
    loading.value = false;
  }
};

const resend = async () => {
  if (!email.value) return showError("Email tidak ditemukan");

  resendLoading.value = true;
  try {
    await resendOtp(email.value);
    startCooldown(60);
    alert("OTP baru dikirim.");
    otpDigits.value = ["", "", "", "", "", ""];
    focusIndex(0);
  } catch (e) {
    showError(e?.response?.data?.message || e.message);
  } finally {
    resendLoading.value = false;
  }
};

const goLogin = () => router.push("/login");

onMounted(() => {
  startCooldown(60);
  focusIndex(0);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
  if (successTimeout) clearTimeout(successTimeout);
});
</script>

<style scoped>
/* samain dengan Register.vue */
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

.logo{
  width: 160px;
  margin: 0 auto 18px;
  display:block;
}

h2{
  color:#3C59C1;
  margin: 0 0 10px;
  font-weight: 900;
}

.muted{
  color: rgba(0,0,0,.55);
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 14px;
}

/* form */
.form{
  margin-top: 8px;
}

/* OTP boxes */
.otp-wrap{
  display:flex;
  justify-content:center;
  gap:10px;
  margin: 10px 0 14px;
}

.otp-box{
  width: 46px;
  height: 52px;
  text-align:center;
  font-size: 18px;
  font-weight: 900;
  border-radius: 14px;
  border:1px solid rgba(0,0,0,.14);
  background: rgba(245,248,255,.9);
  box-sizing: border-box;
}

.otp-box:focus{
  outline:none;
  border-color:#3C59C1;
  box-shadow: 0 0 0 4px rgba(60,89,193,.12);
}

/* buttons samain */
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
  margin-top: 6px;
}

.btn:hover{ transform: translateY(-2px); }
.btn:disabled{ opacity:.7; cursor:not-allowed; }

.btn-secondary{
  width:100%;
  padding: 12px 14px;
  margin-top: 10px;
  border: 2px solid #3C59C1;
  border-radius: 999px;
  background: #fff;
  color: #3C59C1;
  font-weight: 900;
  cursor:pointer;
  transition: .2s;
}

.btn-secondary:hover{ transform: translateY(-2px); }
.btn-secondary:disabled{ opacity:.7; cursor:not-allowed; }

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

/* responsive */
@media (max-width: 360px){
  .otp-box{ width: 42px; height: 50px; }
  .otp-wrap{ gap: 8px; }
}

/* =========================
   SUCCESS MODAL (POPUP)
========================= */
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 18px;
  z-index: 9999;
  animation: overlayIn .18s ease;
}

@keyframes overlayIn{
  from{ opacity: 0; }
  to{ opacity: 1; }
}

.modal-card{
  width: min(360px, 92vw);
  background: #fff;
  border-radius: 22px;
  padding: 22px 20px 18px;
  box-shadow: 0 25px 70px rgba(0,0,0,.25);
  text-align:center;
  animation: modalPop .28s cubic-bezier(.2,.9,.2,1);
}

@keyframes modalPop{
  from{ opacity: 0; transform: translateY(14px) scale(.92); }
  to{ opacity: 1; transform: translateY(0) scale(1); }
}

.check-wrap{
  width: 64px;
  height: 64px;
  border-radius: 999px;
  margin: 0 auto 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(60,89,193,.12);
  color: #3C59C1;
  animation: checkPulse .6s ease;
}

@keyframes checkPulse{
  0%{ transform: scale(.85); }
  60%{ transform: scale(1.05); }
  100%{ transform: scale(1); }
}

.check-icon{
  width: 34px;
  height: 34px;
}

.modal-card h3{
  margin: 6px 0 4px;
  color: #3C59C1;
  font-weight: 900;
}

.modal-muted{
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,.55);
}

.modal-btn{
  margin-top: 0;
}
</style>