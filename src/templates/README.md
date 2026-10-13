# 🎨 Panduan Mengedit Template Bingkai Foto

File template bingkai foto terletak di:
👉 [`src/templates/PhotoFrameTemplate.vue`](file:///c:/Users/ama.lebu/Documents/ProjectiwithAI/src/templates/PhotoFrameTemplate.vue)

File ini berupa komponen Vue murni dengan **HTML** dan **Tailwind CSS**. Anda bisa bebas mengotak-atik tampilan bingkai seperti mengedit file HTML biasa!

---

### Variabel yang Tersedia dari Store (`photoStore`):

| Variabel | Keterangan | Contoh Nilai |
| :--- | :--- | :--- |
| `photoStore.imageUrl` | URL gambar foto asli | `blob:http://...` |
| `photoStore.metadata.title` | Judul foto (Baris 1) | `"Sol Sepatu"` |
| `photoStore.metadata.lensInfo` | Info lensa / kamera (Baris 2) | `"Telephoto lens - 69mm"` |
| `photoStore.fileMetricsRow` | Metrik file (Baris 3) - Array | `["728 KB", "2332x3108", "7MP"]` |
| `photoStore.exposureSettingsRow` | Parameter eksposur (Baris 4) - Array | `["ISO 25", "69mm", "0.0ev", "F2.4", "1/1250 s"]` |
| `photoStore.metadata.iso` | ISO saja | `"ISO 25"` |
| `photoStore.metadata.focalLength`| Focal length saja | `"69mm"` |
| `photoStore.metadata.ev` | Nilai EV saja | `"0.0ev"` |
| `photoStore.metadata.aperture` | Nilai Aperture saja | `"F2.4"` |
| `photoStore.metadata.shutterSpeed`| Kecepatan rana saja | `"1/1250 s"` |
| `photoStore.metadata.dateTaken` | Tanggal pemotretan | `"13 Okt 2026"` |

---

### Contoh Kustomisasi:

#### 1. Membuat Teks Rata Tengah (Center)
Cukup ubah class pada `metadata-footer` menjadi:
```html
<div class="metadata-footer text-center pt-3 pb-1 space-y-1">
```

#### 2. Menambahkan Watermark / Nama Fotografer
Tambahkan baris HTML baru di dalam `metadata-footer`:
```html
<p class="text-[10px] text-gray-400 italic">
  Photo by: Ama Lebu
</p>
```

#### 3. Mengubah Warna Bingkai atau Font
Ubah objek `theme` pada bagian `<script setup>` atau tambahkan style di `<style scoped>`.

Perubahan apapun yang Anda simpan di file ini akan **langsung terlihat secara real-time** pada layar HP maupun pada hasil unduhan (Download Foto JPG 100%)!
