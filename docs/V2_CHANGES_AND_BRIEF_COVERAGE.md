> Catatan historis V1/V2. Untuk V3, Edit diganti Reschedule dan transfer sudah tersedia. Lihat EVENT_PROTOTYPE_ORDER_14_FRAMES.md dan V3_WALKTHROUGH.md.

# V2 — Perbaikan import & visual + status terhadap brief

## Apa yang berubah
1. Import Workshop aktif: XLSX / UTF-8 CSV → preview → validasi → Import → participant muncul di event.
2. Template sementara: Nama, No HP, Usia. Kolom ini diturunkan dari field registration form atas izin user; brief belum menetapkan format spreadsheet final.
3. Form Workshop sekarang menambahkan participant lokal, bukan hanya menyimpan respons. Tidak membuat paid order, invoice, purchase Session atau konfirmasi pembayaran.
4. Desain mengacu langsung pada screenshot PDF: logo sumber, Poppins lokal, sidebar sekitar188px, topbar48px, Product/Class hierarchy, floating labels, density table, badges, warna/border dan placement Details/Participants/Schedule.
5. State V2 menggunakan localStorage key baru; data demo V1 tidak dimigrasikan atau dihapus.

## Cakupan brief (prototype, bukan production CMS)
| Kebutuhan | Status V2 | Catatan |
|---|---|---|
| Lima event type, dua tipe baru | Tersedia | Internal Meeting, bukan tipe keenam Team Meeting |
| Placeholder sesuai tipe | Tersedia | Hint, tidak memaksa nama atau menghapus input |
| Trial satu tanggal/sesi, PTM satu schedule | Tersedia | Create + single-active management demo |
| Workshop/Bootcamp/Internal satu atau lebih | Tersedia | Multi dated schedules, tanpa Generate Schedule |
| Free/Paid untuk empat tipe pertama | Tersedia | Simulasi field harga, bukan transaksi pembayaran |
| Internal tidak diorder Student | Ditampilkan / tidak ada checkout | Order Check dan public Workshop form guard; production server enforcement bukan bagian app statis |
| Tab Schedule + Details read-only | Tersedia | Schedule mutation tidak dilakukan dari summary |
| Peserta tidak hilang saat edit/drop/replacement | Tersedia dan diuji | Event members dan Session references stabil; jadwal punya assignment terpisah |
| Tidak membuat order/Session/pembayaran kedua | Tersedia sebagai invariant demo | Tidak ada actual financial integration |
| Attendance Detail sebelum Finish, dua entry | Tersedia | Presence, Meeting Journal, late dan note |
| Attendance persis Adaptive/Group | Struktur tabel mendekati; belum exact production | Journal viewer/editor minimal, tidak ada referensi schema jurnal lengkap di PDF |
| Workshop import spreadsheet | Tersedia dengan format sementara | Format final, identity/payment/quota policies tetap perlu persetujuan |
| Generate form Nama/No HP/Usia | Tersedia | Adds demo participant; response data lokal browser/origin sama |

## Bagian yang belum dapat diklaim final
- Isi/schema/jalur persetujuan Meeting Journal produksi belum direplikasi 1:1.
- Model staff peserta Internal Meeting dan parent/PTM participation tidak didefinisikan brief; tidak diisi dengan asumsi pembelian Student.
- Rule quota numerik, entitlement multi-schedule, paid registration workflow, real availability conflicts dan role permissions tidak dijelaskan; prototype tidak mengarang rule final.
- Single-active/drop-before-add PTM serta Ongoing-only attendance edit adalah proposal demo. Trial Drop-before-Add berasal dari anotasi brief.
- Visual lebih dekat pada PDF, tetapi bukan pixel-perfect terhadap CMS live terbaru. Font, geometry dan logo referensi sudah digunakan; beberapa tools demo masih sengaja tampil.

## Bukan kekurangan flow, tetapi batas tech stack yang diminta
LocalStorage, tanpa database/API/login/multi-user/real payment adalah batas prototype yang disengaja. Tidak diklaim sebagai implementasi CMS siap produksi atau form internet bersama.
