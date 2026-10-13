<script setup>
import { ref } from 'vue'
import { usePhotoStore } from '../stores/photoStore'
import { UploadCloud, Sparkles } from 'lucide-vue-next'

const photoStore = usePhotoStore()
const isDragging = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    photoStore.processFile(file)
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && (file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name))) {
    photoStore.processFile(file)
  }
}

const loadSampleImage = async () => {
  try {
    photoStore.isLoading = true
    const response = await fetch(`${import.meta.env.BASE_URL}sample.jpg`)
    const blob = await response.blob()
    const file = new File([blob], 'sol_sepatu.jpg', { type: 'image/jpeg' })
    await photoStore.processFile(file)
    photoStore.setSampleData()
  } catch (err) {
    console.error('Failed to load sample image:', err)
  } finally {
    photoStore.isLoading = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Feature card (signature 40px corner, sharp bottom-left) -->
    <div
      class="card-signature bg-white p-5 sm:p-7 shadow-float transition-all"
      :class="isDragging ? 'ring-2 ring-primary' : ''"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*,.heic,.heif"
        class="hidden"
        @change="handleFileChange"
      />

      <button
        type="button"
        @click="triggerFileInput"
        class="w-full rounded-2xl border-2 border-dashed border-ink/25 bg-soft/60 py-9 sm:py-12 lg:py-16 px-4 flex flex-col items-center gap-3 active:bg-soft transition-colors"
      >
        <div class="w-16 h-16 rounded-full bg-primary border border-ink flex items-center justify-center">
          <UploadCloud class="w-8 h-8 text-ink" />
        </div>
        <div class="space-y-1">
          <h3 class="font-display font-bold text-2xl sm:text-3xl leading-tight">Pilih foto</h3>
          <p class="text-sm text-muted font-medium">
            <span class="lg:hidden">Ketuk untuk buka galeri atau kamera</span>
            <span class="hidden lg:inline">Klik untuk pilih file, atau seret &amp; lepas foto ke sini</span>
          </p>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-semibold">
          <span class="px-3 py-0.5 rounded-full bg-white border border-hairline">JPEG</span>
          <span class="px-3 py-0.5 rounded-full bg-white border border-hairline">PNG</span>
          <span class="px-3 py-0.5 rounded-full bg-white border border-hairline">WEBP</span>
          <span class="px-3 py-0.5 rounded-full bg-mint border border-ink">HEIC</span>
        </div>
      </button>

      <!-- Primary black pill -->
      <button
        type="button"
        @click="triggerFileInput"
        class="mt-4 w-full bg-ink text-white rounded-full py-3.5 text-base font-semibold active:scale-[0.98] transition-transform"
      >
        Upload Foto
      </button>
    </div>

    <!-- Signature mint-green pill -->
    <button
      type="button"
      @click.stop="loadSampleImage"
      class="w-full flex items-center justify-center gap-2 bg-primary text-ink border border-ink rounded-full py-3.5 text-base font-semibold active:scale-[0.98] transition-transform"
    >
      <Sparkles class="w-4.5 h-4.5" />
      Coba contoh "Sol Sepatu"
    </button>
  </div>
</template>
