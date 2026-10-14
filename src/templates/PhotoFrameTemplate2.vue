<script setup>
import { usePhotoStore } from '../stores/photoStore'
import PhotoFrameTemplate1 from './PhotoFrameTemplate1.vue'

const photoStore = usePhotoStore()

const props = defineProps({
  // Bisa menerima custom styling jika diperlukan
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <!-- 
    =============================================================================
    🎨 TEMPLATE 2: NOIR SPOTLIGHT (WRAPPER TEMPLATE 1 DENGAN BACKGROUND B&W & GARIS)
    =============================================================================
    Template 2 adalah Template 1 yang ditaruh di tengah kanvas berasio 9:16 / 16:9,
    diberi latar belakang foto hitam-putih (monochrome noir), serta aksen garis
    artistik di pojok kanan-atas dan pojok kiri-bawah.
    =============================================================================
  -->
  <div
    class="photo-frame-card-template2 relative w-full aspect-[9/16] overflow-hidden bg-slate-950 select-none text-left shadow-2xl flex flex-col justify-center items-center p-4 sm:p-6"
    :class="customClass"
  >
    <!-- 🌑 1. BACKGROUND FOTO HITAM PUTIH (MONOCHROME NOIR) -->
    <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <img
        v-if="photoStore.imageUrl"
        :src="photoStore.imageUrl"
        alt="Background Monochrome"
        class="w-full h-full object-cover filter grayscale contrast-110 brightness-90 block"
        crossorigin="anonymous"
      />
      <!-- Subtle vignette overlay -->
      <div class="absolute inset-0 bg-black/15 pointer-events-none"></div>
    </div>

    <!-- 🖼️ 2. CARD UTAMA DENGAN AKSEN GARIS FRAME ARTISTIK -->
    <div class="relative z-10 w-[84%] sm:w-[82%] max-w-[360px] mx-auto flex flex-col items-center">
      
      <!-- Aksen Sudut Atas-Kanan (Top-Right Corner Bracket) -->
      <div
        class="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-28 sm:w-36 h-36 sm:h-48 border-t-2 border-r-2 sm:border-t-[2.5px] sm:border-r-[2.5px] border-white pointer-events-none z-0"
      ></div>

      <!-- Aksen Sudut Bawah-Kiri (Bottom-Left Corner Bracket) -->
      <div
        class="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-28 sm:w-36 h-36 sm:h-48 border-b-2 border-l-2 sm:border-b-[2.5px] sm:border-l-[2.5px] border-white pointer-events-none z-0"
      ></div>

      <!-- Aksen Garis Vertikal Sisi Kiri (Aesthetic Dash Tick) -->
      <div
        class="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 w-[2px] h-14 sm:h-20 bg-white/80 rounded-full pointer-events-none z-0"
      ></div>

      <!-- KARTU UTAMA: TEMPLATE 1 ASLI -->
      <div class="relative z-10 w-full">
        <PhotoFrameTemplate1 />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Styling tambahan untuk Template 2 jika diperlukan */
</style>
