# AUTH CONTRACT — current shape of the authenticated identity

Purpose: so the replacement token can mirror this identity and authorization code does not change.
All statements below are from reading the named files; no inference.

## A. `adminAuth.verifyIdToken` — decoded-token fields ACTUALLY read

The only call is `middleware/authMiddleware.ts:58` (`adminAuth.verifyIdToken(token)`). Every field read off the decoded token and off the subsequent `adminAuth.getUser()` record, and every downstream reader:

| Field | Read at (source) | Written into | Downstream readers | Used for |
|---|---|---|---|---|
| `uid` | authMiddleware.ts:61 (arg to getUser), :66 | `req.user.uid` | roleMiddleware.ts:20 (existence); admins/index.ts:315; update-password.ts:41 | identity + self-scoping |
| `email` | authMiddleware.ts:69 (`\|\| ""`) | `req.user.email` | none found | set only |
| `email_verified` | authMiddleware.ts:70 (`\|\| false`) | `req.user.email_verified` | none found | set only |
| `phone_number` | authMiddleware.ts:71 (`\|\| ""`) | `req.user.phone_number` | none found | set only |
| `picture` | authMiddleware.ts:73 (`\|\| ""`) | `req.user.photo_url` | none found | set only |
| `customClaims` (from `adminAuth.getUser`, NOT the token) | authMiddleware.ts:62,67; admins/index.ts:235,375 | `req.user.roles`, `req.user.status` | roleMiddleware.ts:29 (`req.user.roles`); status has no reader | roles/status source |
| `displayName` (from getUser) | authMiddleware.ts:68 (`\|\| ""`) | `req.user.name` | none found | set only |
| `photoURL` (from getUser) | admins/index.ts:329 | — | admins/index.ts:329 (compare in PUT) | profile-photo update |

**Key fact:** `req.user.uid` and `req.user.roles` are the ONLY fields that drive authorization.
`req.user.name`, `email`, `email_verified`, `phone_number`, `photo_url`, `status` are populated but never read downstream.

## B. Custom claims — read keys vs written keys

### Read

| Claim key | Value type (as used) | Readers (file:line) |
|---|---|---|
| `roles` | array of strings (e.g. `["admin","super_admin","user"]`) | authMiddleware.ts:67 (`customClaims.roles \|\| ["user"]`); ClaimsContext.tsx:59,110 (`claims?.roles`, `Array.isArray`, `.includes("admin")`, `.includes("super_admin")`); useAuthGuard.ts:53 (`customClaims?.roles \|\| []`); roleMiddleware.ts:29 (via `req.user.roles`) |
| `status` | string, defaults `"active"` | authMiddleware.ts:72 only (`customClaims.status \|\| "active"` → `req.user.status`); NO consumer of `req.user.status` found |

### Written (`setCustomUserClaims`)

| File:Line | Claim keys written | Value type | Guard state of route |
|---|---|---|---|
| pages/api/v1/admins/index.ts:271 (POST) | `roles`, `updated_at` | roles: string[]; updated_at: `serverTimestamp()` | GUARDED (super_admin) |
| pages/api/v1/admins/index.ts:409 (DELETE) | `roles`, `updated_at` | same | GUARDED (super_admin) |
| pages/api/v1/admins/create-role.ts:44 | `roles`, `created_at`, `updated_at` | roles: string[]; created_at/updated_at: `serverTimestamp()` | FAIL-CLOSED-DEAD (unreachable) |

Claim value types: `roles` = array of `UserRoleType` strings; `created_at`/`updated_at` = Firestore `serverTimestamp()` sentinel. **Note (P0):** a `serverTimestamp` FieldValue is not JSON-serializable — invalid for custom claims. Client casts claims into `CustomClaimsProps` (types/users.ts:45-60), which also declares `id, iss, aud, auth_time, sub, iat, exp, email_verified, firebase, created_at, updated_at`.

## C. Contexts exposed to components, and consumers

### `context/AuthProvider.tsx` — `{ user: User | null, loading: boolean }` (lines 10-13)

`user` is the raw Firebase `User` object (from `onAuthStateChanged`, line 31).

- Consumer: `hooks/auth/useAuthGuard.ts:20` — `{ user, loading: authLoading }`; uses `user` only for truthiness (line 35 `if (!user) → redirect login`). No other `useAuth` consumer found.

