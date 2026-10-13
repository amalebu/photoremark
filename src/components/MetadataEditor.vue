<script setup>
import { ref } from 'vue'
import { usePhotoStore } from '../stores/photoStore'
import { Sliders, ChevronDown, ChevronUp } from 'lucide-vue-next'

const photoStore = usePhotoStore()
const isOpen = ref(false)

const textFields = [
  { key: 'title', label: 'Judul foto', placeholder: 'mis. Sol Sepatu' },
  { key: 'lensInfo', label: 'Lensa / kamera', placeholder: 'mis. Telephoto lens - 69mm' },
]

const fileFields = [
  { key: 'fileSize', label: 'Ukuran' },
  { key: 'dimensionsText', label: 'Dimensi' },
  { key: 'megapixelsText', label: 'MP' },
]

const exposureFields = [
  { key: 'iso', label: 'ISO' },
  { key: 'focalLength', label: 'Focal' },
  { key: 'ev', label: 'EV' },
  { key: 'aperture', label: 'Aperture' },
  { key: 'shutterSpeed', label: 'Shutter' },
]

const themes = [
  { id: 'white', label: 'Putih' },
  { id: 'dark', label: 'Gelap' },
  { id: 'mint', label: 'Mint' },
]

const borders = [
  { id: 'compact', label: 'Tipis' },
  { id: 'normal', label: 'Standar' },
  { id: 'spacious', label: 'Lebar' },
]

const inputClass =
  'w-full bg-white border border-hairline rounded-[12px] px-3 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors'
</script>

<template>
  <div class="bg-white border border-hairline rounded-[24px] shadow-float overflow-hidden">
    <!-- Accordion header -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between p-4 lg:p-5 text-left lg:cursor-default"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-mint border border-ink flex items-center justify-center">
          <Sliders class="w-4.5 h-4.5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-display font-bold text-lg leading-none">Teks & bingkai</span>
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-ink"
              :class="photoStore.metadata.hasExif ? 'bg-primary text-ink' : 'bg-soft text-ink'"
            >
              {{ photoStore.metadata.hasExif ? 'EXIF terbaca' : 'Manual' }}
            </span>
          </div>
          <div class="text-[13px] text-muted font-medium mt-1">
            {{ isOpen ? 'Ketuk untuk tutup' : 'Ubah judul, lensa & exposure' }}
          </div>
        </div>
      </div>
      <div class="w-8 h-8 rounded-full bg-soft flex items-center justify-center lg:hidden">
        <ChevronUp v-if="isOpen" class="w-4 h-4" />
        <ChevronDown v-else class="w-4 h-4" />
      </div>
    </button>

    <div :class="isOpen ? 'block' : 'hidden lg:block'" class="px-4 lg:px-5 pb-5 pt-1 space-y-5 border-t border-hairline">
      <!-- Title & lens -->
      <div class="space-y-3 pt-4">
        <label v-for="f in textFields" :key="f.key" class="block">
          <span class="block text-[13px] font-semibold mb-1.5">{{ f.label }}</span>
          <input v-model="photoStore.metadata[f.key]" type="text" :placeholder="f.placeholder" :class="inputClass" />
        </label>
      </div>

      <!-- File metrics -->
      <div>
        <span class="block text-[13px] font-semibold mb-1.5">Metrik file</span>
        <div class="grid grid-cols-3 gap-2">
          <label v-for="f in fileFields" :key="f.key" class="block">
            <span class="block text-[11px] text-muted font-medium mb-1">{{ f.label }}</span>
            <input v-model="photoStore.metadata[f.key]" type="text" :class="inputClass" />
          </label>
        </div>
      </div>

      <!-- Exposure -->
      <div>
        <span class="block text-[13px] font-semibold mb-1.5">Exposure</span>
        <div class="grid grid-cols-3 gap-2">
          <label v-for="f in exposureFields" :key="f.key" class="block">
            <span class="block text-[11px] text-muted font-medium mb-1">{{ f.label }}</span>
            <input v-model="photoStore.metadata[f.key]" type="text" :class="inputClass" />
          </label>
        </div>
      </div>

      <!-- Theme -->
      <div class="pt-4 border-t border-hairline space-y-4">
        <div>
          <span class="block text-[13px] font-semibold mb-2">Tema warna</span>
          <div class="flex gap-2">
            <button
              v-for="t in themes"
              :key="t.id"
              type="button"
              @click="photoStore.frameConfig.theme = t.id"
              class="flex-1 py-2 rounded-[18px] text-sm font-semibold border transition-colors"
              :class="photoStore.frameConfig.theme === t.id ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-hairline'"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div>
          <span class="block text-[13px] font-semibold mb-2">Ketebalan border</span>
          <div class="flex gap-2">
            <button
              v-for="b in borders"
              :key="b.id"
              type="button"
              @click="photoStore.frameConfig.borderScale = b.id"
              class="flex-1 py-2 rounded-[18px] text-sm font-semibold border transition-colors"
              :class="photoStore.frameConfig.borderScale === b.id ? 'bg-primary text-ink border-ink' : 'bg-white text-ink border-hairline'"
            >
              {{ b.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
