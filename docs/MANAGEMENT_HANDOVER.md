# Executive & Engineering Management Handover Note

**Date:** October 9, 2026  
**Project:** AlphaDrafts Admin Panel (`alpha-drafts-admin-app`)  
**Target:** Engineering Leadership & Product Management  
**Status:** **Stable & Production Ready**

---

## 1. Executive Summary

The AlphaDrafts Admin Panel has undergone a comprehensive architectural migration and quality remediation:
1. **Transitioned away from Firebase client/admin tokens** to a secure **`httpOnly` cookie-based JWT architecture** connected to the Contabo backend API.
2. **Eliminated all hardcoded hostnames**: The frontend strictly targets relative paths (`/v1/*`), with Next.js handling server-side proxy rewrites to the configured `BACKEND_URL`.
3. **Dual-Mode Execution**: The codebase operates seamlessly in **Local Mock Mode** (for offline / staging development using mock fixtures) and **Production Proxy Mode** (relaying directly to the live backend).
4. **Resolved all functional blockers and React 19 warnings**: Zero TypeScript compiler errors, zero ESLint warnings, and verified production build with Next.js Turbopack.

---

## 2. Status of Functional Surfaces

| Surface | Operational State | Notes / Business Capabilities |
|---|---|---|
| **Authentication & Recovery** | ✅ Production Ready | Secure login, session hydration, double-submit CSRF defense, single-flight 401 refresh mutex, password reset, and email verification. |
| **Overview Metrics** | ✅ Production Ready | Live platform KPIs: total users, active tier subscriptions, revenue breakdown, cumulative projects, and analyzer tool usage. Background refreshes are seamless. |
| **User Management** | ✅ Production Ready | Paginated directory with sorting (`created_at`, `updated_at`), status badges, and direct `mailto:` user outreach actions. |
| **Project Tracking** | ✅ Production Ready | Project monitoring with status filtering (`draft`, `in_progress`, `completed`, `archived`) and null-safe rendering. |
| **Subscription & Revenue** | ✅ Production Ready | Multi-filter billing explorer (by plan and status) with price normalization and formatted currency rendering. |
| **Account Settings** | ✅ Operational | Profile viewer and self-service password update form with regex password strength validation. |
| **Admin Team Management** | ⏸️ Paused (Safe) | Gated behind `ADMINS_ENABLED = false` in `constants/admins.ts` until backend exposes admin CRUD endpoints. |

---

## 3. Major Fixes Delivered in Recent Release

1. **Table Navigation Restoration:** Fixed table row link navigation where Lucide's `Link` SVG icon was imported instead of Next.js `next/link`.
2. **HTML Specification Compliance:** Removed nested `<button>` inside `<button>` in `MetricsCard.tsx`, eliminating browser hydration errors and click propagation conflicts.
3. **Role-Based Access Control Hardening:** Updated `AdminLayout.tsx` to authorize both `admin` and `super_admin` roles, preventing Super Admins from being erroneously locked out.
4. **Eliminated Authorization Flashes:** Refactored `useAuthGuard.ts` so permissions are derived cleanly without temporary flashes of protected content during claims loading.
5. **Overview UI Fix:** Replaced full-screen blocking overlay on background refetches with non-intrusive revalidation.
6. **Zero ESLint Warnings:** Resolved 9 React 19 cascading render warnings across tables and modals.
7. **Clean Next.js Config:** Migrated deprecated `images.domains` to `images.remotePatterns`.

---

## 4. Deployment & Infrastructure Guidelines

### Netlify Deployment Configuration
The app is pre-configured for Netlify deployment via `netlify.toml` with the `@netlify/plugin-nextjs` OpenNext adapter.

| Setting | Required Value | Notes |
|---|---|---|
| **Build Command** | `yarn build` | Runs `next build` |
| **Publish Directory** | `.next` | Handled by Netlify OpenNext plugin |
| **Node Version** | `22` | Set via `NODE_VERSION=22` in Netlify dashboard |
| **`BACKEND_URL`** | Contabo Backend Origin | e.g. `https://api.alphadrafts.com` (no trailing slash, no `/api`) |

> **Important:** Do NOT prefix `BACKEND_URL` with `NEXT_PUBLIC_`. It is read strictly on the server in `next.config.ts` to execute server-side rewrites.

---

## 5. Risk Register & Strategic Recommendations

1. **Add Automated Regression Suite (Priority 1):**
   - *Risk:* Future changes to `apiClient` interceptors or role guards could regress without automated tests.
   - *Recommendation:* Introduce Vitest + React Testing Library to cover auth guards, cookie refresh loops, and currency formatters.
2. **Next.js Edge Middleware for Defense-in-Depth (Priority 2):**
   - *Risk:* Route guarding is currently enforced client-side via `AdminLayout`.
   - *Recommendation:* Implement a root `middleware.ts` to inspect the `access_token` cookie and redirect unauthenticated requests before the HTML/JS bundle reaches the client.
3. **Backend Admin Management API (Priority 3):**
   - *Next Step:* When the backend exposes `/v1/admin/members` (to promote/revoke admin users), unpause the Admin Management UI by setting `ADMINS_ENABLED = true` in `constants/admins.ts`.

---

## 6. Documentation Index (Located in `/docs`)

- [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) — System architecture, proxy mechanics, and context hierarchy.
- [`docs/DB_SCHEMA.md`](./DB_SCHEMA.md) — Entity models, DTOs, and timestamp formatting specs.
- [`docs/APP_FLOW.md`](./APP_FLOW.md) — Authentication lifecycles, 401 refresh sequence, and UI user journeys.
- [`docs/TRD.md`](./TRD.md) — Formal Technical Requirements Document (Functional & Non-Functional).
- [`docs/API_CONTRACT.md`](./API_CONTRACT.md) — Exhaustive REST endpoint specifications with sample request/responses.
- [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) — Netlify OpenNext build & environment variable instructions.