### `context/ClaimsContext.tsx` — `{ customClaims, loading, token, refreshToken, refreshClaims }` (lines 18-24)

| Consumer (file:line) | Destructured field(s) | Use |
|---|---|---|
| hooks/auth/useAuthGuard.ts:21 | `customClaims`, `loading: claimsLoading` | role gate: `customClaims?.roles` (line 53) |
| components/overview/index.tsx:11 | `token` | React Query `enabled: !!token` gate |
| components/users/UserTable.tsx:25 | `token` | same |
| components/project/ProjectTable.tsx:26 | `token` | same |
| components/subscription/SubscriptionTable.tsx:40 | `token` | same |
| components/admins/AdminTable.tsx:35 | `token` | same (AdminTable:73-74) |
| components/admins/CreateAdminForm.tsx:9 | `token` | gate |
| components/admins/Switcher.tsx:9 | `token` | gate |

`token` is used as an auth-readiness flag; the actual `Authorization: Bearer` header is attached inside the apiClient interceptor (see D), not from this state.

### `context/DashboardContext.tsx` — `{ activeDashboard, userRoles, isAdmin, isSuperAdmin, setters }` (lines 16-25)

- Writers: ClaimsContext.tsx:30,59-61,110-112 (derives from claims); useAuthGuard.ts:57 (`setUserRoles`).
- Readers: useAuthGuard.ts:23 (`userRoles`); components/admins/index.tsx:7 (`isSuperAdmin`); components/admins/Switcher.tsx:10 (`isSuperAdmin`); components/navigation/admin/NavBar.tsx:30 (`isAdmin`); components/admins/AdminTable.tsx:28 (prop `isSuperAdmin`); utils/others/getTableActions.ts:4 (param `isSuperAdmin`).

### Separate: `hooks/auth/useCurrentUser.ts` (raw Firebase `User` via `onAuthStateChanged`)

- components/navigation/admin/NavBar.tsx:29 — `currentUser.displayName`, `currentUser.photoURL`.
- components/settings/Account.tsx:12 — `currentUser.displayName`, `currentUser.email`, `currentUser.photoURL`.

## D. Token lifecycle (current, by function name)

Source module: `utils/auth/refreshToken.ts` (re-exported as `utils/auth/index.ts` → `utils/index.ts`).

1. **Obtain:** `getIdToken(forceRefresh = false)` (refreshToken.ts:14-27) → `auth.currentUser.getIdToken(forceRefresh)`; returns `null` if no `currentUser`.
2. **Per-request attach:** `utils/api/apiClient.ts:29-50` (axios request interceptor) calls `getIdToken()` on every request and sets `config.headers.Authorization = "Bearer " + token`.
3. **Scheduled refresh:** `setupTokenRefresh` (refreshToken.ts:34-77) reads `user.getIdTokenResult().expirationTime`, schedules `setTimeout` to fire `getIdToken(true)` 5 minutes (300,000 ms) before expiry, then re-schedules. Wired from `context/AuthProvider.tsx:37`.
4. **On 401:** `apiClient.ts:100-147` (response interceptor). If `status === 401` and response `error.code === "auth/id-token-expired"` (server-side Firebase error shape):
   - **De-duplication: YES — preserve in Gate 2.** `pendingRefreshPromise` (apiClient.ts:26, 114-122) caches the in-flight `getIdToken(true)`; concurrent 401s await the same promise. Cleared in `.finally()`.
   - Retries the original request once with the fresh token (`_retry` header guard, line 106).
   - If the refreshed token is `null` → `auth.signOut()` and `window.location.href = "/auth/login"` (lines 142-145).
   - **Gate 2 note:** the retry trigger is the literal string `auth/id-token-expired`. A Contabo API will not produce that shape; without a new trigger, refresh-on-401 silently stops working.
5. **Claims re-sync:** `ClaimsContext.refreshClaims` (ClaimsContext.tsx:38-67) forces `getIdToken(true)` (retry once after 500 ms), then `getIdTokenResult()` → `setCustomClaims` + Dashboard `setUserRoles/setIsAdmin/setIsSuperAdmin`. `refreshToken` (70-90) does the same and also `setToken`. Both `onAuthStateChanged` handlers (ClaimsContext.tsx:99-129) populate `token` + `customClaims` on sign-in.

