# Developer Onboarding

Welcome to the AlphaDrafts Admin App. This guide helps you get set up locally and understand how to work in this codebase.

## Prerequisites

- Node.js 20+
- Yarn
- Firebase project access (client + admin service account)
- Access to AlphaDrafts backend (Cloud Run) for metrics and lists

## Clone and install

```
# SSH or HTTPS as appropriate
git clone https://github.com/Alpha-Drafts/alpha-drafts-admin-app.git
cd alpha-drafts-admin-app
yarn install
```

## Environment variables

- Copy .env.local.example to .env.local and fill in values
- Required keys:
  - NEXT_PUBLIC_NODE_ENV: local | development | staging | production
  - Firebase client config (NEXT*PUBLIC_FIREBASE*\*)
  - FIREBASE_SERVICE_ACCOUNT_KEYS: JSON string of service account (server-side only)
  - NEXT*PUBLIC*\*\_URL: used by utils/others/envUtils.ts for redirects

See docs/ENVIRONMENT.md for details and examples.

## Run locally

```
yarn dev
# App: http://localhost:3000
```

## Lint, format, typecheck

```
yarn format
yarn lint
yarn check-types
```

Husky + lint-staged will run on commit.

## Project overview

- Next.js (pages/)
- Client-side Firebase auth; custom claims for roles
- Next API routes (pages/api/v1): admin management endpoints secured by Firebase Admin SDK, authMiddleware, and roleMiddleware
- External backend for metrics/data via constants/API_BASE_URL

## Where to start

- pages/index.tsx → Login
- layouts/AdminLayout.tsx → Route guard
- components/\* → Feature UIs
- pages/api/v1/admins/\* → Admin management APIs
- utils/api/apiClient.ts → Axios + token logic

## Common tasks

- Add a new protected page: create pages/admin/new-feature.tsx; render inside AdminLayout; fetch data with useFetchHook and apiClient; secure server endpoints with authMiddleware + requiredRole("admin")
- Add a new API route: follow examples in pages/api/v1/\_example

## Coding standards

- TypeScript strict; avoid any
- ESlint + Prettier enforced
- Keep params and validator names consistent across client/server
