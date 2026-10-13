# 📸 PhotoRemark

> **Ekstrak Metadata EXIF Foto & Buat Bingkai Elegan Tanpa Backend & Tanpa Kompresi**

🌐 **Live Demo:** [https://amalebu.github.io/photoremark/](https://amalebu.github.io/photoremark/)

---

## ✨ Fitur Utama

- **100% Client-Side:** Privasi aman, seluruh foto diproses lokal di browser pengguna tanpa pernah diunggah ke server backend.
- **Tanpa Kompresi (Lossless 1:1):** Foto dipertahankan pada resolusi asli saat diunggah maupun saat diunduh (JPG 100% Max Quality).
- **Dukungan Format Luas:** JPEG, PNG, WEBP, dan **HEIC / HEIF** (Apple iPhone & Samsung Galaxy).
- **Ekstraksi EXIF Otomatis & Akurat:**
  - Mendeteksi Model Kamera, Aperture, Shutter Speed, ISO, dan Exposure Bias (EV).
  - Mengonversi focal length fisik smartphone ke ekuivalen format 35mm (mis. 23mm, 69mm) dan mengklasifikasikan kategori lensa (*Wide-angle lens*, *Telephoto lens*, dll).
- **Ganti Foto Saja (Lock Metadata):** Ketuk foto untuk mengganti gambar tanpa merubah nilai EXIF yang sudah terbaca dari foto pertama.
- **Template Bingkai HTML Terpisah:** File template bingkai terletak di `src/templates/PhotoFrameTemplate.vue` sehingga mudah diedit layaknya template HTML biasa.
- **Tampilan Responsif Jobright Design:** Dioptimalkan untuk layar HP (mobile-first), tablet, dan desktop dengan mode Full Screen imersif.

---

## 🛠️ Tech Stack

- **Vue 3** (Composition API `<script setup>`)
- **Vite 8**
- **Pinia**
- **Tailwind CSS v4**
- **exifr** (Client-side EXIF parser)
- **heic-to** (HEIC to JPEG decoder)
- **html-to-image** (High-res DOM capture)
- **Lucide Icons**

---

## 🚀 Menjalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/amalebu/photoremark.git
cd photoremark

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Build untuk produksi
npm run build
```

---

## 📦 Deployment ke GitHub Pages

Proyek ini telah dikonfigurasi dengan:
1. **GitHub Actions Workflow** di `.github/workflows/deploy.yml` yang otomatis mem-build dan mem-publish setiap push ke branch `main`.
2. Script manual:
```bash
npm run deploy
```
