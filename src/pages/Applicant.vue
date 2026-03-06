<template>
  <div class="wrap" :class="{ leaving }">
    <!-- TOPBAR -->
    <header class="top">
      <div class="brand">
        <img src="../assets/edukarya.png" class="brandLogo" alt="Edukarya" />
      </div>

      <div class="right">
        <span class="user">{{ user.email }} • APPLICANT</span>
        <button class="logout" @click="doLogout">Log out</button>
      </div>
    </header>

    <!-- MAIN -->
    <main class="container">
      <section class="heroCard enter">
        <h1>Dashboard Pendaftar</h1>
        <p>Pantau status pendaftaran kamu.</p>
      </section>

      <section class="grid">
        <!-- STATUS CARD -->
        <div class="card enter delay1">
          <div class="kv">
            <div class="k">Nama</div>
            <div class="v">{{ profile.name || "-" }}</div>
          </div>

          <div class="kv">
            <div class="k">Email</div>
            <div class="v">{{ user.email }}</div>
          </div>

          <div class="kv">
            <div class="k">Status</div>
            <div class="v row">
              <span class="badge" :class="statusClass">{{ statusText }}</span>
              <span v-if="profile.divisi" class="badge ghost">{{ profile.divisi }}</span>
            </div>
          </div>

          <button
            v-if="status === 'BELUM_DAFTAR'"
            class="primary"
            @click="openForm"
          >
            Isi Data Diri
          </button>

          <button
            v-else
            class="primary disabled"
            disabled
            title="Sudah submit"
          >
            Sudah submit, tunggu review
          </button>
        </div>

        <!-- INFO CARD -->
        <div class="card enter delay2">
          <h3>Info</h3>
          <ul class="info">
            <li>CV wajib PDF max 5MB.</li>
            <li>Status awal PENDING.</li>
            <li>Dilarang memalsukan CV</li>
          </ul>
        </div>
      </section>
    </main>

    <!-- MODAL FORM -->
    <div class="modalBackdrop" :class="{ show: formOpen }" @click="closeForm"></div>

    <div class="modal" :class="{ show: formOpen, out: formClosing }" @click.stop>
      <div class="modalHead">
        <h2>Isi Data Diri</h2>
        <button class="x" @click="closeForm">✕</button>
      </div>

      <div class="form">
        <div class="field">
          <label>Nama Lengkap</label>
          <input v-model="draft.name" type="text" placeholder="Nama kamu" />
        </div>

        <div class="field">
          <label>Universitas</label>
          <input v-model="draft.univ" type="text" placeholder="Nama universitas" />
        </div>

        <div class="field">
          <label>No. WhatsApp</label>
          <input v-model="draft.wa" type="text" placeholder="08xxxxxxxxxx" />
        </div>

        <div class="field">
          <label>Semester</label>
          <input v-model="draft.semester" type="number" min="1" max="14" placeholder="contoh: 5" />
        </div>

        <div class="field full">
          <label>Divisi</label>
          <select v-model="draft.divisi">
            <option value="" disabled>Pilih divisi</option>
            <option>HR</option>
            <option>Content Management</option>
            <option>Marketing</option>
            <option>Event Organizer</option>
            <option>Design</option>
            <option>Talent</option>
            <option>Videographer</option>
            <option>IT</option>
          </select>
        </div>

        <div class="field full">
          <label>Upload Portofolio (PDF max 5MB)</label>
          <input type="file" accept="application/pdf" @change="onPickPdf" />
          <small v-if="draft.pdfName" class="hint">
            Terpilih: <b>{{ draft.pdfName }}</b>
          </small>
        </div>

        <div class="field full">
          <label>Screenshot Bukti Follow IG Edukarya (JPG/PNG max 3MB)</label>
          <input type="file" accept="image/*" @change="onPickFollow" />
          <small v-if="draft.followName" class="hint">
            Terpilih: <b>{{ draft.followName }}</b>
          </small>
        </div>

        <div class="actions">
          <!-- ✅ FIX: Batal disamain satu keluarga sama Submit -->
          <button class="primary secondary" type="button" @click="closeForm">Batal</button>

          <button class="primary" type="button" @click="submitForm" :disabled="loading">
            {{ loading ? "Mengirim..." : "Submit" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL NOTIFIKASI (STYLE SAMA KAYAK LOGIN.VUE) -->
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

    <!-- TOAST -->
    <div class="toast" :class="{ show: toast }">Data berhasil dikirim ✅ (Status: PENDING)</div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { me as fetchMe, logout as doLogoutSvc } from "../services/auth.js"
import { api } from "../services/api.js"

const router = useRouter()

const leaving = ref(false)
const formOpen = ref(false)
const formClosing = ref(false)
const loading = ref(false)
const toast = ref(false)

const user = reactive({ email: "", role: "" })

// ✅ modal state (copy konsep dari login.vue)
const modal = reactive({
  show: false,
  type: "error", // "error" | "info"
  title: "Informasi",
  message: ""
})

function openModal(message, opts = {}) {
  modal.type = opts.type || "error"
  modal.title = opts.title || (modal.type === "error" ? "Informasi" : "Informasi")
  modal.message = message || "Terjadi kesalahan."
  modal.show = true
}
function closeModal() {
  modal.show = false
}

// BELUM_DAFTAR | PENDING | INTERVIEW | DITERIMA | DITOLAK
const status = ref("BELUM_DAFTAR")

const profile = reactive({
  name: "",
  univ: "",
  wa: "",
  semester: "",
  divisi: "",
  pdfName: "",
  followName: "",
})

const draft = reactive({
  name: "",
  univ: "",
  wa: "",
  semester: "",
  divisi: "",
  pdfName: "",
  pdfFile: null,
  followName: "",
  followFile: null,
})

const statusText = computed(() => {
  if (status.value === "BELUM_DAFTAR") return "BELUM DAFTAR"
  if (status.value === "PENDING") return "PENDING"
  if (status.value === "INTERVIEW") return "INTERVIEW"
  if (status.value === "DITERIMA") return "DITERIMA"
  if (status.value === "DITOLAK") return "DITOLAK"
  return "-"
})

const statusClass = computed(() => {
  if (status.value === "BELUM_DAFTAR") return "s0"
  if (status.value === "PENDING") return "s1"
  if (status.value === "INTERVIEW") return "s2"
  if (status.value === "DITERIMA") return "s3"
  if (status.value === "DITOLAK") return "s4"
  return "s0"
})

function mapBackendStatus(appStatus){
  if (!appStatus) return "BELUM_DAFTAR"
  if (appStatus === "PENDING") return "PENDING"
  if (appStatus === "INTERVIEW") return "INTERVIEW"
  if (appStatus === "ACCEPTED") return "DITERIMA"
  if (appStatus === "REJECTED") return "DITOLAK"
  return "PENDING"
}

async function loadMe(){
  const u = await fetchMe()
  user.email = u?.email || "-"
  user.role = u?.role || "APPLICANT"

  // profile
  const p = u?.profile
  if (p) {
    profile.name = p.fullName || ""
    profile.univ = p.university || ""
    profile.wa = p.phone || ""
    profile.semester = p.semester ?? ""
  }

  const app = u?.application
  if (app) {
    profile.divisi = app.division || ""
    status.value = mapBackendStatus(app.status)
    profile.pdfName = app.cvPath ? "CV uploaded" : ""
    profile.followName = app.igProofPath ? "IG proof uploaded" : ""
  } else {
    status.value = "BELUM_DAFTAR"
  }
}

onMounted(async () => {
  try {
    await loadMe()
  } catch (e) {
    // kalau token invalid, router guard bakal lempar ke login
  }
})

function openForm(){
  draft.name = profile.name
  draft.univ = profile.univ
  draft.wa = profile.wa
  draft.semester = String(profile.semester || "")
  draft.divisi = profile.divisi
  draft.pdfName = ""
  draft.pdfFile = null
  draft.followName = ""
  draft.followFile = null
  formOpen.value = true
}

function closeForm(){
  if (!formOpen.value) return
  formClosing.value = true
  setTimeout(() => {
    formOpen.value = false
    formClosing.value = false
  }, 220)
}

async function submitForm(){
  // basic validate
  if (!draft.name || !draft.univ || !draft.wa || !draft.semester || !draft.divisi) {
    return openModal("Lengkapi semua field.", { type: "error", title: "Lengkapi Data" })
  }
  if (!draft.pdfFile) return openModal("CV (PDF) wajib diupload.", { type: "error", title: "Upload CV" })

  loading.value = true
  try {
    const fd = new FormData()
    fd.append("full_name", draft.name)
    fd.append("university", draft.univ)
    fd.append("phone", draft.wa)
    fd.append("semester", String(parseInt(draft.semester, 10) || 0))
    fd.append("division", draft.divisi)
    fd.append("declaration", "true")

    fd.append("cv", draft.pdfFile)
    if (draft.followFile) fd.append("ig_proof", draft.followFile)

    await api.post("/api/applicant/apply", fd, { isForm: true })

    toast.value = true
    setTimeout(() => (toast.value = false), 1200)

    closeForm()
    await loadMe()
  } catch (e) {
    openModal(e?.message || "Gagal submit", { type: "error", title: "Submit Gagal" })
  } finally {
    loading.value = false
  }
}

function doLogout(){
  doLogoutSvc()
  leaving.value = true
  setTimeout(() => router.push("/login"), 350)
}

function onPickPdf(e){
  const file = e.target.files?.[0]
  if(!file) return

  if (file.type !== "application/pdf") return openModal("File harus PDF", { type: "error", title: "File Tidak Valid" })
  if (file.size > 5 * 1024 * 1024) return openModal("Max 5MB", { type: "error", title: "File Terlalu Besar" })

  draft.pdfName = file.name
  draft.pdfFile = file
}

function onPickFollow(e){
  const file = e.target.files?.[0]
  if(!file) return

  if (!file.type.startsWith("image/")) return openModal("File harus gambar", { type: "error", title: "File Tidak Valid" })
  if (file.size > 3 * 1024 * 1024) return openModal("Max 3MB", { type: "error", title: "File Terlalu Besar" })

  draft.followName = file.name
  draft.followFile = file
}
</script>

<style scoped>
/* ===== LIGHT THEME ===== */
.wrap{
  min-height:100vh;
  position: relative;
  overflow-x: hidden;
  background: url('../assets/bg-applicant.png');
  background-size: cover;
  background-position: center;
}

/* overlay opacity 75% */
.wrap::before{
  content:"";
  position:absolute;
  inset:0;
  background: rgba(255,255,255,.90); /* 75% putih */
  backdrop-filter: blur(2px); /* optional biar soft */
  z-index:0;
}

/* supaya konten di atas overlay */
.wrap > *{
  position: relative;
  z-index: 1;
}

/* ===== TOPBAR (blue like your screenshot) ===== */
.top{
  height:56px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 0 22px;
  background: #2f5bd3;
  color: white;
}

.brandText{
  font-weight: 900;
  letter-spacing: .2px;
}

.right{
  display:flex;
  align-items:center;
  gap: 14px;
}
.user{
  font-size: 13px;
  opacity: .95;
}

.logout{
  background: #fff;
  border: none;
  color: #2f5bd3;
  padding: 7px 14px;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,.15);
}
.logout:hover{
  transform: translateY(-2px);
}

/* ===== LAYOUT ===== */
.container{
  width: min(1100px, 92%);
  margin: 18px auto 0;
  padding-bottom: 60px;
}

/* ===== HERO CARD ===== */
.heroCard{
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(60,89,193,.10);
  border-radius: 16px;
  padding: 18px 18px;
  box-shadow: 0 18px 40px rgba(60,89,193,.10);
}

.heroCard h1{
  margin:0;
  font-size: 24px;
  color: #1a2a5a;
}
.heroCard p{
  margin:6px 0 0;
  color: rgba(0,0,0,.58);
  font-weight: 600;
}

/* ===== GRID ===== */
.grid{
  margin-top: 14px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ===== CARD ===== */
.card{
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(60,89,193,.10);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(60,89,193,.10);
}

.kv{ margin-bottom: 12px; }
.k{
  font-size: 12px;
  color: rgba(0,0,0,.55);
  font-weight: 700;
}
.v{
  margin-top: 3px;
  font-weight: 900;
  color: #1a2a5a;
}

.row{
  display:flex;
  gap: 10px;
  align-items:center;
  margin-top: 8px;
}

/* ===== BADGES ===== */
.badge{
  display:inline-flex;
  align-items:center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid rgba(0,0,0,.08);
  background: rgba(0,0,0,.04);
  color: #1a2a5a;
}
.badge.ghost{
  opacity: .85;
  background: rgba(60,89,193,.10);
  border-color: rgba(60,89,193,.18);
  color: #2f5bd3;
}

/* status tones */
.badge.s0{ background: rgba(60,89,193,.10); border-color: rgba(60,89,193,.18); color:#2f5bd3; }
.badge.s1{ background: rgba(255,214,10,.22); border-color: rgba(220,170,0,.18); color:#9b6f00; }   /* pending */
.badge.s2{ background: rgba(0,180,255,.18); border-color: rgba(0,140,210,.18); color:#0077cc; }    /* interview */
.badge.s3{ background: rgba(70,255,160,.20); border-color: rgba(40,190,120,.18); color:#0f8a46; }  /* diterima */
.badge.s4{ background: rgba(255,80,110,.18); border-color: rgba(210,40,70,.18); color:#b3172a; }   /* ditolak */

.primary{
  margin-top: 14px;
  background: linear-gradient(90deg, #1a2e9e, #6394dd);
  border: none;
  color: white;
  padding: 11px 14px;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 16px 35px rgba(0,0,0,.16);
  transition: transform .18s ease, filter .18s ease;
}
.primary:hover{ transform: translateY(-2px); filter: brightness(1.03); }
.primary.disabled{ opacity:.6; cursor:not-allowed; }

/* ✅ FIX: tombol batal (secondary) tapi masih 1 keluarga sama submit */
.primary.secondary{
  background: rgba(255,255,255,.85);
  color: #1a2e9e;
  border: 1px solid rgba(26,46,158,.22);
  box-shadow: 0 16px 35px rgba(0,0,0,.10);
}
.primary.secondary:hover{
  transform: translateY(-2px);
  filter: brightness(1.02);
}

h3{ margin:0 0 10px; color:#1a2a5a; }
.info{
  margin:0;
  padding-left: 18px;
  line-height: 1.8;
  color: rgba(0,0,0,.62);
  font-weight: 700;
}

/* ===== MODAL FORM ===== */
.modalBackdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  opacity: 0;
  pointer-events: none;
  transition: .25s ease;
  z-index: 50;
}
.modalBackdrop.show{
  opacity: 1;
  pointer-events: auto;
}

.modal{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(.98);
  width: min(520px, 92%);
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(60,89,193,.14);
  border-radius: 18px;
  box-shadow: 0 30px 70px rgba(0,0,0,.25);
  backdrop-filter: blur(12px);
  padding: 16px;
  opacity: 0;
  pointer-events: none;
  z-index: 60;
  box-sizing: border-box;
}
.modal.show{
  opacity: 1;
  pointer-events: auto;
  animation: pop .35s cubic-bezier(.2,.9,.2,1) both;
}
.modal.out{
  animation: popOut .22s ease both;
}
@keyframes pop{
  from{ opacity:0; transform: translate(-50%, -50%) translateY(16px) scale(.96); }
  to{ opacity:1; transform: translate(-50%, -50%) translateY(0) scale(1); }
}
@keyframes popOut{
  from{ opacity:1; transform: translate(-50%, -50%) translateY(0) scale(1); }
  to{ opacity:0; transform: translate(-50%, -50%) translateY(10px) scale(.98); }
}

.modalHead{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 6px 6px 10px;
}
.modalHead h2{
  margin:0;
  font-size: 18px;
  color: #1a2a5a;
}
.x{
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.08);
  background: rgba(0,0,0,.04);
  color: #1a2a5a;
  cursor: pointer;
}
.x:hover{ background: rgba(0,0,0,.06); }

.form{
  padding: 8px 6px 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}

.field{ margin-bottom: 0; }
.field.full{ grid-column: 1 / -1; }

.actions{
  grid-column: 1 / -1;
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  margin-top: 6px;
}

/* samain tinggi input & select biar sejajar */
input, select{ height: 44px; box-sizing: border-box; }

label{
  display:block;
  font-size: 12px;
  color: rgba(0,0,0,.58);
  margin-bottom: 6px;
  font-weight: 800;
}
input, select{
  width: 100%;
  padding: 11px 12px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.95);
  color: #1a2a5a;
  outline: none;
}
input:focus, select:focus{ border-color: rgba(60,89,193,.45); }

/* ===== TOAST ===== */
.toast{
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(0,0,0,.08);
  color: #1a2a5a;
  padding: 12px 14px;
  border-radius: 14px;
  box-shadow: 0 20px 55px rgba(0,0,0,.18);
  transition: .25s ease;
  font-weight: 900;
  z-index: 80;
}
.toast.show{
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ===== ENTER ===== */
.enter{ animation: in .6s cubic-bezier(.2,.9,.2,1) both; }
.delay1{ animation-delay: .12s; }
.delay2{ animation-delay: .22s; }
@keyframes in{
  from{ opacity:0; transform: translateY(18px); }
  to{ opacity:1; transform: translateY(0); }
}

@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
}
.brandLogo{
  height: 30px;
  object-fit: contain;
}
.hint{
  display:block;
  margin-top:8px;
  font-size:12px;
  color: rgba(0,0,0,.6);
  font-weight:700;
}

/* ===== MODAL NOTIFIKASI (COPY LOGIN.VUE) ===== */
.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 18px;
  z-index: 120;
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
.modal-icon.error{ background: #e74c3c; }

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
.modal-btn:hover{ transform: translateY(-1px); }
@media (max-width:600px){

  .top{
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 12px 18px;
    gap: 6px;
  }

  .brand{
    width:100%;
  }

  .right{
    width:100%;
    display:flex;
    justify-content: space-between;
    align-items:center;
  }

  .user{
    font-size:12px;
  }

  .logout{
    padding:6px 12px;
    font-size:12px;
  }

}
/* ===== MOBILE HEADER CLEAN ===== */
@media (max-width:600px){

  /* sembunyikan email + applicant */
  .user{
    display:none;
  }

  /* header tetap horizontal */
  .top{
    display:flex;
    align-items:center;
    justify-content:space-between;
  }

  /* logout tetap di kanan */
  .right{
    margin-left:auto;
  }

  /* logo sedikit lebih kecil biar rapi */
  .brandLogo{
    height:24px;
  }

}
</style>
