# Technical Requirements Document (TRD)

**Project:** AlphaDrafts Admin Panel  
**Document Version:** 2.0  
**Target Environment:** Netlify (OpenNext) / Node 22  

---

## 1. System Scope & Objectives

The **AlphaDrafts Admin Panel** provides administrative, operational, and financial oversight for the AlphaDrafts SaaS platform. It enables authorized staff to inspect platform metrics, query user accounts, monitor drafting projects, and analyze subscription health.

---

## 2. Functional Requirements

### 2.1 Authentication & Session (FR-AUTH)
- **FR-AUTH-1:** The system shall authenticate administrators using email and password against `POST /v1/auth/login`.
- **FR-AUTH-2:** The session shall be maintained via `httpOnly` cookies (`access_token` and `refresh_token`).
- **FR-AUTH-3:** The client shall intercept HTTP 401 errors and attempt a single silent refresh against `POST /v1/auth/refresh`. Multiple concurrent 401s must be de-duplicated via a mutex promise.
- **FR-AUTH-4:** State-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) shall supply an `X-CSRF-Token` header matching the `csrf_token` cookie.
- **FR-AUTH-5:** The logout procedure shall call `POST /v1/auth/logout`, clear all React Query caches, and route to the login screen.
- **FR-AUTH-6:** The system shall support self-service password reset via `/auth/forgot-password` and `/auth?mode=resetPassword`.

### 2.2 Role-Based Access Control (FR-RBAC)
- **FR-RBAC-1:** All administrative routes under `/admin/*` shall be protected by `useAuthGuard`.
- **FR-RBAC-2:** Both `admin` and `super_admin` roles shall be authorized to view core dashboard pages (Overview, Users, Projects, Subscriptions, Settings).
- **FR-RBAC-3:** If an unauthenticated user attempts to visit an admin route, they shall be redirected to `/` with a `redirect` query parameter.
- **FR-RBAC-4:** If an authenticated user lacks administrative roles, they shall be redirected to `/unauthorised`.

### 2.3 Dashboard Surfaces (FR-SURF)
- **FR-SURF-1 (Overview):** Must display total users, active subscriptions by tier (Starter, Student, Professional), revenue by tier, project statistics, and analyzer executions via `GET /v1/admin/metrics`.
- **FR-SURF-2 (Users):** Must display paginated user rows (50 per page), with sorting support for `created_at` and `updated_at`. Must support opening a `mailto:` link for any user.
- **FR-SURF-3 (Projects):** Must display project title, creator name, status badge, and formatted creation date. Must filter by status (`All`, `draft`, `in_progress`, `completed`, `archived`) and support `null` status values without error.
- **FR-SURF-4 (Subscriptions):** Must display subscriber name, email, plan name, normalized currency amount, and status. Must filter by plan and subscription status.
- **FR-SURF-5 (Settings):** Must display admin profile info and allow updating passwords via `PATCH /v1/users/update-password` with regex complexity enforcement (uppercase, lowercase, number, special char, length 6–20).

---

## 3. Non-Functional Requirements

### 3.1 Security (NFR-SEC)
- **NFR-SEC-1:** Zero credentials or JWT tokens stored in `localStorage` or `sessionStorage`.
- **NFR-SEC-2:** All backend communication must be encrypted over HTTPS in production.
- **NFR-SEC-3:** All external links must use `rel="noopener noreferrer"`.
- **NFR-SEC-4:** Double-submit CSRF tokens enforced for all mutative API operations.

### 3.2 Performance & Bundle Size (NFR-PERF)
- **NFR-PERF-1:** Page initial load Largest Contentful Paint (LCP) shall be < 2.0s under standard 4G networks.
- **NFR-PERF-2:** Background data revalidation (React Query window focus) shall occur without displaying full-screen loading spinners.
- **NFR-PERF-3:** Bundle analyzer script (`npm run analyze`) shall be maintained for monitoring vendor dependency sizes.

### 3.3 Compatibility & Responsiveness (NFR-COMP)
- **NFR-COMP-1:** Target browsers: Chrome 110+, Safari 16+, Edge 110+, Firefox 115+.
- **NFR-COMP-2:** Responsive layouts supported from mobile viewports (320px) up to 2xl desktop viewports (1536px+).

---

## 4. Data Envelope & Error Contract

All backend responses conform to the standard payload shape:
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {}
}
```

Standard error format:
```json
{
  "status": "error",
  "message": "Human-readable explanation of error",
  "error": {
    "code": "ERROR_CODE_STRING"
  }
}
```
