<template>
  <div class="wrapper" @keydown.esc="handleEsc" tabindex="0">
    <!-- ===== SPLASH (LOGO POPUP 2 DETIK) ===== -->
    <div class="splash" :class="{ hide: splashDone }">
      <img src="../assets/edukaryaopening.png" class="splash-logo" alt="Edukarya" />
    </div>

    <!-- Backdrop -->
    <div class="backdrop" :class="{ show: sidebar }" @click="closeSidebar"></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebar }">
      <button class="close" @click="closeSidebar" aria-label="Close">✕</button>

      <img src="../assets/edukarya.png" class="sb-logo" alt="Edukarya" />
      <p class="sb-sub">CV. Edukarya Gemilang Jaya</p>

      <div class="sb-section">
        <h4>Cabang</h4>
        <a class="sb-link" href="#">Kota Semarang, Jawa Tengah</a>
        <a class="sb-link" href="#">Kota Surakarta, Jawa Tengah</a>
        <a class="sb-link" href="#">Kota Yogya, Yogyakarta</a>
        <a class="sb-link" href="#">Kota Malang, Jawa Timur</a>
        <a class="sb-link" href="#">Kota Surabaya, Jawa Timur</a>
      </div>

      <div class="sb-section">
        <h4>Company</h4>
        <a class="sb-link" href="#tentang" @click.prevent="goSection('tentang')">Tentang Kami</a>
        <a class="sb-link" href="#divisi" @click.prevent="goSection('divisi')">Divisi</a>
        <a class="sb-link" href="#ecosystem" @click.prevent="goSection('ecosystem')">Ecosystem</a>
      </div>

      <div class="sb-section">
        <h4>Ecosystem</h4>
        <a
          class="sb-link"
          href="https://www.instagram.com/edukarya.id?igsh=ZmZnZGFkb2J6ZGJp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edukarya | Instagram
        </a>
        <a
          class="sb-link"
          href="https://www.instagram.com/talentakarta?igsh=Z21nYno1M3pjMGc0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talenta Karta | Instagram
        </a>
        <a class="sb-link" href="https://www.youtube.com/@SapanesiaID" target="_blank" rel="noopener noreferrer">
          Sapanesia ID | Youtube
        </a>
      </div>
    </aside>

    <!-- MAIN -->
    <!-- ✅ blur sidebar & blur modal dipisah -->
    <div class="main" :class="{ shift: sidebar, divblur: divModal, enter: splashDone, leaving: leaving }">
      <!-- HERO -->
      <section class="hero" :class="{ show: pageReady }">
        <!-- tombol ☰ pojok kiri atas + HILANG saat sidebar open -->
        <div class="topbar" :class="{ hide: sidebar }">
          <button class="menu" @click="openSidebar" aria-label="Open menu">
            <span class="hamburger">☰</span>
          </button>
        </div>

        <div class="hero-inner container">
          <div class="hero-center">
            <img src="../assets/edukarya.png" class="hero-logo" alt="Edukarya" />
            <img src="../assets/judul.png" class="hero-title" alt="Join Our Tribe" />
            <button class="cta hero-cta" @click="goLogin">DAFTAR SEKARANG</button>
          </div>
        </div>

        <div class="hero-fade"></div>
      </section>

      <!-- ===== TENTANG ===== -->
      <section id="tentang" class="section tentang" data-reveal>
        <div class="container section-container">
          <div class="tentang-grid">
            <div class="tentang-text" data-reveal style="--d: 0ms">
              <div class="sasaran-title">
                <span class="line"></span>
                <h3>Mengenal Lebih Dekat</h3>
              </div>

              <p>
                Edukarya Ecosystem adalah wadah kolaborasi inovatif bagi mahasiswa untuk berkembang dalam ekosistem
                profesional. Kami menggabungkan kreativitas, manajemen modern, dan semangat komunitas untuk
                menciptakan dampak nyata bagi generasi muda Indonesia. Melalui berbagai divisi, kami membina talenta
                untuk siap menghadapi tantangan industri masa depan.
              </p>

              <a href="https://edukarya.com" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                Selengkapnya →
              </a>
            </div>

            <div class="tentang-image" data-reveal style="--d: 120ms">
              <img src="../assets/team.jpg" alt="Edukarya Team" />
            </div>
          </div>

          <div class="sasaran-section">
            <div class="sasaran-title" data-reveal style="--d: 0ms">
              <span class="line"></span>
              <h3>Sasaran Peserta</h3>
            </div>

            <div class="sasaran-grid">
              <div class="sasaran-card" data-reveal style="--d: 0ms">
                <div class="icon-circle">🎓</div>
                <h4>Mahasiswa Aktif</h4>
                <p>Terbuka untuk mahasiswa aktif semester 1 - 7 dari seluruh perguruan tinggi.</p>
              </div>

              <div class="sasaran-card" data-reveal style="--d: 90ms">
                <div class="icon-circle">💡</div>
                <h4>Kemauan Belajar</h4>
                <p>Memiliki antusiasme tinggi untuk mempelajari hal baru dan berkembang.</p>
              </div>

              <div class="sasaran-card" data-reveal style="--d: 180ms">
                <div class="icon-circle">👥</div>
                <h4>Kerjasama Tim</h4>
                <p>Mampu bekerja secara kolaboratif dalam lingkungan tim yang dinamis.</p>
              </div>

              <div class="sasaran-card" data-reveal style="--d: 270ms">
                <div class="icon-circle">🌍</div>
                <h4>Semua Jurusan</h4>
                <p>Terbuka untuk latar belakang pendidikan maupun (Interdisipliner).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== DIVISI ===== -->
      <section id="divisi" class="section divisi">
        <div class="divisi-header container" data-reveal>
          <div class="divisi-left">
            <h2>Jelajahi <span>Divisi</span> Kami</h2>
          </div>

          <div class="divisi-right">
            <p>Pilih divisi yang sesuai dengan passion dan keahlianmu untuk berkembang bersama.</p>
          </div>
        </div>

        <!-- 1) HR (BIRU) -->
        <div class="div-band band-blue" :style="bandStyle('HR', 'blue')">
          <div class="container section-container">
            <article class="div-card" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-hr.png" alt="Human Resources" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Human<br />Resources</h3>
                <p>
                  Divisi HR bertanggung jawab pada proses rekrutmen, seleksi, onboarding, serta pengelolaan
                  administrasi peserta magang. HR juga membantu evaluasi kinerja, absensi, dan pengembangan budaya
                  kerja tim.
                </p>

                <button class="btn-more" @click="openDivModal('HR')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 2) Content (PUTIH) -->
        <div class="div-band band-white" :style="bandStyle('CONTENT', 'white')">
          <div class="container section-container">
            <article class="div-card reverse" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-content.png" alt="Content Management" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Content<br />Management</h3>
                <p>
                  Divisi Content Management mengelola perencanaan, pembuatan, pengeditan, dan publikasi konten
                  website maupun media sosial. Bertugas memastikan konten informatif, konsisten, dan sesuai strategi
                  brand.
                </p>

                <button class="btn-more" @click="openDivModal('CONTENT')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 3) Marketing (BIRU) -->
        <div class="div-band band-blue" :style="bandStyle('MARKETING', 'blue')">
          <div class="container section-container">
            <article class="div-card" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-marketing.png" alt="Marketing" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Marketing</h3>
                <p>
                  Divisi Marketing fokus pada strategi promosi, riset pasar, pengelolaan campaign, serta analisis
                  performa pemasaran. Bertanggung jawab meningkatkan awareness dan jumlah pendaftar melalui berbagai
                  kanal digital.
                </p>

                <button class="btn-more" @click="openDivModal('MARKETING')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 4) EO (PUTIH) -->
        <div class="div-band band-white" :style="bandStyle('EO', 'white')">
          <div class="container section-container">
            <article class="div-card reverse" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-eo.png" alt="Event Organizer" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Event<br />Organizer (EO)</h3>
                <p>
                  Divisi Event Organizer merancang, mengoordinasikan, dan mengeksekusi berbagai acara seperti webinar,
                  workshop, atau launching program. Bertugas mengatur timeline, vendor, dan kebutuhan teknis acara.
                </p>

                <button class="btn-more" @click="openDivModal('EO')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 5) Design (BIRU) -->
        <div class="div-band band-blue" :style="bandStyle('DESIGN', 'blue')">
          <div class="container section-container">
            <article class="div-card" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-design.png" alt="Design" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Design</h3>
                <p>
                  Divisi Design bertanggung jawab membuat materi visual seperti poster, feed media sosial, banner, dan
                  kebutuhan branding lainnya. Fokus pada kreativitas, estetika, dan konsistensi identitas visual.
                </p>

                <button class="btn-more" @click="openDivModal('DESIGN')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 6) Talent (PUTIH) -->
        <div class="div-band band-white" :style="bandStyle('TALENT', 'white')">
          <div class="container section-container">
            <article class="div-card reverse" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-talent.png" alt="Talent" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Talent</h3>
                <p>
                  Divisi Talent bertugas menjadi representasi brand di depan kamera, membuat konten video, live
                  session, atau promosi interaktif. Memiliki peran dalam membangun engagement audiens.
                </p>

                <button class="btn-more" @click="openDivModal('TALENT')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- 7) Videographer (BIRU) -->
        <div class="div-band band-blue" :style="bandStyle('VIDEOGRAPHER', 'blue')">
          <div class="container section-container">
            <article class="div-card" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <img src="../assets/div-video.png" alt="Videographer" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Videographer</h3>
                <p>
                  Divisi Videographer bertanggung jawab pada proses pengambilan gambar, editing video, hingga produksi
                  konten audiovisual. Mendukung kebutuhan promosi dan dokumentasi kegiatan.
                </p>

                <button class="btn-more" @click="openDivModal('VIDEOGRAPHER')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>

        <!-- ✅ 8) IT (PUTIH) - BARU -->
        <div class="div-band band-white" :style="bandStyle('IT', 'white')">
          <div class="container section-container">
            <article class="div-card reverse" data-reveal>
              <div class="div-media" data-reveal style="--d: 0ms">
                <!-- pakai gambar aman dulu biar ga error asset -->
                <img src="../assets/div-IT.png" alt="Information Technology (IT)" />
              </div>

              <div class="div-body glass" data-reveal style="--d: 120ms">
                <h3>Information<br />Technology (IT)</h3>
                <p>
                  Divisi IT membantu kebutuhan teknis dan pengembangan sistem/website, memastikan operasional digital
                  berjalan lancar, serta mendukung integrasi tools yang dipakai tim.
                </p>

                <button class="btn-more" @click="openDivModal('IT')">Selengkapnya →</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ===== ECOSYSTEM GRID ===== -->
      <section id="ecosystem" class="section ecosystem">
        <div class="container section-container center">
          <h2 class="eco-title">EDUKARYA ECOSYSTEM</h2>

          <div class="eco-logos">
            <img src="../assets/ecosystem-logos.png" alt="Edukarya Ecosystem Logos" />
          </div>

          <div class="eco-line"></div>

          <p class="eco-copy">Copyright © 2026 Edukarya Ecosystem By Nashir Al and Zanuba Devin T.R</p>
        </div>
      </section>
    </div>

    <!-- ===== MODAL DETAIL DIVISI ===== -->
    <!-- diposisikan di luar .main agar fixed ngunci ke viewport -->
    <div v-if="divModal" class="modal-backdrop" @click.self="closeDivModal">
      <div class="modal-card" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="modal-title">
            <h3>{{ activeDivTitle }}</h3>
            <p>Detail Kriteria & Job Description</p>
          </div>
          <button class="modal-close" @click="closeDivModal" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <!-- DESKTOP: TABEL -->
          <table v-if="!isMobile" class="detail-table">
            <thead>
              <tr>
                <th>Kriteria</th>
                <th>Job Description</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <ul class="td-list">
                    <li v-for="(it, i) in activeDiv?.kriteria" :key="'k' + i">{{ it }}</li>
                  </ul>
                </td>

                <td>
                  <ul class="td-list">
                    <li v-for="(it, i) in activeDiv?.job" :key="'j' + i">{{ it }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- MOBILE: LAYOUT BEDA TOTAL (CARD), DATA TETAP SAMA -->
          <div v-else class="m-detail">
            <div class="m-block">
              <h4 class="m-head">Kriteria</h4>
              <ul class="td-list">
                <li v-for="(it, i) in activeDiv?.kriteria" :key="'mk' + i">{{ it }}</li>
              </ul>
            </div>

            <div class="m-block">
              <h4 class="m-head">Job Description</h4>
              <ul class="td-list">
                <li v-for="(it, i) in activeDiv?.job" :key="'mj' + i">{{ it }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal-foot">
          <button class="modal-ok" @click="closeDivModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const sidebar = ref(false)
const leaving = ref(false)
const pageReady = ref(false)

/* splash state */
const splashDone = ref(false)

let observer = null

// ===== MODAL STATE =====
const divModal = ref(false)
const activeDivKey = ref("HR")

// ✅ MOBILE DETECTOR (untuk layout modal)
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 600
}

// ===== DATA DETAIL DIVISI (REVISI SESUAI GAMBAR) =====
const DIV_DETAIL = {
  HR: {
    title: "Human Resources",
    kriteria: [
      "Mahasiswa aktif semester 3 ke atas (Psikologi/Manajemen/SDM lebih diutamakan)",
      "Teliti, rapi, dan menjaga kerahasiaan data",
      "Komunikatif dan memiliki interpersonal skill yang baik",
      "Mampu mengoperasikan Google Workspace / Microsoft Office",
      "Tertarik pada bidang Human Resources",
    ],
    job: [
      "Membantu proses administrasi rekrutmen (posting lowongan, screening CV, jadwal interview)",
      "Mengelola database kandidat & karyawan",
      "Membantu onboarding karyawan baru",
      "Mendukung kegiatan internal (engagement, evaluasi, absensi)",
      "Membantu pembuatan laporan HR",
    ],
  },

  VIDEOGRAPHER: {
    title: "Videographer",
    kriteria: [
      "Menguasai software editing (CapCut/Premiere/Final Cut, dll)",
      "Kreatif dan memiliki sense visual yang baik",
      "Memahami framing dan basic sinematografi",
      "Memiliki portofolio (lebih disukai)",
      "Siap bekerja sesuai deadline",
    ],
    job: [
      "Mengambil footage kegiatan/event",
      "Editing video untuk konten sosial media",
      "Membuat short video, reels, atau highlight",
      "Mengatur pencahayaan & audio sederhana",
      "Menyimpan dan mengarsipkan file video",
    ],
  },

  CONTENT: {
    title: "Content Management",
    kriteria: [
      "Memiliki kemampuan menulis yang baik",
      "Kreatif dan detail",
      "Memahami storytelling dasar",
      "Mampu bekerja dengan deadline",
      "Familiar dengan Google Docs & tools content",
    ],
    job: [
      "Membuat dan mengedit konten (artikel, caption, script)",
      "Proofreading dan quality control konten",
      "Riset topik dan tren",
      "Optimasi konten dasar (SEO sederhana)",
    ],
  },

  DESIGN: {
    title: "Design",
    kriteria: [
      "Aktif di media sosial",
      "Kreatif dan responsif",
      "Mampu menggunakan tools design dasar (Canva, dll)",
      "Memiliki kreativitas tinggi",
      "Mampu menerjemahkan brief singkat menjadi karya visual",
      "Terbuka terhadap revisi dan masukan",
    ],
    job: [
      "Membuat aset visual utama seperti logo, kartu nama, letterhead, dan identitas lainnya",
      "Mendesain seluruh perlengkapan visual untuk diklat dan webinar (poster acara, sertifikat, virtual background, dan materi presentasi)",
      "Menyusun desain untuk iklan digital, brosur, banner, dan katalog layanan pelatihan",
      "Memastikan semua desain yang keluar (baik internal maupun eksternal) sesuai dengan pedoman warna dan gaya (Brand Guidelines) perusahaan",
    ],
  },

  EO: {
    title: "Event Organizer (EO)",
    kriteria: [
      "Mahasiswa aktif semua jurusan",
      "Terorganisir dan detail oriented",
      "Komunikatif dan mampu bekerja dalam tim",
      "Familiar dengan Zoom/Google Meet",
    ],
    job: [
      "Membantu persiapan dan koordinasi acara pelatihan/webinar/diklat",
      "Menghubungi narasumber dan peserta",
      "Mengelola administrasi peserta",
      "Support teknis saat event berlangsung",
      "Membuat laporan evaluasi kegiatan",
    ],
  },

  TALENT: {
    title: "Talent",
    kriteria: [
      "Percaya diri dan komunikatif",
      "Tertarik pada dunia media & podcast",
      "Memiliki kemampuan riset yang baik",
      "Kreatif dan up to date dengan tren konten",
      "Mampu bekerja multitasking",
    ],
    job: [
      "Menjadi host/pembawa acara untuk podcast dan konten",
      "Membuat dan mengembangkan ide konten (podcast, short video, reels, dll)",
      "Menyusun script atau outline pembahasan",
      "Melakukan riset topik yang relevan dan menarik",
      "Melakukan personal branding sebagai talent (jika dibutuhkan)",
      "Evaluasi performa konten bersama tim",
    ],
  },

  MARKETING: {
    title: "Marketing",
    kriteria: [
      "Mahasiswa / Siswi SMA/SMK semua jurusan",
      "Kreatif dan aktif di media sosial",
      "Komunikatif dan percaya diri",
      "Tertarik pada dunia marketing & branding",
      "Mau belajar dan bekerja dengan target",
    ],
    job: [
      "Membantu perencanaan dan eksekusi campaign marketing",
      "Riset pasar dan kompetitor",
      "Membuat database leads",
      "Membantu strategi branding & promosi",
      "Support tim dalam aktivitas digital marketing",
    ],
  },

  // ✅ IT - BARU (isi sembarang dulu sesuai request)
  IT: {
  title: "Information Technology (IT)",
  kriteria: [
    "Mahasiswa IT/Sistem Informasi/Teknik Komputer",
    "Memahami dasar coding (HTML/CSS/JS atau sesuai kebutuhan)",
    "Problem solving yang baik",
    "Teliti dan responsif",
    "Bersedia belajar teknologi baru",
  ],
  job: [
    "Membantu maintenance website/sistem internal",
    "Support troubleshooting teknis",
    "Membantu pengembangan fitur sederhana",
    "Dokumentasi sistem",
    "Support kebutuhan teknis tim",
  ],
},
}

const activeDiv = computed(() => DIV_DETAIL[activeDivKey.value])
const activeDivTitle = computed(() => activeDiv.value?.title || "-")

// ===== BG PER DIVISI (PAKAI GAMBAR UTAMA DIVISI) =====
const DIV_BG = {
  HR: new URL("../assets/div-hr.png", import.meta.url).href,
  CONTENT: new URL("../assets/div-content.png", import.meta.url).href,
  MARKETING: new URL("../assets/div-marketing.png", import.meta.url).href,
  EO: new URL("../assets/div-eo.png", import.meta.url).href,
  DESIGN: new URL("../assets/div-design.png", import.meta.url).href,
  TALENT: new URL("../assets/div-talent.png", import.meta.url).href,
  VIDEOGRAPHER: new URL("../assets/div-video.png", import.meta.url).href,

  // ✅ IT background aman (pakai team.jpg dulu)
  IT: new URL("../assets/div-IT.png", import.meta.url).href,
}

const bandStyle = (key, tone = "blue") => {
  const img = DIV_BG[key] || new URL("../assets/div-IT.png", import.meta.url).href

  const overlay =
    tone === "blue"
      ? "linear-gradient(rgba(47, 91, 211, 0.94), rgba(47, 91, 211, 0.94))"
      : "linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93))"

  return {
    backgroundImage: `${overlay}, url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }
}

const openDivModal = (key) => {
  activeDivKey.value = key
  divModal.value = true
  document.body.style.overflow = "hidden"
}
const closeDivModal = () => {
  divModal.value = false
  document.body.style.overflow = ""
}

onMounted(() => {
  // ✅ init mobile check
  checkMobile()
  window.addEventListener("resize", checkMobile)

  setTimeout(() => {
    pageReady.value = true
  }, 2000)

  const w = document.querySelector(".wrapper")
  w && w.focus()

  setTimeout(() => {
    splashDone.value = true
  }, 2000)

  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"))
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in")
        } else {
          entry.target.classList.remove("reveal-in")
        }
      })
    },
    { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  )

  revealEls.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  window.removeEventListener("resize", checkMobile)
  document.body.style.overflow = ""
})

const openSidebar = () => {
  sidebar.value = true
  if (window.innerWidth <= 900) document.body.style.overflow = "hidden"
}
const closeSidebar = () => {
  sidebar.value = false
  if (!divModal.value) document.body.style.overflow = ""
}

const handleEsc = () => {
  if (divModal.value) return closeDivModal()
  if (sidebar.value) return closeSidebar()
}

const goSection = (id) => {
  closeSidebar()
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 240)
}

const goLogin = () => {
  leaving.value = true
  setTimeout(() => {
    router.push("/login")
  }, 600)
}
</script>

<style scoped>
/* ===== BASE ===== */
.wrapper {
  min-height: 100vh;
  outline: none;
}

/* ===== REVEAL ANIMATION (scroll pop up) ===== */
[data-reveal] {
  opacity: 0;
  transform: translateY(26px) scale(0.985);
  transition: opacity 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
  transition-delay: var(--d, 0ms);
  will-change: transform, opacity;
}
.reveal-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ===== SPLASH ===== */
.splash {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.35s ease;
}
.splash.hide {
  opacity: 0;
  pointer-events: none;
}

.splash-logo {
  width: 260px;
  max-width: 70vw;
  animation: splashPopUp 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes splashPopUp {
  0% {
    transform: translateY(26px) scale(0.92);
    opacity: 0;
  }
  60% {
    transform: translateY(-6px) scale(1.03);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* ===== MAIN ===== */
.main {
  width: 100%;
  transition: margin-left 0.38s cubic-bezier(0.2, 0.9, 0.2, 1), filter 0.28s ease;
}
.main:not(.enter) {
  opacity: 0;
}
.main.enter {
  opacity: 1;
  animation: pageIn 1s cubic-bezier(0.2, 0.9, 0.2, 1) both;
}
@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ✅ BLUR KHUSUS SIDEBAR */
.main.shift {
  filter: blur(3px);
}

/* ✅ BLUR KHUSUS MODAL (terpisah dari sidebar) */
.main.divblur {
  filter: blur(3px);
}

/* ===== BACKDROP ===== */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s ease;
  z-index: 60;
}
.backdrop.show {
  opacity: 1;
  pointer-events: auto;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: #2f5bd3;
  color: white;
  padding: 22px 18px 26px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 70;
  transform: translateX(-102%);
  transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.2, 1);
  box-shadow: 18px 0 55px rgba(0, 0, 0, 0.22);
}
.sidebar.open {
  transform: translateX(0);
}
.close {
  position: absolute;
  right: 14px;
  top: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}
.sb-logo {
  width: 185px;
  margin-top: 18px;
}
.sb-sub {
  font-size: 13px;
  margin: 10px 0 14px;
  opacity: 0.95;
  font-weight: 700;
}
.sb-section {
  margin-top: 18px;
}
.sb-section h4 {
  margin: 0 0 10px;
  font-size: 16px;
}
.sb-link {
  display: block;
  font-size: 13px;
  margin: 7px 0;
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.95);
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}
.sb-link:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
}

/* ===== DESKTOP: geser konten ===== */
@media (min-width: 901px) {
  .main.shift {
    margin-left: 280px;
  }
  .backdrop {
    background: rgba(0, 0, 0, 0.14);
  }
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 620px;
  height: 85vh;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(rgba(47, 91, 211, 0.86), rgba(47, 91, 211, 0.86)), url("../assets/poto.png");
  background-size: cover;
  background-position: center;
  transform: translateY(-60px);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.2, 0.9, 0.2, 1);
}
.hero.show {
  transform: translateY(0);
  opacity: 1;
}
.topbar {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 20;
  transition: opacity 0.18s ease;
}
.topbar.hide {
  opacity: 0;
  pointer-events: none;
}
.menu {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 1;
}
.hamburger {
  display: inline-block;
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
  opacity: 0.98;
}
.menu:hover .hamburger {
  opacity: 1;
}
.hero-inner {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 110px;
  text-align: center;
}
.hero-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.hero-logo {
  width: min(240px, 58vw);
  height: auto;
  display: block;
}
.hero-title {
  width: min(860px, 92vw);
  height: auto;
  display: block;
  filter: drop-shadow(0 16px 30px rgba(0, 0, 0, 0.22));
}
.cta.hero-cta {
  font-size: 25px;
  font-weight: 900;
  padding: 18px 42px;
  position: relative;
  z-index: 30;
  margin-top: 80px;
  background: #fff;
  color: #2f5bd3;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.cta.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.24);
}
.hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22%;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 45%,
    rgba(255, 255, 255, 0.55) 72%,
    rgba(255, 255, 255, 1) 100%
  );
}
@media (max-width: 900px) {
  .hero {
    min-height: 560px;
    height: 80vh;
  }
  .hero-inner {
    padding-top: 30px;
    padding-bottom: 120px;
  }
  .hamburger {
    font-size: 34px;
  }
  .hero-title {
    width: min(760px, 94vw);
  }
}
@media (max-width: 520px) {
  .hero-inner {
    padding-bottom: 140px;
  }
  .hero-fade {
    height: 30%;
  }
}

/* ===== SECTIONS ===== */
.section {
  padding: 54px 16px;
}
.section-container {
  text-align: left;
}
.center {
  text-align: center;
}

/* ===== GLOBAL CONTAINER FIX ===== */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
  box-sizing: border-box;
}
.divisi .container {
  max-width: 1200px;
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
}

/* =========================
   TENTANG
========================= */
.tentang-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.tentang-text h3 {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
}
.tentang-text p {
  font-size: 20px;
  line-height: 1.8;
  color: #0f172a;
  margin-bottom: 18px;
  font-weight: 500;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  background: #e2e8f0;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #0f172a;
}
.btn-secondary:hover {
  background: #dbe3f5;
  transform: translateX(4px);
}
.tentang-image {
  display: flex;
  justify-content: center;
}
.tentang-image img {
  width: 100%;
  max-width: 520px;
  border-radius: 20px;
  transform: rotate(-2deg);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
}
@media (max-width: 900px) {
  .tentang-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .tentang-image img {
    transform: none;
  }
}

/* =========================
   SASARAN
========================= */
.sasaran-section {
  margin-top: 60px;
}
.sasaran-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}
.sasaran-title .line {
  width: 40px;
  height: 4px;
  background: #2f5bd3;
  border-radius: 2px;
}
.sasaran-title h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
}
.sasaran-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.sasaran-card {
  background: #ffffff;
  padding: 30px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
}
.sasaran-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}
.icon-circle {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  background: #eef2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #2f5bd3;
}
.sasaran-card h4 {
  margin: 10px 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}
.sasaran-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  font-weight: 600;
}
@media (max-width: 1024px) {
  .sasaran-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .sasaran-grid {
    grid-template-columns: 1fr;
  }
}

/* =========================
   DIVISI
========================= */
.divisi {
  padding: 34px 0 0;
  background: #ffffff;
}
.divisi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  padding: 60px 0 40px;
}
.divisi-left h2 {
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  color: #0f172a;
}
.divisi-left span {
  color: #2f5bd3;
}
.divisi-right {
  max-width: 420px;
}
.divisi-right p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  font-weight: 600;
}
@media (max-width: 900px) {
  .divisi-header {
    flex-direction: column;
    gap: 16px;
  }
  .divisi-left h2 {
    font-size: 36px;
  }
}

.div-band {
  position: relative;
  padding: 70px 0;
  overflow: hidden;
}

/* background image sekarang di-handle dari :style bandStyle() */
.band-blue {
  /* nothing */
}
.band-white {
  border: none;
}

.div-card {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  background: transparent;
  border: 0;
  padding: 0;
  box-shadow: none;
  color: inherit;
}
.div-card.reverse .div-body {
  order: 1;
}
.div-card.reverse .div-media {
  order: 2;
}
.div-media {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.26);
  max-width: 600px;
  margin: 0 auto;
}
.div-media img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 18px;
  border: none !important;
  outline: none !important;
}
.div-body h3 {
  margin: 0 0 10px;
  font-size: 64px;
  line-height: 1.02;
  font-weight: 900;
  letter-spacing: 0.3px;
}
.div-body p {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  font-weight: 600;
  max-width: 540px;
}
.band-blue .div-body h3,
.band-blue .div-body p {
  color: rgba(255, 255, 255, 0.98);
}
.band-white .div-body h3 {
  color: #2f5bd3;
}
.band-white .div-body p {
  color: #334155;
  opacity: 0.92;
}
@media (max-width: 900px) {
  .div-card {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .div-card.reverse .div-body,
  .div-card.reverse .div-media {
    order: initial;
  }
  .div-body h3 {
    font-size: 40px;
  }
}

.btn-more {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.18s ease;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.band-white .btn-more {
  background: rgba(47, 91, 211, 0.08);
  border: 1px solid rgba(47, 91, 211, 0.22);
  color: #2f5bd3;
}
.btn-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
}

/* ===== MODAL ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 18px;
}
.modal-card {
  width: min(980px, 96vw);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  animation: modalIn 0.22s ease both;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.modal-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
}
.modal-title p {
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.6);
}
.modal-close {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  font-size: 18px;
}
.modal-body {
  padding: 14px 16px 16px;
  overflow: auto;
  max-height: min(70vh, 620px);
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.detail-table thead th {
  background: #2f5bd3;
  color: #fff;
  text-align: left;
  padding: 12px 12px;
  font-weight: 900;
}
.detail-table td {
  border: 1px solid rgba(0, 0, 0, 0.08);
  vertical-align: top;
  padding: 12px;
}
.td-div {
  font-weight: 900;
  color: #0f172a;
  text-align: center;
}
.td-list {
  margin: 0;
  padding-left: 18px;
  line-height: 1.65;
  font-weight: 650;
  color: rgba(15, 23, 42, 0.85);
}
.modal-foot {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.modal-ok {
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  background: #2f5bd3;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

/* ✅ MOBILE MODAL LAYOUT (beda total) */
.m-detail {
  display: grid;
  gap: 12px;
}
.m-block {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  padding: 12px;
}
.m-head {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
}

/* biar modal lebih enak di HP */
@media (max-width: 600px) {
  .modal-backdrop {
    padding: 12px;
    align-items: flex-end;
  }
  .modal-card {
    width: 100%;
    border-radius: 16px;
  }
  .modal-body {
    padding: 12px;
    max-height: 78vh;
  }
  .td-list {
    padding-left: 18px;
  }
}

/* ===== ECOSYSTEM FOOTER ===== */
.ecosystem {
  background: #fff;
  padding: 56px 10px 30px;
}
.eco-title {
  margin: 0 0 22px;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #2f5bd3;
}
.eco-logos {
  display: flex;
  justify-content: center;
  align-items: center;
}
.eco-logos img {
  width: min(980px, 92vw);
  height: auto;
  display: block;
}
.eco-line {
  margin: 26px auto 14px;
  width: min(1100px, 92%);
  height: 2px;
  background: #2f5bd3;
  opacity: 0.9;
}
.eco-copy {
  margin: 0;
  font-size: 14px;
  color: #2f5bd3;
  font-weight: 600;
}

/* ===== page out ===== */
.main.leaving {
  animation: pageOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes pageOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* =========================
   HERO FIX KHUSUS HP
========================= */
@media (max-width: 600px) {
  .hero-logo {
    width: 140px;
  }

  .hero-title {
    width: 92%;
  }

  .hero-center {
    gap: 10px;
  }

  .cta.hero-cta {
    font-size: 16px;
    padding: 12px 22px;
    margin-top: 28px;
  }

  .hero {
    min-height: 520px;
    height: 75vh;
  }
}
</style>