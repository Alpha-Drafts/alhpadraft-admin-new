# AlphaDrafts Admin App — Full Codebase Audit Report
**Date:** 2026-05-22
**Auditor:** Senior Engineering Lead & Product Manager (AI-assisted)
**Repository:** `Alpha-Drafts/alpha-drafts-admin-app`
**Branch audited:** `dev`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technical Codebase Review](#2-technical-codebase-review)
3. [Product Manager Review](#3-product-manager-review)
4. [Security Review](#4-security-review)
5. [Code Quality Review](#5-code-quality-review)
6. [Documentation](#6-documentation)
7. [Jira-Ready Action Plan](#7-jira-ready-action-plan)
8. [What To Do Next](#8-what-to-do-next)

---

## 1. Executive Summary

### What the App Does
The **AlphaDrafts Admin Panel** is an internal web dashboard used by the AlphaDrafts team to manage their SaaS platform. Admins can view platform-wide metrics, manage users, review subscriptions, browse projects, and manage the admin team (grant/revoke admin roles).

### Who the Users Are
Two internal user tiers:
- **Admins** — read-only access to users, projects, subscriptions, and other admins
- **Super Admins** — full RBAC control including adding/removing admin roles

There are no external end-users of this application.

### Business/Product Purpose
This is an operational back-office tool for the AlphaDrafts team. It sits on top of two data sources:
1. A **Firebase/Firestore** database for admin identity and role management
2. An **external Google Cloud Run backend API** (`alpha-drafts-backend-*.us-east1.run.app`) for users, projects, subscriptions, and platform metrics

### Overall Maturity Level
**Early-to-Mid Beta.** The scaffolding and architecture are solid. The codebase is well-structured, TypeScript is used throughout, auth middleware is properly designed, and there is a sensible DX setup (commitlint, husky, prettier, lint-staged). However, several features are commented out, there are confirmed functional bugs, at least one critical API endpoint is broken, and there are zero automated tests.

### Production Readiness Verdict
**NOT production-ready.** Specific blockers:
- One API endpoint (`/api/v1/admins/create-role`) is structurally broken — it will return 401 for all callers
- Two auth API endpoints (`forgot-password`, `reset-password`) have async/await bugs that silently return empty responses
- The admin removal frontend sends a mismatched query parameter (`userId` vs `user_id`), causing the delete to fail silently
- No test coverage whatsoever
- The service account JSON is parsed without error handling — a malformed env var will crash the server on boot
- Sensitive internal backend URLs are hardcoded in source

---

## 2. Technical Codebase Review

### 2.1 Tech Stack & Frameworks

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (Pages Router) | 16.1.1 |
| Language | TypeScript | ^5 |
| UI Library | React | ^19.0.0 |
| Styling | TailwindCSS | ^4 |
| Component Library | Preline UI | ^3.1.0 |
| Auth | Firebase Authentication | ^11.9.1 |
| Database | Firebase Firestore | ^11.9.1 |
| Server Auth | firebase-admin SDK | ^13.4.0 |
| Data Fetching | TanStack React Query | ^5.81.5 |
| HTTP Client | Axios | ^1.12.0 |
| Animation | Framer Motion | ^12.20.1 |
| Icons | Lucide React | ^0.523.0 |
| Toasts | React Toastify | ^11.0.5 |
| Date Formatting | date-fns | ^4.1.0 |
| Input Validation | express-validator | ^7.2.1 |
| Error Boundary | react-error-boundary | ^6.0.0 |
| Commit Linting | @commitlint/cli + conventional | ^19.8.1 |
| Code Formatting | Prettier + Tailwind plugin | ^3.6.2 |

**Note:** `package.json` still has `"name": "nextjs-firebase-template"` — never updated from the starter template.

### 2.2 Folder/File Structure

```
/
├── pages/                   # Next.js pages (Pages Router)
│   ├── admin/               # Protected admin pages
│   ├── auth/                # Login, forgot-password
│   ├── api/v1/admins/       # Next.js API routes for admin management
│   │   └── auth/            # Password management endpoints
│   │   └── _example/        # Developer reference routes (not production)
│   ├── index.tsx            # Redirect home
│   └── 404.tsx / 500.tsx    # Error pages
├── components/              # Feature-specific React components
│   ├── admins/              # AdminTable, CreateAdminForm, Switcher
│   ├── auth/                # LoginForm, ForgotPasswordForm, ResetPasswordForm
│   ├── navigation/admin/    # NavBar, Sidebar, MobileNavigation
│   ├── overview/            # Metrics dashboard
│   ├── project/             # ProjectTable
│   ├── settings/            # Account/password management
│   ├── subscription/        # SubscriptionTable
│   ├── users/               # UserTable
│   └── others/              # ErrorBoundary, 404/500, Unauthorised
├── common/                  # Reusable UI primitives (Table, Pagination, Dropdown, Modal, etc.)
├── context/                 # React Contexts (Auth, Claims, Dashboard, AppProviders)
├── hooks/                   # Custom hooks (auth guards, fetch, scroll, preline init)
├── middleware/               # API middleware (auth, role, validate)
├── utils/                   # Utility functions (api client, formatting, validation, auth, SEO)
├── types/                   # TypeScript type definitions
├── constants/               # App-wide constants (routes, roles, plans, tables, etc.)
├── layouts/                 # AdminLayout, PublicLayout
├── styles/                  # CSS files
├── database/                # index.ts (empty — exports nothing)
├── docs/                    # Developer documentation
├── public/                  # Static assets
├── firebase.ts              # Firebase client SDK init
├── firebaseAdmin.ts         # Firebase Admin SDK init
└── site.metadata.ts         # Site-wide metadata
```

### 2.3 Main App Architecture

The app follows a **Firebase + Next.js Pages Router** architecture:

```
Browser Client
     │
     ├── Firebase Auth (client SDK)        → Token-based authentication
     ├── Next.js API Routes (/api/v1/*)    → Admin management (Firestore via client SDK)
     └── External Backend API              → Users, projects, subscriptions, metrics
              (alpha-drafts-backend-*.us-east1.run.app)
```

**Data flow for protected pages:**
1. `_app.tsx` wraps everything in `AppProviders` (ReactQuery → Auth → Dashboard → Claims)
2. `AuthProvider` subscribes to Firebase `onAuthStateChanged`
3. `ClaimsProvider` reads Firebase custom claims (roles) from the ID token
4. `DashboardContext` stores active dashboard type and role booleans
5. `AdminLayout` calls `useAuthGuard("admin")` which redirects unauthenticated/unauthorised users
6. Data fetching uses `useFetchHook` wrapping TanStack Query and the custom `apiClient`
7. `apiClient` (Axios) auto-attaches Firebase ID tokens and handles 401 token refresh

### 2.4 Key Modules

| Module | File | Purpose |
|---|---|---|
| Auth Provider | `context/AuthProvider.tsx` | Firebase auth state subscription |
| Claims Provider | `context/ClaimsContext.tsx` | Custom claims (roles) and token management |
| Dashboard Context | `context/DashboardContext.tsx` | Role-based dashboard switching |
| Auth Guard | `hooks/auth/useAuthGuard.ts` | Client-side route protection |
| Auth Middleware | `middleware/authMiddleware.ts` | Server-side JWT verification |
| Role Middleware | `middleware/roleMiddleware.ts` | RBAC enforcement on API routes |
| API Client | `utils/api/apiClient.ts` | Axios with auto-token attach and refresh |
| Fetch Hook | `hooks/misc/useFetchHook.ts` | TanStack Query wrapper for GET requests |
| Admin API | `pages/api/v1/admins/index.ts` | Full CRUD for admin management |

### 2.5 Authentication & Access Control

**Client-side:**
- Firebase email/password login only (no SSO, no Google OAuth despite `GoogleIcon` component existing)
- `useAuthGuard` hook handles redirects in `AdminLayout`
- Known gap: `claimsLoading` temporarily grants `isAuthorised = true` before roles are confirmed — any authenticated user briefly appears authorised while claims fetch

**Server-side:**
- `authMiddleware` verifies Firebase ID tokens using Admin SDK — correctly implemented
- `requiredRole` checks `roles` array from custom claims — correctly implemented
- Middleware chain: `authMiddleware → requiredRole → validateRequest → handler`

**Roles:**
- `user` — base role (redirected to /unauthorised)
- `admin` — read access to admin dashboard
- `super_admin` — write access including role management

### 2.6 Environment Variables

| Variable | Exposed to Browser | Notes |
|---|---|---|
| `NEXT_PUBLIC_NODE_ENV` | Yes | Custom env name. NOT standard `NODE_ENV`. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID` | Yes | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase web config |
| `FIREBASE_SERVICE_ACCOUNT_KEYS` | **No** | Full JSON service account. Highest sensitivity. |
| `NEXT_PUBLIC_*_URL` | Yes | Environment-specific app URLs |
| `SAPLING_API_KEY_DEV/PROD` | No | Referenced in example file. **Not used in code.** |

**Finding:** Each Firebase var also has a `_DEV` variant (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY_DEV`). The `??` fallback means if the primary is set to empty string, it falls through to the dev key — misconfiguration risk.

**Finding:** The backend API base URL is **hardcoded in source** (`constants/auth.ts`), including the GCP project number:
```typescript
export const API_BASE_URL = isProduction
  ? "https://alpha-drafts-backend-635966690380.us-east1.run.app"
  : "https://alpha-drafts-backend-dev-635966690380.us-east1.run.app";
```

### 2.7 External Integrations

| Integration | Purpose | How Used |
|---|---|---|
| Firebase Auth | User authentication | Client SDK + Admin SDK for token verification |
| Firebase Firestore | Admin data storage | Via client SDK in API routes (architectural concern — see §4) |
| Google Cloud Run Backend | Users, projects, subscriptions, metrics | Via hardcoded `API_BASE_URL` |
| Preline UI | Component library (accordion, sidebar, modals) | Script-based initialisation |
| next-sitemap | SEO sitemap | Runs on `postbuild` |
| Sapling AI | Unknown | Keys in env example, **no implementation in code** |

### 2.8 Build, Deploy, Runtime Assumptions

- **Build:** `yarn build` → `next-sitemap` runs post-build
- **Runtime:** Node.js (Next.js Pages Router, not App Router / Edge)
- **Environments:** local, development, staging, production
- **Domains:** `admin.alphadrafts.com` (prod), `admindev.alphadrafts.com` (dev), `adminstaging.alphadrafts.com` (staging)
- **No CI/CD pipeline** exists in the repository (no GitHub Actions, Dockerfile, or deployment scripts)

---

## 3. Product Manager Review

### 3.1 Main User Flows

| Flow | Status | Notes |
|---|---|---|
| Login with email/password | Working | Firebase email/password |
| Forgot password | **Broken** | Async bug — API never sends a response |
| Reset password via email link | **Broken** | Same async bug |
| Change password (settings) | Working | |
| View platform metrics (overview) | Working | Hits external backend |
| Browse users | Working | Read-only, contact only via `mailto:` |
| Browse subscriptions | Working | Filter by plan/status |
| Browse projects | Working | Filter by status |
| List admins | Working | |
| Add admin/super admin | Working (super admins only) | |
| Remove admin | **Broken** | Frontend sends wrong query param |

### 3.2 Admin Workflows Supported

- **Overview Dashboard:** 7 metric cards (total users, active subscriptions by tier, projects created/completed, instruction analyser usage)
- **User Management:** View users list with plan status and project count. Contact via email client. No user detail view, no ability to disable/ban/delete users.
- **Subscription Management:** View subscription history, filter by plan and status. No cancel/refund capability.
- **Project Management:** View all projects by status. No project detail view, no actions.
- **Admin Management:** Super admins can add/remove admins. Admins see read-only list.
- **Settings:** Change own password. Profile info is read-only.

### 3.3 Feature Completeness — What Is Stubbed or Commented Out

| Component | Commented/Stubbed Feature |
|---|---|
| `utils/others/getTableActions.ts` | `onViewDetails`, `onDisable`, `onDelete` user actions |
| `components/project/ProjectTable.tsx` | `onViewDetails` action |
| `components/navigation/admin/Sidebar.tsx` | "Customers" nav item with sub-links |
| `constants/routes.ts` | `transactions`, `profile` routes (no pages exist) |
| `site.metadata.ts` | Contact info, social handles, analytics all `"#"` |
| `database/index.ts` | Entire file is empty |

### 3.4 UX Gaps

1. **No reliable password reset feedback** — the API silently fails (always appears to succeed)
2. **Admin removal fails silently** — no error shown when remove admin API fails
3. **Loading spinner has no timeout** — users see a spinner indefinitely if the backend is down
4. **No search or filter on users table** — only 50-per-page pagination
5. **No pagination state persistence** — sort change or page navigation resets state
6. **Users table has no page heading** — inconsistent with all other pages
7. **Typo:** "All Subcriptions" (missing 'c') in `SubscriptionTable.tsx:172`
8. **Error message missing on failed admin removal** — modal stays open with no feedback

### 3.5 Operational Risks

1. **No audit log** — no record of who added/removed which admin and when
2. **No rate limiting** on API routes — compromised admin token can hammer Firestore
3. **Super admin can demote themselves** — no self-demotion prevention
4. **Forgot password works without verifying the user is an admin** — any Firebase user can request a reset link
5. **No session timeout** beyond Firebase token expiry (1 hour)

### 3.6 Missing Product Requirements

- Transactions page (route defined, no page)
- Profile page (route defined, no page)
- User detail view (commented out)
- User disable/ban/delete (commented out)
- Audit log for role changes
- Search and filter on data tables
- Bulk operations
- CSV export

---

## 4. Security Review

### 4.1 CRITICAL — Broken Authentication on `/api/v1/admins/create-role`

**File:** [pages/api/v1/admins/create-role.ts](pages/api/v1/admins/create-role.ts) — lines 10–29

```typescript
export default async function handler(
  req: NextApiRequest,   // ← NOT AuthenticatedRequest
  res: NextApiResponse,
) {
  const role: UserRoleType = "super_admin";
  switch (req.method) {
    case "POST":
      return requiredRole(role)(req, res, async () =>  // ← req.user is always undefined
```

`requiredRole` checks `req.user.uid` but `authMiddleware` — the function that sets `req.user` — is never called. The middleware returns 401 for all callers. The endpoint is completely non-functional. If the `requiredRole` guard logic ever changes, this becomes an unprotected endpoint that sets Firebase custom claims for any caller.

**Fix:** Wrap handler in `authMiddleware`. Change `NextApiRequest` to `AuthenticatedRequest`.

### 4.2 HIGH — Unawaited Promises in Auth Endpoints

**Files:** [pages/api/v1/admins/auth/forgot-password.ts](pages/api/v1/admins/auth/forgot-password.ts), [pages/api/v1/admins/auth/reset-password.ts](pages/api/v1/admins/auth/reset-password.ts)

```typescript
async function handlePost(req, res) {
  try {
    sendPasswordResetEmail(auth, email, {...})  // ← not awaited
      .then(() => {
        return send200Success({...});  // ← return is to .then(), not to handlePost
      })
      .catch(error => { ... });
    // function returns undefined — no HTTP response set
  } catch (error) { ... }
}
```

The HTTP response is never reliably sent. Both endpoints always appear to return an empty 200. Errors from Firebase are silently swallowed. Password reset is broken end-to-end.

**Fix:** Replace `.then()/.catch()` pattern with `await`.

### 4.3 HIGH — Query Parameter Mismatch in Admin Removal

**Frontend:** [components/admins/AdminTable.tsx:105-110](components/admins/AdminTable.tsx)
```typescript
await apiClient.delete(`/api/v1/admins`, {
  params: { userId: selectedItem.user_id, role: type }  // sends "userId"
});
```

**Backend:** [pages/api/v1/admins/index.ts:356](pages/api/v1/admins/index.ts)
```typescript
const { user_id, role } = req.query;  // expects "user_id"
```

`user_id` is always `undefined` on the server. Additionally, DELETE validation rules validate `id` but the handler reads `user_id`. **Admin removal never actually removes anyone.**

### 4.4 MEDIUM — Firebase Client SDK Used in Server-Side API Routes

API routes import `db` from `@/firebase` (client SDK) and call Firestore directly:

```typescript
import { db } from "@/firebase";  // client SDK, not admin SDK
```

The client SDK respects Firestore Security Rules. This means server-side admin operations have an implicit dependency on Firestore rules being permissive enough to allow them. Recommended: use Firebase Admin SDK in all API routes, which bypasses security rules intentionally and uses the service account credentials already loaded.

### 4.5 MEDIUM — No Error Handling Around `JSON.parse` of Service Account

**File:** [firebaseAdmin.ts:13](firebaseAdmin.ts)

```typescript
credential: cert(JSON.parse(serviceAccount)),  // throws if empty or malformed
```

If `FIREBASE_SERVICE_ACCOUNT_KEYS` is missing or invalid JSON, the server crashes on startup with an uncaught exception and no helpful error message.

### 4.6 MEDIUM — Temporary Authorisation Window in `useAuthGuard`

**File:** [hooks/auth/useAuthGuard.ts:46-50](hooks/auth/useAuthGuard.ts)

```typescript
if (claimsLoading) {
  setIsAuthorised(true);  // any authenticated user appears authorised briefly
  setIsLoading(false);
  return;
}
```

Any authenticated user, regardless of role, briefly passes the admin guard while claims are loading from Firebase. This is a client-side UX decision but represents a brief unauthorised access window.

### 4.7 MEDIUM — Internal Backend URLs Hardcoded in Source

**File:** [constants/auth.ts](constants/auth.ts)

The full GCP Cloud Run service URLs including project number are compiled into the source and thus the production bundle. Should be environment variables.

### 4.8 LOW — `console.warn` Logs User IDs in Production

**File:** [components/admins/AdminTable.tsx:63](components/admins/AdminTable.tsx)

```typescript
console.warn("Open Remove Admin modal with ID:", tx?.user_id);
```

### 4.9 LOW — `window.location.href` in apiClient (SSR Risk)

**File:** [utils/api/apiClient.ts:144](utils/api/apiClient.ts)

Will throw `ReferenceError` if ever executed during server-side rendering.

### 4.10 LOW — No CSRF Protection Documented

Next.js API routes have no CSRF protection. Auth via `Authorization: Bearer` headers largely mitigates this, but the pattern is not documented.

---

## 5. Code Quality Review

### 5.1 Strengths

- Well-structured TypeScript throughout with accurate type definitions
- Consistent API response pattern (`send200Success`, `send404NotFound`, etc.) used uniformly
- Middleware chain is clean and composable: `authMiddleware → requiredRole → validateRequest → handler`
- Good separation of concerns across pages, components, hooks, context, middleware, utils, constants
- Reusable common components used consistently across features
- Proactive token refresh via both background scheduler and reactive 401 handler
- Good developer experience setup (commitlint, husky, prettier, lint-staged, bundle analyzer)
- Each file has a top-level JSDoc comment explaining purpose
- Developer-facing `_example/` routes with excellent `_readme.md` documentation

### 5.2 Weaknesses

- Zero test coverage
- Async/await mixed with `.then()/.catch()` in two critical endpoints — causes silent failures
- Query parameter naming inconsistency breaks admin delete flow
- No isolated error boundaries for individual data sections — one API failure can affect the whole page
- `ClaimsProvider` and `DashboardContext` both store `isAdmin`/`isSuperAdmin` — two sources of truth

### 5.3 Duplicated Code

Pagination logic (`handlePrevPage`, `handleNextPage`, `setCurrentPage`, state) is copy-pasted identically in four table components:
- `components/admins/AdminTable.tsx`
- `components/users/UserTable.tsx`
- `components/project/ProjectTable.tsx`
- `components/subscription/SubscriptionTable.tsx`

A single `usePagination` hook would eliminate this entirely.

### 5.4 Dead / Unused Code

| File | Dead Code |
|---|---|
| `database/index.ts` | Entire file — exports nothing |
| `utils/validation/sanitiseInputs.ts` | `removeLeadingZero`, `isValidUrl` — not imported anywhere |
| `constants/routes.ts` | `adminRoutes.transactions`, `adminRoutes.profile` — no pages exist |
| `common/icons/_example.tsx` | Example component not used in production |
| `utils/others/getTableActions.ts` | `onViewDetails`, `onDisable`, `onDelete` handlers (commented out) |
| `.env.local.example` | `SAPLING_API_KEY_DEV/PROD` — no usage in codebase |
| `site.metadata.ts` | `analytics.google`, `blog`, `contact`, `apps`, `social_handles` all placeholder |

### 5.5 Fragile Areas

1. `firebaseAdmin.ts` — server crash on malformed env var
2. `forgot-password.ts` / `reset-password.ts` — broken async pattern
3. Admin delete flow — param name mismatch
4. `send500Error` uses `res.statusCode || 500` — middleware may have already set a different code, returning a misleading status
5. Firestore cursor pagination is O(N) reads to skip N documents — expensive as data grows
6. `useAuthGuard` includes `router` in its dependency array — in Pages Router, `router` is a new object each render, which can cause the effect to re-fire unexpectedly

### 5.6 Naming Issues

- `package.json` name is `"nextjs-firebase-template"` (never updated)
- `DEFAULT_SORT_OPTIONS_TWO` — non-descriptive; `USER_SORT_OPTIONS` would be clearer
- `handleSortSelection` in `ProjectTable.tsx` actually sets a status filter, not a sort
- `NEXT_PUBLIC_NODE_ENV` conflicts with developer expectation that `NODE_ENV` is used

---

## 6. Documentation

### 6.1 Developer Onboarding

**Prerequisites:**
- Node.js 20+
- Yarn
- A Firebase project with Authentication and Firestore enabled
- A Firebase service account JSON key file

**First-time setup:**
```bash
git clone https://github.com/Alpha-Drafts/alpha-drafts-admin-app.git
cd alpha-drafts-admin-app
yarn install
cp .env.local.example .env.local
# Edit .env.local with your values (see §6.2)
yarn dev
```

App is available at http://localhost:3000

**To create your first super admin (manual bootstrap):**
1. Create a Firebase user via the Firebase Console
2. Use Firebase Console → Authentication → User → Custom Claims to set:
   `{ "roles": ["user", "admin", "super_admin"] }`
3. Log in at `/auth` with that user

### 6.2 Environment Variables Reference

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_NODE_ENV` | Yes | `local` | One of: local, development, staging, production |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | `AIzaSy...` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | `myapp.firebaseapp.com` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | `my-project` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | `my-project.appspot.com` | |
| `NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID` | Yes | `123456789` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | `1:123:web:abc` | |
| `FIREBASE_SERVICE_ACCOUNT_KEYS` | Yes | `{"type":"service_account",...}` | Full JSON, single-line. Never commit. |
| `NEXT_PUBLIC_LOCAL_URL` | Yes | `http://localhost:3000` | Used in password reset links |
| `NEXT_PUBLIC_DEVELOPMENT_URL` | Optional | `https://admindev.alphadrafts.com` | |
| `NEXT_PUBLIC_STAGING_URL` | Optional | `https://adminstaging.alphadrafts.com` | |
| `NEXT_PUBLIC_PRODUCTION_URL` | Optional | `https://admin.alphadrafts.com` | |

**Service account setup:**
Firebase Console → Project Settings → Service Accounts → Generate New Private Key → download JSON → minify to single line → paste as `FIREBASE_SERVICE_ACCOUNT_KEYS` value.

### 6.3 Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                     Browser (Next.js)                       │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────────────┐  │
│  │AuthProv. │  │ClaimsProv.  │  │DashboardContext        │  │
│  │(Firebase │  │(JWT claims  │  │(Active role,           │  │
│  │ SDK)     │  │ + token)    │  │ isAdmin/isSuperAdmin)  │  │
│  └──────────┘  └─────────────┘  └───────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Admin Pages (/admin/*)                              │    │
│  │  Protected by AdminLayout → useAuthGuard             │    │
│  │  Data via useFetchHook → apiClient (Axios)           │    │
│  └──────────────────┬──────────────────────────────────┘    │
└─────────────────────┼──────────────────────────────────────┘
                      │
         ┌────────────┴────────────────┐
         │                             │
 ┌───────▼────────┐           ┌────────▼────────────┐
 │ Next.js API    │           │ External Backend     │
 │ /api/v1/admins │           │ GCP Cloud Run        │
 │ (admin CRUD,   │           │ /v1/admin/users      │
 │  auth, roles)  │           │ /v1/admin/projects   │
 └───────┬────────┘           │ /v1/admin/metrics    │
         │                    │ /v1/admin/subscr.    │
 ┌───────▼────────┐           └─────────────────────┘
 │ Firebase       │
 │ Firestore      │
 │ (admins coll.) │
 └────────────────┘
```

### 6.4 Deployment Process

No CI/CD pipeline exists in the repository. All deployments are currently assumed to be manual.

```bash
yarn build          # Runs Next.js build + postbuild sitemap
yarn start          # Verify locally before deploying
# Deploy as a standard Next.js Node.js app (Vercel, Cloud Run, etc.)
# Set all environment variables in the hosting platform
```

**Before any deployment:**
- Verify all env vars are set in the hosting environment
- Ensure Firestore security rules allow the admin queries used in API routes
- Ensure the Firebase service account has the required permissions

### 6.5 Main Workflows

**Adding an admin:**
1. Super Admin → `/admin/admins` → "Add Admin"
2. Select role, enter email, click "Confirm Email"
3. Backend checks if user exists in Firestore `users` collection
4. If found: click "Add Admin" → backend sets Firebase custom claims and creates/updates `admins` Firestore document

**Removing an admin (currently broken):**
1. Super Admin finds admin in table → dropdown → "Remove Admin"
2. Types admin's email → "Remove Admin"
3. **Bug:** Frontend sends `userId`, backend expects `user_id` — removal silently fails

**Viewing platform metrics:**
1. Admin logs in → redirected to `/admin/overview`
2. Fetches from `{API_BASE_URL}/v1/admin/metrics`
3. Renders 7 metric cards

### 6.6 Known Risks and Limitations

1. **Forgot password and reset password are broken** — do not rely on these flows until P0-001/P0-002 are fixed
2. **Admin removal is broken** — silently fails until P0-003 is fixed
3. **No test coverage** — all changes are manually tested only
4. **Firestore pagination is O(N) reads** — fetching page 10 of 50 requires reading 450 documents first
5. **Client SDK in API routes** — depends on permissive Firestore security rules
6. **No audit trail** for role changes
7. **Sapling API keys** in env example but no implementation exists
8. **`create-role` endpoint is non-functional** — always returns 401

### 6.7 Handover Notes for Future Engineers

**Required questions for the previous developer:**
1. What Firestore security rules are currently deployed? The API routes need them to be permissive for server-side operations.
2. Is the external backend API documented? No API contract exists in this repo.
3. Was Sapling AI integration planned? Keys exist but no code.
4. Why is `database/index.ts` empty? Was a Firestore abstraction layer intended?
5. What is the current deployment infrastructure? No pipeline exists.
6. How is the initial super admin created given the `create-role` endpoint is broken?

**Confirmed bugs as of 2026-05-22:**
- Forgot password endpoint: async bug — no HTTP response sent
- Reset password endpoint: same async bug
- Admin remove: `userId` vs `user_id` param mismatch
- `create-role`: no `authMiddleware` — always returns 401

---

## 7. Jira-Ready Action Plan

### P0 — Critical Fixes (Block Production)

---

**[P0-001] Fix async bug in forgot-password API**
- **Problem:** `sendPasswordResetEmail` is called without `await`. HTTP response is never reliably sent. Password reset emails may not trigger and success/error is swallowed.
- **Expected Outcome:** Forgot password flow works end-to-end
- **Acceptance Criteria:**
  - POST `/api/v1/admins/auth/forgot-password` returns 200 when email is valid
  - Returns 500 with error message when Firebase throws
  - User receives reset email
- **File:** `pages/api/v1/admins/auth/forgot-password.ts`
- **Owner:** Backend
- **Effort:** XS

---

**[P0-002] Fix async bug in reset-password API**
- **Problem:** Same async/await issue — `confirmPasswordReset` is not awaited; response is orphaned in `.then()`
- **Expected Outcome:** Password reset completes successfully with valid `oobCode`
- **Acceptance Criteria:**
  - POST `/api/v1/admins/auth/reset-password` returns 200 on success
  - Returns 500 if oobCode is invalid or expired
- **File:** `pages/api/v1/admins/auth/reset-password.ts`
- **Owner:** Backend
- **Effort:** XS

---

**[P0-003] Fix admin removal query parameter mismatch**
- **Problem:** Frontend sends `userId` but backend expects `user_id`. Admin removal silently fails for every call. Additionally, validation validates `id` but handler reads `user_id`.
- **Expected Outcome:** Admin removal correctly removes the role from Firebase claims and Firestore
- **Acceptance Criteria:**
  - Removing an admin from the UI actually removes their role
  - Removed admin loses access on next token refresh
  - Success toast appears; admin disappears from list on refetch
- **Files:** `components/admins/AdminTable.tsx:105`, `pages/api/v1/admins/index.ts:469`
- **Owner:** Frontend + Backend
- **Effort:** S

---

**[P0-004] Fix broken `create-role` endpoint (add authMiddleware)**
- **Problem:** Endpoint uses `NextApiRequest` and calls `requiredRole` without `authMiddleware`. `req.user` is always `undefined` → always returns 401. No one can use this endpoint.
- **Expected Outcome:** Legitimate super admins can set custom claims via this endpoint
- **Acceptance Criteria:**
  - Requires valid super_admin Bearer token
  - Correctly sets Firebase custom claims
  - Returns 403 for non-super-admin callers
  - Returns 401 for unauthenticated callers
- **File:** `pages/api/v1/admins/create-role.ts`
- **Owner:** Backend
- **Effort:** XS

---

**[P0-005] Add error handling around `JSON.parse` in `firebaseAdmin.ts`**
- **Problem:** Missing or malformed `FIREBASE_SERVICE_ACCOUNT_KEYS` crashes the server on startup
- **Expected Outcome:** Clear, graceful error message when env var is missing/malformed
- **Acceptance Criteria:**
  - Missing env var: logs `"FIREBASE_SERVICE_ACCOUNT_KEYS is not set"` and exits cleanly
  - Malformed JSON: logs `"FIREBASE_SERVICE_ACCOUNT_KEYS contains invalid JSON"` and exits cleanly
- **File:** `firebaseAdmin.ts`
- **Owner:** Backend / DevOps
- **Effort:** XS

---

### P1 — Next Sprint

---

**[P1-001] Set up CI/CD pipeline**
- **Problem:** No automated build, test, or deployment pipeline
- **Expected Outcome:** Every PR triggers lint, type-check, and tests; merges to main deploy automatically
- **Acceptance Criteria:**
  - GitHub Actions runs `yarn lint`, `yarn check-types`, tests on every PR
  - Deployment workflow on merge to main
- **Owner:** DevOps
- **Effort:** M

---

**[P1-002] Add automated test coverage for API routes**
- **Problem:** Zero tests — every change risks regression with no safety net
- **Expected Outcome:** Core API paths covered
- **Acceptance Criteria:**
  - Unit tests for all middleware (`authMiddleware`, `roleMiddleware`, `validateMiddleware`)
  - Integration tests for admin CRUD API routes
  - e2e tests for login and add/remove admin flows
  - Tests run in CI
- **Owner:** Full-stack / QA
- **Effort:** L

---

**[P1-003] Move backend API URLs to environment variables**
- **Problem:** GCP Cloud Run URLs with project number hardcoded in `constants/auth.ts`
- **Expected Outcome:** Backend URL configured via env var, not compiled into source
- **Acceptance Criteria:**
  - `NEXT_PUBLIC_BACKEND_URL` env var introduced
  - `constants/auth.ts` reads from env var
  - `.env.local.example` and README updated
- **File:** `constants/auth.ts`
- **Owner:** DevOps / Backend
- **Effort:** XS

---

**[P1-004] Add audit logging for role changes**
- **Problem:** No record of who granted or revoked admin roles or when
- **Expected Outcome:** Every role change writes to an `audit_logs` Firestore collection
- **Acceptance Criteria:**
  - Grant/revoke admin: logs `actor_uid`, `target_uid`, `role`, `action`, `timestamp`
  - Super admins can view audit log in UI (or at minimum in Firestore Console)
- **Owner:** Backend + Frontend
- **Effort:** M

---

**[P1-005] Add rate limiting to sensitive API routes**
- **Problem:** No rate limiting — compromised admin token can hammer Firestore
- **Expected Outcome:** Sensitive endpoints rate-limited
- **Acceptance Criteria:**
  - Requests exceeding threshold return 429 Too Many Requests
  - Applied to: create-role, add admin (POST /admins), remove admin (DELETE /admins)
- **Owner:** Backend
- **Effort:** S

---

**[P1-006] Remove `console.warn` from AdminTable production code**
- **Problem:** Logs admin user IDs to browser console
- **File:** `components/admins/AdminTable.tsx:63`
- **Owner:** Frontend
- **Effort:** XS

---

**[P1-007] Update `package.json` name from template value**
- **Problem:** `"name": "nextjs-firebase-template"` — never updated
- **File:** `package.json:2`
- **Owner:** Any
- **Effort:** XS

---

### P2 — Medium-Term Improvements

---

**[P2-001] Extract `usePagination` hook to eliminate copy-paste**
- **Problem:** Identical pagination logic copy-pasted in 4 table components
- **Expected Outcome:** Single reusable `usePagination(itemsPerPage)` hook
- **Files:** All four table components in `components/`
- **Owner:** Frontend
- **Effort:** S

---

**[P2-002] Switch Firestore API route queries to Firebase Admin SDK**
- **Problem:** API routes use client SDK — depends on permissive Firestore security rules
- **Expected Outcome:** Admin SDK used in server-side routes; security rules can be locked down
- **Owner:** Backend
- **Effort:** M

---

**[P2-003] Add search/filter to users table**
- **Problem:** No way to find a specific user; only 50-per-page pagination
- **Expected Outcome:** Search by name or email, filter by subscription plan
- **Owner:** Frontend + Backend
- **Effort:** M

---

**[P2-004] Implement user management actions (view details, disable, delete)**
- **Problem:** These actions are all commented out in `getTableActions.ts`
- **Expected Outcome:** Admins can view user detail, disable/re-enable, or delete users
- **Owner:** Frontend + Backend
- **Effort:** L

---

**[P2-005] Fix `send500Error` to always return HTTP 500**
- **Problem:** Uses `res.statusCode || 500` — may return wrong status code if middleware set it earlier
- **File:** `utils/validation/apiResponses.ts:170`
- **Owner:** Backend
- **Effort:** XS

---

**[P2-006] Add prevent-self-demotion guard in admin role removal**
- **Problem:** Super admin can accidentally remove their own role and lock themselves out
- **Acceptance Criteria:**
  - Server rejects removal if `req.user.uid === user_id`
  - UI disables remove button for logged-in user's own entry
- **Owner:** Frontend + Backend
- **Effort:** S

---

**[P2-007] Create or remove the Transactions and Profile pages**
- **Problem:** Routes defined in `adminRoutes` but pages don't exist
- **Expected Outcome:** Either implement these pages or remove the routes and sidebar entries
- **Owner:** Frontend
- **Effort:** M

---

**[P2-008] Fix "All Subcriptions" typo**
- **Problem:** Missing 'c' in heading
- **File:** `components/subscription/SubscriptionTable.tsx:172`
- **Owner:** Frontend
- **Effort:** XS

---

### P3 — Backlog

---

**[P3-001] Replace offset-based Firestore pagination with cursor-based**
- **Problem:** Skipping N documents requires reading N documents (O(N) Firestore reads) — expensive at scale
- **Expected Outcome:** Cursor-based pagination using `startAfter(lastDoc)` directly
- **Owner:** Backend
- **Effort:** M

---

**[P3-002] Remove all dead code**
- Empty `database/index.ts`, unused `sanitiseInputs.ts`, undefined-route constants, commented-out nav items, Sapling key placeholders
- **Owner:** Any
- **Effort:** S

---

**[P3-003] Add idle session timeout**
- **Problem:** No automatic logout after inactivity beyond Firebase 1-hour token
- **Expected Outcome:** Logout (or warning) after 30 minutes of inactivity
- **Owner:** Frontend
- **Effort:** S

---

**[P3-004] Add CSV export to data tables**
- **Problem:** No way to export data from any table
- **Expected Outcome:** Export button downloads current-filter data as CSV
- **Owner:** Frontend + Backend
- **Effort:** M

---

**[P3-005] Populate site metadata**
- **Problem:** Contact info, social handles, analytics all placeholder `"#"` in `site.metadata.ts`
- **Expected Outcome:** Reflects actual AlphaDrafts brand information
- **Owner:** PM / Frontend
- **Effort:** XS

---

## 8. What To Do Next

### This Week (P0 — Unblock the App)

These five fixes are small (XS–S effort) and are blocking basic production use:

1. Fix async bugs in forgot-password and reset-password (`pages/api/v1/admins/auth/`)
2. Fix admin removal param mismatch (`AdminTable.tsx` + `admins/index.ts`)
3. Add `authMiddleware` to `create-role.ts`
4. Add try/catch around `JSON.parse` in `firebaseAdmin.ts`
5. Remove `console.warn` from `AdminTable.tsx`

### Next Sprint (P1 — Operational Baseline)

6. Set up CI/CD pipeline — everything else depends on this
7. Write tests for the 5 existing API routes before adding any new features
8. Move backend URL to env var — before next deployment
9. Add audit logging for role changes — operational necessity for an admin panel

### Before Expanding Features (P2)

10. Switch API routes to Firebase Admin SDK (architectural prerequisite)
11. Add rate limiting to sensitive endpoints
12. Build user management actions (view, disable, delete)
13. Implement self-demotion prevention

### Questions for the Previous Developer (Required Before Proceeding)

1. What Firestore security rules are deployed? Share them — the API routes depend on them.
2. Is the external backend API documented anywhere? No contract exists in this repo.
3. What is the current deployment infrastructure and process?
4. Was Sapling AI integration planned or is it abandoned?
5. What was `database/index.ts` intended to export?
6. How is the initial super admin created today (given `create-role` is broken)?
