# 🛒 Global Baniya - Hyper-Local E-Commerce Platform

Welcome to **Global Baniya**, a highly scalable, role-based, hyper-local e-commerce and quick-commerce platform. Designed to handle everything from grocery delivery (like Zepto/Blinkit) to apparel and electronics, it features a robust multi-role architecture and a normalized inventory engine.

## 🚀 Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Tailwind CSS & Lucide Icons
- **State Management:** Zustand
- **Authentication:** Custom Unified Auth (Bcrypt for Hashing, Nodemailer for OTP)

## ✨ Core Features

- **🎭 Multi-Role Architecture:** Dedicated flows and dashboards for `CUSTOMER`, `RETAILER`, `WHOLESALER`, and `ADMIN`.
- **📦 Advanced Inventory Engine:** A strictly normalized 4-level database schema (`Product` -> `ProductItem` -> `ProductVariant`) where stock (`qty_in_stock`) is strictly managed at the Size/Variant level.
- **⚡ Live Stock Sync:** Real-time polling on the storefront. If a variant's stock drops to 0, the "Add to Cart" button instantly disables and shows "Out of Stock".
- **🔐 Unified Security:** Single login portal supporting both Email/Password (Bcrypt hashed) and secure OTP-based login/password reset.
- **🛡️ Route Protection:** Middleware (`proxy.ts`) based route protection ensuring vendors and customers only access their designated portals.

## 🛠️ Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/) Server (running locally or via cloud)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/global-baniya.git](https://github.com/your-username/global-baniya.git)
cd global-baniya