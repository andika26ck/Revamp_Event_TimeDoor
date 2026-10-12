# Format import Workshop sementara

Dibuat karena user mengizinkan implementasi walaupun format brief belum final. Tidak menjadi kebijakan resmi Timedoor.

## Template
Gunakan `public/templates/workshop-participants.xlsx` atau `.csv`. First sheet, header tepat Nama / No HP / Usia (case-insensitive, order boleh berbeda). Semua kolom wajib. Contoh fiktif boleh diganti.
- Nama: plain text, tidak kosong.
- No HP: text agar 0 awal tetap ada. XLSX numeric phone ditolak karena angka nol yang hilang tidak boleh ditebak kembali. Validasi dasar 8–15 digit; bukan kebijakan telepon final. Simbol +, spasi, tanda kurung dan hyphen diperbolehkan.
- Usia: integer >= 0. Tidak ada batas umur eligibility baru.
- UTF-8 CSV dengan comma atau semicolon delimiter, quoted fields/newlines didukung. XLS lama tidak didukung.
- Batas demo: 2 MB/file, 1.000 nonempty rows. File dipercaya/dipilih user; bukan endpoint upload produksi.

## Duplikat & penyimpanan
Identity sementara: normalized Nama + No HP. Normalisasi Indonesia menyamakan leading 0 dengan +62. Jika nama peserta existing sama tetapi tidak punya No HP, dianggap potential duplicate dan ditolak secara konservatif.
Duplikat dalam file atau event ditandai. Bila ada satu row invalid, seluruh import disabled; tidak ada partial import. Perbaiki file dan upload ulang.
Import menambahkan participant pada event Workshop yang dituju saja, dengan origin Spreadsheet. Session purchase kosong / Not linked. Tidak membuat order, invoice, quota consumption atau pembayaran. Assign Students dapat memakai registrasi tersebut tanpa membuat purchase Session.

## Form
Form menambahkan participant dengan origin Registration form dan submission log. Perilaku ini adalah proposal demo; keputusan paid-event registration/checkout dan seat confirmation belum final. Duplikat participant sama ditolak. Semua data di browser yang sama, tidak tersinkron antar pengguna.
