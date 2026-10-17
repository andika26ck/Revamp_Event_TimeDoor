> **V3.2 — revisi mentor:** Participants Internal Meeting sekarang teacher-only. Form Workshop masuk Pending, lalu dipilih dan dikonfirmasi admin ke Student List. Riwayat Confirmed disimpan; tidak otomatis Paid atau assigned. **Panduan terbaru: `docs/V3_2_MENTOR_REVISIONS.md`**. Dokumen versi sebelumnya di bawah bersifat historis untuk bagian yang berubah. Tidak perlu Reset Data.

> **V3.1:** demo students receive clearly labeled simulated applied amounts; legacy manual rows can be repaired without reset. Transfers support Trial ↔ Workshop ↔ Bootcamp across books/languages, with PTM/Internal Meeting excluded. See `docs/V3_1_CHANGES.md`.

# Timedoor — Event Rules Demo

Prototype interaktif berbasis **Next.js + React + CSS biasa**, memakai seed statis dan localStorage. Tidak memakai database, API, login, atau payment gateway. Icon: lucide-react. Poppins font lokal; parser XLSX read-excel-file. Logo berasal dari screenshot CMS yang diberikan user. Fokus: rule tipe event, stable Session references, Attendance Detail, Workshop registration, **Reschedule dua langkah dan Move Participants**.

## Cara paling cepat: langsung demo
ZIP sudah menyertakan hasil build statis di `out/`. Cukup Node.js 20.9+ (disarankan Node 22 LTS atau lebih baru).

1. Ekstrak ZIP.
2. Buka terminal di folder `timedoor-event-demo` (folder yang memiliki `package.json`).
3. Jalankan:

```bash
node scripts/serve.mjs
```

4. Buka **http://localhost:3000** di browser.

**Tidak perlu npm install untuk menjalankan build yang sudah disertakan.** Jangan double-click `out/index.html`: asset Next menggunakan HTTP path.
Port lain: set environment variable PORT sebelum menjalankan server.

## Kalau mau mengubah kode

```bash
npm ci
npm run dev
```

Buka http://localhost:3000. Setelah perubahan selesai:

```bash
npm run build
npm start
```

`npm start` menjalankan server statis sederhana untuk `out/`, bukan backend aplikasi. Stop server demo yang sudah memakai port 3000 sebelum menyalakan dev server.

## Versi 3 — Reschedule + Move Participants
Seluruh14frame supplied direpresentasikan sebagai cabang/state interaktif. Bukan14langkah berurutan. Panduan utama: `docs/EVENT_PROTOTYPE_ORDER_14_FRAMES.md` dan `docs/V3_WALKTHROUGH.md`.

- Reschedule mengganti Edit lama: cutoff2jam sebelum jadwal lama mulai untuk semua tipe, attendance guard, reason, comparison review, assigned-only impact dan history.
- Move satu siswa/batch: Upcoming/no-record atau Ended/Absent confirmation; destination quota, review per-siswa, Active/Reserved, invoice selisih dan Remaining Event Value.
- Demo Finance verification terpisah; notifications hanya local queue; CSV batch export nyata.
- Demo clock default28Sep2026,10:00WIB, terlihat jelas sebagai simulasi.10seed event:5original +5movement scenarios. Data V2 tetap di keylama; tidak dimigrasikan/dihapus.

## Flow yang bisa dicoba
- Daftar Event: search/filter lima tipe.
- Create Event: placeholder per tipe, Free/Paid untuk Trial/Workshop/Bootcamp/PTM; satu schedule untuk Trial/PTM; multi untuk tipe lain. Beralih tipe tidak menghapus draft schedule/nama.
- Event Detail: Details (schedule read-only), Participants (event-level), Attendance dan Schedule.
- Schedule: Add, reviewed Reschedule, View History, Assign existing students, Cancel/Drop upcoming, Add replacement. Member dan Session reference tetap sama. Dropped history tidak dihapus.
- Attendance: dua jalur menuju detail occurrence yang sama, bahkan sebelum Finish. Manual Demo lifecycle: Upcoming/Ongoing/Finished.
- Ongoing: Change Presence, note, late minutes dan minimal journal; Finished tetap viewable/read-only di demo.
- Workshop: import XLSX/CSV → preview/validasi → participants; Generate Form → Preview → submit Nama/No HP/Usia → Pending Form Submissions → select → review → confirm to Student List. Tidak membuat paid order atau confirmed payment.
- Student Order Check: Internal Meeting diberi Blocked; tidak ada checkout/purchase nyata.
- Reset Demo Data: kembali ke10seed event (5original +5movement scenarios).

