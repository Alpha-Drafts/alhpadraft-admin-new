# Route Inventory — pages/api

Scope: every file under `pages/api/` after deletion of `pages/api/v1/_example/**` (unauthenticated + template CRUD removed ahead of Gate 1).

- `find pages/api -type f | wc -l` → **7**
- Rows in route table → **7** (match; discrepancy 0)

Server source of truth for these routes: Firestore (client SDK via `@/firebase`) + Firebase Auth Admin SDK (`@/firebaseAdmin`).

Client access pattern for **these** routes: axios `apiClient` (`baseURL: "/"`, `utils/api/apiClient.ts`) → same-origin `/api/v1/admins/*`.

**Dashboard product data is separate:** Users, Projects, Subscriptions, and Overview metrics do **not** hit this app’s `/api/`. They call an external Cloud Run backend via `API_BASE_URL` (`constants/auth.ts`):

- prod: `https://alpha-drafts-backend-635966690380.us-east1.run.app`
- dev: `https://alpha-drafts-backend-dev-635966690380.us-east1.run.app`

Endpoints used by UI (not inventory rows; no local route files):

| UI surface    | Endpoint                                    |
| ------------- | ------------------------------------------- |
| Overview      | `{API_BASE_URL}/v1/admin/metrics`           |
| Users         | `{API_BASE_URL}/v1/admin/users?...`         |
| Projects      | `{API_BASE_URL}/v1/admin/projects?...`      |
| Subscriptions | `{API_BASE_URL}/v1/admin/subscriptions?...` |

This app’s local API surface is **admin-role management + password auth only** (`admins`, `users` collections + Firebase Auth). Not DocAuditor product data.

## Column legend

- **USAGE:** `in-use` = active client caller and functional; `broken-in-use` = active client caller but broken; `unused` = no client caller (or structurally unreachable).
- **CONTABO:** Contabo-backend equivalent for the route. Evidence: `_docs/REFERENCE_CLIENT.md` (live-verified 2026-08-13). Values: `COVERED` (endpoint + method), `GAP` (no backend equivalent exposed), `N/A` (route removed).

## Routes

| #   | Route path                            | File                                        | Methods (switch/guard) | What it does (behaviour)                                                                                                                                                                                                                                                                                                                                                      | Firestore collections/documents                                                                         | R/W          | Middleware (outer→inner)                                                   | Role/claim enforced                                                    | USAGE                                                   | CONTABO                                                                                                        | Notes                                                                                                                                                                        |
| --- | ------------------------------------- | ------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `/api/v1/admins`                      | pages/api/v1/admins/index.ts                | GET, POST, PUT, DELETE | GET: lists `admins` (skip/take, sort name/date, optional `type=super_admin`, or single by `id`); POST: promotes `users/{user_id}` to admin/super_admin (custom claims + `users` doc + `admins/{user_id}`); PUT: updates caller’s `photo_url` in Auth + `users/{uid}`; DELETE: strips admin/super_admin from claims + `users/{user_id}`, updates or deletes `admins/{user_id}` | admins (GET read; POST/DELETE write); users (POST/PUT/DELETE read+write); Auth claims (POST/PUT/DELETE) | BOTH         | authMiddleware → requiredRole → validateRequest → handler                  | GET: `admin`; POST: `super_admin`; PUT: `admin`; DELETE: `super_admin` | broken-in-use (DELETE); in-use (GET/POST); unused (PUT) | GAP — no admin-management endpoint on backend (`/v1/admin/*` is GET-only metrics/users/projects/subscriptions) | **DELETE broken:** client sends `userId` (AdminTable.tsx:105-110), handler reads `user_id` (index.ts:356), validator requires `id` (index.ts:471). PUT has no client caller. |
| 2   | `/api/v1/admins/check-status`         | pages/api/v1/admins/check-status.ts         | GET                    | Given `email` + role, returns `user_id` of first `users` doc matching email (CreateAdminForm lookup before promote)                                                                                                                                                                                                                                                           | users (read, query by email)                                                                            | READ         | authMiddleware → requiredRole("super_admin") → validateRequest → handleGet | `super_admin`                                                          | in-use                                                  | GAP — no backend equivalent                                                                                    | CreateAdminForm.tsx:33                                                                                                                                                       |
| 3   | `/api/v1/admins/admins-count`         | pages/api/v1/admins/admins-count.ts         | GET                    | Counts `admins` with `roles array-contains "admin"` and `"super_admin"`; returns `{admins_count, super_admins_count}`                                                                                                                                                                                                                                                         | admins (read, count)                                                                                    | READ         | authMiddleware → requiredRole("admin") → handleGet                         | `admin`                                                                | in-use                                                  | GAP — no backend equivalent                                                                                    | Switcher.tsx:19                                                                                                                                                              |
| 4   | `/api/v1/admins/auth/update-password` | pages/api/v1/admins/auth/update-password.ts | POST                   | Updates authenticated admin’s Firebase Auth password                                                                                                                                                                                                                                                                                                                          | none (Auth only, adminAuth.updateUser)                                                                  | WRITE (Auth) | authMiddleware → requiredRole("admin") → validateRequest → handlePost      | `admin`                                                                | in-use                                                  | COVERED → `PATCH /v1/users/update-password` (guarded, body `{password}`)                                       | Account.tsx:53                                                                                                                                                               |
| 5   | `/api/v1/admins/auth/reset-password`  | pages/api/v1/admins/auth/reset-password.ts  | POST                   | Confirms password reset with `oobCode` + new password (confirmPasswordReset)                                                                                                                                                                                                                                                                                                  | none (Auth only)                                                                                        | WRITE (Auth) | validateRequest → handlePost                                               | none (public)                                                          | in-use                                                  | COVERED → `POST /v1/auth/reset-password`                                                                       | ResetPasswordForm.tsx:57                                                                                                                                                     |
| 6   | `/api/v1/admins/auth/forgot-password` | pages/api/v1/admins/auth/forgot-password.ts | POST                   | Sends Firebase Auth password-reset email for given `email`                                                                                                                                                                                                                                                                                                                    | none (Auth only)                                                                                        | WRITE (Auth) | validateRequest → handlePost                                               | none (public)                                                          | in-use                                                  | COVERED → `POST /v1/auth/forgot-password`                                                                      | ForgotPasswordForm.tsx:30                                                                                                                                                    |
| 7   | `/api/v1/admins/create-role`          | pages/api/v1/admins/create-role.ts          | POST                   | Sets custom claims `{roles, created_at, updated_at}` via setCustomUserClaims                                                                                                                                                                                                                                                                                                  | none (Auth only)                                                                                        | WRITE (Auth) | requiredRole("super_admin") → validateRequest — **NO authMiddleware**      | nominally `super_admin`; `req.user` never set → always 401             | unused                                                  | N/A — file deleted in B2                                                                                       | FAIL-CLOSED-DEAD (see GUARD_AUDIT). No client caller. serverTimestamp in claims is invalid JSON.                                                                             |

