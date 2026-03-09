# StockFlow 📦

**StockFlow** is a modern, production-ready multi-tenant SaaS inventory management platform. Built with a focus on professional engineering standards, it provides a seamless experience for organizations to manage their product catalog, track stock movements, and monitor business health through real-time dashboards.

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Secure data isolation using `organization_id` scoping at the database level.
- **Inventory Management**: Full CRUD operations for products with unique SKU enforcement per organization.
- **Stock Tracking**: Real-time stock adjustments with a complete history of inventory movements and audit logs.
- **Low Stock Alerts**: Intelligent alerting system based on organization-wide or product-specific thresholds.
- **Dashboard Analytics**: Instant visibility into total inventory value, item counts, and critical stock levels.
- **Premium UI/UX**: High-end SaaS aesthetic with responsive layouts, smooth animations, and optimized workflows.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Styling**: Vanilla CSS + Tailwind CSS 4
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Logging**: Pino (Structured Logging)
- **Validation**: Zod (Shared across monorepo)

---

## 📁 Project Structure

This project is a monorepo managed with npm workspaces:

```text
/
├── apps/
│   ├── api/          # Express backend with Prisma & PostgreSQL
│   └── web/          # Next.js 14 frontend
├── packages/
│   └── shared/       # Shared Zod schemas and TypeScript types
└── prisma/           # Database schema and migrations
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance

### Installation
1. Clone the repository.
2. Install dependencies from the root:
   ```bash
   npm install
   ```

### Database Setup
1. Configure your `.env` in `apps/api/`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/stockflow"
   JWT_SECRET="your-super-secret-key"
   ```
2. Run Prisma migrations:
   ```bash
   npm run prisma:migrate --workspace=@stockflow/api
   ```

### Running Locally
- **Development Mode** (Both API and Web):
  ```bash
  npm run dev:api
  npm run dev:web
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

---

## 🏗️ Architectural Philosophy

The StockFlow codebase has been meticulously refactored to follow professional industry patterns:

- **Controller-Service-Repository**: Backend logic is decoupled for high maintainability and testability.
- **Feature-Based Modules**: Frontend components and hooks are organized by domain (e.g., `features/inventory`).
- **Unified Validation**: Shared schemas ensure that data integrity is enforced consistently from the UI to the database.
- **Global Error Handling**: Centralized API error management with structured responses and professional logging.

---

## 🔐 Security

- **JWT Authentication**: Secure token-based access with custom middleware.
- **Automatic Scoping**: All database queries are automatically scoped by `organizationId`, preventing cross-tenant data leakage.
- **Password Hashing**: Industry-standard `bcrypt` hashing for user credentials.

---

## 📝 License

This project is licensed under the MIT License.
