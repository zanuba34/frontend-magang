<template>
  <div class="wrap" :class="{ open: modelValue }" @keydown.esc="$emit('update:modelValue', false)" tabindex="-1">
    <!-- klik area gelap (optional) -->
    <div class="backdrop" @click="$emit('update:modelValue', false)"></div>

    <!-- PANEL -->
    <aside class="panel" role="dialog" aria-modal="true" aria-label="Sidebar Menu">
      <button class="close" @click="$emit('update:modelValue', false)" aria-label="Close">✕</button>

      <div class="brand">
        <img class="brand-logo" src="../assets/edukarya.png" alt="Edukarya" />
        <div class="brand-sub">CV. Edukarya Gemilang Jaya</div>
      </div>

      <div class="section">
        <div class="title">Cabang</div>
        <a class="link" href="#">Kota Semarang, Jawa Tengah</a>
        <a class="link" href="#">Kota Surakarta, Jawa Tengah</a>
        <a class="link" href="#">Kota Yogya, Yogyakarta</a>
        <a class="link" href="#">Kota Malang, Jawa Timur</a>
        <a class="link" href="#">Kota Surabaya, Jawa Timur</a>
      </div>

      <div class="section">
        <div class="title">Company</div>
        <a class="link" href="#tentang">Tentang Kami</a>
        <a class="link" href="#">Kerjasama</a>
        <a class="link" href="#">Youtube</a>
        <a class="link" href="#">Instagram</a>
        <a class="link" href="#">Telegram</a>
      </div>

      <div class="section">
        <div class="title">Ecosystem</div>
        <a class="link" href="#">Sapanesia ID | Blog</a>
        <a class="link" href="#">Studio Bahan Ajar</a>
        <a class="link" href="#">Talenta Karta | Vocation</a>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* wrapper */
.wrap{
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
}

/* backdrop */
.backdrop{
  position:absolute;
  inset:0;
  background: rgba(0,0,0,.25);
  opacity:0;
  transition: opacity .25s ease;
}

/* panel full screen */
.panel{
  position:absolute;
  inset:0;
  background: #2f5bd3;
  color: #fff;

  /* animasi masuk */
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity .28s ease, transform .28s ease;

  padding: 28px 26px 34px;
  overflow: auto;
}

/* open state */
.wrap.open{ pointer-events: auto; }
.wrap.open .backdrop{ opacity: 1; }
.wrap.open .panel{
  opacity: 1;
  transform: translateY(0);
}

/* close button */
.close{
  position: absolute;
  right: 18px;
  top: 14px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  opacity: .95;
}

/* brand */
.brand{
  padding-top: 10px;
  margin-bottom: 18px;
}
.brand-logo{
  width: 300px;
  max-width: 78vw;
  display:block;
}
.brand-sub{
  margin-top: 10px;
  font-weight: 700;
  opacity: .95;
}

/* sections */
.section{
  margin-top: 26px;
}
.title{
  font-weight: 900;
  font-size: 18px;
  margin-bottom: 8px;
}
.link{
  display:block;
  padding: 4px 0;
  color: rgba(255,255,255,.95);
  text-decoration: none;
  font-weight: 600;
  opacity: .95;
}
.link:hover{
  opacity: 1;
  text-decoration: underline;
}

/* biar mirip mobile screenshot */
@media (min-width: 900px){
  .panel{
    padding: 34px 44px 44px;
  }
}
</style>
