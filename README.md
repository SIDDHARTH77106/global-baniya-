# Global Baniya - Hyper-Local E-Commerce Platform

Global Baniya is a role-based hyper-local commerce platform for customers, retailers, wholesalers, and admins. The current build focuses on authentication, protected dashboards, inventory management, low-stock alerts, search/cart UI, and the foundation for future order and payout modules.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS and Lucide icons
- **State:** Zustand
- **Auth:** Custom email/password and OTP flow with signed cookies
- **Email:** Nodemailer for OTP delivery

## What We Are Doing

We are building a marketplace-style quick-commerce system where:

- Customers can browse products, search nearby store listings, and add items to the cart.
- Retailers and wholesalers can use protected dashboards for inventory, alerts, orders, and payouts.
- Admins can manage product inventory and create product bundles.
- Stock is tracked at the `ProductVariant` level so each size or variant has its own quantity.
- Low-stock alerts help retailers, wholesalers, and admins restock quickly.

## Current Functionality

- Role-based users: `CUSTOMER`, `RETAILER`, `WHOLESALER`, and `ADMIN`.
- Signed session cookie support through `lib/auth-session.ts`.
- OTP registration and email sending helpers through `lib/auth-flow.ts`.
- Prisma models for users, product types, categories, brands, products, product items, variants, sizes, colors, attributes, and reviews.
- Inventory server actions for creating product bundles, updating stock, updating sale price, and reading low-stock alerts.
- Dashboard layouts for retailer, wholesaler, admin, and account settings pages.
- Search and cart UI using local demo data while backend product discovery is still being connected.

## What Will Happen Next

The next backend milestone is to add production order and payout models. After that, retailer and wholesaler order pages can move from placeholder queues to real order management.

Planned next steps:

1. Add database models for carts, orders, order items, payments, payouts, delivery status, and vendor/store ownership.
2. Connect storefront product cards and search results to Prisma data instead of demo arrays.
3. Add checkout flow with order creation and stock reservation.
4. Build retailer and wholesaler fulfillment workflows.
5. Add admin controls for categories, brands, users, and platform settings.
6. Add tests for auth, inventory actions, stock changes, and protected routes.

## How We Will Proceed Further

Development should move module by module:

1. **Schema first:** Add or update Prisma models and migrations.
2. **Backend logic:** Add server actions or API routes with validation and role checks.
3. **Frontend integration:** Replace placeholder UI with real data and loading/error states.
4. **Verification:** Run lint, TypeScript checks, and focused tests after each module.
5. **Polish:** Improve empty states, dashboard actions, mobile layouts, and admin workflows.

## Backend Work

Backend work means everything that protects, stores, validates, and changes data:

- Prisma schema design and migrations.
- MySQL data relationships for users, inventory, orders, payouts, and stores.
- Server actions in `app/actions`.
- API routes in `app/api`.
- Authentication, OTP handling, password hashing, and signed sessions.
- Role authorization for customer, retailer, wholesaler, and admin flows.
- Inventory stock updates and cache revalidation.
- Future order lifecycle, payment records, payout settlement, and delivery state handling.

## Frontend Work

Frontend work means everything the user sees and interacts with:

- Home page sections, product cards, categories, search, and cart UI.
- Login, register, forgot password, and OTP verification screens.
- Retailer, wholesaler, and admin dashboards.
- Tables, forms, alerts, filters, empty states, and action buttons.
- Responsive mobile and desktop layouts.
- Zustand client state for cart and auth UI.
- Connecting UI screens to server actions and API routes.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MySQL
- A valid `DATABASE_URL` in `.env`
- Optional email credentials for OTP delivery: `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM`

### Install

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

### Verify Code

```bash
npm run lint
npx tsc --noEmit
```

## Important Notes

- This project uses Next.js 16 App Router. Before changing routing, layouts, route handlers, server actions, or caching behavior, read the relevant local docs in `node_modules/next/dist/docs`.
- Some pages intentionally show placeholder content because the matching backend models are not created yet.
- The current search/store results still use demo data and should be connected to real product and store records in a future module.
