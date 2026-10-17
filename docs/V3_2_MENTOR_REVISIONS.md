# V3.2 — revisi mentor: Internal Meeting dan draft Workshop

Dokumen ini menggantikan perilaku lama yang menyatakan form langsung menambah Student List. Source, build `out/`, dan tes dalam paket ini sudah memakai flow baru.

## 1. Internal Meeting → Participants
- Room Name dan Total Teachers tetap tampil; Total Students dihilangkan.
- Teacher List memakai komponen/tampilan yang sama seperti event lain.
- Teacher berasal dari Schedule yang tidak Dropped, dihitung unik. Perubahan melalui Schedule tercermin di Participants.
- Tidak ada Student List, Add Demo Students, import student, registration form, atau transfer student.
- Tidak menambah mekanisme manajemen staff atau tombol Add Teacher baru. Teacher tetap dikelola melalui Schedule.
- Larangan pemesanan Student dan aturan reschedule existing tidak berubah.

## 2. Workshop → registration form → Pending → Confirmed
1. Generate Form dan Preview Form tetap melalui Participants Workshop.
2. Submit Nama / No HP / Usia menambahkan **Pending** ke Form Submissions saja.
3. Pending belum menjadi event member, tidak dihitung dalam Total Students, tidak mengambil kuota, dan tidak muncul dalam Assign Students.
4. Admin membuka Participants. Filter awal Form Submissions = Pending; pilihan lain Confirmed dan All.
5. Pilih satu/beberapa baris atau Select All Pending. Pilihan ini terpisah dari checkbox transfer pada Student List.
6. Klik **Confirm to Student List**, tinjau nama dan sisa kapasitas, lalu **Confirm N Students**. Cancel tidak mengubah data.
7. Sistem memvalidasi ulang seluruh pilihan: event, status Pending, data, identitas duplikat dan kapasitas event. Kapasitas menggunakan angka event (fallback demo 25), sama dengan model kapasitas transfer. Active dan Reserved sama-sama memakai kapasitas; Transferred Out tidak.
8. Jika satu baris bermasalah atau kuota kurang, seluruh batch diblokir. Tidak ada pemindahan sebagian.
9. Jika berhasil, siswa ditambahkan ke Student List, submission menjadi Confirmed dan riwayat dipertahankan. Baris Confirmed tidak bisa dipilih/dikonfirmasi ulang.
10. Assignment jadwal tetap dilakukan terpisah di Schedule. Konfirmasi tidak membuat pembayaran, invoice, purchase Session, transfer, atau notifikasi.

Nama dan nomor HP yang dinormalisasi dipakai untuk mencegah registrasi ganda. Leading 0 dan +62 dianggap sama. Duplikat terhadap Student List maupun submission existing ditolak; duplikat yang masuk melalui jalur lain setelah submit diperiksa lagi sebelum konfirmasi.

**Confirmed adalah konfirmasi ikut, bukan Paid.** Peserta baru memakai paymentStatus Unverified dan session null. Guard transfer existing tetap menolak nilai finansial yang belum diketahui. Tidak ada jalur pembayaran baru yang dibuat.

Import spreadsheet dan Add Demo Students tetap menggunakan flow existing; revisi ini hanya mengubah penerimaan registration form. Belum ada fitur reject, pembatalan konfirmasi atau pembayaran baru.

## 3. Data V3/V3.1 lama — tanpa Reset Data
Key `timedoor-event-rules-demo-v3` dipertahankan. Saat load:
- Submission lama Submitted yang ID-nya sudah ada sebagai member ditandai Confirmed (legacy).
- Submission lama yang tidak memiliki linked member menjadi Pending.
- Member existing, assignment, attendance, Session, pembayaran dan history tidak dihapus/didemote. Tidak dibuat timestamp konfirmasi palsu untuk legacy.
- Riwayat legacy dilabeli “Existing participant retained from previous version”.

Peserta lama yang dahulu otomatis masuk Student List sengaja dipertahankan agar data tidak hilang. Coba submit baru untuk melihat flow Pending. Jangan Reset Data hanya untuk memasang pembaruan.

## 4. Menjalankan dan memasang
Paket lengkap berisi source dan `out/` hasil build. `node_modules` tidak disertakan agar ringan.

### Paling aman untuk lokal
1. Ekstrak paket ke folder baru, bukan di dalam folder project lama.
2. Hentikan server lama.
3. Jalankan `node scripts/serve.mjs` atau `START_DEMO_WINDOWS.cmd` dari folder berisi package.json.
4. Gunakan browser/profil/alamat/port yang sama seperti sebelumnya, lalu hard refresh (Ctrl+F5). Data lokal melekat pada origin, bukan folder.
5. Jangan Reset Data. Server default localhost:3000; apabila sebelumnya memakai port lain, gunakan port yang sama.

### GitHub / Vercel
Buat backup atau branch lebih dahulu. Salin source paket ini ke project, commit dan push seperti biasa. Jangan menimpa `.git`, `.env` atau `.vercel`. Vercel membangun source; `out/` tidak perlu di-commit. Tidak ada deployment, push atau perubahan akun yang dilakukan oleh paket ini.

### Development / testing
`npm ci`, lalu `npm run dev`. Untuk build gunakan `npm run build`. Node 20.9+ diperlukan.

```bash
npm run test:rules
npm run test:registration
# Jalankan server terlebih dahulu; CHROMIUM_PATH dapat diisi path browser lokal.
npm run test:demo
node tests/trial-rules.mjs
node tests/v31-regression.mjs
npm run test:mentor
```

Semua transaksi masih simulasi localStorage, tanpa backend, pembayaran asli atau sinkronisasi multi-user.