## E. Where the token is persisted

- **App code persists nothing.** Grep for `localStorage|sessionStorage|document.cookie|indexedDB` → **no matches** in the repo.
- Copies exist only in React state: ClaimsContext `token` and `customClaims` (memory, lost on reload).
- The durable token lives inside the Firebase SDK (`auth.currentUser`); its web-storage persistence (default IndexedDB/localStorage) is Firebase SDK internals, not this repo’s code.

## F. Firebase-dependent code that breaks silently when Firebase is removed

### Firestore `Timestamp` reads/formats

| Location | Detail |
|---|---|
| utils/formatting/formatDates.ts:7 | imports `Timestamp` from `firebase/firestore`; helpers `formatTimestampToDate/ToTime/ToDateAndTime/ToRelativeYear/ToRelativeTime/ToDateTwo` (10-168) reconstruct `new Timestamp(seconds, nanoseconds)`, call `.toDate()`, or parse plain `{_seconds,_nanoseconds}` objects |
| utils/formatting/formatIOSDates.ts:6 | imports `Timestamp` from `firebase-admin/firestore` (**server package in client bundle** via `@/utils` barrel — see G0-1); `formatUnderscoreDateToDate`/`...AndTime` (122,152) handle `{_seconds,_nanoseconds}` and `.toDate()` |
| components/admins/AdminTable.tsx:22,183 | `Timestamp` type + `formatTimestampToDate(admin?.created_at as Timestamp)` |
| components/users/UserTable.tsx:3,77 | `formatTimestampToDateTwo(user?.joinedOn)` |
| components/project/ProjectTable.tsx:5,99 | `formatTimestampToDateTwo(project?.createdAt)` |
| components/subscription/SubscriptionTable.tsx:6,98 | `formatTimestampToDateTwo(sub?.paymentDate)` |
| types/users.ts:1,24-31,41-42,58-59 | `Timestamp`/`FieldValue` types + `joinedOn {_seconds,_nanoseconds}`; CustomClaimsProps timestamps |
| types/admins.ts:3,15-16; types/apis.ts:1,21-22; types/subscriptions.ts:7-8 | `Timestamp`/`FieldValue` / `_seconds`-style types |
| Server writes: `serverTimestamp()` | admins/index.ts:9,273,279,292-293,336,411,417,429; create-role.ts:6,39-40 |

### Firebase auth error-code → message mapping

| Location | Detail |
|---|---|
| constants/firebase-codes.ts:8-170 | `errors` map: key = Firebase auth code minus `auth/` prefix → user-facing string (~100 codes) |
| utils/formatting/formatErrors.ts:11-23 | `getFirebaseError(code, fallback)` strips `auth/`, looks up `errors` |
| utils/formatting/formatErrors.ts:26-46 | `formatError` — axios → `response.data.message`; `FirebaseError` w/ `auth/` code → map; else `err.message` |
| utils/formatting/formatErrors.ts:49-67 | `formatAuthError` — unwraps `error?.response?.data?.error` first, then same Firebase mapping |
| Consumers of `formatAuthError` | hooks/auth/useLogin.ts:51; hooks/auth/useSignOutUser.ts:22; components/auth/ResetPasswordForm.tsx:70,78; components/auth/ForgotPasswordForm.tsx:43 |
| Consumers of `formatError` | utils/api/apiClient.ts:141 (toast); hooks/misc/useFetchHook.ts:43; components/admins/*; components/auth/* |
| Hardcoded Firebase error code in client | apiClient.ts:100-103 — treats `error.code === "auth/id-token-expired"` as the retry trigger for 401s |

## Summary for the replacement token

- Identity shape the server actually consumes: `{ uid: string, roles: string[] }` (from token `uid` + `customClaims.roles`).
- Client consumes: `token` (as a readiness flag), `claims.roles` (array of `admin|super_admin|user`), `claims.status` (write-only, never read), plus Firebase `User.displayName/email/photoURL` for the nav bar and settings header.
- Authorization decision points to mirror: roleMiddleware `req.user.roles.includes(role)`; useAuthGuard `customClaims?.roles`; ClaimsContext → Dashboard `isAdmin/isSuperAdmin/userRoles`.
- **Preserve** `pendingRefreshPromise` de-duplication; **replace** the `auth/id-token-expired` 401 trigger when Contabo is wired.
