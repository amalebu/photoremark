<script setup>
import { usePhotoStore } from './stores/photoStore'
import PhotoUploader from './components/PhotoUploader.vue'
import PhotoFramePreview from './components/PhotoFramePreview.vue'
import MetadataEditor from './components/MetadataEditor.vue'
import { Camera, Trash2, ShieldCheck, Zap, Layers, MonitorSmartphone } from 'lucide-vue-next'

const photoStore = usePhotoStore()

const tickerItems = [
  'ISO', 'F-STOP', 'SHUTTER SPEED', 'FOCAL LENGTH', 'EV BIAS', 'LENS INFO',
  'FILE SIZE', 'RESOLUTION', 'MEGAPIXELS', 'EXIF', 'NO COMPRESSION', 'NO BACKEND',
]

const stats = [
  { icon: ShieldCheck, value: '0', label: 'Backend & server upload' },
  { icon: Zap, value: '1:1', label: 'Resolusi asli, tanpa kompresi' },
  { icon: Layers, value: '100%', label: 'Diproses lokal di perangkatmu' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white font-sans text-ink">
    <!-- Nav bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hairline">
      <div class="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-primary border border-ink flex items-center justify-center">
            <Camera class="w-4.5 h-4.5 text-ink" />
          </div>
          <div class="leading-none min-w-0">
            <h1 class="font-display font-bold text-lg sm:text-xl tracking-tight">
              Photo<span class="bg-primary px-1 ml-0.5 rounded-md">Meta</span>
            </h1>
            <p class="text-[11px] sm:text-xs text-muted font-medium mt-1 truncate">Frame EXIF tanpa kompresi</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-ink/70">
            <MonitorSmartphone class="w-4 h-4" />
            HP • Tablet • Desktop
          </span>
          <button
            v-if="photoStore.hasImage"
            type="button"
            @click="photoStore.resetPhoto"
            title="Hapus foto dan upload ulang dari awal untuk baca EXIF baru"
            class="flex items-center gap-1.5 bg-ink text-white rounded-[18px] px-4 py-1.5 text-sm font-semibold active:scale-95 hover:bg-ink/85 transition"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <span
            v-else
            class="flex items-center gap-1 bg-mint text-ink border border-ink/10 rounded-[18px] px-3 py-1 text-xs sm:text-sm font-semibold"
          >
            100% Lokal
          </span>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <!-- STATE 1: Belum ada foto -->
      <template v-if="!photoStore.hasImage">
        <!-- Hero mint band: 1 kolom di HP, 2 kolom di desktop -->
        <section class="bg-mint">
          <div class="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16 lg:py-24 grid gap-8 lg:gap-14 lg:grid-cols-2 lg:items-center">
            <div class="space-y-4 sm:space-y-5 text-left">
              <span class="inline-flex items-center gap-1.5 bg-white border border-ink rounded-full px-3 py-1 text-xs sm:text-sm font-semibold">
                <span class="w-2 h-2 rounded-full bg-primary border border-ink"></span>
                100% di browser, tanpa backend
              </span>
              <h2 class="font-display font-bold text-[44px] sm:text-6xl xl:text-[80px] leading-[1.05] tracking-[-1px]">
                Ekstrak metadata,
                <span class="bg-primary px-1.5 rounded-lg box-decoration-clone">bingkai fotomu</span>
                tanpa kompresi.
              </h2>
              <p class="text-base sm:text-lg font-light leading-relaxed text-ink/80 max-w-xl">
                Upload foto, baca EXIF otomatis, lalu download hasil berbingkai dengan resolusi asli 1:1.
              </p>
            </div>

            <div class="w-full max-w-xl mx-auto lg:max-w-none">
              <PhotoUploader />
            </div>
          </div>
        </section>

        <!-- Black ticker (full-bleed) -->
        <section class="bg-ink text-white overflow-hidden py-3.5 sm:py-4" aria-hidden="true">
          <div class="flex w-max animate-marquee gap-8 text-sm font-medium whitespace-nowrap">
            <template v-for="n in 2" :key="n">
              <span v-for="(item, i) in tickerItems" :key="n + '-' + i" class="flex items-center gap-8">
                {{ item }}
                <span class="w-2 h-2 rounded-full bg-primary"></span>
              </span>
            </template>
          </div>
        </section>

        <!-- Stats: tumpuk di HP, 3 kolom di tablet/desktop -->
        <section class="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16 grid gap-4 sm:gap-5 md:grid-cols-3">
          <div
            v-for="s in stats"
            :key="s.label"
            class="flex items-center gap-4 bg-mint rounded-[24px] px-5 py-4 sm:py-6"
          >
            <div class="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-white border border-ink flex items-center justify-center">
              <component :is="s.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="font-display font-bold text-[38px] sm:text-5xl leading-none">{{ s.value }}</div>
              <div class="text-[13px] sm:text-sm font-medium text-ink/70 mt-1">{{ s.label }}</div>
            </div>
          </div>
        </section>
      </template>

      <!-- STATE 2: Ada foto — 1 kolom di HP/tablet, 2 kolom di desktop -->
      <section v-else class="bg-mint min-h-[70vh]">
        <div class="max-w-6xl mx-auto px-3.5 sm:px-8 py-5 sm:py-8 lg:py-10 grid gap-4 lg:gap-8 lg:grid-cols-12 lg:items-start">
          <div class="lg:col-span-7 min-w-0">
            <PhotoFramePreview />
          </div>
          <div class="lg:col-span-5 min-w-0 lg:sticky lg:top-24">
            <MetadataEditor />
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-hairline">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-6 text-center sm:text-left text-[13px] sm:text-sm text-muted font-medium">
        100% Frontend • Resolusi asli 1:1 • Tanpa kompresi
      </div>
    </footer>

    <!-- Loading overlay (mis. konversi HEIC) -->
    <div
      v-if="photoStore.isLoading"
      class="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div class="bg-white rounded-[24px] px-6 py-5 flex items-center gap-4 shadow-float max-w-sm">
        <span class="w-6 h-6 shrink-0 rounded-full border-[3px] border-ink border-t-primary animate-spin"></span>
        <p class="font-semibold text-sm">{{ photoStore.loadingMessage }}</p>
      </div>
    </div>

    <!-- Error toast -->
    <div
      v-if="photoStore.error"
      class="fixed bottom-4 inset-x-4 z-[60] mx-auto max-w-md bg-ink text-white rounded-[18px] px-4 py-3 flex items-start justify-between gap-3 text-sm font-medium shadow-float"
    >
      <span>{{ photoStore.error }}</span>
      <button type="button" @click="photoStore.error = null" class="text-primary font-semibold shrink-0">Tutup</button>
    </div>
  </div>
</template>
