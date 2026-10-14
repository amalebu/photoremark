# 🎨 Panduan Mengedit Template Bingkai Foto

Proyek ini memiliki **2 Template Bingkai Foto** yang bisa Anda pilih dan edit secara langsung layaknya file HTML biasa:

1. 👉 [`src/templates/PhotoFrameTemplate1.vue`](file:///c:/Users/ama.lebu/Documents/ProjectiwithAI/src/templates/PhotoFrameTemplate1.vue) — **Template 1: Studio Minimal** (Bingkai kartu bersih dengan footer metadata dan logo hexagon badge).
2. 👉 [`src/templates/PhotoFrameTemplate2.vue`](file:///c:/Users/ama.lebu/Documents/ProjectiwithAI/src/templates/PhotoFrameTemplate2.vue) — **Template 2: Noir Spotlight & Geometric Badge** (Poster rasio 9:16 dengan latar belakang hitam-putih, kartu foto warna di tengah, aksen garis bingkai artistik, dan logo badge).

Kedua file di atas berupa komponen Vue murni dengan **HTML**, **Tailwind CSS**, dan scoped CSS. Anda bebas mengotak-atik tampilan bingkai sesuai selera!

---

### Variabel yang Tersedia dari Store (`photoStore`):

| Variabel | Keterangan | Contoh Nilai |
| :--- | :--- | :--- |
| `photoStore.imageUrl` | URL gambar foto asli | `blob:http://...` |
| `photoStore.metadata.title` | Judul foto (Baris 1) | `"Galaxy S25"` |
| `photoStore.metadata.lensInfo` | Info lensa / kamera (Baris 2) | `"Wide-angle lens - 23mm"` |
| `photoStore.fileMetricsRow` | Metrik file (Baris 3) - Array | `["3.37 MB", "3000x4000", "12MP"]` |
| `photoStore.exposureSettingsRow` | Parameter eksposur (Baris 4) - Array | `["ISO 200", "23mm", "0.0ev", "F1.8", "1/100 s"]` |
| `photoStore.metadata.iso` | ISO saja | `"ISO 200"` |
| `photoStore.metadata.focalLength`| Focal length saja | `"23mm"` |
| `photoStore.metadata.ev` | Nilai EV saja | `"0.0ev"` |
| `photoStore.metadata.aperture` | Nilai Aperture saja | `"F1.8"` |
| `photoStore.metadata.shutterSpeed`| Kecepatan rana saja | `"1/100 s"` |
| `photoStore.metadata.dateTaken` | Tanggal pemotretan | `"14 Okt 2026"` |

---

### Contoh Kustomisasi:

#### 1. Mengubah Warna Garis / Background di Template 2
Buka [`PhotoFrameTemplate2.vue`](file:///c:/Users/ama.lebu/Documents/ProjectiwithAI/src/templates/PhotoFrameTemplate2.vue), cari class garis:
```html
<!-- Mengubah warna sudut atas-kanan dari putih ke hijau mint -->
<div class="... border-white ...">
<!-- Ubah menjadi: -->
<div class="... border-primary ...">
```

#### 2. Mengubah / Menghilangkan Logo Badge
Cari bagian `<!-- LOGO HEXAGON BADGE -->` di masing-masing file template untuk mengganti icon SVG atau menambahkan logo kamu sendiri.

Perubahan apapun yang Anda simpan di file template ini akan **langsung terlihat secara real-time** pada layar HP maupun pada hasil unduhan (Download Foto JPG 100%)!
