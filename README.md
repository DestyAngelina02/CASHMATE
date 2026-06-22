# CASHMATE

Cashmate adalah aplikasi Point of Sale (POS) / Sistem Kasir modern berbasis web. Aplikasi ini dirancang dengan memisahkan arsitektur *Frontend* dan *Backend* untuk memastikan skalabilitas dan performa yang tinggi.

## 🌟 Fitur Utama
- **Dashboard Interaktif**: Statistik penjualan real-time.
- **Manajemen Master Data**: Pengelolaan Kategori, Supplier, dan Produk (beserta upload gambar).
- **Sistem Transaksi (POS)**: Antarmuka kasir yang responsif dengan dukungan kalkulasi otomatis dan pencarian instan (kompatibel dengan Barcode Scanner).
- **Cetak Struk**: Format struk yang dioptimalkan untuk printer thermal hitam-putih.
- **Manajemen Pengguna**: Pengelolaan hak akses Admin & Kasir.

## 🛠️ Teknologi yang Digunakan
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
- **Backend**: Node.js, Express.js, Prisma ORM, Multer (untuk upload).
- **Database**: MySQL.

---

## 🚀 Cara Menjalankan Aplikasi di Lokal

Aplikasi ini dibagi menjadi dua bagian utama: `backend` dan `frontend`. Anda harus menjalankan keduanya secara bersamaan.

### 1. Persiapan Database (MySQL)
Pastikan Anda sudah menginstal dan menjalankan server MySQL (contoh: melalui XAMPP atau Docker).
Buat database baru bernama `cashmate_db`.

### 2. Menjalankan Backend
Buka terminal baru dan arahkan ke folder `backend`:
```bash
cd backend
```
Instal dependensi:
```bash
npm install
```
Atur environment variable:
Buat file `.env` di dalam folder `backend` dan isi dengan konfigurasi database Anda:
```env
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/cashmate_db"
```
Migrasi Database dan Seed Data Awal:
```bash
npx prisma db push
node prisma/seed.js
```
Jalankan server backend:
```bash
npm run dev
```
*Backend akan berjalan di `http://localhost:5000`*

### 3. Menjalankan Frontend
Buka terminal baru dan arahkan ke folder `frontend`:
```bash
cd frontend
```
Instal dependensi:
```bash
npm install
```
Atur environment variable:
Buat file `.env.local` di dalam folder `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```
Jalankan server frontend:
```bash
npm run dev
```
*Frontend akan berjalan di `http://localhost:3000`*

---

## 👥 Akun Default (Seeder)
Jika Anda telah menjalankan `node prisma/seed.js`, Anda dapat menggunakan akun berikut (fitur login akan diimplementasikan pada tahap selanjutnya):
- **Email:** admin@cashmate.com
- **Role:** Administrator
