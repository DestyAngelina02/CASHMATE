# CASHMATE: Aplikasi Kasir Digital Berbasis Web

## Plan Pengembangan Sistem

### 1. Arsitektur Sistem

```text
Client (Browser/Mobile)
        │
        ▼
Frontend (Next.js/React - JavaScript)
        │ REST API
        ▼
Backend (Node.js + Express)
        │ Prisma ORM
        ▼
Database (MySQL)
```

---

## 2. Teknologi yang Digunakan

### Frontend
- Next.js
- React.js
- JavaScript ES6+
- Axios
- TanStack Query
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod Validation
- Chart.js

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Bcrypt
- Multer
- Nodemailer

### Database
- MySQL
- Prisma ORM

### Deployment
- Frontend: Vercel
- Backend: Railway / Render
- Database: PlanetScale / VPS MySQL

---

## 3. Struktur Project Frontend

```text
frontend/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── store/
│   ├── utils/
│   └── middleware/
└── package.json
```

---

## 4. Struktur Project Backend

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   └── utils/
├── app.js
└── server.js
```

---

## 5. Modul Sistem

### Authentication
- Login
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Change Password

### Dashboard
- Total Penjualan
- Total Produk
- Total Transaksi
- Grafik Penjualan
- Produk Terlaris

### Produk
- CRUD Produk
- Upload Gambar
- Barcode
- QR Code

### Kategori
- CRUD Kategori

### Supplier
- CRUD Supplier

### Stok
- Stock In
- Stock Out
- Adjustment

### Pelanggan
- CRUD Pelanggan
- Membership

### Transaksi
- Scan Barcode
- Keranjang Belanja
- Diskon
- Pajak
- QRIS
- Cetak Struk

### Laporan
- Penjualan
- Keuntungan
- Stok
- Aktivitas Kasir
- Export PDF, Excel, CSV

---

## 6. Database Design

### Entity
- User
- Role
- Category
- Product
- Supplier
- Customer
- Transaction
- TransactionItem
- Payment
- StockMovement

### Relasi

```text
Role
└── User

Category
└── Product

Supplier
└── Product

Customer
└── Transaction

Transaction
├── TransactionItem
├── Payment
└── User

Product
├── TransactionItem
└── StockMovement
```

---

## 7. Prisma Schema (Ringkasan)

```prisma
model User {
  id       Int @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}

model Product {
  id       Int @id @default(autoincrement())
  name     String
  stock    Int
  price    Decimal
}

model Transaction {
  id        Int @id @default(autoincrement())
  total     Decimal
  createdAt DateTime @default(now())
}
```

---

## 8. REST API

### Authentication

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Product

```http
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Transaction

```http
GET  /api/transactions
POST /api/transactions
```

### Reports

```http
GET /api/reports/sales
GET /api/reports/profit
GET /api/reports/stocks
```

---

## 9. Sprint Development

### Sprint 1
- Setup Project
- Database
- Prisma
- Authentication

### Sprint 2
- Dashboard
- User Management

### Sprint 3
- Produk
- Kategori
- Supplier

### Sprint 4
- Stok
- Pelanggan

### Sprint 5
- Transaksi Kasir

### Sprint 6
- Laporan
- Export PDF & Excel

### Sprint 7
- Testing
- Deployment
- Dokumentasi

---

## 10. Fitur Unggulan

1. Dashboard Real-Time
2. Role & Permission
3. Manajemen Produk dan Stok
4. Barcode dan QR Code
5. Laporan Profit Otomatis
6. Export PDF dan Excel
7. Audit Log
8. Responsive Design
9. Multi User Kasir
10. Arsitektur Frontend dan Backend Terpisah
