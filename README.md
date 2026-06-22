# Cashmate V2 - Modern Web POS System

Cashmate is a full-stack, enterprise-ready Point of Sale (POS) and Inventory Management web application. 

Version 2 features a complete UI overhaul, introducing a clean, dark-themed, glassmorphism design that provides a premium user experience. The application is separated into a Next.js (React) frontend and an Express.js (Node.js) backend utilizing Prisma ORM with MySQL.

## 🚀 Key Features

*   **Sales Center & POS V2:** Fast and responsive POS terminal with category filtering, barcode search, multi-payment options (including ShopeePay), cart management (hold, clear), and integrated tax calculations.
*   **Inventory Center:** Complete CRUD for products, automatic stock deduction, low-stock alerts, category & supplier management, and a dedicated Barcode Center for bulk label printing.
*   **Analytics Center:** Real-time dashboard with KPI cards, dynamic sales revenue charts, and top-performing / low-stock product analysis.
*   **Customer Management:** Track customer purchases and manage loyalty tiers (Regular, Member, VIP) easily.
*   **Unified Reports:** Centralized reporting for sales and inventory with options to export to CSV and Print.
*   **Live Notifications:** Real-time notification bell on the top bar warning about low or depleted stock.

## 💻 Tech Stack

**Frontend:**
*   Next.js (App Router)
*   React 18
*   Tailwind CSS (Custom dark theme with glassmorphism)

**Backend:**
*   Node.js & Express.js
*   Prisma ORM
*   MySQL Database
*   Multer (for image uploads)

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18 or newer recommended)
*   MySQL Server (e.g., via XAMPP)

### 1. Database Setup
1. Start your MySQL server.
2. Create a new database named `cashmate`.

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   DATABASE_URL="mysql://root:@localhost:3306/cashmate"
   ```
4. Push Prisma schema and seed initial data:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
5. Start the backend server: `npm run dev` (Runs on port 5000)

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend server: `npm run dev` (Runs on port 3000)

## 👤 Default Credentials
*   **Email:** `admin@cashmate.com`
*   **Password:** `admin123`

## 📁 Project Structure

*   `backend/` - Node.js Express server, Prisma schema, controllers, routes.
*   `frontend/` - Next.js React application.
    *   `src/app/(dashboard)/` - Protected V2 dashboard routes (sales, inventory, analytics, etc.)
    *   `src/app/login/` - Custom dark-themed login page.
    *   `src/components/layout/` - Sidebar and Topbar navigation.

## 🤝 License
This project is for educational and portfolio purposes.