Panduan presentasi langkah demi langkah: `docs/V3_WALKTHROUGH.md` (fitur baru) dan `docs/DEMO_WALKTHROUGH.md` (fitur awal; Edit diganti Reschedule).

## Arsitektur sederhana

```text
app/page.js                   halaman Next utama
app/layout.js                 metadata + global CSS
app/globals.css               responsive styling
components/Demo.js            flow, modal, navigation, form, local state
components/Movement.js        reschedule/transfer UI
lib/movement.js               pure local transaction/validation
lib/scenarios.js              movement demo fixtures
lib/data.js                   seed, tipe dan placeholder
scripts/serve.mjs              server file statis untuk demo
out/                          hasil Next static export, siap diserve
tests/smoke.mjs               behavioral smoke test (opsional)
docs/                         brief mapping, batas scope, walkthrough, QA
```

Navigasi prototype memakai hash (`#/events`, `#/events/EV-001/schedule`, `#/attendance/...`, `#/register/...`) agar static export dapat dijalankan tanpa backend/rewrite. Bukan multi-route backend atau production CMS. Browser Back/Forward tetap berfungsi.

Data tersimpan dengan key `timedoor-event-rules-demo-v3`. Refresh tidak menghapus perubahan. Browser/origin/port lain memiliki data terpisah. Link form tidak menjadi form pendaftaran online bersama: generate dan submit dari browser/origin yang sama untuk presentasi. Gunakan data fiktif; tidak ada privacy/backend security di prototype.

## Batas yang disengaja
- Spreadsheet import **sudah aktif dengan format sementara**: Nama, No HP, Usia. Format dipilih atas arahan user; bukan format final brief. Lihat docs/IMPORT_FORMAT_PROVISIONAL.md.
- Participants Internal Meeting menampilkan Teacher List dari Schedule, tanpa student. Model staff di luar teacher belum ditambahkan.
- Quota dan room/teacher/student conflicts **divalidasi pada data lokal**. Real availability, concurrency locks, parent entitlement PTM, pricing Internal Meeting, checkout dan production authorization masih di luar scope.
- Aturan single-active untuk PTM pada management, minimal journal dan Ongoing-only editing adalah **proposal demo**, bukan policy final produksi.
- Dropdown Room memakai daftar statis sederhana, tidak memakai layanan pencarian.
- Sidebar menggunakan hierarchy CMS dari screenshot PDF. Menu di luar scope demo memberi pemberitahuan, bukan halaman implementasi penuh.
- Bulk Move dan two-step Reschedule sudah aktif. Per-student Book Allocation, multi-schedule transfer entitlement, reservation expiry dan remaining-value redemption belum ditentukan; kasus entitlement ambigu diblokir untuk review.
- Invoice/value/verification hanyalah record demo lokal; tidak ada pembayaran nyata atau notifikasi terkirim. Guard/checkbox finance bukan security produksi.

## Pengujian opsional

Install dependencies (`npm ci`), lalu Playwright browser jika tidak punya executable Chromium:

```bash
npx playwright install chromium
```

Server pada port 3000 harus berjalan di terminal terpisah, lalu:

```bash
npm run test:demo
```

DEMO_URL dapat diarahkan ke port lain. CHROMIUM_PATH opsional untuk browser lokal. Hasil tes ada di `test-output/` secara default (atau QA_DIR). Tes memakai browser terpisah dengan data demo, bukan data produksi. Source ini telah dibuild dan melalui 92 checks (31 original behavioral + 10 V3.1 behavioral + 37 movement transactions + 9 import parser + 5 Trial regression); laporan ada di docs/QA_REPORT.md.

V3 regression tambahan: `npm run test:rules` (37 movement + 9 import checks), `node tests/trial-rules.mjs` (5Trial checks). Contoh `DEMO_URL=http://localhost:3080 QA_DIR=test-output npm run test:demo`.

V3.1 targeted regression: `DEMO_URL=http://localhost:3000 QA_DIR=test-output/v31 node tests/v31-regression.mjs`.
