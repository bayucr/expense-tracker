# Expense Tracker App

Full-stack personal finance web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + RLS)**. Designed with financial accuracy in mind: strictly enforces **integer minor-unit arithmetic** to prevent IEEE 754 floating-point drift, uses **Indonesian Rupiah (IDR)** formatted with `id-ID` locale, and operates natively within the **Asia/Jakarta (UTC+7)** timezone.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14+ (App Router, Server Actions, TypeScript) |
| **Styling** | Tailwind CSS + shadcn/ui + Radix UI Primitives |
| **Backend / Auth / DB** | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| **Validation** | Zod (shared client & server validation) |
| **Forms** | React Hook Form + `@hookform/resolvers/zod` |
| **Testing** | Vitest + `fast-check` (Property-Based) + Playwright (E2E) |
| **CI / CD** | GitHub Actions + Vercel |

---

## Key Features

1. **Precision Currency & Minor Units (IDR)**:
   - Stored in PostgreSQL as `numeric(14,2)`.
   - In-memory calculations use integer minor units (1 IDR = 100 minor units/sen) to eliminate floating-point arithmetic errors.
   - Formatted using `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` (e.g. `Rp 1.500.000`).

2. **Asia/Jakarta Timezone (UTC+7)**:
   - Consistent date resolution across timezones with `todayInJakarta()`, `currentMonthInJakarta()`, and `monthRange()`.

3. **Row-Level Security (RLS)**:
   - All `categories` and `transactions` tables are secured by PostgreSQL RLS policies where `auth.uid() = user_id`.
   - Every Server Action executes server-side validation and verifies `getUser()` authentication and category ownership before executing queries.

4. **Category & Transaction Management**:
   - Automatic seeding of 8 default categories for new users via database trigger (`handle_new_user`).
   - Create, edit, and delete categories and transactions with full modal dialogues and duplicate prevention.
   - Filter transactions by month, type (income/expense), category, and description search.
   - Server-side sorting and pagination (20 items per page).

5. **Monthly Financial Summary**:
   - Total income, total expense, and net balance KPI cards.
   - Category allocation breakdown with visual progress meters and percentage share.
   - Quick recent transactions feed.

6. **Comprehensive Property-Based Testing**:
   - 8 correctness properties verified using `fast-check` across randomized inputs.

---

## Project Structure

```
├── .github/workflows/ci.yml       # GitHub Actions CI workflow
├── supabase/migrations/
│   ├── 001_tables_and_rls.sql     # Categories & transactions schema + RLS policies
│   └── 002_indexes_and_trigger.sql# Performance indexes & 8 default category trigger
├── src/
│   ├── actions/                   # Next.js Server Actions (auth, categories, transactions)
│   ├── app/                       # Next.js App Router pages, layouts, loading, errors
│   │   ├── (auth)/                # Login & register routes
│   │   ├── auth/confirm/          # Email confirmation route handler
│   │   ├── dashboard/             # Protected dashboard, transactions, categories
│   │   └── page.tsx               # Portfolio landing page
│   ├── components/                # Modular React UI components (shadcn/ui, forms, charts)
│   ├── lib/                       # Pure utilities (format, date, summary, validations, supabase)
│   └── types/                     # Shared TypeScript interfaces & types
├── tests/
│   ├── properties/                # fast-check property-based tests (Properties 1-8)
│   ├── unit/                      # Vitest unit test suites
│   └── e2e/                       # Playwright E2E integration tests
└── playwright.config.ts           # Playwright configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+ (recommended)
- **npm** or **pnpm**
- A **Supabase** account / project

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/<your-username>/expense-tracker-app.git
cd expense-tracker-app
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Note**: Never commit `.env.local` to git. Only public anon keys are exposed to the client; the service-role key is never used in application code.

### 3. Apply Database Migrations

In your Supabase project dashboard, navigate to the **SQL Editor** and run the migration scripts in order:

1. `supabase/migrations/001_tables_and_rls.sql`
2. `supabase/migrations/002_indexes_and_trigger.sql`

This creates the tables, enables Row Level Security, configures the trigger to seed 8 default categories upon user signup, and sets up query performance indexes.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

### Vitest Suite (Unit & Property-Based Tests)

Run all unit and `fast-check` property tests:

```bash
npm run test
```

### 8 Correctness Properties Verified

| # | Property Name | Target Module |
|---|---|---|
| 1 | Summary totals and balance invariant (`net_balance = income - expense`) | `src/lib/summary.ts` |
| 2 | Minor unit arithmetic eliminates floating-point drift | `src/lib/format.ts` |
| 3 | `todayInJakarta` returns accurate UTC+7 Jakarta calendar date | `src/lib/date.ts` |
| 4 | Search param parser always returns safe fallback defaults | `src/lib/validations/search-params.ts` |
| 5 | `safeRedirectPath` strictly rejects open redirects and protocols | `src/lib/utils.ts` |
| 6 | Category name schema trims whitespace and enforces length (1-50) | `src/lib/validations/category.ts` |
| 7 | Unauthenticated Server Actions always return `ok: false` | `src/actions/` |
| 8 | `formatCurrency` produces standard Indonesian Rupiah format | `src/lib/format.ts` |

### Playwright E2E Tests

```bash
npm run test:e2e
```

### Linting & Type Checking

```bash
npm run lint
npm run typecheck
```

---

## Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In Vercel Project Settings > **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL, e.g. `https://your-app.vercel.app`)
4. In Supabase Dashboard > **Authentication** > **URL Configuration**:
   - Set **Site URL** to `https://your-app.vercel.app`.
   - Add `https://your-app.vercel.app/**` to **Redirect URLs**.
5. Deploy!

---

## Security Checklist

- [x] **RLS Enabled**: Enforced on `categories` and `transactions` tables.
- [x] **No Service-Role Key**: Application code strictly uses `anon` public key with user session token context.
- [x] **Authentication Verification**: `getUser()` is invoked at the start of every Server Action.
- [x] **XSS Prevention**: React automatically escapes text; no `dangerouslySetInnerHTML` or raw HTML rendering.
- [x] **Open Redirect Defense**: All redirects pass through `safeRedirectPath()`.
- [x] **Git Ignored Secrets**: `.env.local` and `.env` are git-ignored.
