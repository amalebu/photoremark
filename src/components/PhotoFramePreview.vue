<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { usePhotoStore } from '../stores/photoStore'
import PhotoFrameTemplate from '../templates/PhotoFrameTemplate.vue'
import {
  Download,
  Check,
  Trash2,
  ImagePlus,
  Lock,
  FileDown,
  Maximize2,
  X,
  Type
} from 'lucide-vue-next'
import { toCanvas } from 'html-to-image'
import confetti from 'canvas-confetti'
import MetadataEditor from './MetadataEditor.vue'

const photoStore = usePhotoStore()

const frameTemplateRef = ref(null)
const replaceFileInput = ref(null)
const isDownloading = ref(false)
const viewMode = ref('framed') // 'framed' | 'original'
const downloadSuccess = ref(false)
const isFullscreen = ref(false)

// Fit-to-screen untuk mode full screen: frame diskalakan agar muat penuh
// di tinggi & lebar layar, jadi tidak perlu scroll.
const FS_FRAME_WIDTH = 448
const FS_MARGIN = 24
const fsStageRef = ref(null)
const fsFrameRef = ref(null)
const fsScale = ref(1)
let fsObserver = null

const fitFullscreen = () => {
  const stage = fsStageRef.value
  const frame = fsFrameRef.value
  if (!stage || !frame) return
  const fw = frame.offsetWidth
  const fh = frame.offsetHeight
  if (!fw || !fh) return
  const availW = stage.clientWidth - FS_MARGIN
  const availH = stage.clientHeight - FS_MARGIN
  fsScale.value = Math.max(Math.min(availW / fw, availH / fh, 4), 0.1)
}

const stopFsObserver = () => {
  fsObserver?.disconnect()
  fsObserver = null
}

const startFsObserver = () => {
  stopFsObserver()
  fsObserver = new ResizeObserver(fitFullscreen)
  if (fsStageRef.value) fsObserver.observe(fsStageRef.value)
  if (fsFrameRef.value) fsObserver.observe(fsFrameRef.value)
  fitFullscreen()
}

watch(isFullscreen, async (open) => {
  if (open) {
    await nextTick()
    startFsObserver()
  } else {
    stopFsObserver()
  }
})

// Trigger file input to replace ONLY the image (locking metadata)
const triggerReplaceImage = () => {
  replaceFileInput.value?.click()
}

const handleReplaceFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    photoStore.replaceImageOnly(file)
  }
  e.target.value = ''
}

// Fullscreen controls
const openFullscreen = () => {
  isFullscreen.value = true
  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  }
}

const closeFullscreen = () => {
  isFullscreen.value = false
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {})
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    closeFullscreen()
  }
}

