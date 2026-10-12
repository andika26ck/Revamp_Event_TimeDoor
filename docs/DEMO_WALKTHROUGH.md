> Catatan historis V1/V2. Untuk V3, Edit diganti Reschedule dan transfer sudah tersedia. Lihat EVENT_PROTOTYPE_ORDER_14_FRAMES.md dan V3_WALKTHROUGH.md.

# Panduan presentasi ke mentor — 5–8 menit

## Sebelum mulai
Jalankan `node scripts/serve.mjs`, buka http://localhost:3000. Klik Reset demo data → Reset Data. Semua nama/nomor untuk demo saja.

## 1. Rule berdasarkan tipe (1–2 menit)
Events → Create Event. Pilih Trial, isi nama, Add Schedule. Tunjukkan Add berikutnya disabled. Pilih Workshop: bisa menambah tanggal kedua. Kembali ke Trial: baris tidak terhapus diam-diam; Save disabled sampai jumlah diperbaiki. Coba PTM dan Internal Meeting. Internal tidak punya student checkout. Klik Discard jika tidak perlu menyimpan.

## 2. Masalah utama: peserta hilang saat ganti jadwal (2 menit)
Buka Trial 13 November Sesi 1 → Participants. Catat Axel SES-001 dan Bella SES-002.
Schedule → Drop → Drop Schedule. Ada history Dropped, Add kembali enabled. Tambah replacement tanggal 14 Nov → Save Schedule.
Participants: peserta dan Session tetap sama. Tidak membuat purchase/order kedua. Schedule → Assign Students → centang Axel dan Bella → Assign 2 Students. Assignment merujuk Session lama. History occurrence lama tetap ada.

## 3. Attendance sebelum Finish (1–2 menit)
Schedule replacement → See Details. Tunjukkan Upcoming, presence Not Recorded (bukan otomatis Absent), Journal belum tersedia.
Ganti Demo lifecycle ke Ongoing. Change Presence untuk Axel → Present → isi note/journal contoh → Save. See Meeting Journal sekarang bisa dibuka.
Ganti ke Finished → detail/journal masih bisa dibaca, tombol edit disabled dalam policy demo.
Class Attendance → See Details pada occurrence yang sama menghasilkan data yang sama. Jelaskan lifecycle sengaja manual supaya demo tidak tergantung tanggal hari ini.

## 4. Workshop registration (1 menit)
Workshop Digital Literacy → Participants → Generate Form → Generate Form → Preview Form.
Isi data fiktif pada Nama, No HP, Usia → Daftar. Copy konfirmasi netral: data terkirim, bukan paid atau kursi confirmed.
Back to CMS → Workshop → Participants → Form Submissions menunjukkan respons lokal. Participant form sekarang muncul di Student List tanpa purchase Session. Session existing SES-001 / SES-002 tetap sama; peserta baru menampilkan Not linked, bukan order baru.
Import Participants → Download XLSX Template → Choose file → Preview → Import. Participant contoh bertambah. Upload file yang sama lagi: duplicate error, tidak ada partial import. Format tiga kolom bersifat sementara atas izin user.

## 5. Penutup
Student Order Check menunjukkan Internal Meeting blocked. Tunjukkan Reset untuk mengulang presentasi.
Tegaskan: prototype UI/data statis, bukan production integration. Quota, staff/PTM attendee model, import format dan pembayaran masih perlu keputusan produk.
