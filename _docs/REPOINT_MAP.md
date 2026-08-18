# REPOINT MAP — dashboard product data → Contabo backend

Purpose: document how the admin dashboard's product-data surfaces (Overview metrics, Users, Projects, Subscriptions) are repointed from the old Cloud Run + Firebase-token stack to the Contabo cookie-JWT backend. Companion to `REFERENCE_CLIENT.md` (the auth/envelope contract) and `ROUTE_INVENTORY.md` (the `/pages/api` route equivalences).

## 1. Repoint mechanism (implemented in A3 + A4)

- `constants/auth.ts:1` → `export const API_BASE_URL = ""` — every dashboard request builds a **relative** path (`/v1/admin/...`), removing the old Cloud Run URL. No request ever points at a hardcoded host anymore (verified: zero `https://` backend URLs remain in `.ts/.tsx`).
- `next.config.ts:29-46` → rewrites `/v1/:path*` and `/v2/:path*` → `${BACKEND_URL}/…`. `BACKEND_URL` is a server-side env var (never `NEXT_PUBLIC_`); trailing slashes and `/api` suffix stripped; no rewrites when unset.
- `utils/api/apiClient.ts` → session carried by httpOnly cookies (`withCredentials: true`, no Authorization header); CSRF echoed on unsafe methods; single-flight 401 refresh via `POST /v1/auth/refresh`. All GET product-data requests therefore require a live session cookie (`/v1/admin/*` is guarded by `FirebaseAuthGuard` + `AdminRoleGuard`, `alpha-drafts-backend/src/admin/admin.controller.ts:17`).

## 2. Endpoint map

| Dashboard surface | Endpoint (relative)                                       | Backend source           | App consumer                                       | Envelope → payload                                                                                     | Status    |
| ----------------- | --------------------------------------------------------- | ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------- |
| Overview metrics  | `GET /v1/admin/metrics`                                   | `admin.controller.ts:22` | `components/overview/index.tsx:14`                 | `{status,message,data}` → `OverviewMetric`                                                             | aligned   |
| Users report      | `GET /v1/admin/users?skip&take&sort`                      | `admin.controller.ts:28` | `components/users/UserTable.tsx:44`                | `{status,message,data}` → `PaginationResult<UserReport>` (`data`,`totalCount`,`skip`,`take`,`hasMore`) | aligned   |
| Projects          | `GET /v1/admin/projects?skip&take&status`                 | `admin.controller.ts:36` | `components/project/ProjectTable.tsx:45`           | `{status,message,data}` → `PaginationResult<ProjectData>`                                              | aligned\* |
| Subscriptions     | `GET /v1/admin/subscriptions?skip&take&name&status&order` | `admin.controller.ts:44` | `components/subscription/SubscriptionTable.tsx:66` | `{status,message,data}` → `PaginationResult<…>`                                                        | aligned   |

\* `aligned` = response shape is consumable by the app's fetch layer as-is; see §5 for backend field/behavior limitations that affect what the tables actually display.

## 3. Why the app's fetch layer needs no changes

- `hooks/misc/useFetchHook.ts:31` checks `response.data.status !== "success"` and unwraps `response.data.data`. The Contabo backend wraps **every** controller response via the global `ResponseInterceptor` (`alpha-drafts-backend/src/main.ts:69`, `common/response.interceptor.ts:19-23`) into `{status:"success", message, data}`, so the check passes and the unwrap yields the payload table.
- Pagination payloads are `PaginationResult<T>` (`alpha-drafts-backend/src/common/pagination.dto.ts:149-155`) → `{ data, totalCount, skip, take, hasMore }`. `UserTable.tsx:50-51` and `ProjectTable.tsx:51-52` read `data` + `totalCount`; `SubscriptionTable.tsx:23-26` reads `data.data` + `data.totalCount` via `normalSubscriptionData`. All match.
- Dates arrive as Firestore timestamps `{_seconds, _nanoseconds}` (not ISO) — `utils/formatting/formatDates.ts:128-155` `formatTimestampToDateTwo` already accepts that shape (used by all three tables).

## 4. Query-param alignment (verified against backend DTOs)

| Surface                | App sends                                                                          | Backend DTO enum                                          | Match                               |
| ---------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| Users `sort`           | `created_at` / `updated_at` (`DEFAULT_SORT_OPTIONS_TWO`, `constants/tables.ts:11`) | `UserSortField` (`pagination.dto.ts:23-26`)               | ✓                                   |
| Projects `status`      | `All`/`draft`/`in_progress`/`completed`/`archived`                                 | `AdminProjectStatus` (`admin.types.ts:52-58`)             | ✓ enum, but backend ignores it (§5) |
| Subscriptions `name`   | `Starter`/`Student`/`Professional` (`PLANS`)                                       | `SubscriptionType` (`payments.types.ts:3-7`, same casing) | ✓                                   |
| Subscriptions `status` | `active`/`inactive`/`failed` (`SUBSCRIPTION_STATUSES`)                             | `SubscriptionStatus` (`payments.types.ts:9-13`)           | ✓                                   |
| Subscriptions `order`  | `desc`                                                                             | `SortOrder` (`pagination.dto.ts:12-15`)                   | ✓                                   |

## 5. Backend field/behavior limitations observed (NOT fixed here)

- `metrics.noOfProjectsCompleted` is **hardcoded** equal to `noOfProjectsCreated` (`alpha-drafts-backend/src/admin/admin.firebase.ts:72-73` — "Projects no longer have status field").
- `projects[].status` is always **null** — the backend stopped reading a project status field (`admin.firebase.ts:173`), and the project status filter param is silently dropped (`admin.firebase.ts:152-156`). The app's `ProjectTable.tsx:90-92` calls `getStatusColor(project.status)` and `project.status.replace(/_/g, " ")`, which will **crash on `null`** once rows render.
- `subscriptions[].amountPaid` is `amountUnit` **cast to string** (`admin.firebase.ts:206`); the app's `formatPrices` expects `number | bigint` and renders `NaN` for a string amount (`utils/formatting/formatPrices.ts:29-39`).
- `SubscriptionTable.normalSubscriptionData` triple-unwraps `data.data.data` — correct only because `ResponseInterceptor` adds the outer envelope; it would misread any other pagination shape.
- Overview is safe (all nine `OverviewMetric` fields exactly match `PlatformStatisticsProps`).

## 6. Verification status

- Verified statically: envelope contract (`ResponseInterceptor`), pagination key (`totalCount`), date shape (`{_seconds,_nanoseconds}`), query-param enums (table above), zero hardcoded backend URLs.
- Verified live (A3/A4 dev-server): proxy serves `/v1/auth/*` and `/v1/admin/*` (200 / correct pass-through) via `BACKEND_URL`.
- **Blocked**: live browser verification of the four dashboard endpoints requires a test admin session (login → `GET /v1/users/me` must return `"admin"` in `data.roles`, else the admin gate falls back to `["user"]` and `/v1/admin/*` returns 403).
