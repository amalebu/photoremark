<script setup>
import { computed } from 'vue'
import { usePhotoStore } from '../stores/photoStore'

const photoStore = usePhotoStore()

const props = defineProps({
  // Bisa menerima custom styling jika diperlukan
  customClass: {
    type: String,
    default: ''
  }
})

// Konfigurasi Warna Tema (Bisa Anda tambah / ubah warnanya di sini!)
const theme = computed(() => {
  const current = photoStore.frameConfig.theme
  if (current === 'dark') {
    return {
      bg: '#000000',
      title: '#ffffff',
      subtitle: '#d4d4d8',
      metrics: '#86909c',
      exposure: '#00f0a0', // spring-mint accent
    }
  } else if (current === 'mint') {
    return {
      bg: '#ecffe0',
      title: '#000000',
      subtitle: '#3f4a3a',
      metrics: '#5f6b58',
      exposure: '#000000',
    }
  }
  // Default 'white'
  return {
    bg: '#ffffff',
    title: '#000000',
    subtitle: '#86909c',
    metrics: '#86909c',
    exposure: '#86909c',
  }
})

// Konfigurasi Ketebalan Border Frame
const borderPaddingClass = computed(() => {
  const scale = photoStore.frameConfig.borderScale
  if (scale === 'compact') return 'p-1.5 sm:p-2'
  if (scale === 'spacious') return 'p-5 sm:p-7'
  return 'p-3.5 sm:p-5' // normal
})
</script>

<template>
  <!-- 
    =============================================================================
    🎨 TEMPLATE BINGKAI FOTO (PHOTO FRAME HTML TEMPLATE)
    =============================================================================
    File ini khusus untuk mengatur desain bingkai foto.
    Anda bisa bebas mengotak-atik susunan HTML, class Tailwind, maupun CSS di sini!
    
    Contoh yang bisa Anda lakukan:
    - Mengubah font, ukuran teks, dan jarak (padding/margin)
    - Mengubah posisi teks (misal: rata tengah `text-center`, atau split kanan-kiri)
    - Menambahkan logo kamera, watermark nama Anda, atau tanggal foto
    =============================================================================
  -->

  
  <div
    class="photo-frame-card w-full shadow-lagi transition-colors duration-200 select-none text-left"
    :class="[borderPaddingClass, customClass]"
    :style="{ backgroundColor: theme.bg }"
  >
    <!-- 🖼️ 1. AREA FOTO UTAMA -->
    <div class="photo-wrapper w-full overflow-hidden rounded-xs bg-slate-900">
      <img
        v-if="photoStore.imageUrl"
        :src="photoStore.imageUrl"
        alt="Foto Utama"
        class="w-full h-auto block object-contain select-none"
        crossorigin="anonymous"
      />
    </div>

    <!-- 📝 2. AREA FOOTER METADATA (Teks di bawah foto) -->
    <div class="metadata-footer pt-3 pb-5 font-primary px-0.5">
      
      <!-- BARIS 1: Judul Foto (Titillium Web Bold) -->
      <h2
        v-if="photoStore.metadata.title"
        class="frame-title font-bold tracking-tight leading-tight"
        :style="{ color: theme.title }"
      >
        {{ photoStore.metadata.title }}
      </h2>

      <!-- BARIS 2: Keterangan Lensa / Kamera (Subtitle) -->
      <p
        v-if="photoStore.metadata.lensInfo"
        class="frame-subtitle text-[10px] font-medium leading-tight my-0.5"
        :style="{ color: theme.subtitle }"
      >
        {{ photoStore.metadata.lensInfo }}
      </p>

      <!-- BARIS 3: Metrik File (Ukuran | Dimensi | Resolusi MP) -->
      <div
        v-if="photoStore.fileMetricsRow && photoStore.fileMetricsRow.length"
        class="frame-metrics flex items-center divide-x divide-gray-200 text-[10px] font-medium leading-tight mt-0.5"
        :style="{ color: theme.metrics }"
      >
        <span
          v-for="(item, index) in photoStore.fileMetricsRow"
          :key="index"
          class="px-1 first:pl-0 last:pr-0"
        >
          {{ item }}
        </span>
      </div>

      <!-- BARIS 4: Parameter Eksposur (ISO | Focal Length | EV | Aperture | Shutter Speed) -->
      <div
        v-if="photoStore.exposureSettingsRow && photoStore.exposureSettingsRow.length"
        class="frame-exposure flex items-center divide-x divide-gray-200 text-[10px] font-medium leading-tight"
        :style="{ color: theme.exposure }"
      >
        <span
          v-for="(item, index) in photoStore.exposureSettingsRow"
          :key="index"
          class="px-1 first:pl-0 last:pr-0"
        >
          {{ item }}
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.photo-wrapper img {
  image-rendering: auto;
}

/* Dukungan fleksibel bila Anda menulis devide-x atau divide-x */
.devide-x > :not([hidden]) ~ :not([hidden]) {
  border-left-width: 1px;
}
.devide-gray-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: #d1d5db;
}

.shadow-lagi{
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