## Deleted this session (pre-Gate 1)

| Former path                             | Why removed                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/api/v1/_example/unauthenticated`      | **FAIL-OPEN:** unauthenticated GET/POST/PUT/DELETE on Firestore `items` — reachable if deployed |
| `/api/v1/_example/client-authenticated` | Template user-scoped CRUD on `items`; not part of product                                       |
| `/api/v1/_example/admin`                | Template admin CRUD on `items`; not part of product                                             |
| `/api/v1/_example/admin/[user_id]`      | Template per-user admin CRUD on `items`; not part of product                                    |
| `pages/api/v1/_example/_readme.md`      | Docs for the templates                                                                          |

**Follow-up (not done here):** check whether Firestore still has an `items` collection with junk from any prior deploy. Requires Firebase credentials (no `.env.local` in this workspace).

## Firestore access from OUTSIDE pages/api

**No client-side Firestore data reads/writes exist.** Greps for `getDoc|getDocs|onSnapshot|setDoc|updateDoc|deleteDoc|addDoc|collection(|runTransaction` in `components/`, `hooks/`, `context/` returned no data-access calls.

| File:Line                                          | What                                        | Data access?                 |
| -------------------------------------------------- | ------------------------------------------- | ---------------------------- |
| firebase.ts:32                                     | `db = getFirestore(app)` export             | Consumers are pages/api only |
| components/admins/AdminTable.tsx:22                | `Timestamp` type for display                | No — format only             |
| utils/formatting/formatDates.ts:7                  | `Timestamp` helpers on already-fetched data | No                           |
| types/admins.ts, users.ts, apis.ts                 | `FieldValue`/`Timestamp` types              | No — types only              |
| hooks/auth/\*, context/AuthProvider, ClaimsContext | `auth` from `@/firebase` only               | No Firestore                 |

## Counts

| Metric                            | Value                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `find pages/api -type f \| wc -l` | **7**                                                                                       |
| Rows in route table               | **7**                                                                                       |
| USAGE in-use (fully)              | **5** (check-status, admins-count, update-password, reset-password, forgot-password)        |
| USAGE broken-in-use               | **1** (admins/index — DELETE broken; GET/POST work)                                         |
| USAGE unused                      | **1** (create-role)                                                                         |
| CONTABO known                     | **3 covered** (routes 4,5,6); **3 GAP** (routes 1,2,3); **1 N/A** (route 7 — deleted in B2) |
| WRITE routes (≥1 write method)    | **5** (admins/index, create-role, update-password, reset-password, forgot-password)         |

## Commands (this deliverable)

```
rm -rf pages/api/v1/_example
find pages/api -type f | sort
# → 7 admin route files listed above
find pages/api -type f | wc -l
# →        7
```
