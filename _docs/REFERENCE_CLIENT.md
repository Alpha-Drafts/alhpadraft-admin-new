# REFERENCE CLIENT — alhpadraft-new (Contabo cookie-JWT backend)

Purpose: single source of truth for the Contabo backend contract that this admin app must mirror in A3–A6. Statements below are observed — either read from `alhpadraft-new` source (file:line cited), from `alpha-drafts-backend` source, or live-verified against the Contabo backend. No inference presented as fact.

## 1. Provenance

- Auth flow: read from `alhpadraft-new` working code (deployed client for the same Contabo backend), file:line cited.
- Endpoints + envelopes: live-verified against the Contabo backend on **2026-08-13** (HTTP codes and bodies captured below).
- Product-data endpoint set: read from `alpha-drafts-backend/src/admin/admin.controller.ts`.
- Auth-specific controllers (`login`/`logout`/`refresh`/`csrf-token`/`forgot-password`/`reset-password`/`verify-email`) live on the backend `firebase-decopling` branch, which is **not** on this machine's `main` checkout; their routes are confirmed to exist by the live calls below.

## 2. Session transport (observed, alhpadraft-new)

- Session = httpOnly cookies `access_token` + `refresh_token` set by the backend; the browser attaches them automatically. The frontend never reads the token contents.
- CSRF = non-httpOnly cookie `csrf_token`, echoed on state-changing requests in header `X-CSRF-Token` (double-submit). Applied to **POST/PUT/PATCH/DELETE only**.
- Axios client: `baseURL: "/"`, `withCredentials: true`, `Content-Type: application/json`, **no Authorization header** (`utils/api/apiClient.ts:27-33`).
- `ensureCsrfToken()` (`utils/auth/session.ts:21-31`): if `csrf_token` cookie absent → `GET /v1/auth/csrf-token` (sets it) → return the cookie value.
- Request interceptor (`utils/api/apiClient.ts:69-74`): for unsafe methods, if the cookie exists and the header is not already set → set `X-CSRF-Token`.
- 401 handling (`utils/api/apiClient.ts:96-113`): on 401 AND original request AND not already retried AND url does **not** contain `/v1/auth/` → single-flight `POST /v1/auth/refresh` (de-duplicated via `pendingRefreshPromise`, `utils/api/apiClient.ts:44-55`) → retry original request once. Refresh failure → reject (no hard redirect; route guards handle it).
- Logout (`utils/auth/authApi.ts:63-77`): `ensureCsrfToken()` → `POST /v1/auth/logout` `{}` with CSRF header; errors swallowed (client state always cleared).

## 3. Session/roles source (observed, alhpadraft-new)

- Browser state is NOT derived from the JWT (httpOnly). It is sourced from `GET /v1/users/me` (`context/AuthProvider.tsx:73-77`): 200 → signed in; 401 → signed out.
- `mapMeResponse` (`context/AuthProvider.tsx:42-54`) maps `data.id || data.uid`, `email`, `fullName || name`, `roles` (array), `emailVerified`.
- Roles live under `data.roles`. Known values consumed: `"admin"`, `"super_admin"`, `"subscriber"` (`context/ClaimsContext.tsx:53-56`); fallback when absent: `["user"]` (`context/ClaimsContext.tsx:65,82`).
- `token` in the reference client is a **readiness flag** — `"session"` when a user is present, else null (`context/ClaimsContext.tsx:93-98`). It is not an access token.

## 4. Login flow (observed, alhpadraft-new)

`hooks/auth/useLogin.ts:25-62` → `loginUser({ email, password })`:

1. `ensureCsrfToken()`
2. `POST /v1/auth/login` with `X-CSRF-Token` → `res.data.data` typed `{ uid, email, fullName }` (`utils/auth/authApi.ts:39-48`)
3. `refreshClaims()` → `GET /v1/users/me` to sync roles into DashboardContext (`isAdmin` / `isSuperAdmin` / `isSubscriber` / `userRoles`)
4. navigate.

## 5. Endpoints — live-verified 2026-08-13 (Contabo)

Probe method: GET, or POST with empty `{}` body (validation error proves the route exists; no side effects).

