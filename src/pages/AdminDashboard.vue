<template>
  <div class="sa">
    <!-- SIDEBAR -->
    <aside class="sb" :class="{ open: sbOpen }">
      <div class="sbTop">
        <div class="sbLogo">
          <img src="../assets/edukaryaopening.png" alt="Edukarya" class="logoImg" />
        </div>

        <button class="sbX" @click="sbOpen=false">✕</button>
      </div>

      <button class="sbItem" :class="{active: tab==='dashboard'}" @click="tab='dashboard'">
        🏠 Dashboard
      </button>
      <button class="sbItem" :class="{active: tab==='pendaftar'}" @click="tab='pendaftar'">
        📄 Data Pendaftar
      </button>
      <button class="sbItem" :class="{active: tab==='export'}" @click="tab='export'">
        ⬇️ Export Data
      </button>

      <div class="sbLine"></div>

      <button class="sbItem danger" @click="logout">🚪 Logout</button>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <!-- TOPBAR -->
      <header class="top">
        <button class="hamb" @click="sbOpen=true">☰</button>
        <h1>Dashboard</h1>
        <div class="topRight">
          <span class="who">Dashboard Admin</span>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="content">
        <!-- DASHBOARD -->
        <section v-if="tab==='dashboard'" class="fade">
          <div class="cards">
            <div class="stat blue">
              <div>
                <div class="t">Total Pendaftar</div>
                <div class="n">{{ stats.total }}</div>
              </div>
            </div>
            <div class="stat yellow">
              <div>
                <div class="t">Pending</div>
                <div class="n">{{ stats.pending }}</div>
              </div>
            </div>
            <div class="stat green">
              <div>
                <div class="t">Interview</div>
                <div class="n">{{ stats.interview }}</div>
              </div>
            </div>
            <div class="stat orange">
              <div>
                <div class="t">Accepted</div>
                <div class="n">{{ stats.accepted }}</div>
              </div>
            </div>
            <div class="stat red">
              <div>
                <div class="t">Rejected</div>
                <div class="n">{{ stats.rejected }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- PENDAFTAR -->
        <section v-else-if="tab==='pendaftar'" class="fade">
          <div class="panel">
            <div class="panelHead">
              <h2>Data Pendaftar</h2>
              <button class="btn" @click="loadApplicants">Refresh</button>
            </div>

            <div v-if="applicants.length === 0" class="empty">
              Belum ada pendaftar submit.
            </div>

            <div v-else class="tableWrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Divisi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(a,i) in applicants" :key="i">
                    <td>{{ a.name || '-' }}</td>
                    <td>{{ a.email }}</td>
                    <td>{{ a.divisi || '-' }}</td>

                    <td>
                      <span class="pill" :class="pillClass(a.status)">{{ a.status }}</span>
                    </td>

                    <td>
                    <button class="btnMini" @click="openApplicant(a)">Detail</button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- EXPORT -->
        <section v-else-if="tab==='export'" class="fade">
          <div class="panel">
            <h2>Export Data Pendaftar (CSV)</h2>
            <p class="muted">Klik tombol untuk download CSV.</p>
            <button class="btn big" @click="exportCsv" :disabled="applicants.length===0">
              Export CSV
            </button>
            <p v-if="applicants.length===0" class="muted" style="margin-top:10px;">
              (Kosong) Isi form applicant dulu biar ada datanya.
            </p>
          </div>
        </section>

        <!-- ADMIN (cuma superadmin yang bisa nambah) -->
        <section v-else class="fade">
          <div class="panel">
            <div class="panelHead">
              <h2>Manajemen Admin</h2>
              <button class="btn" @click="openAddAdmin">+ Tambah Admin</button>
            </div>

            <div v-if="admins.length===0" class="empty">Belum ada admin.</div>

            <ul class="adminList" v-else>
              <li v-for="(ad,i) in admins" :key="i">
                <span>{{ ad.email }}</span>

                <div class="rowRight">
                  <span class="tag">ADMIN</span>
                  <button class="del" @click="removeAdmin(i)">Hapus</button>
                </div>
              </li>
            </ul>

          </div>
        </section>
      </main>
    </div>

    <!-- MODAL TAMBAH ADMIN -->
    <div class="bd" :class="{show: addOpen}" @click="closeAdd"></div>
    <div class="modal addModal" :class="{show: addOpen, out: addClosing}" @click.stop>
  <div class="mh">
    <h3>Tambah Admin</h3>
    <button class="x" @click="closeAdd">✕</button>
  </div>

  <div class="mBody">
    <div class="f">
      <label class="lbl">Email Admin</label>
      <input v-model="adminEmail" class="inp" placeholder="email admin..." />
    </div>

    <div class="f">
      <label class="lbl">Password</label>
      <input v-model="adminPassword" type="password" class="inp" placeholder="password admin..." />
    </div>

    <div class="mFooter">
      <button class="btn btnFull" @click="addAdmin">Simpan</button>
    </div>
  </div>
</div>


    <!-- MODAL DETAIL PENDAFTAR -->
<!-- MODAL DETAIL PENDAFTAR -->
<div class="bd" :class="{show: detailOpen}" @click="closeDetail"></div>

<div class="modal" :class="{show: detailOpen, out: detailClosing}" @click.stop>
  <div class="mh">
    <h3>Detail Pendaftar</h3>
    <button class="x" @click="closeDetail">✕</button>
  </div>

  <div v-if="selected" class="detailCard">
    <div class="rows">
      <div class="r"><div class="k">Nama:</div><div class="v">{{ selected.name || "-" }}</div></div>
      <div class="r"><div class="k">Email:</div><div class="v">{{ selected.email || "-" }}</div></div>
      <div class="r"><div class="k">Universitas:</div><div class="v">{{ selected.universitas || "-" }}</div></div>
      <div class="r"><div class="k">Semester:</div><div class="v">{{ selected.semester || "-" }}</div></div>
      <div class="r"><div class="k">No WhatsApp:</div><div class="v">{{ selected.whatsapp || "-" }}</div></div>
      <div class="r"><div class="k">Divisi:</div><div class="v">{{ selected.divisi || "-" }}</div></div>

      <div class="r">
        <div class="k">Portofolio:</div>
        <div class="v">
          <button class="mini" :disabled="!selected.portfolio"
            @click="downloadFile('cv', 'CV.pdf')">
            Download
          </button>
        </div>
      </div>

      <div class="r">
        <div class="k">Bukti Follow:</div>
        <div class="v">
          <button class="mini ghost" :disabled="!selected.buktiFollow" @click="previewImg('ig')">
            Lihat
          </button>
          <button class="mini" :disabled="!selected.buktiFollow"
            @click="downloadFile('ig', 'ig-proof')">
            Download
          </button>
        </div>
      </div>

      <img v-if="previewSrc" :src="previewSrc" class="preview" />
    </div>

    <div class="statusBlock">
      <div class="k">Status:</div>
      <select v-model="selectedStatus" class="sel2">
        <option value="PENDING">Pending</option>
        <option value="INTERVIEW">Interview</option>
        <option value="ACCEPTED">Diterima</option>
        <option value="REJECTED">Ditolak</option>
      </select>
    </div>

    <button class="saveBtn" @click="saveStatus">Simpan</button>
  </div>
</div>



    <div class="toast" :class="{show: toast}">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { me as fetchMe, logout as logoutSvc } from "../services/auth.js"
import { api, apiRequest } from "../services/api.js"

const router = useRouter()

const tab = ref("dashboard")
const sbOpen = ref(false)

const applicants = ref([])
const admins = ref([])

const detailOpen = ref(false)
const detailClosing = ref(false)
const selected = ref(null)
const selectedStatus = ref("PENDING")
const previewSrc = ref("")

const addOpen = ref(false)
const addClosing = ref(false)
const adminEmail = ref("")
const adminPassword = ref("")
const currentRole = ref("ADMIN")

const toast = ref(false)
const toastMsg = ref("")

function showToast(msg){
  toastMsg.value = msg
  toast.value = true
  setTimeout(()=>toast.value=false, 1400)
}

const stats = ref({ total: 0, pending: 0, interview: 0, accepted: 0, rejected: 0 })

async function loadStats(){
  try {
    const res = await api.get("/api/admin/dashboard/stats")
    stats.value = {
      total: res.total || 0,
      pending: res.pending || 0,
      interview: res.interview || 0,
      accepted: res.accepted || 0,
      rejected: res.rejected || 0,
    }
  } catch(e) {
    // ignore
  }
}

/** Ambil applicant dari backend */
async function loadApplicants(){
  try {
    const res = await api.get("/api/admin/applicants?limit=50&page=1")
    applicants.value = (res.data || []).map(r => ({
      applicationId: r.applicationId,
      name: r.name,
      email: r.email,
      divisi: r.division,
      status: r.status,
      whatsapp: r.phone,
      universitas: r.university,
      semester: r.semester,
    }))
  } catch (e) {
    showToast(e.message || "Gagal load applicants")
  }
}

async function openApplicant(a){
  previewSrc.value = ""
  try {
    const res = await api.get(`/api/admin/applicants/${a.applicationId}`)
    selected.value = {
      applicationId: res.applicationId,
      name: res.applicant?.name || "-",
      email: res.applicant?.email || "-",
      whatsapp: res.applicant?.phone || "-",
      universitas: res.applicant?.university || "-",
      semester: res.applicant?.semester ?? "-",
      divisi: res.division || "-",
      portfolioName: "CV.pdf",
      portfolio: res.cvFilename ? true : false,
      buktiFollowName: "IG-proof",
      buktiFollow: res.igProofFilename ? true : false,
      notes: res.notes || ""
    }
    selectedStatus.value = res.status || "PENDING"
    detailOpen.value = true
  } catch (e) {
    showToast(e.message || "Gagal load detail")
  }
}

function closeDetail(){
  detailClosing.value = true
  setTimeout(()=>{
    detailOpen.value = false
    detailClosing.value = false
    selected.value = null
    previewSrc.value = ""
  }, 200)
}

async function saveStatus(){
  if (!selected.value) return
  try {
    await api.put(`/api/admin/applicants/${selected.value.applicationId}/status`, { status: selectedStatus.value })
    showToast("Status updated ✅")
    closeDetail()
    await loadStats()
    await loadApplicants()
  } catch (e) {
    showToast(e.message || "Gagal update status")
  }
}

async function previewImg(kind){
  if (!selected.value) return
  try {
    const id = selected.value.applicationId
    if (kind === "cv") {
      const blob = await apiRequest(`/api/admin/applicants/${id}/cv`, { expectBlob: true })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
      return
    }
    if (kind === "ig") {
      const blob = await apiRequest(`/api/admin/applicants/${id}/ig-proof`, { expectBlob: true })
      const url = URL.createObjectURL(blob)
      previewSrc.value = url
      return
    }
  } catch (e) {
    showToast(e.message || "Gagal preview")
  }
}

async function downloadFile(kind, filename){
  if (!selected.value) return
  try {
    const id = selected.value.applicationId
    const path = kind === "cv"
      ? `/api/admin/applicants/${id}/cv`
      : `/api/admin/applicants/${id}/ig-proof`

    const blob = await apiRequest(path, { expectBlob: true })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename || (kind === "cv" ? "CV.pdf" : "ig-proof")
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) {
    showToast(e.message || "Gagal download")
  }
}

function pillClass(st){
  const s = (st || "").toUpperCase()
  if (s === "PENDING") return "p1"
  if (s === "INTERVIEW") return "p2"
  if (s === "ACCEPTED") return "p3"
  if (s === "REJECTED") return "p4"
  return "p1"
}

async function exportCsv(){
  try {
    const blob = await apiRequest("/api/admin/export", { expectBlob: true })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.xlsx"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) {
    showToast(e.message || "Gagal export")
  }
}

function loadAdmins(){
  admins.value = []
}

function openAddAdmin(){
  if (currentRole.value !== "SUPER_ADMIN") {
    return showToast("Fitur ini hanya untuk SUPER_ADMIN")
  }
  adminEmail.value = ""
  adminPassword.value = ""
  addOpen.value = true
}

function closeAdd(){
  addClosing.value = true
  setTimeout(()=>{
    addOpen.value = false
    addClosing.value = false
  }, 200)
}

async function addAdmin(){
  if (currentRole.value !== "SUPER_ADMIN") return showToast("Hanya SUPER_ADMIN")
  if (!adminEmail.value || !adminPassword.value) return showToast("Email & password wajib")
  try {
    await api.post("/api/admin/users", { email: adminEmail.value, password: adminPassword.value, role: "ADMIN" })
    showToast("Admin dibuat ✅")
    closeAdd()
  } catch (e) {
    showToast(e.message || "Gagal buat admin")
  }
}

function removeAdmin(){
  showToast("Hapus admin belum disediakan oleh backend.")
}

function logout(){
  logoutSvc()
  router.push("/login")
}

onMounted(async ()=>{
  try {
    const u = await fetchMe()
    currentRole.value = u?.role || "ADMIN"
  } catch {}
  loadAdmins()
  await loadStats()
  await loadApplicants()
})

</script>

<style scoped>
.sa{ min-height:100vh; background:#f3f6ff; display:flex; }

/* sidebar */
.sb{
  width: 260px;
  background:#fff;
  border-right:1px solid rgba(0,0,0,.06);
  padding:14px;
}
.sbTop{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.sbLogo{
  padding: 6px 0;
  background: transparent;
  border-radius: 0;
}

.sbX{ display:none; border:none; background:transparent; font-size:18px; cursor:pointer; }

.sbItem{
  width:100%;
  border:none;
  background:transparent;
  padding:12px 12px;
  border-radius:12px;
  text-align:left;
  cursor:pointer;
  font-weight:800;
  color:#233;
  transition:.2s;
}
.sbItem:hover{ background: rgba(60,89,193,.08); }
.sbItem.active{
  background: rgba(60,89,193,.12);
  color:#3C59C1;
}
.sbLine{ height:1px; background: rgba(0,0,0,.06); margin:12px 0; }
.sbItem.danger{ color:#c22; }
.sbItem.danger:hover{ background: rgba(255,0,0,.06); }

/* main */
.main{ flex:1; }
.top{
  height:56px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 0 18px;
  background:#fff;
  border-bottom:1px solid rgba(0,0,0,.06);
}
.top h1{ margin:0; font-size:22px; color:#223; }
.hamb{ display:none; border:none; background:transparent; font-size:22px; cursor:pointer; }
.who{ font-weight:900; color:#3C59C1; }

.content{ padding:18px; }
.fade{ animation: fade .35s ease both; }
@keyframes fade{ from{opacity:0; transform: translateY(10px);} to{opacity:1; transform: translateY(0);} }

/* stat cards */
.cards{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 260px));
  gap:14px;
}
.stat{
  border-radius:14px;
  padding:16px;
  color:#111;
  box-shadow:0 16px 40px rgba(0,0,0,.08);
  border: 1px solid rgba(0,0,0,.05);
}
.stat .t{ font-weight:800; opacity:.85; }
.stat .n{ font-size:28px; font-weight:900; margin-top:6px; }

.blue{ background:#3b71ff; color:#fff; }
.yellow{ background:#ffe08a; }
.green{ background:#cfeecf; }
.orange{ background:#ffd0b2; }
.mint{ background:#d7f0d7; }
.red{ background:#ffb1b6; }

/* panel */
.panel{
  background:#fff;
  border: 1px solid rgba(0,0,0,.06);
  border-radius:14px;
  padding:16px;
  box-shadow:0 16px 40px rgba(0,0,0,.06);
}
.panelHead{ display:flex; justify-content:space-between; align-items:center; gap:10px; }
.panel h2{ margin:0; color:#223; }
.muted{ color: rgba(0,0,0,.55); font-weight:700; }

.btn{
  background:#3C59C1;
  color:#fff;
  border:none;
  padding:10px 14px;
  border-radius:12px;
  cursor:pointer;
  font-weight:900;
}
.btn.big{ margin-top:10px; }
.btn:disabled{ opacity:.6; cursor:not-allowed; }

.empty{ padding:14px; color: rgba(0,0,0,.55); font-weight:800; }

.tableWrap{ margin-top:12px; overflow:auto; }
.table{ width:100%; border-collapse: collapse; }
th,td{ padding:10px; border-bottom:1px solid rgba(0,0,0,.06); text-align:left; font-weight:800; }
th{ color:#3C59C1; background: rgba(60,89,193,.06); }

.pill{
  display:inline-flex;
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  border:1px solid rgba(0,0,0,.08);
}
.p0{ background: rgba(60,89,193,.10); color:#3C59C1; }
.p1{ background: rgba(255,214,10,.22); color:#9b6f00; }
.p2{ background: rgba(0,180,255,.18); color:#0077cc; }
.p3{ background: rgba(70,255,160,.20); color:#0f8a46; }
.p4{ background: rgba(255,80,110,.18); color:#b3172a; }

.adminList{ margin:12px 0 0; padding:0; list-style:none; }
.adminList li{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 12px;
  border:1px solid rgba(0,0,0,.06);
  border-radius:12px;
  margin-bottom:10px;
  font-weight:900;
}
.tag{
  background: rgba(60,89,193,.10);
  color:#3C59C1;
  border:1px solid rgba(60,89,193,.18);
  padding:5px 10px;
  border-radius:999px;
  font-size:12px;
}

/* modal */
.bd{
  position:fixed; inset:0;
  background: rgba(0,0,0,.35);
  opacity:0; pointer-events:none;
  transition:.2s;
}
.bd.show{ opacity:1; pointer-events:auto; }
.modal{
  position:fixed;
  left:50%; top:50%;
  transform: translate(-50%,-50%) scale(.98);
  width: min(420px, 92%);
  background:#fff;
  border:1px solid rgba(0,0,0,.08);
  border-radius:14px;
  box-shadow:0 26px 70px rgba(0,0,0,.22);
  box-sizing: border-box;
  padding:14px;
  opacity:0; pointer-events:none;
}
.modal.show{
  opacity:1; pointer-events:auto;
  animation: pop .25s ease both;
}
.modal.out{ animation: popOut .18s ease both; }
@keyframes pop{ from{opacity:0; transform:translate(-50%,-50%) translateY(10px) scale(.98);} to{opacity:1; transform:translate(-50%,-50%) translateY(0) scale(1);} }
@keyframes popOut{ from{opacity:1;} to{opacity:0;} }

.mh{ display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.x{ border:none; background:transparent; font-size:18px; cursor:pointer; }
.inp{
  width:100%;
  padding:11px 12px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,.12);
  margin-bottom:12px;
  font-weight:800;
}

/* toast */
.toast{
  position:fixed;
  bottom:18px;
  left:50%;
  transform: translateX(-50%) translateY(18px);
  opacity:0;
  background:#fff;
  color:#3C59C1;
  border:1px solid rgba(0,0,0,.08);
  padding:10px 14px;
  border-radius:12px;
  box-shadow:0 18px 50px rgba(0,0,0,.18);
  font-weight:900;
  transition:.22s;
}
.toast.show{ opacity:1; transform: translateX(-50%) translateY(0); }

/* responsive sidebar */
@media (max-width: 900px){
  .sb{
    position:fixed; left:0; top:0; bottom:0;
    transform: translateX(-102%);
    transition: .25s ease;
    z-index:20;
  }
  .sb.open{ transform: translateX(0); }
  .sbX{ display:block; }
  .hamb{ display:block; }
  .cards{ grid-template-columns: 1fr; }
}

.rowRight{
  display:flex;
  align-items:center;
  gap:10px;
}

.del{
  background: rgba(255,0,0,.08);
  color:#c22;
  border:1px solid rgba(255,0,0,.18);
  padding:6px 10px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
}
.del:hover{ background: rgba(255,0,0,.12); }

.btnMini{
  background: rgba(60,89,193,.10);
  color:#3C59C1;
  border:1px solid rgba(60,89,193,.18);
  padding:7px 10px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
}
.btnMini:disabled{ opacity:.5; cursor:not-allowed; }

.detail{ display:flex; flex-direction:column; gap:10px; }
.dRow{ display:flex; justify-content:space-between; gap:12px; font-weight:800; }
.dRow span{ color: rgba(0,0,0,.55); }
.sel{
  padding:8px 10px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,.12);
  font-weight:900;
}
.files{ margin-top:8px; display:flex; flex-direction:column; gap:10px; }
.fileItem{ display:flex; justify-content:space-between; align-items:center; gap:10px; }
.ft{ font-weight:900; }
.preview{
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 12px;
  border:1px solid rgba(0,0,0,.08);
}

.detailGrid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 18px;
  margin-top: 10px;
}

.item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0,0,0,.06);
}

.item.full{
  grid-column: 1 / -1;
}

.lbl{
  color: rgba(0,0,0,.55);
  font-weight: 800;
}

.val{
  font-weight: 900;
  color:#111;
}

.sel{
  width: 220px;
  margin-left:auto;
  padding: 10px 12px;
  border-radius: 12px;
  border:1px solid rgba(0,0,0,.12);
  font-weight: 800;
  background:#fff;
}

.fileRow{
  align-items:flex-start;
}

.fileActions{
  margin-left:auto;
  display:flex;
  gap:10px;
}

.btn2{
  background:#3C59C1;
  color:#fff;
  border:none;
  padding:8px 12px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
}
.btn2.ghost{
  background: rgba(60,89,193,.10);
  color:#3C59C1;
  border:1px solid rgba(60,89,193,.20);
}
.btn2:disabled{
  opacity:.5;
  cursor:not-allowed;
}

.detailFooter{
  margin-top: 14px;
  display:flex;
  justify-content:flex-end; /* tombol nempel kanan bawah */
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,.08);
}

.btnSave{
  background:#3C59C1;
  color:#fff;
  border:none;
  padding:10px 16px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
}
.btnSave:hover{ filter: brightness(1.03); }

@media (max-width: 560px){
  .detailGrid{ grid-template-columns: 1fr; }
  .sel{ width: 100%; }
  .item{ align-items:flex-start; flex-direction:column; }
  .fileActions{ margin-left:0; }
  .detailFooter{ justify-content:stretch; }
  .btnSave{ width:100%; }
}

.detailCard{
  background:#fff;
  border:1px solid rgba(0,0,0,.08);
  border-radius:14px;
  padding:14px;
}

.rows{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.r{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}

.k{
  width:120px;
  color: rgba(0,0,0,.55);
  font-weight:800;
  font-size:13px;
}

.v{
  flex:1;
  text-align:left;
  font-weight:900;
  color:#111;
  display:flex;
  justify-content:flex-start;
  gap:10px;
  flex-wrap:wrap;
}

.mini{
  background: rgba(60,89,193,.12);
  color:#3C59C1;
  border:1px solid rgba(60,89,193,.22);
  padding:7px 10px;
  border-radius:10px;
  font-weight:900;
  cursor:pointer;
}
.mini.ghost{
  background: rgba(0,0,0,.04);
  border:1px solid rgba(0,0,0,.10);
  color:#223;
}
.mini:disabled{ opacity:.5; cursor:not-allowed; }

.statusBlock{
  margin-top:12px;
  padding-top:12px;
  border-top:1px solid rgba(0,0,0,.08);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}

.sel2{
  width: 220px;
  padding:9px 12px;
  border-radius:10px;
  border:1px solid rgba(0,0,0,.12);
  font-weight:800;
  background:#fff;
}

.saveBtn{
  margin-top:12px;
  width:100%;
  background:#3C59C1;
  color:#fff;
  border:none;
  padding:12px 14px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 10px 25px rgba(0,0,0,.12);
}

.preview{
  width:100%;
  max-height:220px;
  object-fit:contain;
  border-radius:12px;
  border:1px solid rgba(0,0,0,.08);
}

@media (max-width: 520px){
  .r{ flex-direction:column; align-items:flex-start; }
  .k{ width:auto; }
  .statusBlock{ flex-direction:column; align-items:stretch; }
  .sel2{ width:100%; }
}

/* ===== ADD ADMIN MODAL (rapi) ===== */
.addModal{
  width: min(520px, 92%);
  padding: 18px;
  border-radius: 18px;
}

.mBody{
  padding-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.f{
  display:flex;
  flex-direction:column;
  gap:6px;
}

.lbl{
  font-size: 12px;
  font-weight: 900;
  color: rgba(0,0,0,.55);
}

.inp{
  width:100%;
  box-sizing: border-box;
  height: 44px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.14);
  font-weight: 800;
  outline: none;
  background:#fff;
}

.inp:focus{
  border-color: rgba(60,89,193,.55);
  box-shadow: 0 0 0 3px rgba(60,89,193,.12);
}

.mFooter{
  margin-top: 6px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,.08);
  display:flex;
  justify-content:flex-end;
}

.btnFull{
  width: 100%;
  border-radius: 12px;
  padding: 12px 14px;
}

.logoImg{
  height: 40px;
  object-fit: contain;
}

</style>
