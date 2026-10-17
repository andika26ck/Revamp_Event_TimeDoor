# Timedoor Event Demo V3.2 — mulai dari sini

Dua revisi mentor sudah diterapkan:
1. Internal Meeting → Participants menampilkan room, Total Teachers dan Teacher List dari Schedule; tanpa student.
2. Workshop form → Pending Form Submissions → pilih satu/banyak calon → Confirm to Student List → review → Confirm. Riwayat Confirmed tetap ada; kuota/duplikat divalidasi. Tidak otomatis Paid atau assigned.

## Jalankan tanpa instalasi
- Ekstrak ZIP ke folder baru.
- Stop server demo lama.
- Di folder berisi package.json, jalankan START_DEMO_WINDOWS.cmd atau `node scripts/serve.mjs` (Node 20.9+).
- Buka http://localhost:3000 dan hard refresh Ctrl+F5.
- Pertahankan browser/profil/alamat/port yang sama agar data V3 sebelumnya terbaca.
- **Jangan Reset Data untuk memasang revisi.** Peserta lama dari form dipertahankan sebagai Confirmed. Submit pendaftaran baru untuk mencoba Pending.

Source dan out/ hasil build sudah disertakan; node_modules sengaja tidak disertakan agar ringan. Untuk mengedit source: `npm ci` lalu `npm run dev`.

Panduan lengkap: docs/V3_2_MENTOR_REVISIONS.md
Hasil tes: docs/V3_2_QA_REPORT.md (126 pemeriksaan lolos).

Paket ini belum di-push ke GitHub/Vercel. Backup/branch project lama sebelum menyalin source. Jangan timpa .git, .env atau .vercel. Semua data aplikasi masih demo lokal.