| Endpoint                    | Method | Observed result                                                         | Meaning                                                               |
| --------------------------- | ------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `/v1/auth/csrf-token`       | GET    | 200 `{"status":"success","message":"success","data":{"csrfToken":"…"}}` | sets `csrf_token` cookie                                              |
| `/v1/auth/login`            | POST   | 403 `CSRF token mismatch` (no header)                                   | route exists, CsrfGuard enforced                                      |
| `/v1/auth/logout`           | POST   | 403 `CSRF token mismatch` (no header)                                   | route exists, CsrfGuard enforced                                      |
| `/v1/auth/signup`           | POST   | 403 `CSRF token mismatch` (no header)                                   | route exists, CsrfGuard enforced                                      |
| `/v1/auth/refresh`          | POST   | 401 `No refresh token` (no cookie)                                      | route exists, needs `refresh_token` cookie                            |
| `/v1/auth/forgot-password`  | POST   | 400 `Bad Request Exception` (empty body)                                | route exists, DTO validation                                          |
| `/v1/auth/reset-password`   | POST   | 400 `Bad Request Exception` (empty body)                                | route exists, DTO validation                                          |
| `/v1/auth/verify-email`     | POST   | 400 `Bad Request Exception` (empty body)                                | route exists, DTO validation                                          |
| `/v1/users/me`              | GET    | 401 without session                                                     | guarded session/roles source                                          |
| `/v1/users/update-password` | PATCH  | 401 `No access token` (no session)                                      | guarded; body `{ password }` (`src/users/users.controller.ts:96-106`) |
| `/v1/admin/metrics`         | GET    | guarded                                                                 | product data (`src/admin/admin.controller.ts:22`)                     |
| `/v1/admin/users`           | GET    | guarded                                                                 | product data (`:28`)                                                  |
| `/v1/admin/projects`        | GET    | guarded                                                                 | product data (`:36`)                                                  |
| `/v1/admin/subscriptions`   | GET    | guarded                                                                 | product data (`:44`)                                                  |

## 6. Envelope / error contract (live-verified)

- Success: `{ "status": "success", "message": "…", "data": {…} }` — **no `code` field** (verified from the csrf-token body).
- Error: `{ "statusCode": …, "message": "…", "timestamp": "…", "path": "…" }` (verified from all 4xx/401 bodies above).
- Client extraction used by reference client (`utils/api/apiClient.ts:163-166`): `data.message ?? data.error?.code ?? "An error occurred."`
- Pagination key on product-data endpoints: **`totalCount`** (camelCase; backend `PaginationResult`).

## 7. Data shape — backend is NOT fully decoupled

- The backend's `/v1/admin/*` product data still reads Firestore (`alpha-drafts-backend/src/admin/admin.firebase.ts`), and dates return as Firestore timestamps `{_seconds, _nanoseconds}` — **NOT ISO strings**. Treat all admin payload dates as `{_seconds, _nanoseconds}`.
- Auth is the only fully-decoupled part (JWT/cookie + CSRF). Firebase cannot be switched off on the backend.

## 8. Base URL / proxying (observed, alhpadraft-new)

- `API_BASE_URL` (`constants/auth.ts:17-24`): production → `""` (relative paths, proxied through Next rewrites); development → `NEXT_PUBLIC_LOCAL_URL || NEXT_PUBLIC_DEVELOPMENT_URL || NEXT_PUBLIC_STAGING_URL || DEV_API_URL`.
- Rewrites (`next.config.ts:42-59`): `/v1/:path*` and `/v2/:path*` → `${BACKEND_URL}/…`. `BACKEND_URL` is a **server-side** env var (NOT `NEXT_PUBLIC_`); trailing slashes and `/api` suffix stripped; no rewrites if unset.

## 9. Mapping to this app's `/pages/api` routes (CONTABO equivalences)

- Route 4 update-password → **COVERED** `PATCH /v1/users/update-password`, body `{ password }`
- Route 5 reset-password → **COVERED** `POST /v1/auth/reset-password`
- Route 6 forgot-password → **COVERED** `POST /v1/auth/forgot-password`
- Routes 1/2/3 (admins CRUD, check-status, admins-count) → **GAP** — backend exposes no admin-management endpoints (`/v1/admin/*` is GET-only product data)
- Route 7 create-role → deleted in B2; no equivalence

> Note: request DTO field names for `forgot-password` / `reset-password` / `verify-email` live on the backend decoupled branch (not on this machine's `main` checkout). Confirm against those DTOs during A6.
