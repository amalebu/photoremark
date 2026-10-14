<script setup>
import { computed } from 'vue'
import { usePhotoStore } from '../stores/photoStore'
import PhotoFrameTemplate1 from './PhotoFrameTemplate1.vue'
import PhotoFrameTemplate2 from './PhotoFrameTemplate2.vue'

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
    🎨 PHOTO FRAME TEMPLATE DISPATCHER
    =============================================================================
    Komponen ini otomatis merender template yang dipilih user:
    - Template 1: `src/templates/PhotoFrameTemplate1.vue` (Classic Minimal / Studio)
    - Template 2: `src/templates/PhotoFrameTemplate2.vue` (Noir Spotlight & Geometric Badge)
    
    Anda bisa mengotak-atik masing-masing template langsung di filenya masing-masing!
    =============================================================================
  -->
  <div class="photo-frame-root w-full flex justify-center">
    <!-- Template 1: Classic Minimalist -->
    <PhotoFrameTemplate1
      v-if="photoStore.frameConfig.templateId === 'template1'"
      :custom-class="customClass"
    />

    <!-- Template 2: Noir Spotlight & Geometric Badge -->
    <PhotoFrameTemplate2
      v-else-if="photoStore.frameConfig.templateId === 'template2'"
      :custom-class="customClass"
    />
  </div>
</template>
