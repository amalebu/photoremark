import { defineStore } from 'pinia'
import exifr from 'exifr'
import { isHeicFile, heicToJpegBlob } from '../utils/heic'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    rawFile: null,
    imageUrl: null,
    isLoading: false,
    loadingMessage: 'Memuat foto...',
    error: null,
    isImageSwapped: false, // Flag when image was replaced while locking metadata
    
    // Original image properties (lossless)
    originalDimensions: {
      width: 0,
      height: 0,
      megapixels: 0,
    },
    
    // Extracted & Editable Metadata
    metadata: {
      title: 'Sol Sepatu',
      lensInfo: 'Telephoto lens - 69mm',
      fileSize: '728 KB',
      dimensionsText: '2332x3108',
      megapixelsText: '7MP',
      iso: 'ISO 25',
      focalLength: '69mm',
      ev: '0.0ev',
      aperture: 'F2.4',
      shutterSpeed: '1/1250 s',
      cameraMake: '',
      cameraModel: '',
      dateTaken: '',
      hasExif: false,
      rawExif: null,
    },

    // Frame styling options
    frameConfig: {
      theme: 'white', // 'white' | 'dark' | 'mint'
      borderScale: 'compact', // 'compact' (paling tipis) | 'normal' | 'spacious'
      exportFormat: 'jpeg', // 'jpeg' (100% quality)
      showTitle: true,
      showLensInfo: true,
      showFileMetrics: true,
      showExposureSettings: true,
    },
  }),

  getters: {
    hasImage: (state) => !!state.imageUrl && state.originalDimensions.width > 0,
    
    // Row 1 / Baris 3: File metrics as array of strings
    fileMetricsRow: (state) => {
      const parts = []
      if (state.metadata.fileSize) parts.push(state.metadata.fileSize)
      if (state.metadata.dimensionsText) parts.push(state.metadata.dimensionsText)
      if (state.metadata.megapixelsText) parts.push(state.metadata.megapixelsText)
      return parts
    },

    // Row 2 / Baris 4: Exposure settings as array of strings
    exposureSettingsRow: (state) => {
      const parts = []
      if (state.metadata.iso) parts.push(state.metadata.iso)
      if (state.metadata.focalLength) parts.push(state.metadata.focalLength)
      if (state.metadata.ev) parts.push(state.metadata.ev)
      if (state.metadata.aperture) parts.push(state.metadata.aperture)
      if (state.metadata.shutterSpeed) parts.push(state.metadata.shutterSpeed)
      return parts
    },

    // Aliases
    fileMetrics: (state) => {
      const parts = []
      if (state.metadata.fileSize) parts.push(state.metadata.fileSize)
      if (state.metadata.dimensionsText) parts.push(state.metadata.dimensionsText)
      if (state.metadata.megapixelsText) parts.push(state.metadata.megapixelsText)
      return parts
    },
    exposureSettings: (state) => {
      const parts = []
      if (state.metadata.iso) parts.push(state.metadata.iso)
      if (state.metadata.focalLength) parts.push(state.metadata.focalLength)
      if (state.metadata.ev) parts.push(state.metadata.ev)
      if (state.metadata.aperture) parts.push(state.metadata.aperture)
      if (state.metadata.shutterSpeed) parts.push(state.metadata.shutterSpeed)
      return parts
    },
    fileMetricsRowText: (state) => {
      const parts = []
      if (state.metadata.fileSize) parts.push(state.metadata.fileSize)
      if (state.metadata.dimensionsText) parts.push(state.metadata.dimensionsText)
      if (state.metadata.megapixelsText) parts.push(state.metadata.megapixelsText)
      return parts.join('   |   ')
    },
    exposureSettingsRowText: (state) => {
      const parts = []
      if (state.metadata.iso) parts.push(state.metadata.iso)
      if (state.metadata.focalLength) parts.push(state.metadata.focalLength)
      if (state.metadata.ev) parts.push(state.metadata.ev)
      if (state.metadata.aperture) parts.push(state.metadata.aperture)
      if (state.metadata.shutterSpeed) parts.push(state.metadata.shutterSpeed)
      return parts.join('   |   ')
    },
  },

  actions: {
    formatFileSize(bytes) {
      if (!bytes || bytes <= 0) return '0 KB'
      if (bytes < 1000 * 1000) {
        return `${Math.round(bytes / 1024)} KB`
      }
      // Decimal MB matching smartphone gallery & camera app metadata (e.g. 1.43 MB)
      const mb = (bytes / 1000000).toFixed(2)
      return `${mb} MB`
    },

    formatShutterSpeed(exposureTime) {
      if (!exposureTime || exposureTime <= 0) return ''
      if (exposureTime >= 1) {
        return `${Number(exposureTime).toFixed(1).replace(/\.0$/, '')} s`
      }
      const denominator = Math.round(1 / exposureTime)
      return `1/${denominator} s`
    },

    formatAperture(fnumber) {
      if (!fnumber) return ''
      const num = Number(fnumber)
      return `F${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}`
    },

    formatEV(bias) {
      if (bias === undefined || bias === null || isNaN(bias)) return '0.0ev'
      const num = Number(bias)
      const sign = num > 0 ? '+' : ''
      return `${sign}${num.toFixed(1)}ev`
    },

    // Menghasilkan URL gambar yang bisa ditampilkan browser.
    // HEIC/HEIF di-decode ke JPEG (kualitas 100%); format lain dipakai apa adanya.
    async createDisplayUrl(file) {
      const heic = await isHeicFile(file)
      this.loadingMessage = heic
        ? 'Mengonversi HEIC ke JPG (kualitas 100%)...'
        : 'Memuat foto...'
      let blob = file
      if (heic) {
        try {
          blob = await heicToJpegBlob(file)
        } catch (err) {
          console.error('HEIC convert error:', err)
          throw new Error('Gagal membaca file HEIC. Coba file lain atau ekspor ke JPG dulu.')
        }
      }
      return URL.createObjectURL(blob)
    },

    // Initial Process: Reads image + extracts metadata fresh
    async processFile(file) {
      if (!file) return
      this.isLoading = true
      this.error = null
      this.isImageSwapped = false

      try {
        // Konversi dulu sebelum mengganti state, supaya foto lama tetap utuh jika gagal
        const newUrl = await this.createDisplayUrl(file)
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl)
        }

        this.rawFile = file
        this.imageUrl = newUrl

        // Read natural dimensions without any compression or alteration
        const dims = await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
            })
          }
          img.onerror = () => reject(new Error('Gagal memuat gambar asli'))
          img.src = this.imageUrl
        })

        const mp = Math.round((dims.width * dims.height) / 1000000)
        this.originalDimensions = {
          width: dims.width,
          height: dims.height,
          megapixels: mp,
        }

        // Format basic file metrics from original file
        this.metadata.fileSize = this.formatFileSize(file.size)
        this.metadata.dimensionsText = `${dims.width}x${dims.height}`
        this.metadata.megapixelsText = `${mp}MP`

        // Extract EXIF first so we can use Model for title if filename is a timestamp
        let exif = null
        try {
          exif = await exifr.parse(file, {
            tiff: true,
            xmp: true,
            exif: true,
            gps: true,
            mergeOutput: true,
          })
        } catch (exifErr) {
          console.warn('EXIF parse warning:', exifErr)
        }

        // Clean filename for default title
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())

        // If filename is a camera timestamp/generic name (e.g. 20261013 091721), use camera Model as title
        const isGenericTimestamp = /^[0-9\s]+$/.test(cleanName) || /^(IMG|PXL|DSC|SAM|PHOTO)/i.test(cleanName)
        if (isGenericTimestamp && exif?.Model) {
          this.metadata.title = exif.Model
        } else {
          this.metadata.title = cleanName || exif?.Model || 'Sol Sepatu'
        }

        if (exif && Object.keys(exif).length > 0) {
          this.metadata.hasExif = true
          this.metadata.rawExif = exif

          // Camera Make & Model
          this.metadata.cameraMake = exif.Make || ''
          this.metadata.cameraModel = exif.Model || ''

          // 35mm Equivalent Focal Length (critical for smartphones like Samsung/iPhone)
          const focal35 = exif.FocalLengthIn35mmFormat || exif.FocalLengthIn35mmFilm
          const focalActual = exif.FocalLength
          const effectiveFocal = focal35 || focalActual
          const focalMm = effectiveFocal ? `${Math.round(effectiveFocal)}mm` : ''

          // Lens Category (e.g. "Wide-angle lens - 23mm", "Telephoto lens - 69mm", "Ultra wide-angle lens - 13mm")
          const getLensCategory = (f) => {
            if (!f) return 'Standard lens'
            const val = Number(f)
            if (val < 19) return 'Ultra wide-angle lens'
            if (val < 36) return 'Wide-angle lens'
            if (val < 60) return 'Standard lens'
            return 'Telephoto lens'
          }

          if (exif.LensModel && !/camera|unknown|back|front/i.test(exif.LensModel)) {
            this.metadata.lensInfo = exif.LensModel
          } else if (effectiveFocal) {
            const cat = getLensCategory(effectiveFocal)
            this.metadata.lensInfo = `${cat} - ${focalMm}`
          } else {
            this.metadata.lensInfo = [exif.Make, exif.Model].filter(Boolean).join(' ') || 'Standard lens'
          }

          // ISO
          const isoVal = exif.ISO || exif.ISOSpeedRatings
          this.metadata.iso = isoVal ? `ISO ${isoVal}` : 'ISO 25'

          // Focal Length (shows 35mm equivalent e.g. "23mm", matching camera display)
          this.metadata.focalLength = focalMm || '23mm'

          // EV (Exposure Compensation / Exposure Bias Value)
          const evVal = exif.ExposureBiasValue !== undefined 
            ? exif.ExposureBiasValue 
            : (exif.ExposureCompensation !== undefined ? exif.ExposureCompensation : 0)
          this.metadata.ev = this.formatEV(evVal)

          // Aperture
          this.metadata.aperture = this.formatAperture(exif.FNumber) || 'F1.8'

          // Shutter Speed
          this.metadata.shutterSpeed = this.formatShutterSpeed(exif.ExposureTime) || '1/1250 s'

          // Date
          if (exif.DateTimeOriginal) {
            try {
              this.metadata.dateTaken = new Date(exif.DateTimeOriginal).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            } catch {
              this.metadata.dateTaken = String(exif.DateTimeOriginal)
            }
          }
        } else {
          // No EXIF embedded in the image (common in stripped web images)
          this.metadata.hasExif = false
          this.metadata.rawExif = null
          // Use standard photography defaults matching user reference
          this.metadata.lensInfo = 'Telephoto lens - 69mm'
          this.metadata.iso = 'ISO 25'
          this.metadata.focalLength = '69mm'
          this.metadata.ev = '0.0ev'
          this.metadata.aperture = 'F2.4'
          this.metadata.shutterSpeed = '1/1250 s'
        }
      } catch (err) {
        console.error('File process error:', err)
        this.error = err.message || 'Terjadi kesalahan saat memproses file'
      } finally {
        this.isLoading = false
      }
    },

    // NEW FEATURE: Replaces the photo image ONLY, without altering or re-reading the metadata
    async replaceImageOnly(file) {
      if (!file) return
      this.isLoading = true
      this.error = null

      try {
        // Konversi dulu sebelum mengganti state, supaya foto lama tetap utuh jika gagal
        const newUrl = await this.createDisplayUrl(file)
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl)
        }

        this.rawFile = file
        this.imageUrl = newUrl

        // Read dimensions of the new image for full-res lossless canvas rendering
        const dims = await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
            })
          }
          img.onerror = () => reject(new Error('Gagal memuat gambar baru'))
          img.src = this.imageUrl
        })

        const mp = Math.round((dims.width * dims.height) / 1000000)
        this.originalDimensions = {
          width: dims.width,
          height: dims.height,
          megapixels: mp,
        }

        // NOTE: We deliberately do NOT re-read or overwrite this.metadata!
        // The metadata remains locked exactly as extracted or edited from the first photo.
        this.isImageSwapped = true
      } catch (err) {
        console.error('Replace image error:', err)
        this.error = err.message || 'Gagal mengganti foto'
      } finally {
        this.isLoading = false
      }
    },

    setSampleData() {
      this.metadata.title = 'Sol Sepatu'
      this.metadata.lensInfo = 'Telephoto lens - 69mm'
      this.metadata.fileSize = '728 KB'
      this.metadata.dimensionsText = '2332x3108'
      this.metadata.megapixelsText = '7MP'
      this.metadata.iso = 'ISO 25'
      this.metadata.focalLength = '69mm'
      this.metadata.ev = '0.0ev'
      this.metadata.aperture = 'F2.4'
      this.metadata.shutterSpeed = '1/1250 s'
    },

    // Full reset: Clears photo and metadata to read fresh EXIF on next upload
    resetPhoto() {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl)
      }
      this.rawFile = null
      this.imageUrl = null
      this.originalDimensions = { width: 0, height: 0, megapixels: 0 }
      this.metadata = {
        title: 'Sol Sepatu',
        lensInfo: 'Telephoto lens - 69mm',
        fileSize: '728 KB',
        dimensionsText: '2332x3108',
        megapixelsText: '7MP',
        iso: 'ISO 25',
        focalLength: '69mm',
        ev: '0.0ev',
        aperture: 'F2.4',
        shutterSpeed: '1/1250 s',
        cameraMake: '',
        cameraModel: '',
        dateTaken: '',
        hasExif: false,
        rawExif: null,
      }
      this.frameConfig.borderScale = 'compact'
      this.isImageSwapped = false
      this.error = null
    },
  },
})
