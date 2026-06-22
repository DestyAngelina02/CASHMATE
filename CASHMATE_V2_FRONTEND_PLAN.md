# CASHMATE V2 - FRONTEND EXECUTION PLAN
## Enterprise Digital Point of Sale (ZIP Based)

---

# 1. PROJECT OVERVIEW

CashMate V2 merupakan aplikasi:

- Point of Sale (POS)
- Inventory Management
- Customer Relationship Management
- Business Analytics
- Reporting System
- User Management

Tujuan utama:

- Semua tombol aktif
- Semua menu terhubung API
- Tidak ada halaman kosong
- Tidak ada dummy component
- Full responsive desktop, tablet, mobile

---

# 2. MASTER LAYOUT

```text
┌────────────────────────────────────────────┐
│ Top Navigation                             │
├────────────┬───────────────────────────────┤
│ Sidebar    │ Main Workspace                │
│ Navigation │                               │
├────────────┴───────────────────────────────┤
│ Floating Quick Action Button (+)           │
└────────────────────────────────────────────┘
```

---

# 3. SIDEBAR NAVIGATION

```text
Dashboard

Sales Center
├── POS Terminal
├── Transactions
├── Refund
└── Payment History

Inventory
├── Products
├── Categories
├── Stock Management
├── Barcode Center
└── Suppliers

Customers
├── Customer List
├── Membership
├── Loyalty Point
└── Purchase History

Analytics
├── Sales Analytics
├── Profit Analytics
├── Product Analytics
└── Customer Analytics

Reports
├── Sales Report
├── Inventory Report
├── Cash Flow
├── Profit Report
└── Export Center

Administration
├── Users
├── Roles
├── Permissions
└── Activity Logs

Settings
├── Store Profile
├── Receipt Template
├── Tax Settings
├── Payment Gateway
└── System Config
```

---

# 4. DASHBOARD MODULE

## KPI CARDS

- Total Revenue
- Total Orders
- Total Products
- Total Customers
- Net Profit
- Today's Sales

### Action Mapping

| Widget | Action |
|----------|----------|
| Revenue | Revenue Analytics |
| Orders | Transaction History |
| Products | Product Management |
| Customers | Customer Management |
| Profit | Profit Analytics |

---

## Dashboard Charts

### Revenue Overview

Filter:

- Today
- Week
- Month
- Quarter
- Year

### Sales Trend

Mode:

- Line Chart
- Bar Chart
- Area Chart

### Product Analytics

- Best Seller
- Slow Moving
- Out Of Stock

---

# 5. PRODUCT MANAGEMENT

## Product Table

Columns:

- Image
- Barcode
- SKU
- Product Name
- Category
- Cost Price
- Selling Price
- Stock
- Status
- Action

---

## Product Actions

- Add Product
- Edit Product
- Delete Product
- Import Product
- Export Product
- Print Barcode
- Bulk Delete
- Stock Adjustment

---

## Product Detail Tabs

- General Information
- Pricing
- Inventory
- Images
- Purchase History
- Sales History
- Audit Log

---

## Product Quick Actions

- Clone Product
- Generate Barcode
- Generate QR Code
- Archive Product
- Restore Product

---

# 6. POS TERMINAL

## Layout

### Left Panel

- Product Search
- Category Filter
- Product Grid

### Right Panel

- Shopping Cart
- Summary
- Payment Area

---

## Product Card

Actions:

- Add To Cart
- View Detail
- Favorite Product

---

## Shopping Cart

Actions:

- Increase Quantity
- Decrease Quantity
- Remove Item
- Clear Cart

---

## Order Actions

- Apply Discount
- Apply Tax
- Apply Voucher
- Split Bill
- Hold Order
- Resume Order

---

## Payment Methods

- Cash
- QRIS
- Dana
- OVO
- GoPay
- ShopeePay
- Bank Transfer

---

## After Payment

- Print Receipt
- Email Receipt
- Download PDF Receipt
- Create New Order

---

# 7. INVENTORY MANAGEMENT

## Stock Dashboard

Widgets:

- Current Stock
- Low Stock
- Out Of Stock
- Incoming Stock

---

## Stock Movement

Actions:

- Stock In
- Stock Out
- Transfer Stock
- Adjustment

---

## Supplier Purchasing

Actions:

- Create Purchase Order
- Receive Stock
- Return Supplier

---

# 8. CUSTOMER MANAGEMENT

## Customer Profile

Fields:

- Name
- Phone
- Email
- Address
- Member Level
- Loyalty Points
- Total Purchase

---

## Customer Actions

- Add Customer
- Edit Customer
- Upgrade Membership
- Send Promotion
- View Purchase History

---

# 9. ANALYTICS CENTER

## Sales Analytics

Widgets:

- Revenue
- Orders
- Average Order Value
- Conversion Rate

---

## Product Analytics

Widgets:

- Best Seller
- Dead Stock
- Fast Moving Product
- Most Profitable Product

---

## Customer Analytics

Widgets:

- New Customer
- Returning Customer
- Top Customer
- Customer Growth

---

# 10. REPORT CENTER

## Available Reports

- Daily Sales
- Weekly Sales
- Monthly Sales
- Profit Report
- Cash Flow Report
- Inventory Report

---

## Export Formats

- PDF
- Excel
- CSV

---

# 11. NOTIFICATION CENTER

## Notification Types

- Low Stock Alert
- New Customer
- Payment Success
- Order Success
- System Notification

---

# 12. FLOATING ACTION BUTTON (+)

## Quick Actions

- New Sale
- New Product
- New Customer
- New Supplier
- Stock Adjustment
- Generate Report

---

# 13. UI COMPONENT STANDARD

## Data Table

Features:

- Search
- Filter
- Sort
- Pagination
- Bulk Action
- Export

---

## Modal Components

Types:

- Create Modal
- Edit Modal
- Delete Confirmation
- Preview Modal

---

## Drawer Components

Types:

- Product Detail
- Customer Detail
- Transaction Detail

---

# 14. FRONTEND MODULE STRUCTURE

```text
src/

app/
├── dashboard
│
├── sales
│   ├── pos
│   ├── transactions
│   ├── refund
│   └── payment-history
│
├── inventory
│   ├── products
│   ├── categories
│   ├── stock
│   ├── barcode
│   └── suppliers
│
├── customers
│   ├── list
│   ├── membership
│   ├── loyalty
│   └── history
│
├── analytics
│   ├── sales
│   ├── profit
│   ├── products
│   └── customers
│
├── reports
│
├── administration
│
└── settings
```

---

# 15. IMPLEMENTATION TARGET

## Functional Target

- 100% mengikuti desain ZIP
- Semua tombol berfungsi
- Semua menu memiliki endpoint API
- Semua widget dapat diklik
- Semua chart interaktif
- Semua tabel searchable
- Semua modal aktif
- Semua export aktif

## Technical Target

Frontend:
- Next.js
- React
- JavaScript
- Tailwind CSS
- Shadcn UI
- TanStack Query

Backend:
- Node.js
- Express.js
- Prisma ORM

Database:
- MySQL

## Final Goal

Membangun aplikasi POS Enterprise modern yang siap digunakan untuk:

- Skripsi
- Tugas Akhir
- UMKM
- Startup Retail
- Implementasi Produksi
