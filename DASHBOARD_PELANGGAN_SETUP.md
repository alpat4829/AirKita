# Dashboard Pelanggan - Setup Guide

## Konfigurasi yang Diperlukan

### 1. Environment Variables

Tambahkan konfigurasi Midtrans ke file `.env`:

```env
# Midtrans Configuration (Sandbox)
MIDTRANS_SERVER_KEY=your-server-key-here
MIDTRANS_CLIENT_KEY=your-client-key-here
MIDTRANS_IS_PRODUCTION=false
```

**Cara mendapatkan Midtrans keys:**

1. Daftar di https://dashboard.sandbox.midtrans.com/
2. Login dan buka Settings > Access Keys
3. Copy Server Key dan Client Key
4. Paste ke file `.env`

### 2. Database Seeding (Optional)

Untuk testing, Anda perlu data dummy:

**Buat Mitra (Depot):**

```sql
INSERT INTO mitra (user_id, ID_KELURAHAN, Nama_Mitra, Pemilik, No_HP, Alamat, Email, Jam_buka, Jam_Tutup, Status)
VALUES (2, 1, 'Depot Air Segar', 'Budi Santoso', '081234567890', 'Jl. Raya No. 123', 'depot@example.com', '08:00:00', '17:00:00', 'active');
```

**Buat Produk:**

```sql
INSERT INTO produk (ID_Mitra, Nama_Produk, Harga, Deskripsi)
VALUES
(1, 'Isi Ulang Galon', 5000, 'Isi ulang galon 19 liter, air bersih dan higienis'),
(1, 'Galon + Antar', 25000, 'Galon baru 19 liter + antar ke rumah');
```

## Cara Menggunakan Dashboard Pelanggan

### 1. Register sebagai Pelanggan

- Buka `/register/user`
- Isi semua data termasuk lokasi (Provinsi, Kabupaten, Kecamatan, Kelurahan)
- Submit form

### 2. Akses Dashboard

- Setelah login, akses `/dashboard/pelanggan`
- Anda akan melihat depot-depot yang ada di kelurahan yang sama

### 3. Filter Depot

- Gunakan dropdown filter untuk melihat depot di kelurahan/kecamatan lain
- Klik "Reset Filter" untuk kembali ke default

### 4. Memesan Produk

- Klik depot yang sedang buka (badge hijau "Buka")
- Pilih produk yang diinginkan
- Atur jumlah dengan tombol +/-
- Klik "Pesan Sekarang"
- Popup Midtrans akan muncul
- Lakukan pembayaran (di sandbox, gunakan kartu test)

### 5. Tracking Pesanan

- Klik tombol "Pesanan Saya" di header
- Lihat semua pesanan dengan status:
    - 🟡 Menunggu Pembayaran
    - 🔵 Diproses Depot
    - 🟢 Selesai
- Untuk pesanan selesai, klik "Pesan Lagi" untuk quick reorder

## Kartu Test Midtrans (Sandbox)

Untuk testing pembayaran di sandbox:

**Credit Card:**

- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Exp Date: Any future date
- OTP/3DS: `112233`

## Troubleshooting

### Popup Midtrans tidak muncul

- Pastikan Midtrans Client Key sudah benar di `.env`
- Clear browser cache
- Check console browser untuk error

### Depot tidak muncul

- Pastikan ada depot dengan Status = 'active'
- Pastikan depot ada di kelurahan yang sama dengan pelanggan
- Check jam operasional depot

### Error saat order

- Pastikan produk ada dan terhubung dengan depot
- Check console untuk error detail
- Pastikan Midtrans Server Key benar

## Fitur yang Sudah Diimplementasi

✅ Depot listing dengan filter lokasi
✅ Depot detail dengan produk
✅ One-click ordering (tanpa form)
✅ Midtrans payment integration
✅ Order tracking dengan status
✅ Quick reorder untuk pesanan selesai
✅ Modern glassmorphism UI
✅ Responsive design
✅ Toast notifications

## Next Steps

Untuk melanjutkan development:

1. Implementasi Dashboard Mitra (untuk depot owner)
2. Implementasi Dashboard Admin (untuk verifikasi mitra)
3. Setup real-time notifications dengan Laravel Echo
4. Testing dan bug fixes
