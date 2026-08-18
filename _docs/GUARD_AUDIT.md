# Guard Composition Audit — pages/api

Method: read every file in `middleware/`, then read the composition (not intent) of every route under `pages/api/`.

After pre-Gate-1 deletion of `pages/api/v1/_example/**`, **7 route files** remain.

## FAIL-OPEN FINDINGS

### 1. (REMOVED THIS SESSION) `pages/api/v1/_example/unauthenticated.ts`

**Was FAIL-OPEN.** Unauthenticated GET/POST/PUT/DELETE against Firestore collection `items`. No `authMiddleware`, no `requiredRole`. Reachability is the route file existing under `pages/api/`, not whether the admin UI calls it. If deployed, anyone on the internet could write to `items` on the shared Firebase project.

Composition (as it existed before deletion):

```ts
// pages/api/v1/_example/unauthenticated.ts (deleted)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return validateRequest(getValidationRules)(req, res, async () =>
        handleGet(req, res),
      );
    case "POST":
      return validateRequest(postValidationRules)(req, res, async () =>
        handlePost(req, res),
      );
    case "PUT":
      return validateRequest(putValidationRules)(req, res, async () =>
        handlePut(req, res),
      );
    case "DELETE":
      return validateRequest(deleteValidationRules)(req, res, async () =>
        handleDelete(req, res),
      );
    // ...
  }
}
```

Only wrapper: `validateRequest`. No auth. Handlers called `setDoc`/`updateDoc`/`deleteDoc`/`getDocs` on `collection(db, "items")`.

**Action taken:** entire `pages/api/v1/_example/` tree deleted (also removed three GUARDED-but-unwanted template routes: `client-authenticated.ts`, `admin/index.ts`, `admin/[user_id].ts`, plus `_readme.md`).

**Remaining FAIL-OPEN in repo after deletion: none.**

Follow-up (not done): verify Firestore `items` collection for junk data — needs credentials (no `.env.local` present).

---

## A. Middleware files (`middleware/`)

### middleware/authMiddleware.ts (`authMiddleware`)

- Reads `req.headers.authorization` (line 33).
- Missing header → `req.user = null`, 401 (lines 36-42).
- Non-`Bearer ` prefix → `req.user = null`, 401 (lines 44-51).
- `adminAuth.verifyIdToken(token)` (line 58); then `adminAuth.getUser(decodedToken.uid)` for custom claims (line 61).
- Expired token (`auth/id-token-expired`) → 401 (lines 80-87). Other verify errors → outer catch → 500 (lines 90-98).
- **On success sets `req.user`** (lines 65-74):
  `{ uid, roles: customClaims.roles || ["user"], name, email, email_verified, phone_number, status: customClaims.status || "active", photo_url }`

### middleware/roleMiddleware.ts (`requiredRole`)

- `requiredRole(allowedRole)` wrapper (lines 13-18).
- `!req.user || !req.user?.uid` → 401 (lines 20-26).
- `userRoles = req.user.roles || ["user"]` (line 29); `includes(allowedRole)` (line 32).
- Missing role → 403 (lines 35-41); else `next()` (line 44).
- **Reads ONLY `req.user.roles` — the field authMiddleware populates.**

### middleware/validateMiddleware.ts (`validateRequest`)

- Runs express-validator rules; errors → 400; else `next()`. Does not set or read `req.user`.

### middleware/index.ts

- Re-exports all three.

## B + C. Route classification (remaining 7)

| Route file                                  | Path                                  | Wrappers (outer → inner)                                                      | Auth? | Role reads populated value?               | CLASS            |
| ------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- | ----- | ----------------------------------------- | ---------------- |
| pages/api/v1/admins/index.ts                | `/api/v1/admins`                      | authMiddleware → requiredRole(admin\|super_admin) → validateRequest → handler | yes   | yes                                       | GUARDED          |
| pages/api/v1/admins/check-status.ts         | `/api/v1/admins/check-status`         | authMiddleware → requiredRole("super_admin") → validateRequest                | yes   | yes                                       | GUARDED          |
| pages/api/v1/admins/admins-count.ts         | `/api/v1/admins/admins-count`         | authMiddleware → requiredRole("admin") → handleGet                            | yes   | yes                                       | GUARDED          |
| pages/api/v1/admins/auth/update-password.ts | `/api/v1/admins/auth/update-password` | authMiddleware → requiredRole("admin") → validateRequest                      | yes   | yes                                       | GUARDED          |
| pages/api/v1/admins/auth/forgot-password.ts | `/api/v1/admins/auth/forgot-password` | validateRequest → handlePost                                                  | no    | n/a                                       | PUBLIC-BY-DESIGN |
| pages/api/v1/admins/auth/reset-password.ts  | `/api/v1/admins/auth/reset-password`  | validateRequest → handlePost                                                  | no    | n/a                                       | PUBLIC-BY-DESIGN |
| pages/api/v1/admins/create-role.ts          | `/api/v1/admins/create-role`          | requiredRole("super_admin") → validateRequest — **NO authMiddleware**         | no    | reads unpopulated `req.user` → always 401 | FAIL-CLOSED-DEAD |

Unauthenticated on GUARDED routes → authMiddleware 401. Authenticated insufficient role → requiredRole 403.

## D. create-role — FAIL-CLOSED-DEAD confirmed

File: `pages/api/v1/admins/create-role.ts`. **Confirmed dead.**

Composition (verbatim, lines 15-23):

```ts
  const role: UserRoleType = "super_admin";

  switch (req.method) {
    case "POST":
      return requiredRole(role)(req, res, async () =>
        validateRequest(postValidationRules)(req, res, async () =>
          handlePost(req, res),
        ),
      );
```

Handler signature (lines 10-13): `req: NextApiRequest` — **not** `AuthenticatedRequest`. Imports (line 3): `requiredRole, validateRequest` only — **no `authMiddleware`**.

`requiredRole` (roleMiddleware.ts:20-26) always hits first:

```ts
if (!req.user || !req.user?.uid) {
  return send401Unauthorised({
    res,
    message: "Not authorized",
    error: "User is not logged in",
  });
}
```

`req.user` is always undefined → **every request gets 401**. Unreachable. Not FAIL-OPEN (attacker cannot reach `setCustomUserClaims` here).

## E. Every call to `setCustomUserClaims` (repo-wide)

| File:Line                             | Enclosing route guard                                | CLASS            |
| ------------------------------------- | ---------------------------------------------------- | ---------------- |
| pages/api/v1/admins/create-role.ts:44 | no authMiddleware; requiredRole always 401s          | FAIL-CLOSED-DEAD |
| pages/api/v1/admins/index.ts:271      | POST: authMiddleware → requiredRole("super_admin")   | GUARDED          |
| pages/api/v1/admins/index.ts:409      | DELETE: authMiddleware → requiredRole("super_admin") | GUARDED          |

(`docs/ACTION_PLAN.md:16` mentions these in prose only.)

## Counts (after `_example` deletion)

| CLASS                 | Count | Routes                                                    |
| --------------------- | ----- | --------------------------------------------------------- |
| GUARDED               | 4     | admins/index, check-status, admins-count, update-password |
| FAIL-CLOSED-DEAD      | 1     | create-role                                               |
| FAIL-OPEN             | 0     | (unauthenticated example deleted)                         |
| PUBLIC-BY-DESIGN      | 2     | forgot-password, reset-password                           |
| **Total route files** | **7** |                                                           |
