// Dukungan file HEIC/HEIF.
// Browser selain Safari tidak bisa menampilkan HEIC, jadi di-decode ke JPEG 100%
// EXIF tetap dibaca dari file HEIC ASLI (exifr mendukung HEIC).

const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1']

export const isHeicFile = async (file) => {
  if (!file) return false
  if (/\.(heic|heif)$/i.test(file.name || '')) return true
  if (/image\/hei[cf]/i.test(file.type || '')) return true
  try {
    // Sniff "ftyp" brand untuk file tanpa ekstensi / MIME yang jelas
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    const marker = String.fromCharCode(...head.slice(4, 8))
    const brand = String.fromCharCode(...head.slice(8, 12))
    return marker === 'ftyp' && HEIC_BRANDS.includes(brand)
  } catch {
    return false
  }
}

// Lazy-load library (wasm berukuran besar) hanya saat benar-benar dibutuhkan.
export const heicToJpegBlob = async (file) => {
  const { heicTo } = await import('heic-to')
  return heicTo({ blob: file, type: 'image/jpeg', quality: 1 })
}

// Alias for backwards compatibility
export const heicToPngBlob = heicToJpegBlob