// Download at 100% quality directly from the HTML template strictly as JPG
const downloadImage = async () => {
  if (!frameTemplateRef.value) return
  isDownloading.value = true

  try {
    const el = frameTemplateRef.value.$el || frameTemplateRef.value
    const origW = photoStore.originalDimensions.width
    const currentW = el.offsetWidth

    // Calculate pixelRatio so output canvas matches 100% full original resolution
    const pixelRatio = origW > 0 && currentW > 0 ? Math.max(origW / currentW, 1) : 2

    if (document.fonts?.ready) {
      await document.fonts.ready
    }

    // Gunakan toCanvas lalu canvas.toBlob('image/jpeg', 1.0)
    // Catatan: html-to-image's toBlob memiliki bug dimana parameter options.type tidak diteruskan
    // ke canvasToBlob sehingga selalu menghasilkan Blob bertipe image/png. Akibatnya browser
    // mendeteksi mismatch MIME type dan otomatis menambahkan ekstensi .png menjadi .jpg.png.
    const canvas = await toCanvas(el, {
      pixelRatio: pixelRatio,
      cacheBust: false,
    })

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error('Gagal menghasilkan file JPG dari canvas'))
        },
        'image/jpeg',
        1.0
      )
    })

    if (!blob) {
      throw new Error('Gagal menghasilkan file JPG dari template HTML')
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    // Hapus ekstensi lama jika ada di dalam input judul foto
    const rawTitle = (photoStore.metadata.title || 'photo')
      .replace(/\.(jpe?g|png|webp|heic|heif)$/i, '')
      .trim()

    const sanitizedTitle = (rawTitle || 'photo')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')

    a.href = url
    a.download = `${sanitizedTitle || 'photo'}_framed.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    downloadSuccess.value = true
    setTimeout(() => {
      downloadSuccess.value = false
    }, 3500)

    try {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.85 },
        colors: ['#00f0a0', '#ecffe0', '#000000'],
      })
    } catch {
      // ignore
    }
  } catch (err) {
    console.error('Download error:', err)
  } finally {
    isDownloading.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopFsObserver()
})
</script>

<template>
  <div class="space-y-3.5">
    <!-- Hidden input to replace ONLY image while preserving metadata -->
    <input
      ref="replaceFileInput"
      type="file"
      accept="image/*,.heic,.heif"
      class="hidden"
      @change="handleReplaceFileChange"
    />

    <!-- Status Banner: image replaced, metadata locked -->
    <div
      v-if="photoStore.isImageSwapped"
      class="flex items-center justify-between gap-2 bg-ink text-white px-4 py-2.5 rounded-[18px] text-[13px] font-semibold"
    >
      <div class="flex items-center gap-2">
        <Lock class="w-4 h-4 text-primary shrink-0" />
        <span>Foto diganti • metadata awal dikunci</span>
      </div>
      <button
        type="button"
        @click="photoStore.resetPhoto"
        class="text-primary underline underline-offset-2 shrink-0"
      >
        Baca ulang
      </button>
    </div>

    <!-- View switcher + fullscreen -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center bg-white border border-hairline rounded-full p-1 text-sm font-semibold">
        <button
          type="button"
          @click="viewMode = 'framed'"
          class="px-4 py-1.5 rounded-full transition-colors"
          :class="viewMode === 'framed' ? 'bg-ink text-white' : 'text-ink'"
        >
          Bingkai
        </button>
        <button
          type="button"
          @click="viewMode = 'original'"
          class="px-4 py-1.5 rounded-full transition-colors"
          :class="viewMode === 'original' ? 'bg-ink text-white' : 'text-ink'"
        >
          Asli
        </button>
      </div>

      <button
        type="button"
        @click="openFullscreen"
        class="flex items-center gap-1.5 bg-white border border-ink rounded-full px-4 py-2 text-sm font-semibold active:scale-95 transition-transform"
        title="Tampilkan layar penuh"
      >
        <Maximize2 class="w-4 h-4" />
        Full Screen
      </button>
    </div>

    <!-- Preview stage (tap to replace image) -->
    <div
      class="relative w-full mb-5 rounded-[28px] p-3 sm:p-6 flex flex-col items-center justify-center overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      @click="triggerReplaceImage"
      title="Ketuk foto untuk mengganti gambar tanpa merubah metadata"
    >
      <button
        type="button"
        @click.stop="openFullscreen"
        class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center active:scale-95 transition-transform"
        title="Buka layar penuh"
      >
        <Maximize2 class="w-4 h-4" />
      </button>

      <!-- Mode 1: Framed (HTML template) -->
      <div
        v-show="viewMode === 'framed'"
        class="relative flex justify-center w-full max-w-sm sm:max-w-md "
      >
        <PhotoFrameTemplate ref="frameTemplateRef" />
      </div>

      <!-- Mode 2: Original -->
      <div
        v-show="viewMode === 'original'"
        class="relative max-w-full flex flex-col items-center justify-center"
      >
        <img
          :src="photoStore.imageUrl"
          alt="Foto Asli"
          class="rounded-[12px] max-w-full h-auto max-h-[58vh] lg:max-h-[70vh] object-contain"
        />
        <div class="mt-2 text-[13px] text-muted font-medium">
          Foto asli ({{ photoStore.originalDimensions.width }} × {{ photoStore.originalDimensions.height }})
        </div>
      </div>
    </div>

        <!-- Edit Judul Foto (Langsung di atas tombol download) -->
    <div class="bg-white border border-hairline rounded-[22px] p-3.5 sm:p-4 shadow-float space-y-2 block lg:hidden">
      <div class="flex items-center justify-between gap-2">
        <label for="quick-photo-title" class="px-1 flex items-center gap-2 text-xs sm:text-[13px] font-bold text-ink cursor-pointer select-none">
          <span>Judul Foto</span>
        </label>
      </div>
      <div class="relative flex items-center">
        <input
          id="quick-photo-title"
          v-model="photoStore.metadata.title"
          type="text"
          placeholder="Ketik judul foto di sini..."
          class="w-full bg-[#f6f8f7] border border-hairline focus:border-ink focus:bg-white rounded-[14px] pl-3.5 pr-9 py-2.5 text-sm font-semibold text-ink placeholder:text-muted focus:outline-none transition-colors"
          @keydown.enter="$event.target.blur()"
        />
        <button
          v-if="photoStore.metadata.title"
          type="button"
          @click="photoStore.metadata.title = ''"
          class="absolute right-2.5 p-1 text-muted hover:text-ink rounded-full transition-colors"
          title="Kosongkan judul"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <div class="block lg:hidden">
      <MetadataEditor />
    </div>

    <!-- Secondary actions -->
    <div class="grid grid-cols-2 gap-2">
      <button
        type="button"
        @click="triggerReplaceImage"
        class="flex items-center justify-center gap-1.5 py-3 bg-white border border-ink rounded-[18px] text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        <ImagePlus class="w-4 h-4" />
        Ganti Foto Saja
      </button>

      <button
        type="button"
        @click="photoStore.resetPhoto"
        class="flex items-center justify-center gap-1.5 py-3 bg-white border border-hairline rounded-[18px] text-sm font-semibold text-ink active:scale-[0.98] transition-transform"
      >
        <Trash2 class="w-4 h-4" />
        Hapus & Ulang
      </button>
    </div>


    <!-- Download: Single prominent JPG button (No PNG) -->
    <div>
      <button
        type="button"
        @click="downloadImage"
        :disabled="isDownloading"
        class="w-full flex items-center justify-center gap-2 py-3.5 bg-ink hover:bg-ink/90 active:scale-[0.98] text-white rounded-[28px] text-base font-semibold transition-all disabled:opacity-50 shadow-float"
      >
        <Check v-if="downloadSuccess" class="w-4.5 h-4.5 text-primary" />
        <Download v-else class="w-4.5 h-4.5 text-white" />
        <span>{{ isDownloading ? 'Memproses Unduhan...' : (downloadSuccess ? 'Foto JPG Berhasil Disimpan!' : 'Download Foto (JPG 100%)') }}</span>
      </button>
    </div>

    <!-- FULLSCREEN OVERLAY (black band) -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-50 bg-ink text-white flex flex-col justify-between p-4 select-none font-sans"
      >
        <div class="flex items-center justify-between pb-3">
          <div class="flex items-center gap-2">
            <span class="bg-primary text-ink text-xs font-bold px-3 py-1 rounded-full">Full Screen</span>
            <span class="text-xs font-medium text-muted">
              {{ photoStore.originalDimensions.width }} × {{ photoStore.originalDimensions.height }} px
            </span>
          </div>
          <button
            type="button"
            @click="closeFullscreen"
            class="w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center active:scale-95 transition-transform"
            title="Tutup layar penuh"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Stage: frame diskalakan (fit) ke tinggi/lebar layar, tanpa scroll -->
        <div
          ref="fsStageRef"
          class="relative flex-1 min-h-0 overflow-hidden"
          @click="closeFullscreen"
        >
          <div
            ref="fsFrameRef"
            class="absolute left-1/2 top-1/2 rounded-[12px] overflow-hidden"
            :style="{
              width: FS_FRAME_WIDTH + 'px',
              transform: `translate(-50%, -50%) scale(${fsScale})`,
              transformOrigin: 'center center',
            }"
            @click.stop
          >
            <PhotoFrameTemplate />
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 w-full max-w-xl mx-auto">
          <button
            type="button"
            @click="triggerReplaceImage"
            class="flex items-center gap-1.5 px-4 py-3 bg-white text-ink rounded-[18px] text-sm font-semibold active:scale-95 transition-transform"
          >
            <ImagePlus class="w-4 h-4" />
            Ganti
          </button>

          <button
            type="button"
            @click="downloadImage"
            :disabled="isDownloading"
            class="flex-1 flex items-center justify-center gap-1.5 py-3 bg-primary text-ink border border-white/20 rounded-[36px] text-sm font-semibold active:scale-95 transition-transform disabled:opacity-50"
          >
            <Check v-if="downloadSuccess" class="w-4 h-4" />
            <Download v-else class="w-4 h-4" />
            {{ isDownloading ? 'Memproses...' : (downloadSuccess ? 'Tersimpan!' : 'Download JPG (100%)') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
