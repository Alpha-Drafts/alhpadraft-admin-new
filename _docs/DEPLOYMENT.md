# DEPLOYMENT — Netlify (OpenNext) configuration & environment

Purpose: document how the alpha-drafts admin app deploys to Netlify after the firebase removal (A5/A6). Mirrors `alhpadraft-new`'s Netlify setup (zero-config OpenNext, no `netlify.toml`). Companion to `REPOINT_MAP.md` (backend repoint) and `AUTH_CONTRACT.md` (cookie-JWT session).

## 1. Build settings (mirror `alhpadraft-new` — no `netlify.toml`)

Netlify uses the OpenNext adapter (`@netlify/plugin-nextjs`), which is auto-detected for Next.js apps. No `netlify.toml` is committed in this repo, and `alhpadraft-new` has none either — do **not** add one.

| Setting           | Value                         | Notes                                                                     |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------- |
| Framework preset  | Next.js (Netlify auto-detect) | `@netlify/plugin-nextjs` is auto-installed by Netlify                     |
| Base directory    | `/` (repo root)               | single-app repo                                                           |
| Build command     | `yarn build`                  | `next build` via `package.json` `build` script                            |
| Publish directory | `.next`                       | OpenNext output; ignore "publish dir not found" in UI — plugin handles it |
| Package manager   | `yarn`                        | `yarn.lock` present, no `package-lock.json` → Netlify auto-selects Yarn   |
| Node version      | 22                            | set in Netlify UI (`NODE_VERSION`); no `.nvmrc`/`engines` committed       |

## 2. Environment variables

Required / recommended set, as of A6 (after firebase removal):

| Variable       | Scope       | Required    | Value                                                                                                                                         | Consumer                                                                 |
| -------------- | ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `BACKEND_URL`  | Server-only | **Yes**     | Contabo backend origin, **no** `/api`/`#` Swagger suffix, **no** trailing slash, e.g. `http://okc386ldho01lyfco96f5am0.169.58.88.40.sslip.io` | `next.config.ts:30` → rewrites `/v1/:path*` → `${BACKEND_URL}/v1/:path*` |
| `NODE_VERSION` | Build       | Recommended | `22`                                                                                                                                          | Netlify build container                                                  |
| `ANALYZE`      | Build       | No          | `true` to enable `@next/bundle-analyzer` (`next.config.ts:5`)                                                                                 | optional                                                                 |

### Do NOT set (dead after A6)

`NEXT_PUBLIC_NODE_ENV` and the four `NEXT_PUBLIC_{LOCAL,DEVELOPMENT,STAGING,PRODUCTION}_URL` vars are **no longer read by anything**: `getEnv()` / `getEnvUrl()` in `utils/others/envUtils.ts:29-37` have zero callers (the last consumer, the removed forgot-password route, was deleted in A6). They are still exported via `utils/others/index.ts` and can be left as dead code or omitted from Netlify entirely. Note `NEXT_PUBLIC_NODE_ENV` must not be confused with Next's built-in `NODE_ENV`.

### Netlify auto-injected vars

Netlify injects `NEXT_PUBLIC_NETLIFY=true`, commit refs, etc. at build time; these are harmless and are **not** used by the app.

## 3. Runtime/session considerations

- All API traffic is proxied **server-side** through Next rewrites (`/v1/*` → `BACKEND_URL`). The browser only ever talks to the admin origin, so the auth **httpOnly cookie** is set/read on the admin domain (`withCredentials: true`, no `Authorization` header — see `REPOINT_MAP.md` §1).
- On the live Netlify domain the backend must still treat the admin origin as allowed for CSRF/CORS. If `verify-email`, login, or refresh return 403, re-check the backend's allowed-origins list and include the deployed admin origin.
- The email-verify/reset flows build the redirect URL client-side with `window.location.origin` (`pages/auth/index.tsx`, `ResetPasswordForm.tsx`), so they are origin-agnostic — no `PUBLIC_ADMIN_URL`-style var is needed.
- `BACKEND_URL` must **not** be prefixed `NEXT_PUBLIC_` — it is read only in `next.config.ts` (server config). Exposing it to the client would be harmless (it's not a secret) but is unnecessary.

## 4. Pre-launch checklist

1. Set `BACKEND_URL` (and `NODE_VERSION=22`) in the Netlify site → Environment variables.
2. Do not add a `netlify.toml` (mirror `alhpadraft-new`).
3. Verify first deploy: `/admin/overview` metrics render, `admin/users` paginates, `admin/subscriptions` loads → all proxy via `/v1/*`.
4. Verify the auth loop on the deployed origin: login, refresh-after-idle, logout; then `forgot-password` → `verify-email` (and `reset-password`) round-trips against `POST /v1/auth/*`.
5. Confirm 401 → single-flight refresh still works under the Netlify function cold-start (OpenNext) — the client retries once after refresh (`utils/api/apiClient.ts`).
